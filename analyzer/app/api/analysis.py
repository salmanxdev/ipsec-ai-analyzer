import os
import shutil
from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from typing import Optional

from ..analysis_engine import analyze_pcap_file
from ..storage.models import get_analysis_by_id, get_all_history

router = APIRouter()

CAPTURES_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    'captures'
)
DATA_PCAPS_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))),
    'data', 'pcaps'
)
os.makedirs(CAPTURES_DIR, exist_ok=True)

@router.post("/analyze/pcap")
async def analyze_pcap(
    file: Optional[UploadFile] = File(None),
    presetName: Optional[str] = Form(None)
):
    """
    Accept either a real uploaded file or a preset capture name from data/pcaps/.
    Runs the live analysis engine on the file and stores it in SQLite.
    """
    target_path = None
    display_filename = "capture.pcap"

    if file and file.filename:
        display_filename = os.path.basename(file.filename)
        target_path = os.path.join(CAPTURES_DIR, display_filename)
        with open(target_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    elif presetName:
        display_filename = os.path.basename(presetName)
        # Check in data/pcaps first, then captures
        p1 = os.path.join(DATA_PCAPS_DIR, display_filename)
        p2 = os.path.join(CAPTURES_DIR, display_filename)
        if os.path.exists(p1):
            target_path = p1
        elif os.path.exists(p2):
            target_path = p2
        else:
            raise HTTPException(status_code=404, detail=f"Preset PCAP '{display_filename}' not found on server.")
    else:
        # Default to the first available PCAP in data/pcaps
        demo_files = os.listdir(DATA_PCAPS_DIR) if os.path.exists(DATA_PCAPS_DIR) else []
        if demo_files:
            display_filename = demo_files[0]
            target_path = os.path.join(DATA_PCAPS_DIR, display_filename)
        else:
            raise HTTPException(status_code=400, detail="No PCAP file or preset provided.")

    if not target_path or not os.path.exists(target_path) or os.path.getsize(target_path) < 24:
        raise HTTPException(status_code=422, detail="Invalid PCAP file on server.")

    result = analyze_pcap_file(target_path, filename_override=display_filename)
    return result

@router.get("/analysis/history")
async def get_history_endpoint():
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
        raise HTTPException(
            status_code=404,
            detail=f"Analysis session '{analysis_id}' not found."
        )
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
