from typing import Dict, Any

def calculate_security_score(vpn_info: Dict[str, Any], assessment: Dict[str, Any]) -> Dict[str, Any]:
    crypto = assessment.get("cryptography", {})
    replay = assessment.get("replayProtection", {})
    pfs = assessment.get("forwardSecrecy", {})
    rating = crypto.get("cipherRating", "ACCEPTABLE")

    # Component breakdown scores (0-100)
    crypto_score = 92 if rating == "STRONG" else (87 if rating == "ACCEPTABLE" else 40)
    auth_score = 90 if "SHA256" in crypto.get("integrity", "") else 70
    dh = vpn_info.get("dhGroup", "")
    ke_score = 95 if "3072" in dh or "384" in dh else (85 if "2048" in dh else 50)
    sa_score = 88
    replay_score = 100 if replay.get("enabled") else 0
    pfs_score = 100 if pfs.get("pfsEnabled") else 0
    lifetime_score = 90
    meta_score = 72

    components = {
        "cryptography": crypto_score,
        "authentication": auth_score,
        "keyExchange": ke_score,
        "saConfiguration": sa_score,
        "replayProtection": replay_score,
        "forwardSecrecy": pfs_score,
        "keyLifetime": lifetime_score,
        "metadataExposure": meta_score
    }

    # Weighted overall score
    overall = int(
        crypto_score * 0.25 +
        auth_score * 0.15 +
        ke_score * 0.15 +
        sa_score * 0.10 +
        replay_score * 0.10 +
        pfs_score * 0.10 +
        lifetime_score * 0.10
    )

    grade = "EXCELLENT" if overall >= 90 else ("GOOD" if overall >= 80 else ("FAIR" if overall >= 60 else "POOR"))

    return {
        "score": overall,
        "grade": grade,
        "components": components
    }
