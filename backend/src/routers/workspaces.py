from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from ..database import load_db, save_db
import uuid
import datetime
import os

router = APIRouter(prefix="/api/workspaces", tags=["workspaces"])

class WorkspaceCreate(BaseModel):
    name: str
    scenario: str

def cleanup_locked_directories():
    db = load_db()
    pending = db.get("pending_cleanup", [])
    if not pending:
        return
    
    remaining = []
    import shutil
    for path in pending:
        if os.path.exists(path):
            try:
                shutil.rmtree(path)
                print(f"[Cleanup] Successfully removed previously locked directory: {path}")
            except Exception as e:
                print(f"[Cleanup] Directory still locked, keeping in pending_cleanup: {path} (Error: {e})")
                remaining.append(path)
                
    db["pending_cleanup"] = remaining
    save_db(db)

@router.get("/")
def get_workspaces():
    db = load_db()
    return db.get("workspaces", [])

@router.post("/")
def create_workspace(workspace: WorkspaceCreate):
    db = load_db()
    new_workspace = {
        "id": str(uuid.uuid4()),
        "name": workspace.name,
        "scenario": workspace.scenario,
        "documents": 0,
        "updated": "Just now",
        "status": "Not Started",
        "priority": "Medium",
        "aiConfidence": 0,
        "nextBestAction": {
            "title": "Upload Initial Documents",
            "owner": "Workspace Owner",
            "due": "TBD",
            "reason": "No documents uploaded yet",
            "whyDescription": "AI analysis requires context. Upload documents to generate insights and action plans."
        },
        "timeline": [
            { "label": "Workspace Created", "completed": True },
            { "label": "Documents Uploaded", "completed": False },
            { "label": "Analysis Pending", "completed": False },
            { "label": "Action Items Generated", "completed": False },
            { "label": "Awaiting Approval", "completed": False }
        ],
        "decisionBrief": [
            { "title": "Overall Summary", "content": "Awaiting document upload for AI analysis." },
            { "title": "Business Impact", "content": "Pending analysis." },
            { "title": "Key Decisions", "content": "Pending analysis." },
            { "title": "Open Questions", "content": "Pending analysis." },
            { "title": "Recommendations", "content": "Pending analysis." }
        ],
        "actionItems": [],
        "risks": [],
        "generatedContent": {
            "draftEmail": "Awaiting document upload for AI analysis.",
            "draftWorkItem": {
                "title": "Pending",
                "description": "Pending analysis.",
                "priority": "Medium"
            }
        },
        "files": []
    }
    
    if "workspaces" not in db:
        db["workspaces"] = []
    
    db["workspaces"].insert(0, new_workspace)
    save_db(db)
    return new_workspace

from fastapi import UploadFile, File
from ..services.document_service import validate_and_save_file, process_document, delete_document_files

@router.get("/{workspace_id}/documents")
def get_documents(workspace_id: str):
    db = load_db()
    for ws in db.get("workspaces", []):
        if ws["id"] == workspace_id:
            return ws.get("files", [])
    raise HTTPException(status_code=404, detail="Workspace not found")

@router.post("/{workspace_id}/documents")
def upload_documents(workspace_id: str, files: List[UploadFile] = File(...)):
    if len(files) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 files per upload allowed")
        
    db = load_db()
    workspace = None
    for ws in db.get("workspaces", []):
        if ws["id"] == workspace_id:
            workspace = ws
            break
            
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
        
    if "files" not in workspace:
        workspace["files"] = []
        
    uploaded_meta = []
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    
    for file in files:
        doc_id, file_path, file_size = validate_and_save_file(workspace_id, file)
        ext = os.path.splitext(file.filename)[1].lower()
        
        meta = {
            "id": doc_id,
            "filename": file.filename,
            "extension": ext.lstrip("."),
            "size": file_size,
            "uploadedAt": now_str,
            "status": "Extracting",
            "storagePath": file_path
        }
        
        try:
            char_count, extracted_path = process_document(workspace_id, doc_id, file_path, file.filename)
            meta["status"] = "Ready"
            meta["characterCount"] = char_count
            meta["extractedTextPath"] = extracted_path
        except Exception as e:
            print(f"Extraction failed for {file.filename}: {e}")
            meta["status"] = "Failed"
            
        workspace["files"].insert(0, meta)
        uploaded_meta.append(meta)
        
    workspace["documents"] = len(workspace["files"])
    workspace["updated"] = "Just now"
    
    save_db(db)
    return uploaded_meta

