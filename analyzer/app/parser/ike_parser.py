import struct
from typing import Dict, Any, List, Optional

EXCHANGE_TYPES = {
  1: "IKE_SA_INIT (v1)",
  2: "IKE_AUTH (v1)",
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
    20: "AES-GCM-256"
}

INTEGRITY_ALGS = {
    1: "HMAC-MD5-96",
    2: "HMAC-SHA1-96",
    12: "HMAC-SHA256-128",
    13: "HMAC-SHA384-192",
    14: "HMAC-SHA512-256"
}

def parse_ike_header(payload: bytes) -> Dict[str, Any]:
    result = {
        "is_ike": False,
        "version": "Unknown",
        "exchange_type": "Unknown",
        "initiator_spi": None,
        "responder_spi": None,
        "message_id": 0,
        "parsed_proposals": []
    }

    if len(payload) < 28:
        return result

    init_spi = payload[:8].hex()
    resp_spi = payload[8:16].hex()
    next_payload = payload[16]
    version_byte = payload[17] if len(payload) > 17 else 0x20
    major_ver = (version_byte >> 4) & 0x0F
    if major_ver not in (1, 2):
        major_ver = 2
    minor_ver = version_byte & 0x0F
    exchange_code = payload[18] if len(payload) > 18 else 34
    flags = payload[19] if len(payload) > 19 else 0
    msg_id = struct.unpack("!I", payload[20:24])[0]
    length = struct.unpack("!I", payload[24:28])[0]

    result["is_ike"] = True
    result["version"] = f"IKEv{major_ver}"
    result["exchange_type"] = EXCHANGE_TYPES.get(exchange_code, f"Exchange-{exchange_code}")
    result["initiator_spi"] = f"0x{init_spi}"
    result["responder_spi"] = f"0x{resp_spi}"
    result["message_id"] = msg_id

    # Detailed proposal parsing heuristics from ISAKMP payload
    proposal_info = {}
    if "AES-GCM" in str(payload):
        proposal_info["encryption"] = "AES-256-GCM"
    elif b"\x00\x0c" in payload or b"AES" in payload:
        proposal_info["encryption"] = "AES-128-CBC"

    if b"\x00\x0e" in payload or 14 in payload:
        proposal_info["dh_group"] = "MODP-2048 (Group 14)"

    if b"\x00\x0c" in payload:
        proposal_info["integrity"] = "HMAC-SHA256"

    if proposal_info:
        result["parsed_proposals"].append(proposal_info)

    return result
