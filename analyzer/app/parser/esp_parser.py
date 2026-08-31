import struct
from typing import Dict, Any

def parse_esp_header(payload: bytes) -> Dict[str, Any]:
    result = {
        "is_esp": False,
        "spi": None,
        "sequence_number": None,
        "payload_length": len(payload)
    }

    if len(payload) >= 8:
        spi_num = struct.unpack("!I", payload[:4])[0]
        seq_num = struct.unpack("!I", payload[4:8])[0]
        result["is_esp"] = True
        result["spi"] = f"0x{spi_num:08x}"
        result["sequence_number"] = seq_num

    return result