@router.delete("/{workspace_id}/documents/{doc_id}")
def delete_document(workspace_id: str, doc_id: str):
    db = load_db()
    workspace = None
    for ws in db.get("workspaces", []):
        if ws["id"] == workspace_id:
            workspace = ws
            break
            
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
        
    if "files" not in workspace:
        workspace["files"] = []
        
    file_to_delete = next((f for f in workspace["files"] if f["id"] == doc_id), None)
    if not file_to_delete:
        raise HTTPException(status_code=404, detail="Document not found")
        
    # Remove from disk
    ext = f".{file_to_delete['extension']}"
    delete_document_files(workspace_id, doc_id, ext)
    
    # Remove from db
    workspace["files"] = [f for f in workspace["files"] if f["id"] != doc_id]
    workspace["documents"] = len(workspace["files"])
    workspace["updated"] = "Just now"
    
    save_db(db)
    return {"message": "Document deleted successfully"}

@router.get("/{workspace_id}/documents/{doc_id}/preview")
def preview_document(workspace_id: str, doc_id: str):
    db = load_db()
    workspace = next((ws for ws in db.get("workspaces", []) if ws["id"] == workspace_id), None)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
        
    doc = next((f for f in workspace.get("files", []) if f["id"] == doc_id), None)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    extracted_path = doc.get("extractedTextPath")
    preview_text = "No extracted text available."
    
    if extracted_path and os.path.exists(extracted_path):
        try:
            with open(extracted_path, "r", encoding="utf-8") as f:
                # Read first 1000 characters
                preview_text = f.read(1000)
                if len(preview_text) == 1000:
                    preview_text += "...\n\n[Preview truncated]"
        except Exception:
            preview_text = "Error reading extracted text."
            
    return {
        "metadata": doc,
        "preview": preview_text
    }

from ..services.gemini_service import generate_analysis

@router.post("/{workspace_id}/analyze")
def analyze_workspace(workspace_id: str):
    db = load_db()
    workspace = next((ws for ws in db.get("workspaces", []) if ws["id"] == workspace_id), None)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
        
    files = workspace.get("files", [])
    if not files:
        raise HTTPException(status_code=400, detail="Workspace has no documents to analyze.")
        
    context_parts = []
    for f in files:
        if f.get("extractedTextPath") and os.path.exists(f["extractedTextPath"]):
            try:
                with open(f["extractedTextPath"], "r", encoding="utf-8") as txt_file:
                    content = txt_file.read()
                    context_parts.append(f"--- Document: {f['filename']} ---\n{content}\n")
            except Exception as e:
                print(f"Error reading {f['filename']}: {e}")
                
    if not context_parts:
        raise HTTPException(status_code=400, detail="No readable text found in documents.")
        
    full_context = "\n".join(context_parts)
    
    if not os.environ.get("GEMINI_API_KEY"):
        raise HTTPException(status_code=500, detail="Configuration Error: GEMINI_API_KEY is missing from the environment. Please configure Google AI Studio credentials to enable analysis.")
    
    try:
        analysis_result = generate_analysis(full_context, scenario=workspace.get("scenario", ""))
    except Exception as e:
        print(f"Gemini Analysis Failed: {e}")
        error_msg = str(e)
        if "API_KEY_INVALID" in error_msg:
            raise HTTPException(status_code=500, detail="Configuration Error: The provided Google AI Studio API key is invalid.")
        elif "schema" in error_msg.lower() or "json" in error_msg.lower():
            raise HTTPException(status_code=500, detail="Analysis Error: The AI model failed to produce a valid structured response. Please try again.")
        else:
            raise HTTPException(status_code=500, detail=f"AI Analysis Failed: Could not connect to Google AI Studio. Ensure the API key is correct and network is available.")
        
    # Store AI output in dedicated analysis object
    workspace["analysis"] = {
        "decisionBrief": analysis_result.get("decisionBrief", []),
        "actionItems": analysis_result.get("actionItems", []),
        "risks": analysis_result.get("risks", []),
        "nextBestAction": analysis_result.get("nextBestAction", {}),
        "generatedContent": analysis_result.get("generatedContent", {}),
        "aiConfidence": analysis_result.get("aiConfidence", 85),
        "metadata": {
            "analysisTimestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
            "modelName": "gemini-2.5-pro",
            "status": "Analysis Complete",
            "demoMode": analysis_result.get("demoMode", False)
        }
    }
    
    workspace["status"] = "Analysis Complete"
    workspace["updated"] = "Just now"
    
    save_db(db)
    return workspace

