from typing import Dict, Any, List
from .model_registry import ModelRegistry

CATEGORIES = ["VoIP", "Web Browsing", "Messaging", "File Transfer", "Video Streaming", "DNS", "ICMP", "Other"]

def predict_traffic_class(flow_stats: Dict[str, Any]) -> Dict[str, Any]:
    registry = ModelRegistry()
    ml_model = registry.get_model("traffic_classifier")

    mean_iat = flow_stats.get("inter_arrival_mean_ms") or flow_stats.get("interArrivalTimeMs", 0.0)
    mean_size = flow_stats.get("mean_packet_size") or flow_stats.get("avgPacketSize", 0.0)
    std_size = flow_stats.get("std_packet_size") or flow_stats.get("stdPacketSize", 0.0)
    dir_ratio = flow_stats.get("direction_ratio") or flow_stats.get("directionRatio", 1.0)
    pps = flow_stats.get("packets_per_second") or flow_stats.get("packetsPerSec", 0.0)
    bps = flow_stats.get("bytes_per_second") or flow_stats.get("bytesPerSec", 0.0)

    # If trained joblib model exists, use it
    if ml_model is not None:
        try:
            features = [
                flow_stats.get("duration", 0) or flow_stats.get("flowDurationSeconds", 0),
                flow_stats.get("packet_count", 0) or flow_stats.get("packetCount", 0),
                flow_stats.get("byte_count", 0) or flow_stats.get("byteCount", 0),
                pps,
                bps,
                mean_size,
                std_size,
                mean_iat,
                dir_ratio
            ]
            probas = ml_model.predict_proba([features])[0]
            classes = ml_model.classes_

            dist = []
            for cls, prob in zip(classes, probas):
                dist.append({"category": cls, "probability": int(round(prob * 100))})
            dist.sort(key=lambda x: x["probability"], reverse=True)

            return {
                "predictedType": dist[0]["category"],
                "confidence": dist[0]["probability"],
                "distribution": dist
            }
        except Exception:
            pass

    # Statistical heuristic classifier based on observable flow metrics
    voip_prob = 10
    web_prob = 10
    msg_prob = 10
    file_prob = 10
    other_prob = 10

    # Robust Heuristic Classifier
    if mean_size > 800 or bps > 500000:
        file_prob = 84
        web_prob = 9
        voip_prob = 3
        msg_prob = 2
        other_prob = 2
    elif 10.0 <= mean_iat <= 35.0 and mean_size < 300:
        voip_prob = 88
        web_prob = 5
        msg_prob = 4
        file_prob = 2
        other_prob = 1
    elif std_size > 200 or 0.1 <= dir_ratio <= 0.6 or dir_ratio >= 1.8:
        web_prob = 81
        file_prob = 10
        msg_prob = 5
        voip_prob = 2
        other_prob = 2
    elif mean_size < 200 and mean_iat > 500:
        msg_prob = 78
        web_prob = 12
        voip_prob = 5
        file_prob = 3
        other_prob = 2
    else:
        web_prob = 65
        file_prob = 15
        voip_prob = 10
        msg_prob = 5
        other_prob = 5

    dist = [
        {"category": "VoIP", "probability": voip_prob},
        {"category": "Web Browsing", "probability": web_prob},
        {"category": "Messaging", "probability": msg_prob},
        {"category": "File Transfer", "probability": file_prob},
        {"category": "Other", "probability": other_prob}
    ]
    dist.sort(key=lambda x: x["probability"], reverse=True)

    return {
        "predictedType": dist[0]["category"],
        "confidence": dist[0]["probability"],
        "distribution": dist
    }
