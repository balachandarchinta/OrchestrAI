from pydantic import BaseModel

class AnalysisResponse(BaseModel):
    summary: str
    action_plan: str
    risks: str
