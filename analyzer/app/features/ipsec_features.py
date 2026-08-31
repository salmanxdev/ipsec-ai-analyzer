from typing import List, Dict, Any

def extract_ipsec_flow_features(flow: Dict[str, Any], stats: Dict[str, Any]) -> Dict[str, Any]:
    mean_iat = stats.get("inter_arrival_mean_ms", 0.0)
    std_size = stats.get("std_packet_size", 0.0)
    mean_size = stats.get("mean_packet_size", 0.0)

    # Observable side-channel indicators without decryption
    packet_timing_pattern = "PERIODIC" if mean_iat > 0 and mean_iat < 40 and stats.get("inter_arrival_std_ms", 100) < 15 else "VARIABLE"
    size_variance = "LOW VARIANCE" if std_size < 50 else "HIGH VARIANCE"

    return {
        "is_esp_flow": flow.get("is_ipsec", False),
        "packet_timing_pattern": packet_timing_pattern,
        "packet_size_variance": size_variance,
        "fingerprintability": "HIGH" if packet_timing_pattern == "PERIODIC" else "MODERATE"
    }
