from typing import Dict, Any
from .policy import DEFAULT_SECURITY_POLICY

def evaluate_crypto_strength(vpn_info: Dict[str, Any], policy: Dict[str, Any] = DEFAULT_SECURITY_POLICY) -> Dict[str, Any]:
    enc = vpn_info.get("encryption", "AES-128-CBC")
    auth = vpn_info.get("authentication", "HMAC-SHA256")

    rating = "ACCEPTABLE"
    reason = "AES-128-CBC with HMAC-SHA256 provides acceptable confidentiality and integrity for corporate VPN tunnels."

    if "3DES" in enc or "DES" in enc or "MD5" in auth:
        rating = "CRITICAL"
        reason = "Legacy cipher or hash algorithm (DES/3DES/MD5) detected. Highly vulnerable to cryptographic attacks."
    elif "AES-256-GCM" in enc or "AES-128-GCM" in enc:
        rating = "STRONG"
        reason = "Authenticated Encryption (AEAD) with AES-GCM provides optimal cryptographic security and performance."
    elif "AES-128-CBC" in enc:
        rating = "ACCEPTABLE"
        reason = "AES-128-CBC with SHA256 is acceptable for standard deployment; upgrading to AES-GCM is recommended for authenticated encryption."

    return {
        "algorithm": enc,
        "keyLengthBits": 128 if "128" in enc else 256,
        "integrity": auth,
        "cipherRating": rating,
        "cipherRatingReason": reason
    }
