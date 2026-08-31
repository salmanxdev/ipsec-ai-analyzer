from typing import Dict, Any, List

def calculate_risk_score(security_score: int, threats: List[Dict[str, Any]]) -> Dict[str, Any]:
    # Base risk is inverse of security score
    base_risk = max(100 - security_score, 0)

    # Adjust based on severe threats
    high_threat_count = sum(1 for t in threats if t.get("severity") in ("CRITICAL", "HIGH"))
    med_threat_count = sum(1 for t in threats if t.get("severity") == "MEDIUM")

    risk_score = min(base_risk + (high_threat_count * 20) + (med_threat_count * 5), 100)

    if risk_score >= 75:
        level = "CRITICAL"
    elif risk_score >= 50:
        level = "HIGH"
    elif risk_score >= 25:
        level = "MEDIUM"
    else:
        level = "LOW"

    return {
        "riskScore": risk_score,
        "riskLevel": level
    }
