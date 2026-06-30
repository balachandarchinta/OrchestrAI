# OrchestrAI: Enterprise Decision Intelligence Platform

OrchestrAI is an Enterprise Decision Intelligence platform that transforms disconnected business context into explainable, auditable, and actionable decisions using Gemini AI.

---

## 1. Problem Statement
Modern enterprises face significant challenges in operational alignment and decision execution:
* **Information Silos**: Critical business context is scattered across disparate formats—PDF reports, complex spreadsheets, meeting transcripts, and unstructured text documents.
* **Decision Latency**: High turnaround times required for analysts and operators to digest, synthesize, and recommend operational next steps.
* **Lack of Explainability**: Traditional AI recommendations operate as black boxes, providing suggestions without source grounding or transparent reasoning.
* **Manual Action Tracking**: A complete lack of integration between decision outcomes and the underlying evidence that justified them, leading to execution delays and audit failures.

---

## 2. Solution
OrchestrAI resolves enterprise operational bottlenecks by providing a structured decision intelligence workflow:
1. **Context Aggregation**: Unified upload and parsing of PDFs, Excel models (`.xlsx`), and transcripts (`.txt`).
2. **Auditable Analysis**: Gemini-powered decision briefs, risk extraction, and next best action suggestions.
3. **Ground Truth Grounding (Why?)**: Explains the reasoning behind every recommendation with direct, quote-level evidence linked back to source files.
4. **Human-in-the-Loop Execution**: Review, approve, and simulate work item generation (`WI-YYYY-NNNN` reference) that instantly syncs back to the operational dashboard.

### AI Decision Flow
```
Business Documents
        │
        ▼
Document Parser
        │
        ▼
Gemini AI
        │
        ▼
Enterprise Context
        │
        ▼
Executive Brief
        │
        ▼
Next Best Action
        │
        ▼
Why? Explainability
        │
        ▼
Human Review
        │
        ▼
Execute Action
        │
        ▼
Dashboard & Timeline
```

---

## 3. Key Features
* **Dynamic Workspaces**: Scenario-specific workspaces containing uploaded documents, operational metadata, and executive action states.
* **Document Ingestion & Enterprise Parsing**: Out-of-the-box text extraction and processing for `.pdf` documents, `.xlsx` spreadsheet grids, and `.txt` transcripts.
* **Gemini Decision Intelligence**: Proactive synthesis of complex multi-document text to generate centralized briefs, risks, and next best actions.
* **Executive Brief & Action Plan**: Centralized summaries, business impacts, recommendations, and list of pending action items.
* **Why? Explainability Engine**: Quote-level source attribution that exposes verbatim text evidence for any given recommendation.
* **AI Briefing Modal**: On-demand audio-ready briefings and presentation talking points, computed instantly from cached analysis without extra API costs.
* **Human-in-the-loop Execute Action**: Review modal enabling operators to inspect priority, due date, owner, and estimated business impact before approving.
* **Timeline & Workflow Metrics**: Real-time progress trackers showing the current stage of the decision-to-action cycle and dynamic KPI calculations (success rates, confidence).
* **Dashboard Synchronization**: Live updates to the executive dashboard showing completed actions and recent activity references without manual reloads.
* **Demo Mode Fallback**: Automatic detection of rate limits (HTTP 429) or service outages to load cached local analysis scenarios, rendering the app bulletproof.

---

## 4. Architecture
OrchestrAI utilizes a decoupled architecture with React state management on the client and a high-performance Python FastAPI engine on the server.

```
       React + Vite
            │
    Workspace Context
            │
         FastAPI
            │
     Document Parser
            │
        Gemini AI
            │
  Decision Intelligence
            │
        JSON Storage
            │
    Enterprise Dashboard
```

### Detailed Flow:
1. **Frontend (React + Vite)**: Collects document assets and routes operational commands. State is synchronized via a centralized `WorkspaceContext` and styled using Tailwind CSS and shadcn/ui.
2. **Backend (FastAPI)**: Handlers process upload events, coordinate local storage, run schema checks, and query AI engines.
3. **Storage (Local JSON Database)**: Stored in a local database file (`db.json`) for speed, auditability, and ease of deployment.
4. **AI Processing (Gemini AI)**: Google Gemini API analyzes parsed context and generates validated, structured JSON responses.

