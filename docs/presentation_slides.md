# Slide Presentation: OrchestrAI
## Enterprise Decision Intelligence Platform

---

### Slide 1: OrchestrAI
**Transforming Enterprise Context into Auditable Action**
* **Presenter**: [Your Name]
* **Subtitle**: Hackathon Submission 2026

---

### Slide 2: The Problem
**Enterprise Decision Latency & Risks**
* **The Mess**: Teams spend hours manually synthesizing context across meeting transcripts, contracts, and forecasts.
* **The Consequences**:
  - Critical compliance details are missed (e.g. blank liability clauses).
  - Financial discrepancies are delayed.
  - No connection exists between a decision made and the source file justifying it.

---

### Slide 3: The Solution
**OrchestrAI's Auditable Decision Loop**
* **Unified Context**: Ingestion & parsing of transcripts, spreadsheets, and contracts.
* **Decision Synthesis**: Automatic structured analysis (briefs, risks, recommendations).
* **Auditable Reasoning**: Grounding recommendations directly using source quote highlights.
* **Human-in-the-Loop Execution**: Approve and track work item creation in a closed-loop dashboard.

---

### Slide 4: System Architecture
**Simple, Reliable, Decoupled**
* **Client**: React 18 SPA (State synced via context, styled with mutely colored enterprise theme).
* **Server**: FastAPI Backend (Robust parsing, unique ID validation at boot, robust locked-directory cleanup).
* **Model**: Gemini Pro (Generating structured JSON outputs).
* **Storage**: db.json (JSON storage for high performance and zero database maintenance).

---

### Slide 5: Auditable Grounding (Why? Engine)
**Zero-Trust Explainability**
* **Source Grounding**: Explains next best actions with direct quotes from documents.
* **Badged Confidence**: Progress indicator & color-coded badge.
* **Zero Additional Costs**: Derived entirely from stored analysis — no redundant LLM calls.

---

### Slide 6: Closed-Loop Execution
**From AI Suggestion to Tracked Work Item**
* **Step 1: Review**: Displays Task, Owner, Due, Priority, and Business Impact.
* **Step 2: Approve**: Triggers a simulated work item creation (`WI-YYYY-NNNN`).
* **Step 3: Update**: Workspace timeline updates, Completed KPIs increment, and dashboard Recent Activity reflects execution.

---

### Slide 7: Technical Guardrails & Demo Mode
**Built for Production-Grade Stability**
* **ID Uniqueness Guard**: Backend checks `db.json` at startup and halts on duplicate IDs.
* **Demo Mode Auto-Fallback**: Instantly loads cached analysis on quota limits (HTTP 429/503).
* **Windows Cleanup Resiliency**: Directory removal continues even on file locks (scheduling cleanup for next reboot).

---

### Slide 8: Future Roadmap
**Scale Beyond the MVP**
* **Bidirectional Sync**: Integration with Jira, ServiceNow, and Slack APIs.
* **Vector Database (RAG)**: Chat-with-your-data search over historic workspaces.
* **Multi-Agent Debate**: Finance, legal, and operational agents arguing recommendations before human approval.
