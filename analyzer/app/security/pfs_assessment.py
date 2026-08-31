from typing import Dict, Any

def evaluate_pfs(vpn_info: Dict[str, Any]) -> Dict[str, Any]:
    pfs_str = vpn_info.get("pfs", "Enabled")
    enabled = (pfs_str == "Enabled")
    dh = vpn_info.get("dhGroup", "MODP-2048 (Group 14)")

    risk = "LOW"
    if not enabled:
        risk = "HIGH"
    elif "1024" in dh or "768" in dh:
        risk = "MEDIUM"

    return {
        "pfsEnabled": enabled,
        "dhGroup": dh,
        "riskLevel": risk
    }
