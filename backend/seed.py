import json
import os
import shutil

DB_PATH = "c:/Users/balac/OneDrive/Desktop/working file/OrchestrAI/backend/data/db.json"
UPLOAD_DIR = "c:/Users/balac/OneDrive/Desktop/working file/OrchestrAI/backend/uploads"

# Fixed, stable UUIDs
WORKSPACE_IDS = {
    "q3_pricing": "a1b2c3d4-0001-4001-8001-000000000001",
    "vendor_negotiation": "a1b2c3d4-0002-4002-8002-000000000002",
    "product_launch": "a1b2c3d4-0003-4003-8003-000000000003",
}

# Document IDs for seed documents
DOC_IDS = {
    "transcript": "d1d1d1d1-1111-1111-1111-111111111111",
    "proposal": "d2d2d2d2-2222-2222-2222-222222222222",
    "forecast": "d3d3d3d3-3333-3333-3333-333333333333",
    "contract": "d4d4d4d4-4444-4444-4444-444444444444",
    "notes": "d5d5d5d5-5555-5555-5555-555555555555",
    "cost": "d6d6d6d6-6666-6666-6666-666666666666",
    "prd": "d7d7d7d7-7777-7777-7777-777777777777",
    "checklist": "d8d8d8d8-8888-8888-8888-888888888888",
    "marketing": "d9d9d9d9-9999-9999-9999-999999999999",
}

def write_seed_file(workspace_id, doc_id, filename, content):
    workspace_dir = os.path.join(UPLOAD_DIR, workspace_id)
    os.makedirs(workspace_dir, exist_ok=True)
    
    # Write original file
    orig_path = os.path.join(workspace_dir, f"{doc_id}.txt")
    with open(orig_path, "w", encoding="utf-8") as f:
        f.write(content)
        
    # Write extracted file
    ext_path = os.path.join(workspace_dir, f"{doc_id}_extracted.txt")
    with open(ext_path, "w", encoding="utf-8") as f:
        f.write(content)
        
    return orig_path, ext_path

