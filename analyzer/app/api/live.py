from fastapi import APIRouter, Body
from typing import Dict, Any
from ..capture.live_capture import LiveCaptureSession, active_capture_session

router = APIRouter()
_session: Optional[LiveCaptureSession] = None

@router.post("/analyze/live/start")
async def start_live(body: Dict[str, Any] = Body(...)):
    global _session
    iface = body.get("interface", "eth0")
    if _session is not None:
        _session.stop()

    _session = LiveCaptureSession(interface=iface)
    _session.start()
    return {"status": "started", "interface": iface, "session_id": "live_session_active"}

@router.post("/analyze/live/stop")
async def stop_live():
    global _session
    if _session is not None:
        _session.stop()
    return {"status": "stopped"}

@router.get("/analyze/live/status")
async def live_status():
    global _session
    if _session is not None:
        return _session.get_status()
    return {
        "interface": "eth0",
        "status": "STOPPED",
        "packets": 0,
        "ike": 0,
        "esp": 0,
        "ah": 0,
        "other": 0,
        "logs": []
    }