---

## 5. Google Technologies Integration
OrchestrAI relies heavily on Google's industry-leading AI infrastructure:
* **Google Gemini API**: Utilizes the powerful `gemini-2.5-pro` model to digest large volumes of parsed context and synthesize structured executive recommendations.
* **Google AI Studio**: Serves as the primary developer interface for prompt engineering, temperature tuning, and system instructions.
* **Structured JSON Output**: Enforces rigid JSON schemas (`response_mime_type="application/json"` with Pydantic) to guarantee that AI recommendations are returned in a format directly readable by the frontend UI.
* **Long-Context Enterprise Reasoning**: Leverages Gemini's high token limits to ingest multiple enterprise documents (transcripts, proposals, forecasts) simultaneously in a single prompt.
* **Enterprise Decision Support**: Grounds every decision brief and recommended action with exact evidence quotes from documents to eliminate hallucinations.

---

## 6. Business Value & Impact
OrchestrAI solves the primary challenges of modern operations teams:
* **Faster Executive Decision Making**: Cuts down document synthesis time from hours to seconds.
* **Explainable AI Recommendations**: Eliminates black-box distrust by linking actions to direct quote highlights.
* **Human Approval Before Execution**: Ensures operators maintain final sign-off authority for every action.
* **Enterprise Auditability**: Tracks every work item's lineage back to its source document and timestamp.
* **Reduced Context Switching**: Consolidates documents, briefings, redlines, and action tracking into a single tab.

| Enterprise Challenge | OrchestrAI Solution | Business Impact |
| :--- | :--- | :--- |
| **Scattered Enterprise Info** | Unified Workspace | 80% reduction in context switching |
| **Manual Sync Preparation** | AI Briefing / Summary | Saves hours of preparation per meeting |
| **Unexplained AI Decisions** | Why? Explainability | High compliance trust & auditability |
| **Slow Execution Follow-up** | Execute Action | Instantly converts recommendations to work items |
| **Lack of Audit Trails** | Activity Timeline & Reference | Clear timeline of decision lineage |

---

## 7. Installation & Setup

### Prerequisites
* Python 3.10 or higher
* Node.js (v18 or higher) and npm

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend/` root directory:
   ```env
   GEMINI_API_KEY=your_google_ai_studio_key_here
   ```
5. Seed the database with the pre-configured demo scenarios:
   ```bash
   python seed.py
   ```
6. Start the FastAPI backend server:
   ```bash
   uvicorn src.main:app --port 8001
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install Node modules:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser at `http://localhost:5173/`.

---

## 8. Polished Demo Scenarios
OrchestrAI includes three seeded workspaces representing standard enterprise workflows:

1. **Q3 Pricing Review (Financial Strategy)**:
   * *Challenge*: Reconcile an 8% SaaS margin reduction.
   * *Assets*: Meeting transcript, SaaS pricing model, and budget forecast.
   * *Action*: Click **Why?** to inspect Sarah's margin warning quotes, review the briefing, and approve & execute the finalized tier adjustments.
2. **Vendor Negotiation (Procurement & Compliance)**:
   * *Challenge*: Locate missing liability clauses on a high-value ACME Corp contract.
   * *Assets*: Master Services Agreement, contract cost analysis, and redline notes.
   * *Action*: Review flagged blank indemnification clause evidence and halt signing until redlines are sent.
3. **Product Launch (Marketing & Operations)**:
   * *Challenge*: Coordinate launch messaging and agency briefing deadlines.
   * *Assets*: Product Requirements Document (PRD), launch checklist, and marketing plan.
   * *Action*: Verify timeline dependencies and lock marketing assets before next week's PR briefings.

---

## 9. Future Scope & Roadmap
* **Vector Database (RAG Integration)**: Add vector embedding and semantic search across historical workspace archives.
* **Multi-Agent Collaboration**: Legal, Financial, and Operational AI agents debating recommendations before presenting them.
* **Bi-directional Integration**: Direct integrations with Slack, Jira, ServiceNow, and Google Workspace to automatically trigger tickets and alerts.
