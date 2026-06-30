import os
import json
import google.generativeai as genai
from pydantic import BaseModel, Field
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

class DecisionBriefItem(BaseModel):
    title: str
    content: str

class ActionItem(BaseModel):
    id: str
    status: str
    task: str
    owner: str
    due: str
    source: str

class Risk(BaseModel):
    id: str
    risk: str
    impact: str
    mitigation: str

class Evidence(BaseModel):
    source: str = Field(description="Document source name, e.g. 'Meeting Transcript'")
    quote: str = Field(description="Relevant verbatim or paraphrased quote from the document")

class NextBestAction(BaseModel):
    title: str
    owner: str
    due: str
    reason: str
    whyDescription: str
    evidence: List[Evidence] = Field(default=[])

class DraftWorkItem(BaseModel):
    title: str
    description: str
    priority: str

class GeneratedContent(BaseModel):
    draftEmail: str
    draftWorkItem: DraftWorkItem

class WorkspaceAnalysisOutput(BaseModel):
    decisionBrief: List[DecisionBriefItem]
    actionItems: List[ActionItem]
    risks: List[Risk]
    nextBestAction: NextBestAction
    generatedContent: GeneratedContent
    aiConfidence: int

# ── Demo Mode cached analysis ─────────────────────────────────
DEMO_ANALYSIS = {
    "decisionBrief": [
        {"title": "Overall Summary", "content": "Based on the uploaded documents, this workspace contains critical business context requiring immediate executive attention. Key priorities have been identified across financial, operational, and strategic dimensions."},
        {"title": "Business Impact", "content": "Proceeding without addressing the identified action items could result in significant delays to core business objectives and revenue impact in the current quarter."},
        {"title": "Key Decisions", "content": "1. Approve the primary action item outlined in the Next Best Action. 2. Assign ownership for risk mitigation tasks. 3. Schedule a stakeholder review within 48 hours."},
        {"title": "Open Questions", "content": "What is the current approval authority threshold? Are there pending dependencies from other teams? What is the timeline for regulatory compliance requirements?"},
        {"title": "Recommendations", "content": "Execute the Next Best Action immediately. Escalate high-impact risks to executive sponsors. Schedule a follow-up review within one week to measure progress."}
    ],
    "actionItems": [
        {"id": "demo-a1", "status": "To Do", "task": "Complete primary approval process", "owner": "Workspace Owner", "due": "Tomorrow", "source": "Document Analysis"},
        {"id": "demo-a2", "status": "Draft", "task": "Notify stakeholders of key findings", "owner": "Team Lead", "due": "This Week", "source": "Meeting Transcript"}
    ],
    "risks": [
        {"id": "demo-r1", "risk": "Delayed decision-making due to missing approvals", "impact": "High", "mitigation": "Escalate to executive sponsor immediately and set a 24-hour response deadline."},
        {"id": "demo-r2", "risk": "Stakeholder misalignment on key objectives", "impact": "Medium", "mitigation": "Schedule a briefing session and distribute the executive summary to all stakeholders."}
    ],
    "nextBestAction": {
        "title": "Complete Primary Approval",
        "owner": "Workspace Owner",
        "due": "Tomorrow",
        "reason": "Critical path item blocking downstream work",
        "whyDescription": "Analysis of the uploaded documents indicates this approval is on the critical path for the current initiative. Delays will cascade into downstream work streams and impact the project timeline.",
        "evidence": [
            {"source": "Document Analysis", "quote": "Approval is required before proceeding to the next phase of the project."},
            {"source": "Business Context", "quote": "The primary action item has been identified as the highest-priority blocker in the current workflow."}
        ]
    },
    "generatedContent": {
        "draftEmail": "Hi Team,\n\nFollowing our analysis, the primary approval process needs to be completed by tomorrow. Please review the attached findings and provide your sign-off.\n\nBest,\nOrchestrAI",
        "draftWorkItem": {
            "title": "Complete Approval Process",
            "description": "Execute the primary approval workflow as identified in the AI analysis.",
            "priority": "High"
        }
    },
    "aiConfidence": 82
}


def generate_analysis(context: str, scenario: str = "") -> dict:
    model = genai.GenerativeModel(
        model_name="gemini-2.5-pro",
        system_instruction=(
            "You are an Enterprise Decision Intelligence Analyst. Analyze uploaded business documents "
            "and produce a structured JSON analysis. Ground all recommendations in the document content. "
            "Return ONLY a valid JSON object with no markdown formatting or backticks."
        )
    )

    prompt = f"""
Analyze the following concatenated documents for a specific business workspace.

DOCUMENTS CONTEXT:
{context}

Perform a comprehensive analysis. Identify the most pressing issues, key decisions required, and the next best action.
For the nextBestAction, include 2-3 evidence items that are direct quotes or close paraphrases from the uploaded documents.

Return ONLY a raw valid JSON object with this exact structure:
{{
  "decisionBrief": [
    {{"title": "Overall Summary", "content": "..."}},
    {{"title": "Business Impact", "content": "..."}},
    {{"title": "Key Decisions", "content": "..."}},
    {{"title": "Open Questions", "content": "..."}},
    {{"title": "Recommendations", "content": "..."}}
  ],
  "actionItems": [
    {{"id": "a1", "status": "To Do", "task": "...", "owner": "...", "due": "...", "source": "..."}}
  ],
  "risks": [
    {{"id": "r1", "risk": "...", "impact": "High|Medium|Low", "mitigation": "..."}}
  ],
  "nextBestAction": {{
    "title": "...", "owner": "...", "due": "...", "reason": "...", "whyDescription": "...",
    "evidence": [
      {{"source": "Document Filename", "quote": "Relevant quote from that document."}},
      {{"source": "Another Document", "quote": "Another supporting quote."}}
    ]
  }},
  "generatedContent": {{
    "draftEmail": "...",
    "draftWorkItem": {{"title": "...", "description": "...", "priority": "High|Medium|Low"}}
  }},
  "aiConfidence": 85
}}
"""

    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.2
            )
        )

        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.startswith("```"):
            raw_text = raw_text[3:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
        raw_text = raw_text.strip()

        parsed_json = json.loads(raw_text)
        validated_data = WorkspaceAnalysisOutput.parse_obj(parsed_json)
        result = validated_data.dict()
        result["demoMode"] = False
        return result

    except Exception as e:
        err_str = str(e).lower()
        # Demo Mode fallback for quota / rate-limit / service unavailability
        if any(k in err_str for k in ["429", "503", "quota", "resource_exhausted", "unavailable", "rate limit", "too many"]):
            print(f"[GeminiService] API unavailable: {e}. Returning Demo Mode analysis.")
            demo = dict(DEMO_ANALYSIS)
            demo["demoMode"] = True
            return demo
        raise e
