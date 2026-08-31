from pydantic import BaseModel
from typing import Optional, Any, Dict

class ReportRequest(BaseModel):
    analysisId: str
    format: Optional[str] = "pdf"

class ReportResponse(BaseModel):
    type: str
    title: str
    generatedAt: str
    downloadUrl: Optional[str] = None
    summary: Optional[Dict[str, Any]] = None
    details: Optional[Dict[str, Any]] = None
