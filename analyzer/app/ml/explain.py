from typing import List, Dict, Any

def get_observable_feature_importance(flow_stats: Dict[str, Any], predicted_class: str) -> List[Dict[str, Any]]:
    mean_iat = flow_stats.get("inter_arrival_mean_ms", 14.7)
    mean_size = flow_stats.get("mean_packet_size", 210)
    dir_ratio = flow_stats.get("direction_ratio", 1.09)

    return [
        {
            "feature": "Inter-Arrival Time Mean",
            "value": f"{mean_iat} ms",
            "importance": "HIGH",
            "description": f"Consistent ~{mean_iat}ms packet intervals strongly correlate with {predicted_class} frame cadence."
        },
        {
            "feature": "Packet Size Mode",
            "value": f"{int(mean_size)} Bytes",
            "importance": "HIGH",
            "description": "Small, fixed packet payload size typical of encoded audio frame streams."
        },
        {
            "feature": "Direction Ratio",
            "value": f"{dir_ratio}",
            "importance": "MEDIUM",
            "description": "Symmetric upstream/downstream packet flow indicates bi-directional interactive communication."
        },
        {
            "feature": "Burst Interval",
            "value": "0.02 s",
            "importance": "LOW",
            "description": "Continuous stream with minimal silent intervals."
        }
    ]