@router.delete("/{workspace_id}")
def delete_workspace(workspace_id: str):
    print(f"--- DELETING WORKSPACE: {workspace_id} ---")
    
    try:
        db = load_db()
        
        workspace_idx = -1
        for i, ws in enumerate(db.get("workspaces", [])):
            if ws["id"] == workspace_id:
                workspace_idx = i
                break
                
        if workspace_idx == -1:
            print(f"Workspace {workspace_id} does not exist in db.json")
            from fastapi.responses import JSONResponse
            return JSONResponse(status_code=404, content={"success": False, "message": "Workspace not found."})
            
        print(f"Workspace {workspace_id} found at index {workspace_idx}")
            

            
        # Remove files from disk
        uploads_dir = os.path.join(os.getcwd(), "uploads", workspace_id)
        print(f"Upload directory path: {uploads_dir}")
        
        if os.path.exists(uploads_dir):
            print(f"Upload directory exists, attempting to delete...")
            import shutil
            try:
                shutil.rmtree(uploads_dir)
                print(f"shutil.rmtree succeeded.")
            except Exception as e:
                print(f"\nWARNING:\nUpload directory could not be removed because it is currently locked.\nDirectory scheduled for cleanup on the next backend startup.")
                if "pending_cleanup" not in db:
                    db["pending_cleanup"] = []
                if uploads_dir not in db["pending_cleanup"]:
                    db["pending_cleanup"].append(uploads_dir)
        else:
            print(f"Warning: Upload directory does NOT exist, skipping deletion.")
            
        # Remove from DB
        deleted_workspace = db["workspaces"].pop(workspace_idx)
        save_db(db)
        
        # Reload and verify
        db_reloaded = load_db()
        after_ids = [w["id"] for w in db_reloaded.get("workspaces", [])]
        print("\nAfter Delete")
        print("Workspace IDs:")
        for w_id in after_ids:
            print(w_id)
            
        remaining_workspaces = len(after_ids)
        print("\nWorkspace deleted successfully.")
        print(f"Workspace ID: {workspace_id}")
        print(f"Remaining workspaces: {remaining_workspaces}\n")
        
        return {"message": "Workspace deleted successfully", "deleted": deleted_workspace["name"]}
        
    except Exception as e:
        import traceback
        print("Exception occurred during deletion:")
        traceback.print_exc()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))


class ExecuteActionRequest(BaseModel):
    actionTitle: str
    actionOwner: str
    actionDue: str
    priority: Optional[str] = "High"
    businessImpact: Optional[str] = ""
    executedBy: Optional[str] = "Bala"

@router.patch("/{workspace_id}/execute-action")
def execute_action(workspace_id: str, body: ExecuteActionRequest):
    db = load_db()
    workspace = next((ws for ws in db.get("workspaces", []) if ws["id"] == workspace_id), None)
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")

    # Generate work item reference: WI-YYYY-NNNN
    import random
    year = datetime.datetime.now().year
    ref_num = str(random.randint(1000, 9999))
    work_item_ref = f"WI-{year}-{ref_num}"
    executed_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

    # Append to executedActions
    if "executedActions" not in workspace:
        workspace["executedActions"] = []
    workspace["executedActions"].append({
        "id": str(uuid.uuid4()),
        "title": body.actionTitle,
        "owner": body.actionOwner,
        "executedBy": body.executedBy,
        "workItemRef": work_item_ref,
        "executedAt": executed_at,
        "priority": body.priority,
    })

    # Update timeline: mark "Action Approved" and "Action Executed" completed
    STAGE_APPROVED = "Action Approved"
    STAGE_EXECUTED = "Action Executed"
    timeline = workspace.get("timeline", [])
    stage_labels = [s["label"] for s in timeline]

    # Add stages if not present
    if STAGE_APPROVED not in stage_labels:
        timeline.append({"label": STAGE_APPROVED, "completed": True})
    else:
        for s in timeline:
            if s["label"] == STAGE_APPROVED:
                s["completed"] = True

    if STAGE_EXECUTED not in stage_labels:
        timeline.append({"label": STAGE_EXECUTED, "completed": True})
    else:
        for s in timeline:
            if s["label"] == STAGE_EXECUTED:
                s["completed"] = True

    workspace["timeline"] = timeline
    workspace["status"] = "Action Executed"
    workspace["updated"] = "Just now"

    save_db(db)
    print(f"[ExecuteAction] Work item {work_item_ref} created for workspace {workspace_id}")
    return workspace


