from typing import Dict, Any

def evaluate_replay_protection(vpn_info: Dict[str, Any]) -> Dict[str, Any]:
    enabled = vpn_info.get("replayProtection", "Enabled") == "Enabled"
    return {
        "enabled": enabled,
        "windowSizeBits": 64,
        "replayEventsCount": 0,
        "status": "OPTIMAL" if enabled else "DISABLED"
    }
