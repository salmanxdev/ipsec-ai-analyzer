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
    analysis_id = body.get("analysisId", "sess_default")
    analysis_data = get_analysis_by_id(analysis_id)
    if not analysis_data:
        from ..analysis_engine import analyze_pcap_file
        analysis_data = analyze_pcap_file("captures/ipsec_voip_tunnel_01.pcap")

    return generate_executive_report(analysis_data)

@router.post("/reports/technical")
async def create_tech_report(body: Dict[str, Any] = Body(...)):
    analysis_id = body.get("analysisId", "sess_default")
    analysis_data = get_analysis_by_id(analysis_id)
    if not analysis_data:
        from ..analysis_engine import analyze_pcap_file
        analysis_data = analyze_pcap_file("captures/ipsec_voip_tunnel_01.pcap")

    return generate_technical_report(analysis_data)

@router.get("/reports/download/{filename}")
async def download_report_file(filename: str):
    file_path = os.path.join(REPORTS_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, filename=filename, media_type="application/pdf")
    raise HTTPException(status_code=404, detail="Report file not found")
