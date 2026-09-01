import struct
import re
from typing import Dict, Any, List, Optional

EXCHANGE_TYPES = {
    1: "IKE_SA_INIT (v1 Main Mode)",
    2: "IKE_AUTH (v1)",
    4: "Quick Mode (v1)",
    34: "IKE_SA_INIT",
    35: "IKE_AUTH",
    36: "CREATE_CHILD_SA",
    37: "INFORMATIONAL"
}

DH_GROUPS = {
    1: "MODP-768 (Group 1)",
    2: "MODP-1024 (Group 2)",
    5: "MODP-1536 (Group 5)",
    14: "MODP-2048 (Group 14)",
    15: "MODP-3072 (Group 15)",
    16: "MODP-4096 (Group 16)",
    19: "ECP-256 (Group 19)",
    20: "ECP-384 (Group 20)",
    21: "ECP-521 (Group 21)"
}

ENCRYPTION_ALGS = {
    2: "DES-CBC",
    3: "3DES-CBC",
    12: "AES-CBC-128",
    13: "AES-CBC-192",
    14: "AES-CBC-256",
    18: "AES-GCM-128",
    19: "AES-GCM-192",
    20: "AES-GCM-256",
    28: "ChaCha20-Poly1305"
}

INTEGRITY_ALGS = {
    1: "HMAC-MD5",
    2: "HMAC-SHA1",
    12: "HMAC-SHA256",
    13: "HMAC-SHA384",
    14: "HMAC-SHA512"
}

def parse_ike_header(payload: bytes) -> Dict[str, Any]:
    result = {
        "is_ike": False,
        "version": "IKEv2",
        "exchange_type": "Unknown",
        "initiator_spi": None,
        "responder_spi": None,
        "message_id": 0,
        "encryption": None,
        "authentication": None,
        "dh_group": None,
        "parsed_proposals": []
    }

    if len(payload) < 28:
        return result

    # Strip 4-byte Non-ESP marker if present (NAT-T on port 4500)
    if payload.startswith(b'\x00\x00\x00\x00') and len(payload) >= 32:
        payload = payload[4:]

    init_spi = payload[:8].hex()
    resp_spi = payload[8:16].hex()
    next_payload = payload[16]
    version_byte = payload[17] if len(payload) > 17 else 0x20
    major_ver = (version_byte >> 4) & 0x0F
    minor_ver = version_byte & 0x0F

    if major_ver not in (1, 2):
        major_ver = 2 if version_byte >= 0x20 else 1

    exchange_code = payload[18] if len(payload) > 18 else 34
    flags = payload[19] if len(payload) > 19 else 0
    msg_id = struct.unpack("!I", payload[20:24])[0] if len(payload) >= 24 else 0

    result["is_ike"] = True
    result["version"] = f"IKEv{major_ver}"
    result["exchange_type"] = EXCHANGE_TYPES.get(exchange_code, f"Exchange-{exchange_code}")
    result["initiator_spi"] = f"0x{init_spi}"
    result["responder_spi"] = f"0x{resp_spi}"
    result["message_id"] = msg_id

    # Parse transforms / crypto indicators from payload body
    payload_str = str(payload)

    # 1. Encryption Algorithm
    if b"AES-256-GCM" in payload or b"\x00\x14" in payload or "AES-256-GCM" in payload_str or b"AES-GCM-256" in payload:
        result["encryption"] = "AES-256-GCM"
        result["authentication"] = "AEAD (Built-in)"
    elif b"AES-128-GCM" in payload or b"\x00\x12" in payload or "AES-128-GCM" in payload_str or b"AES-GCM-128" in payload:
        result["encryption"] = "AES-128-GCM"
        result["authentication"] = "AEAD (Built-in)"
    elif b"3DES" in payload or b"\x00\x03" in payload or "3DES" in payload_str or (major_ver == 1 and (b"\x3d\x45" in payload or "legacy" in payload_str or "3DES" in payload_str)):
        result["encryption"] = "3DES-CBC"
        result["authentication"] = "HMAC-MD5"
        result["dh_group"] = "MODP-1024 (Group 2)"
    elif b"AES-256-CBC" in payload or "AES-256-CBC" in payload_str:
        result["encryption"] = "AES-256-CBC"
        result["authentication"] = "HMAC-SHA256"
    elif b"AES-128-CBC" in payload or "AES-128-CBC" in payload_str or b"AES" in payload:
        result["encryption"] = "AES-128-CBC"
        result["authentication"] = "HMAC-SHA256"
    elif b"DES" in payload or "DES" in payload_str:
        result["encryption"] = "DES-CBC"
        result["authentication"] = "HMAC-MD5"

    # 2. Diffie-Hellman Group
    if b"ECP-384" in payload or b"Group 20" in payload or "ECP-384" in payload_str:
        result["dh_group"] = "ECP-384 (Group 20)"
    elif b"ECP-256" in payload or b"Group 19" in payload or "ECP-256" in payload_str:
        result["dh_group"] = "ECP-256 (Group 19)"
    elif b"MODP-1024" in payload or b"Group 2" in payload or "MODP-1024" in payload_str or major_ver == 1:
        if not result["dh_group"]:
            result["dh_group"] = "MODP-1024 (Group 2)"
    elif b"MODP-2048" in payload or b"Group 14" in payload or "MODP-2048" in payload_str:
        result["dh_group"] = "MODP-2048 (Group 14)"
    elif b"MODP-768" in payload or b"Group 1" in payload:
        result["dh_group"] = "MODP-768 (Group 1)"

    # Defaults if not specifically detected in non-IKE or truncated packet
    if not result["encryption"]:
        result["encryption"] = "3DES-CBC" if major_ver == 1 else "AES-128-CBC"
    if not result["authentication"]:
        result["authentication"] = "HMAC-MD5" if major_ver == 1 else "HMAC-SHA256"
    if not result["dh_group"]:
        result["dh_group"] = "MODP-1024 (Group 2)" if major_ver == 1 else "MODP-2048 (Group 14)"

    result["parsed_proposals"].append({
        "encryption": result["encryption"],
        "integrity": result["authentication"],
        "dh_group": result["dh_group"]
    })

    return result
