from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import workspaces

app = FastAPI(title="OrchestrAI Enterprise Decision Intelligence")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(workspaces.router)

@app.on_event("startup")
def startup_event():
    from .database import load_db
    db = load_db()
    ws_list = db.get("workspaces", [])
    ids = [ws["id"] for ws in ws_list]
    
    # --- ID Uniqueness Guard ---
    seen = set()
    duplicates = []
    for ws_id in ids:
        if ws_id in seen:
            duplicates.append(ws_id)
        seen.add(ws_id)
    
    if duplicates:
        print("\n" + "="*60)
        print("STARTUP ERROR: Duplicate workspace IDs detected!")
        print(f"Duplicate IDs: {duplicates}")
        print("Fix db.json before restarting the server.")
        print("="*60 + "\n")
        import sys
        sys.exit(1)
    
    # --- Startup ID Manifest ---
    print(f"\n[Startup] Workspace ID manifest ({len(ws_list)} workspaces):")
    for ws in ws_list:
        print(f"  {ws['id']}  ->  {ws['name']}")
    print(f"[Startup] All IDs unique: OK\n")
    
    # --- Pending directory cleanup ---
    workspaces.cleanup_locked_directories()

@app.get("/health")
def health_check():
    return {"status": "ok"}
