import struct
from typing import Dict, Any

def parse_ah_header(payload: bytes) -> Dict[str, Any]:
    result = {
        "is_ah": False,
        "spi": None,
        "sequence_number": None
    }

    if len(payload) >= 12:
        spi_num = struct.unpack("!I", payload[4:8])[0]
        seq_num = struct.unpack("!I", payload[8:12])[0]
        result["is_ah"] = True
        result["spi"] = f"0x{spi_num:08x}"
        result["sequence_number"] = seq_num

    return result