def seed_db():
    # Clean up and reset uploads directory
    if os.path.exists(UPLOAD_DIR):
        try:
            shutil.rmtree(UPLOAD_DIR)
            print("Cleared uploads folder.")
        except Exception as e:
            print(f"Warning: Could not clear uploads folder: {e}")
            
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # 1. Q3 Pricing Review Content
    txt_transcript = "Bala: We need the pricing approval finalized before Friday's executive committee meeting.\nSarah: Understood, but the commercial pricing updates show a margin reduction of 8% on the core SaaS tier.\nDavid: We should check if we can offset this with the enterprise Tier increases.\nBala: Let's focus on finishing pricing approval by tomorrow so we have time to review the final deck."
    txt_proposal = "OrchestrAI Enterprise SaaS Pricing Model v3:\n- Developer tier: $49/mo (no changes)\n- Professional tier: $199/mo (updated from $219/mo, resulting in approx 8% margin reduction)\n- Enterprise tier: Custom pricing (minimum $2,000/mo, increased liability protection included)"
    txt_forecast = "Q3 Financial Projections & Budget Forecast:\n- SaaS revenue targets adjusted due to tier pricing adjustments.\n- Estimated margin impact is a reduction of 8% in SaaS margins.\n- Marketing budgets for Q4 are scheduled for reallocation if SaaS revenue targets are not met."

    write_seed_file(WORKSPACE_IDS["q3_pricing"], DOC_IDS["transcript"], "meeting_transcript.txt", txt_transcript)
    write_seed_file(WORKSPACE_IDS["q3_pricing"], DOC_IDS["proposal"], "pricing_proposal.txt", txt_proposal)
    write_seed_file(WORKSPACE_IDS["q3_pricing"], DOC_IDS["forecast"], "budget_forecast.txt", txt_forecast)

    # 2. Vendor Negotiation Content
    txt_contract = "Standard Master Services Agreement (MSA) between OrchestrAI Inc. and ACME Corp.\nSection 8: Indemnification [Left blank / Awaiting legal appendix]\nSection 9: Limitation of Liability\nThe contractor's total liability under this agreement shall not exceed the total fees paid to the contractor."
    txt_notes = "Negotiation sync notes:\n- Legal team flagged that ACME Corp's contract has a blank indemnification clause.\n- Standard legal policy requires reciprocal indemnification for all vendors with >$50k annual contract value.\n- Need to send redlines with our standard MSA addendum to ACME legal today."
    txt_cost = "ACME Corp Contract Cost Breakdown:\n- Year 1 License Fee: $65,000 (exceeds the $50k threshold for standard legal review).\n- Professional Services: $15,000 one-time onboarding.\n- Total Contract Value: $80,000."

    write_seed_file(WORKSPACE_IDS["vendor_negotiation"], DOC_IDS["contract"], "vendor_contract.txt", txt_contract)
    write_seed_file(WORKSPACE_IDS["vendor_negotiation"], DOC_IDS["notes"], "negotiation_notes.txt", txt_notes)
    write_seed_file(WORKSPACE_IDS["vendor_negotiation"], DOC_IDS["cost"], "cost_analysis.txt", txt_cost)

    # 3. Product Launch Content
    txt_prd = "Product Requirements Document (PRD) - OrchestrAI Decision Intelligence v1.3:\n- Core Features: Explainability Panel, Execute Action Modal, Calculated Workflow Metrics.\n- Code Freeze: Scheduled for Friday evening.\n- PR Agency Briefing: Scheduled for next Tuesday morning."
    txt_checklist = "Product Launch Checklist:\n- Final VP sign-off on PR messaging and tagline assets.\n- PR briefing document finalized.\n- PR agency sync scheduled for Tuesday.\n- Rollout plan includes feature flags for soft launch to mitigate engineering delay risk."
    txt_marketing = "Go-To-Market and Marketing Strategy:\n- Launch campaign highlights: Explainability engine, Decision-to-action workflow.\n- PR brief draft targeting tech and enterprise software publications.\n- Ad spend increase of 10% scheduled for initial launch weeks."

    write_seed_file(WORKSPACE_IDS["product_launch"], DOC_IDS["prd"], "product_requirements.txt", txt_prd)
    write_seed_file(WORKSPACE_IDS["product_launch"], DOC_IDS["checklist"], "launch_checklist.txt", txt_checklist)
    write_seed_file(WORKSPACE_IDS["product_launch"], DOC_IDS["marketing"], "marketing_plan.txt", txt_marketing)

    workspaces_data = [
        {
            "id": WORKSPACE_IDS["q3_pricing"],
            "name": "Q3 Pricing Review",
            "scenario": "Financial Strategy",
            "documents": 3,
            "updated": "2 hours ago",
            "status": "Analysis Complete",
            "priority": "Medium",
            "aiConfidence": 94,
            "nextBestAction": {
                "title": "Finish Pricing Approval",
                "owner": "Bala",
                "due": "Tomorrow",
                "reason": "Pricing review meeting tomorrow",
                "whyDescription": "Based on the latest financial documents uploaded, there is a discrepancy in Q3 projections. Addressing this risk early minimizes potential downstream delays.",
                "evidence": [
                    {
                        "source": "meeting_transcript.txt",
                        "quote": "Bala: We need the pricing approval finalized before Friday's executive committee meeting."
                    },
                    {
                        "source": "pricing_proposal.txt",
                        "quote": "Professional tier: $199/mo (updated from $219/mo, resulting in approx 8% margin reduction)"
                    },
                    {
                        "source": "budget_forecast.txt",
                        "quote": "Estimated margin impact is a reduction of 8% in SaaS margins."
                    }
                ]
            },
            "timeline": [
                {"label": "Workspace Created", "completed": True},
                {"label": "Documents Uploaded", "completed": True},
                {"label": "AI Analysis Completed", "completed": True},
                {"label": "Decision Generated", "completed": True},
                {"label": "Action Approved", "completed": False},
                {"label": "Action Executed", "completed": False}
            ],
            "decisionBrief": [
                {"title": "Overall Summary", "content": "Provide a high-level overview of the Q3 pricing analysis and main takeaways here."},
                {"title": "Business Impact", "content": "Describe how these pricing changes will affect revenue, customer retention, and market positioning."},
                {"title": "Key Decisions", "content": "List the finalized decisions that need to be made during this review."},
                {"title": "Open Questions", "content": "Detail any unresolved issues or missing data required for the final sign-off."},
                {"title": "Recommendations", "content": "Outline the AI-generated recommended actions based on the uploaded documents."}
            ],
            "actionItems": [
                {"id": "a1", "status": "Draft", "task": "Finish Pricing Approval", "owner": "Bala", "due": "Tomorrow", "source": "meeting_transcript.txt"},
                {"id": "a2", "status": "Draft", "task": "Update Budget", "owner": "Finance", "due": "Friday", "source": "budget_forecast.txt"}
            ],
            "risks": [
                {"id": "r1", "risk": "Potential budget overrun in Q4", "impact": "High", "mitigation": "Reallocate marketing funds and delay non-critical hires."},
                {"id": "r2", "risk": "Resource constraints in engineering team", "impact": "Medium", "mitigation": "Prioritize core features; consider short-term contractors."}
            ],
            "generatedContent": {
                "draftEmail": "Hi Team,\n\nFollowing our Q3 Pricing Review, please note that we need to finalize the pricing approval by tomorrow. Finance is also tasked with updating the budget by Friday.\n\nBest,\nBala",
                "draftWorkItem": {
                    "title": "Finalize Q3 Pricing Adjustments",
                    "description": "Review and approve the latest pricing model proposed during the Q3 planning session.",
                    "priority": "High"
                }
            },
            "analysis": {
                "decisionBrief": [
                    {"title": "Overall Summary", "content": "Provide a high-level overview of the Q3 pricing analysis and main takeaways here."},
                    {"title": "Business Impact", "content": "Describe how these pricing changes will affect revenue, customer retention, and market positioning."},
                    {"title": "Key Decisions", "content": "List the finalized decisions that need to be made during this review."},
                    {"title": "Open Questions", "content": "Detail any unresolved issues or missing data required for the final sign-off."},
                    {"title": "Recommendations", "content": "Outline the AI-generated recommended actions based on the uploaded documents."}
                ],
                "actionItems": [
                    {"id": "a1", "status": "Draft", "task": "Finish Pricing Approval", "owner": "Bala", "due": "Tomorrow", "source": "meeting_transcript.txt"},
                    {"id": "a2", "status": "Draft", "task": "Update Budget", "owner": "Finance", "due": "Friday", "source": "budget_forecast.txt"}
                ],
                "risks": [
                    {"id": "r1", "risk": "Potential budget overrun in Q4", "impact": "High", "mitigation": "Reallocate marketing funds and delay non-critical hires."},
                    {"id": "r2", "risk": "Resource constraints in engineering team", "impact": "Medium", "mitigation": "Prioritize core features; consider short-term contractors."}
                ],
                "nextBestAction": {
                    "title": "Finish Pricing Approval",
                    "owner": "Bala",
                    "due": "Tomorrow",
                    "reason": "Pricing review meeting tomorrow",
                    "whyDescription": "Based on the latest financial documents uploaded, there is a discrepancy in Q3 projections. Addressing this risk early minimizes potential downstream delays.",
                    "evidence": [
                        {
                            "source": "meeting_transcript.txt",
                            "quote": "Bala: We need the pricing approval finalized before Friday's executive committee meeting."
                        },
                        {
                            "source": "pricing_proposal.txt",
                            "quote": "Professional tier: $199/mo (updated from $219/mo, resulting in approx 8% margin reduction)"
                        },
                        {
                            "source": "budget_forecast.txt",
                            "quote": "Estimated margin impact is a reduction of 8% in SaaS margins."
                        }
                    ]
                },
                "generatedContent": {
                    "draftEmail": "Hi Team,\n\nFollowing our Q3 Pricing Review, please note that we need to finalize the pricing approval by tomorrow. Finance is also tasked with updating the budget by Friday.\n\nBest,\nBala",
                    "draftWorkItem": {
                        "title": "Finalize Q3 Pricing Adjustments",
                        "description": "Review and approve the latest pricing model proposed during the Q3 planning session.",
                        "priority": "High"
                    }
                },
                "aiConfidence": 94,
                "metadata": {
                    "analysisTimestamp": "2026-06-30 17:00",
                    "modelName": "gemini-2.5-pro",
                    "status": "Analysis Complete",
                    "demoMode": False
                }
            },
            "files": [
                {
                    "id": DOC_IDS["forecast"],
                    "filename": "budget_forecast.txt",
                    "extension": "txt",
                    "size": len(txt_forecast),
                    "uploadedAt": "2 hours ago",
                    "status": "Ready",
                    "characterCount": len(txt_forecast),
                    "storagePath": os.path.join(UPLOAD_DIR, WORKSPACE_IDS["q3_pricing"], f"{DOC_IDS['forecast']}.txt"),
                    "extractedTextPath": os.path.join(UPLOAD_DIR, WORKSPACE_IDS["q3_pricing"], f"{DOC_IDS['forecast']}_extracted.txt")
                },
                {
                    "id": DOC_IDS["proposal"],
                    "filename": "pricing_proposal.txt",
                    "extension": "txt",
                    "size": len(txt_proposal),
                    "uploadedAt": "2 hours ago",
                    "status": "Ready",
                    "characterCount": len(txt_proposal),
                    "storagePath": os.path.join(UPLOAD_DIR, WORKSPACE_IDS["q3_pricing"], f"{DOC_IDS['proposal']}.txt"),
                    "extractedTextPath": os.path.join(UPLOAD_DIR, WORKSPACE_IDS["q3_pricing"], f"{DOC_IDS['proposal']}_extracted.txt")
                },
                {
                    "id": DOC_IDS["transcript"],
                    "filename": "meeting_transcript.txt",
                    "extension": "txt",
                    "size": len(txt_transcript),
                    "uploadedAt": "2 hours ago",
                    "status": "Ready",
                    "characterCount": len(txt_transcript),
                    "storagePath": os.path.join(UPLOAD_DIR, WORKSPACE_IDS["q3_pricing"], f"{DOC_IDS['transcript']}.txt"),
                    "extractedTextPath": os.path.join(UPLOAD_DIR, WORKSPACE_IDS["q3_pricing"], f"{DOC_IDS['transcript']}_extracted.txt")
                }
            ]
        },
        {
            "id": WORKSPACE_IDS["vendor_negotiation"],
            "name": "Vendor Negotiation",
            "scenario": "Procurement",
            "documents": 3,
            "updated": "Yesterday",
            "status": "Analysis Complete",
            "priority": "High",
            "aiConfidence": 87,
            "nextBestAction": {
                "title": "Review ACME Corp Contract",
                "owner": "Legal Team",
                "due": "Today",
                "reason": "Missing liability clause detected",
                "whyDescription": "The uploaded vendor contract for ACME Corp is missing the standard indemnification clause required by our legal department.",
                "evidence": [
                    {
                        "source": "vendor_contract.txt",
                        "quote": "Section 8: Indemnification [Left blank / Awaiting legal appendix]"
                    },
                    {
                        "source": "negotiation_notes.txt",
                        "quote": "Standard legal policy requires reciprocal indemnification for all vendors with >$50k annual contract value."
                    }
                ]
            },
            "timeline": [
                {"label": "Workspace Created", "completed": True},
                {"label": "Documents Uploaded", "completed": True},
                {"label": "AI Analysis Completed", "completed": True},
                {"label": "Decision Generated", "completed": True},
                {"label": "Action Approved", "completed": False},
                {"label": "Action Executed", "completed": False}
            ],
            "decisionBrief": [
                {"title": "Overall Summary", "content": "Analysis of the ACME Corp vendor contract reveals standard terms with a few critical omissions."},
                {"title": "Business Impact", "content": "Proceeding without standard liability clauses exposes the company to unnecessary financial risk."},
                {"title": "Key Decisions", "content": "Decide whether to renegotiate terms or accept the current risk profile."},
                {"title": "Open Questions", "content": "Is ACME Corp willing to adopt our standard MSA?"},
                {"title": "Recommendations", "content": "Halt signing until the indemnification clause is fully incorporated."}
            ],
            "actionItems": [
                {"id": "a3", "status": "To Do", "task": "Send redlines to ACME", "owner": "Legal", "due": "Today", "source": "vendor_contract.txt"},
                {"id": "a4", "status": "In Progress", "task": "Schedule negotiation sync", "owner": "Bala", "due": "Wednesday", "source": "negotiation_notes.txt"}
            ],
            "risks": [
                {"id": "r3", "risk": "Missing indemnification clause", "impact": "High", "mitigation": "Provide ACME with our standard MSA addendum."},
                {"id": "r4", "risk": "Delayed procurement timeline", "impact": "Low", "mitigation": "Fast-track legal review once new terms are submitted."}
            ],
            "generatedContent": {
                "draftEmail": "Hi ACME Team,\n\nWe have reviewed the latest contract draft. Please find our redlines attached, specifically addressing the missing indemnification clause.\n\nThanks,\nBala",
                "draftWorkItem": {
                    "title": "ACME Contract Redlines",
                    "description": "Send standard MSA addendum to ACME Corp for their review.",
                    "priority": "High"
                }
            },
            "analysis": {
                "decisionBrief": [
                    {"title": "Overall Summary", "content": "Analysis of the ACME Corp vendor contract reveals standard terms with a few critical omissions."},
                    {"title": "Business Impact", "content": "Proceeding without standard liability clauses exposes the company to unnecessary financial risk."},
                    {"title": "Key Decisions", "content": "Decide whether to renegotiate terms or accept the current risk profile."},
                    {"title": "Open Questions", "content": "Is ACME Corp willing to adopt our standard MSA?"},
                    {"title": "Recommendations", "content": "Halt signing until the indemnification clause is fully incorporated."}
                ],
                "actionItems": [
                    {"id": "a3", "status": "To Do", "task": "Send redlines to ACME", "owner": "Legal", "due": "Today", "source": "vendor_contract.txt"},
                    {"id": "a4", "status": "In Progress", "task": "Schedule negotiation sync", "owner": "Bala", "due": "Wednesday", "source": "negotiation_notes.txt"}
                ],
                "risks": [
                    {"id": "r3", "risk": "Missing indemnification clause", "impact": "High", "mitigation": "Provide ACME with our standard MSA addendum."},
                    {"id": "r4", "risk": "Delayed procurement timeline", "impact": "Low", "mitigation": "Fast-track legal review once new terms are submitted."}
                ],
                "nextBestAction": {
                    "title": "Review ACME Corp Contract",
                    "owner": "Legal Team",
                    "due": "Today",
                    "reason": "Missing liability clause detected",
                    "whyDescription": "The uploaded vendor contract for ACME Corp is missing the standard indemnification clause required by our legal department.",
                    "evidence": [
                        {
                            "source": "vendor_contract.txt",
                            "quote": "Section 8: Indemnification [Left blank / Awaiting legal appendix]"
                        },
                        {
                            "source": "negotiation_notes.txt",
                            "quote": "Standard legal policy requires reciprocal indemnification for all vendors with >$50k annual contract value."
                        }
                    ]
                },
                "generatedContent": {
                    "draftEmail": "Hi ACME Team,\n\nWe have reviewed the latest contract draft. Please find our redlines attached, specifically addressing the missing indemnification clause.\n\nThanks,\nBala",
                    "draftWorkItem": {
                        "title": "ACME Contract Redlines",
                        "description": "Send standard MSA addendum to ACME Corp for their review.",
                        "priority": "High"
                    }
                },
                "aiConfidence": 87,
                "metadata": {
                    "analysisTimestamp": "2026-06-30 15:30",
                    "modelName": "gemini-2.5-pro",
                    "status": "Analysis Complete",
                    "demoMode": False
                }
            },
            "files": [
                {
                    "id": DOC_IDS["cost"],
                    "filename": "cost_analysis.txt",
                    "extension": "txt",
                    "size": len(txt_cost),
                    "uploadedAt": "Yesterday",
                    "status": "Ready",
                    "characterCount": len(txt_cost),
                    "storagePath": os.path.join(UPLOAD_DIR, WORKSPACE_IDS["vendor_negotiation"], f"{DOC_IDS['cost']}.txt"),
                    "extractedTextPath": os.path.join(UPLOAD_DIR, WORKSPACE_IDS["vendor_negotiation"], f"{DOC_IDS['cost']}_extracted.txt")
                },
                {
                    "id": DOC_IDS["notes"],
                    "filename": "negotiation_notes.txt",
                    "extension": "txt",
                    "size": len(txt_notes),
                    "uploadedAt": "Yesterday",
                    "status": "Ready",
                    "characterCount": len(txt_notes),
                    "storagePath": os.path.join(UPLOAD_DIR, WORKSPACE_IDS["vendor_negotiation"], f"{DOC_IDS['notes']}.txt"),
                    "extractedTextPath": os.path.join(UPLOAD_DIR, WORKSPACE_IDS["vendor_negotiation"], f"{DOC_IDS['notes']}_extracted.txt")
                },
                {
                    "id": DOC_IDS["contract"],
                    "filename": "vendor_contract.txt",
                    "extension": "txt",
                    "size": len(txt_contract),
                    "uploadedAt": "Yesterday",
                    "status": "Ready",
                    "characterCount": len(txt_contract),
                    "storagePath": os.path.join(UPLOAD_DIR, WORKSPACE_IDS["vendor_negotiation"], f"{DOC_IDS['contract']}.txt"),
                    "extractedTextPath": os.path.join(UPLOAD_DIR, WORKSPACE_IDS["vendor_negotiation"], f"{DOC_IDS['contract']}_extracted.txt")
                }
            ]
        },
        {
            "id": WORKSPACE_IDS["product_launch"],
            "name": "Product Launch",
            "scenario": "Marketing & Sales",
            "documents": 3,
            "updated": "3 days ago",
            "status": "Analysis Complete",
            "priority": "High",
            "aiConfidence": 91,
            "nextBestAction": {
                "title": "Finalize Marketing Assets",
                "owner": "Marketing",
                "due": "Next Monday",
                "reason": "Launch date approaching",
                "whyDescription": "All core messaging must be locked in before we can brief the PR agency next Tuesday.",
                "evidence": [
                    {
                        "source": "product_requirements.txt",
                        "quote": "PR Agency Briefing: Scheduled for next Tuesday morning."
                    },
                    {
                        "source": "launch_checklist.txt",
                        "quote": "PR agency sync scheduled for Tuesday."
                    }
                ]
            },
            "timeline": [
                {"label": "Workspace Created", "completed": True},
                {"label": "Documents Uploaded", "completed": True},
                {"label": "AI Analysis Completed", "completed": True},
                {"label": "Decision Generated", "completed": True},
                {"label": "Action Approved", "completed": False},
                {"label": "Action Executed", "completed": False}
            ],
            "decisionBrief": [
                {"title": "Overall Summary", "content": "The upcoming product launch requires alignment across sales, marketing, and engineering."},
                {"title": "Business Impact", "content": "A successful launch is projected to increase Q4 revenue by 20%."},
                {"title": "Key Decisions", "content": "Approve the final marketing budget and PR messaging."},
                {"title": "Open Questions", "content": "Will engineering meet the code freeze deadline?"},
                {"title": "Recommendations", "content": "Increase ad spend allocation by 10% for the first two weeks."}
            ],
            "actionItems": [
                {"id": "a5", "status": "Draft", "task": "Draft PR Briefing", "owner": "Marketing", "due": "Next Tuesday", "source": "product_requirements.txt"}
            ],
            "risks": [
                {"id": "r5", "risk": "Engineering delay", "impact": "High", "mitigation": "Implement feature flags to allow a soft launch if needed."}
            ],
            "generatedContent": {
                "draftEmail": "Hi PR Team,\n\nPlease see the attached product messaging guide for our upcoming launch. Let's sync on Tuesday to finalize the strategy.\n\nBest,\nBala",
                "draftWorkItem": {
                    "title": "PR Briefing Document",
                    "description": "Finalize the PR briefing document based on the latest messaging guide.",
                    "priority": "Medium"
                }
            },
            "analysis": {
                "decisionBrief": [
                    {"title": "Overall Summary", "content": "The upcoming product launch requires alignment across sales, marketing, and engineering."},
                    {"title": "Business Impact", "content": "A successful launch is projected to increase Q4 revenue by 20%."},
                    {"title": "Key Decisions", "content": "Approve the final marketing budget and PR messaging."},
                    {"title": "Open Questions", "content": "Will engineering meet the code freeze deadline?"},
                    {"title": "Recommendations", "content": "Increase ad spend allocation by 10% for the first two weeks."}
                ],
                "actionItems": [
                    {"id": "a5", "status": "Draft", "task": "Draft PR Briefing", "owner": "Marketing", "due": "Next Tuesday", "source": "product_requirements.txt"}
                ],
                "risks": [
                    {"id": "r5", "risk": "Engineering delay", "impact": "High", "mitigation": "Implement feature flags to allow a soft launch if needed."}
                ],
                "nextBestAction": {
                    "title": "Finalize Marketing Assets",
                    "owner": "Marketing",
                    "due": "Next Monday",
                    "reason": "Launch date approaching",
                    "whyDescription": "All core messaging must be locked in before we can brief the PR agency next Tuesday.",
                    "evidence": [
                        {
                            "source": "product_requirements.txt",
                            "quote": "PR Agency Briefing: Scheduled for next Tuesday morning."
                        },
                        {
                            "source": "launch_checklist.txt",
                            "quote": "PR agency sync scheduled for Tuesday."
                        }
                    ]
                },
                "generatedContent": {
                    "draftEmail": "Hi PR Team,\n\nPlease see the attached product messaging guide for our upcoming launch. Let's sync on Tuesday to finalize the strategy.\n\nBest,\nBala",
                    "draftWorkItem": {
                        "title": "PR Briefing Document",
                        "description": "Finalize the PR briefing document based on the latest messaging guide.",
                        "priority": "Medium"
                    }
                },
                "aiConfidence": 91,
                "metadata": {
                    "analysisTimestamp": "2026-06-30 12:15",
                    "modelName": "gemini-2.5-pro",
                    "status": "Analysis Complete",
                    "demoMode": False
                }
            },
            "files": [
                {
                    "id": DOC_IDS["marketing"],
                    "filename": "marketing_plan.txt",
                    "extension": "txt",
                    "size": len(txt_marketing),
                    "uploadedAt": "3 days ago",
                    "status": "Ready",
                    "characterCount": len(txt_marketing),
                    "storagePath": os.path.join(UPLOAD_DIR, WORKSPACE_IDS["product_launch"], f"{DOC_IDS['marketing']}.txt"),
                    "extractedTextPath": os.path.join(UPLOAD_DIR, WORKSPACE_IDS["product_launch"], f"{DOC_IDS['marketing']}_extracted.txt")
                },
                {
                    "id": DOC_IDS["checklist"],
                    "filename": "launch_checklist.txt",
                    "extension": "txt",
                    "size": len(txt_checklist),
                    "uploadedAt": "3 days ago",
                    "status": "Ready",
                    "characterCount": len(txt_checklist),
                    "storagePath": os.path.join(UPLOAD_DIR, WORKSPACE_IDS["product_launch"], f"{DOC_IDS['checklist']}.txt"),
                    "extractedTextPath": os.path.join(UPLOAD_DIR, WORKSPACE_IDS["product_launch"], f"{DOC_IDS['checklist']}_extracted.txt")
                },
                {
                    "id": DOC_IDS["prd"],
                    "filename": "product_requirements.txt",
                    "extension": "txt",
                    "size": len(txt_prd),
                    "uploadedAt": "3 days ago",
                    "status": "Ready",
                    "characterCount": len(txt_prd),
                    "storagePath": os.path.join(UPLOAD_DIR, WORKSPACE_IDS["product_launch"], f"{DOC_IDS['prd']}.txt"),
                    "extractedTextPath": os.path.join(UPLOAD_DIR, WORKSPACE_IDS["product_launch"], f"{DOC_IDS['prd']}_extracted.txt")
                }
            ]
        }
    ]

    # Log IDs for verification
    print("Seeding database with fixed, stable workspace IDs:")
    for ws in workspaces_data:
        print(f"  {ws['id']}  ->  {ws['name']}")

    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with open(DB_PATH, "w") as f:
        json.dump({"workspaces": workspaces_data}, f, indent=4)
    print("Database seeded successfully.")

if __name__ == "__main__":
    seed_db()
