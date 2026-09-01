from typing import Dict, Any

def calculate_security_score(vpn_info: Dict[str, Any], assessment: Dict[str, Any]) -> Dict[str, Any]:
    crypto = assessment.get("cryptography", {})
    replay = assessment.get("replayProtection", {})
    pfs = assessment.get("forwardSecrecy", {})
    rating = crypto.get("cipherRating", "ACCEPTABLE")
    auth_val = crypto.get("integrity", "")
    dh = vpn_info.get("dhGroup", "")

    # Component breakdown scores (0-100)
    if rating == "STRONG":
        crypto_score = 98 if "256" in crypto.get("algorithm", "") else 94
    elif rating == "ACCEPTABLE":
        crypto_score = 88
    else:
        crypto_score = 30

    if "AEAD" in auth_val or "SHA384" in auth_val or "SHA512" in auth_val:
        auth_score = 100
    elif "SHA256" in auth_val:
        auth_score = 90
    elif "SHA1" in auth_val:
        auth_score = 55
    else: # MD5 or unknown
        auth_score = 25

    if "384" in dh or "521" in dh or "4096" in dh:
        ke_score = 98
    elif "3072" in dh:
        ke_score = 94
    elif "2048" in dh or "256" in dh:
        ke_score = 88
    elif "1536" in dh:
        ke_score = 65
    else: # MODP-1024 / MODP-768
        ke_score = 35

    sa_score = 90 if vpn_info.get("ikeVersion") == "IKEv2" else 55
    replay_score = 100 if replay.get("enabled") else 0
    pfs_score = 100 if pfs.get("pfsEnabled") else 25
    lifetime_score = 90
    meta_score = 75

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
        lifetime_score * 0.15
    )

    grade = "EXCELLENT" if overall >= 90 else ("GOOD" if overall >= 80 else ("FAIR" if overall >= 60 else "CRITICAL"))

    return {
        "score": overall,
        "grade": grade,
        "components": components
    }
