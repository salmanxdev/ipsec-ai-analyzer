from typing import List, Dict, Any
from .flow_features import compute_flow_statistics
from .ipsec_features import extract_ipsec_flow_features
from ..parser.flow_parser import extract_flows_from_packets

def process_capture_features(packets: List[Dict[str, Any]]) -> Dict[str, Any]:
    flows = extract_flows_from_packets(packets)
    if not flows:
        return {
            "flow_count": 0,
            "metrics": {},
            "timeline": [],
            "flow_features_list": []
        }

    # Focus on largest IPsec/data flow
    main_flow = max(flows, key=lambda f: f.get("total_bytes", 0))
    main_stats = compute_flow_statistics(main_flow)
    ipsec_feats = extract_ipsec_flow_features(main_flow, main_stats)

    # Build timeline points
    timeline = []
    if packets:
        min_ts = packets[0].get("timestamp", 0.0)
        max_ts = packets[-1].get("timestamp", 0.0)
        span = max(max_ts - min_ts, 1.0)
        buckets = 7
        step = span / buckets

        for b in range(buckets):
            b_start = min_ts + b * step
            b_end = b_start + step
            b_pkts = [p for p in packets if b_start <= p.get("timestamp", 0.0) < b_end]
            b_bytes = sum(p.get("length", 0) for p in b_pkts)
            mins = int((b * step) // 60)
            secs = int((b * step) % 60)
            ts_str = f"{mins:02d}:{secs:02d}"

            timeline.append({
                "timestamp": ts_str,
                "packets": len(b_pkts),
                "bytes": b_bytes,
                "pps": round(len(b_pkts) / max(step, 0.1), 1)
            })

    return {
        "flow_count": len(flows),
        "metrics": main_stats,
        "ipsec_features": ipsec_feats,
        "timeline": timeline,
        "flow": main_flow
    }
