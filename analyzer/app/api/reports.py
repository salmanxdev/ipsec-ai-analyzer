import os
from fastapi import APIRouter, Body, HTTPException
from fastapi.responses import FileResponse
from typing import Dict, Any

from ..reports.executive import generate_executive_report, REPORTS_DIR
from ..reports.technical import generate_technical_report
from ..storage.models import get_analysis_by_id

router = APIRouter()


@router.post("/reports/executive")
async def create_exec_report(body: Dict[str, Any] = Body(...)):
    analysis_id = body.get("analysisId")
    if not analysis_id:
        raise HTTPException(status_code=400, detail="analysisId is required in request body.")

    analysis_data = get_analysis_by_id(analysis_id)
    if not analysis_data:
        raise HTTPException(
            status_code=404,
            detail=f"Analysis session '{analysis_id}' not found. Upload a PCAP first."
        )

    return generate_executive_report(analysis_data)


@router.post("/reports/technical")
async def create_tech_report(body: Dict[str, Any] = Body(...)):
    analysis_id = body.get("analysisId")
    if not analysis_id:
        raise HTTPException(status_code=400, detail="analysisId is required in request body.")

    analysis_data = get_analysis_by_id(analysis_id)
    if not analysis_data:
        raise HTTPException(
            status_code=404,
            detail=f"Analysis session '{analysis_id}' not found. Upload a PCAP first."
        )

    return generate_technical_report(analysis_data)


@router.get("/reports/download/{filename}")
async def download_report_file(filename: str):
    # Prevent path traversal
    safe_name = os.path.basename(filename)
    file_path = os.path.join(REPORTS_DIR, safe_name)
    if os.path.exists(file_path):
        return FileResponse(file_path, filename=safe_name, media_type="application/pdf")
    raise HTTPException(status_code=404, detail="Report file not found.")
