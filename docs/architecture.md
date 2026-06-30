# OrchestrAI: Technical Architecture Documentation

This document describes the technical architecture, design decisions, and data flows of OrchestrAI.

---

## 1. System Topology & Stack

OrchestrAI is designed as a decoupled client-server web application with local JSON persistence, engineered for speed, low maintenance, and zero-setup deployment.

```
+-------------------------------------------------------------+
|                         React SPA                           |
|       (Vite, TypeScript, Tailwind CSS, shadcn/ui)           |
+------------------------------+------------------------------+
                               |
                        HTTP / JSON REST
                               |
                               v
+-------------------------------------------------------------+
|                       FastAPI Backend                       |
|           (Pydantic, Uvicorn, Python 3.10+)                 |
+------+-----------------------+-----------------------+------+
       |                       |                       |
       | Read/Write            | Query API             | Read/Write Files
       v                       v                       v
+------+------+         +------+------+         +------+------+
|   db.json   |         | Google Gemini|        |  uploads/   |
| (Local DB)  |         | (AI Studio) |         | (Documents) |
+-------------+         +-------------+         +-------------+
```

### Frontend Stack
* **Vite + React 18 + TypeScript**: Selected for ultra-fast Hot Module Replacement (HMR) and strict type-safety during refactoring.
* **Tailwind CSS + shadcn/ui**: Provides a unified design system with muted colors suited for enterprise tools.
* **Lucide React**: Vector icons library.
* **Axios**: Promised-based HTTP client for API interactions.

### Backend Stack
* **FastAPI + Uvicorn**: Lightweight asynchronous Python web framework providing native support for Pydantic data schemas.
* **Pydantic**: Type-validation models enforcing clean request/response schemas.
* **Google Generative AI SDK**: High-level library to interface with Google AI Studio and Gemini models.

---

## 2. Ingestion & Document Parsing Pipeline

OrchestrAI processes text from raw documents and stores them in structured files ready for Gemini prompt injections.

```
  [File Upload]
        │
        ▼
[validate_and_save_file] ── (File Size & Ext Check)
        │
        ├── PDF: Extract text via PdfReader (pypdf)
        ├── XLSX: Read worksheets & convert grids via load_workbook (openpyxl)
        └── TXT: Read UTF-8 text with 'replace' error handling
        │
        ▼
[process_document] ── (Normalize line spacing & strip whitespace)
        │
        ▼
[Save extracted text] ➔ file_extracted.txt
```

### Supported File Types:
1. **Spreadsheets (`.xlsx`)**: Extracted using `openpyxl`. The sheet grids are mapped to tab-separated text tables showing rows and headers, allowing Gemini to comprehend quantitative models.
2. **PDF Documents (`.pdf`)**: Extracted via `pypdf`. Extracts text page-by-page.
3. **Plain Text (`.txt`)**: Read with standard UTF-8 decoding. Fallbacks to replacement characters on invalid bytes.

---

## 3. Google Gemini API Integration

The core reasoning engine uses the Google Gemini API to compile document context and produce actionable decisions.

### AI Configuration & Model Selection
* **Model**: `gemini-2.5-pro` is selected as the primary analysis engine. Its high reasoning capabilities and large context window allow it to correlate disparate data points across meeting transcripts and contract redlines without hitting context constraints.
* **Temperature**: Set to `0.2` to minimize hallucination rates and ensure strict consistency across subsequent requests.
* **Response Type**: Configured with `response_mime_type="application/json"` combined with a strict Pydantic model (`WorkspaceAnalysisOutput`) to ensure the response fits the frontend's data model.

### Prompt Construction
Prompts are dynamically built by injecting:
1. **Document Context**: Merges all extracted text files with markers separating each document.
2. **Scenario Constraints**: Custom system instructions mapping to the workspace scenario (e.g. Financial Strategy, Procurement, operations).
3. **Structured Schema**: Rigidly defines the expected output fields:
   * `decisionBrief`: High-level summaries and business impacts.
   * `actionItems`: Tasks, owners, due dates, and sources.
   * `risks`: Impact analysis and mitigation plans.
   * `nextBestAction`: The top priority item with explicit supporting evidence quotes.
   * `generatedContent`: Draft emails and work items.

---

## 4. Explainability Engine (Why? Panel)

A key differentiator for OrchestrAI is zero-trust auditability. Operators are not expected to accept AI decisions without review.

```
       [Next Best Action Recommendation]
                       │
                       ▼
            User clicks "Why?" Button
                       │
                       ▼
           [Explainability Panel Opens]
                       │
                       ▼
Reads Cached "Evidence" ➔ Source filename + Verbatim quote
                       │
                       ▼
    Renders text highlighting the exact quote
```

### Zero-Cost Highlights
To avoid incurring extra LLM latencies and API costs during decision review:
1. The initial Gemini analysis request extracts 2-3 direct evidence quotes matching the recommended action.
2. These quotes are saved in `db.json` inside the workspace analysis payload.
3. When the user clicks **Why?**, the frontend matches the cached quotes against the text files and renders them as highlighted markers, ensuring zero additional cost and immediate response time.

---

## 5. Technical Resiliency & Guardrails

OrchestrAI implements production-ready guardrails to guarantee stability during live demos and runtime operations.

### ID Uniqueness Boot Guard
At backend boot time, the startup event parses `db.json` and scans all workspace IDs. If a duplicate UUID is detected, the server outputs a diagnostic warning and shuts down immediately, preventing data corruption.

### Windows Directory Lock Cleanup Resiliency
Windows filesystems often prevent directory removal when another process (like Uvicorn or an open file reader) holds a file lock.
* When a workspace is deleted, the backend attempts to delete the upload files directory.
* If a file lock error occurs, the path is saved inside `db.json` under `pending_cleanup`.
* On the next backend startup, a background cleanup loop attempts to clear any previously locked directories.

### Demo Mode Auto-Fallback
If the Gemini API key is missing, invalid, or hits a rate limit (HTTP 429), the backend catches the error and injects a pre-calculated mock enterprise analysis (`DEMO_ANALYSIS`), setting `demoMode: True` in the workspace metadata. The frontend detects this flag and renders a subtle blue **Demo Mode** banner to inform users, preventing any live presentation failures.
