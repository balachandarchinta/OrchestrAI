# OrchestrAI: Enterprise Decision Intelligence Platform

OrchestrAI transforms raw, disparate business documents into auditable, structured decision pathways and execution-ready work items. Built for modern enterprise operations, it bridges the gap between AI-driven insights and human-in-the-loop action execution.

---

## 1. Problem Statement
Enterprise operational teams spend hours manually synthesizing context across meeting transcripts, pricing models, contract terms, and budgets. This manual synthesis leads to:
* **Decision Latency**: High turnaround time to digest complex information and propose next steps.
* **Unmitigated Risk**: Compliance oversights, missing liability clauses, or budget discrepancies buried in large documents.
* **Lack of Auditability**: Disconnection between an approved action item and the source documents that justified it.

---

## 2. Solution
OrchestrAI solves these challenges by providing a structured decision intelligence workflow:
1. **Context Aggregation**: Unified upload and parsing of PDFs, Excel models (`.xlsx`), and transcripts (`.txt`).
2. **Auditable Analysis**: Gemini-powered decision briefs, risk extraction, and next best action suggestions.
3. **Ground Truth grounding (Why?)**: Explains the reasoning behind every recommendation with direct, quote-level evidence linked back to source files.
4. **Human-in-the-Loop Execution**: Review, approve, and simulate work item generation (`WI-YYYY-NNNN` reference) that instantly syncs back to the operational dashboard.

---

## 3. Technology Stack
* **Frontend**: React 18, Vite, TypeScript, TailwindCSS/Vanilla CSS, Lucide React (Icons).
* **Backend**: Python 3.10+, FastAPI, Uvicorn, Pydantic, PyPDF (PDF parsing), OpenPyXL (Excel parsing).
* **AI Engine**: Google Gemini API (`gemini-2.5-pro` model for structured JSON outputs).
* **Database**: JSON Storage (`db.json`) for lightweight database representation and stability.

---

## 4. Architecture Diagram

```
+--------------------------------------------------------------+
|                         React Frontend                       |
|   (Dashboard, Workspaces, Timeline, Toast Alerts, modals)   |
+------------------------------+-------------------------------+
                               |
                        HTTP REST APIs
                               |
                               v
+--------------------------------------------------------------+
|                         FastAPI Backend                      |
|      (Router Endpoints, Document Parser, JSON Database)      |
+----+------------------------------------+--------------------+
     |                                    |
  Read / Write                         Generate
  JSON State                           Analysis
     |                                    |
     v                                    v
+----+---------+                 +--------+--------+
|   db.json    |                 |   Gemini API    |
| (Workspaces) |                 | (gemini-2.5-pro)|
+--------------+                 +-----------------+
```

---

## 5. End-to-End Demo Flow

```
[Dashboard Metrics] ➔ [Open Workspace] ➔ [Upload Files] ➔ [Analyze Workspace]
                                                                  │
                                                                  ▼
[Dashboard Updated] ➔ [Execute Action] ➔ [AI Briefing] ➔ [Why? Explainability]
```

---

## 6. Installation & Setup

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend/` root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
5. Seed the database with the pre-configured demo scenarios:
   ```bash
   python seed.py
   ```
6. Start the FastAPI server:
   ```bash
   uvicorn src.main:app --port 8001
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install Node packages:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser at `http://localhost:5173/`.

---

## 7. Polished Demo Scenarios

OrchestrAI comes pre-seeded with three realistic enterprise scenarios:

### Scenario 1: Q3 Pricing Review
* **Documents**: `meeting_transcript.txt`, `pricing_proposal.txt`, `budget_forecast.txt`.
* **Focus**: Auditing an 8% SaaS margin reduction. Click **Why?** to inspect transcript evidence showing Sarah's concern and the pricing proposal sheet pricing adjustments.

### Scenario 2: Vendor Negotiation
* **Documents**: `vendor_contract.txt`, `negotiation_notes.txt`, `cost_analysis.txt`.
* **Focus**: Legal clause validation. Identifies a missing indemnification clause on ACME Corp's contract exceeding the $50k review threshold.

### Scenario 3: Product Launch
* **Documents**: `product_requirements.txt`, `launch_checklist.txt`, `marketing_plan.txt`.
* **Focus**: Project execution alignment. Recommends finalizing marketing assets before the PR agency briefing.

---

## 8. Future Roadmap
1. **Bidirectional Integrations**: Real-time sync with Jira, ServiceNow, and Slack.
2. **Vector RAG (Retrieval-Augmented Generation)**: Vector database integration to enable conversational search over historical workspace documents.
3. **Multi-Agent Debates**: Spawning developer, finance, and legal agents to challenge recommendations before presenting them to human reviewers.
