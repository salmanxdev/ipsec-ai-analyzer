import math
from typing import List, Dict, Any

def compute_flow_statistics(flow: Dict[str, Any]) -> Dict[str, Any]:
    packets = flow.get("packets", [])
    total_packets = flow.get("total_packets", len(packets))
    total_bytes = flow.get("total_bytes", sum(p.get("length", 0) for p in packets))

    start_time = flow.get("start_time", 0.0)
    end_time = flow.get("end_time", 0.0)
    duration = max(end_time - start_time, 0.001)

    sizes = [p.get("length", 0) for p in packets]
    if not sizes:
        sizes = [0]

    mean_size = sum(sizes) / len(sizes)
    variance_size = sum((s - mean_size) ** 2 for s in sizes) / len(sizes)
    std_size = math.sqrt(variance_size)
    min_size = min(sizes)
    max_size = max(sizes)

    # Compute Inter-Arrival Times (IAT)
    iats = []
    for i in range(1, len(packets)):
        delta = packets[i].get("timestamp", 0.0) - packets[i-1].get("timestamp", 0.0)
        iats.append(max(delta, 0.0))

    if not iats:
        iats = [0.0]

    mean_iat_sec = sum(iats) / len(iats)
    mean_iat_ms = mean_iat_sec * 1000.0
    var_iat = sum((iat - mean_iat_sec) ** 2 for iat in iats) / len(iats)
    std_iat_ms = math.sqrt(var_iat) * 1000.0

    pps = total_packets / duration
    bps = total_bytes / duration

    upstream_packets = flow.get("upstream_packets", 0)
    downstream_packets = flow.get("downstream_packets", 0)
    direction_ratio = (upstream_packets / downstream_packets) if downstream_packets > 0 else (upstream_packets or 1.0)

    return {
        "duration": duration,
        "packet_count": total_packets,
        "byte_count": total_bytes,
        "packets_per_second": round(pps, 2),
        "bytes_per_second": round(bps, 2),
        "mean_packet_size": round(mean_size, 2),
        "std_packet_size": round(std_size, 2),
        "min_packet_size": min_size,
        "max_packet_size": max_size,
        "inter_arrival_mean_ms": round(mean_iat_ms, 2),
        "inter_arrival_std_ms": round(std_iat_ms, 2),
        "upstream_packets": upstream_packets,
        "downstream_packets": downstream_packets,
        "upstream_bytes": flow.get("upstream_bytes", 0),
        "downstream_bytes": flow.get("downstream_bytes", 0),
        "direction_ratio": round(direction_ratio, 2)
    }
