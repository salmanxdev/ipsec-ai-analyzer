import os
import shutil
from fastapi import APIRouter, File, UploadFile, HTTPException, Body
from typing import Optional, Dict, Any

from ..analysis_engine import analyze_pcap_file
from ..storage.models import get_analysis_by_id

router = APIRouter()

CAPTURES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'captures')
os.makedirs(CAPTURES_DIR, exist_ok=True)

@router.post("/analyze/pcap")
async def analyze_pcap(
    file: Optional[UploadFile] = File(None),
    body: Optional[Dict[str, Any]] = Body(None)
):
    # Support both file upload (multipart/form-data) and JSON body trigger
    filename = "capture.pcap"
    save_path = os.path.join(CAPTURES_DIR, filename)

    if file is not None:
        filename = file.filename
        save_path = os.path.join(CAPTURES_DIR, filename)
        with open(save_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    elif body and "fileName" in body:
        filename = body["fileName"]
        save_path = os.path.join(CAPTURES_DIR, filename)
        if not os.path.exists(save_path):
            with open(save_path, "wb") as f:
                f.write(b'\x00' * 100) # placeholder if not uploaded yet

    result = analyze_pcap_file(save_path, filename_override=filename)
    return result

@router.get("/analysis/history")
async def get_history_endpoint():
    from ..storage.models import get_all_history
    return get_all_history()

@router.get("/analysis/compare")
async def get_compare_endpoint():
    return {
        "configA": {
            "name": "Scenario A: Current Deployment (AES-128-CBC)",
            "securityScore": 87,
            "riskScore": 31,
            "cipherStrength": "ACCEPTABLE",
            "encryption": "AES-128-CBC",
            "authentication": "HMAC-SHA256",
            "dhGroup": "MODP-2048",
            "pfs": "Enabled",
            "replayProtection": "64-bit window"
        },
        "configB": {
            "name": "Scenario B: Recommended Hardened (AES-256-GCM)",
            "securityScore": 96,
            "riskScore": 12,
            "cipherStrength": "STRONG",
            "encryption": "AES-256-GCM",
            "authentication": "AEAD (Built-in)",
            "dhGroup": "ECP-384",
            "pfs": "Enabled",
            "replayProtection": "128-bit window"
        }
    }

@router.get("/analysis/{analysis_id}")
async def get_analysis(analysis_id: str):
    res = get_analysis_by_id(analysis_id)
    if not res:
        # Fallback for mock/default session if not found in db yet
        res = analyze_pcap_file(os.path.join(CAPTURES_DIR, "ipsec_voip_tunnel_01.pcap"), filename_override="ipsec_voip_tunnel_01.pcap")
    return res

@router.get("/analysis/{analysis_id}/security")
async def get_analysis_security(analysis_id: str):
    res = await get_analysis(analysis_id)
    return res.get("securityAssessment", {})

@router.get("/analysis/{analysis_id}/traffic")
async def get_analysis_traffic(analysis_id: str):
    res = await get_analysis(analysis_id)
    return res.get("trafficAnalysis", {})

@router.get("/analysis/{analysis_id}/threats")
async def get_analysis_threats(analysis_id: str):
    res = await get_analysis(analysis_id)
    return res.get("threatMatrix", [])

@router.get("/analysis/{analysis_id}/evidence")
async def get_analysis_evidence(analysis_id: str):
    res = await get_analysis(analysis_id)
    return res.get("evidenceLogs", {})
