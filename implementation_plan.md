# Goal

Create the complete project foundation for OrchestrAI, an Enterprise Decision Intelligence MVP. This includes setting up a React frontend with Tailwind CSS and shadcn/ui, and a FastAPI backend with local JSON storage. No AI business logic will be implemented yet.

## User Review Required

Please review the proposed tech stack and folder structure below to ensure it aligns perfectly with your vision for the project. 

## Open Questions

- We will be creating the `orchestrai` folder inside `c:/Users/balac/OneDrive/Desktop/working file/OrchestrAI`. Does this sound correct, or should the files be placed directly in the `OrchestrAI` folder?
- For the frontend, I'll use standard `npm` to install packages (Vite, Tailwind, etc.). Are there any specific version constraints I should be aware of?

## Proposed Changes

We will create a root `orchestrai` folder with three subdirectories: `frontend`, `backend`, and `data`.

### Root Level
- Create `orchestrai/data/db.json` with an initial empty JSON structure.

### Backend (`orchestrai/backend/`)
We will set up a FastAPI application using standard conventions.
- `requirements.txt`: Includes `fastapi`, `uvicorn`, `pydantic`.
- `src/main.py`: FastAPI app initialization, CORS middleware, health check endpoint.
- `src/config.py`: Configuration settings.
- `src/database.py`: Logic for reading and writing to the local `db.json` file.
- `src/routers/workspaces.py`: CRUD endpoints for workspaces and a stub for upload.
- `src/services/document_service.py` & `src/services/gemini_service.py` (stub).
- `src/schemas/analysis_schema.py`: Pydantic models for request/response validation.
- `src/prompts/`: Stub markdown files for prompts (`system_prompt.md`, `analysis_prompt.md`, `briefing_prompt.md`).

### Frontend (`orchestrai/frontend/`)
We will initialize a React app using Vite and configure Tailwind CSS and shadcn/ui.
- `package.json`: Vite, React, Tailwind CSS dependencies.
- `src/App.jsx`: Main application layout (Jira-inspired enterprise UI: Left sidebar, top header, responsive layout with muted colors).
- `src/services/api.js`: Axios/Fetch methods to interact with the backend API.
- `src/components/workspace/`: All requested components:
  - `Sidebar.jsx`, `Header.jsx`, `Timeline.jsx`, `NextBestAction.jsx`, `WhyPanel.jsx`
  - Tabs: `ExecutiveBriefTab.jsx`, `ActionPlanTab.jsx`, `RisksTab.jsx`, `GeneratedContentTab.jsx`
  - `AIBriefingModal.jsx`

## Verification Plan

### Automated Tests
- N/A

### Manual Verification
1. Start the FastAPI backend and verify the `/health` endpoint is returning 200 OK.
2. Start the Vite React frontend and verify that the UI renders successfully without errors.
3. Test that the stub backend endpoints (e.g., getting workspaces) are reachable from the frontend.
