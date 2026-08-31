from typing import List, Dict, Any

def extract_packet_features(pkt: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "timestamp": pkt.get("timestamp", 0.0),
        "length": pkt.get("length", 0),
        "protocol": pkt.get("protocol"),
        "transport_proto": pkt.get("transport_proto"),
        "is_esp": pkt.get("is_esp", False),
        "is_ike": pkt.get("is_ike", False)
    }
