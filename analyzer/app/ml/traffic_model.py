from typing import Dict, Any, List
from .model_registry import ModelRegistry

CATEGORIES = ["VoIP", "Web Browsing", "Messaging", "File Transfer", "Video Streaming", "DNS", "ICMP", "Other"]

def predict_traffic_class(flow_stats: Dict[str, Any]) -> Dict[str, Any]:
    registry = ModelRegistry()
    ml_model = registry.get_model("traffic_classifier")

    # If trained joblib model exists, use it
    if ml_model is not None:
        try:
            # Prepare feature vector matching training schema
            features = [
                flow_stats.get("duration", 0),
                flow_stats.get("packet_count", 0),
                flow_stats.get("byte_count", 0),
                flow_stats.get("packets_per_second", 0),
                flow_stats.get("bytes_per_second", 0),
                flow_stats.get("mean_packet_size", 0),
                flow_stats.get("std_packet_size", 0),
                flow_stats.get("inter_arrival_mean_ms", 0),
                flow_stats.get("direction_ratio", 1.0)
            ]
            probas = ml_model.predict_proba([features])[0]
            classes = ml_model.classes_

            dist = []
            for cls, prob in zip(classes, probas):
                dist.append({"category": cls, "probability": int(round(prob * 100))})
            dist.sort(key=lambda x: x["probability"], reverse=True)

            top_cat = dist[0]["category"]
            top_conf = dist[0]["probability"]

            return {
                "predictedType": top_cat,
                "confidence": top_conf,
                "distribution": dist
            }
        except Exception:
            pass

    # Statistical heuristic classifier based on observable flow metrics
    mean_iat = flow_stats.get("inter_arrival_mean_ms", 0.0)
    mean_size = flow_stats.get("mean_packet_size", 0.0)
    std_size = flow_stats.get("std_packet_size", 0.0)
    dir_ratio = flow_stats.get("direction_ratio", 1.0)

    voip_prob = 10
    web_prob = 10
    msg_prob = 10
    file_prob = 10
    other_prob = 10

    # Heuristic scoring
    if 5.0 <= mean_iat <= 40.0 and mean_size < 350 and std_size < 100:
        voip_prob = 87
        web_prob = 6
        msg_prob = 4
        file_prob = 2
        other_prob = 1
    elif mean_size > 900:
        file_prob = 78
        web_prob = 12
        voip_prob = 5
        msg_prob = 3
        other_prob = 2
    elif std_size > 300:
        web_prob = 72
        file_prob = 15
        msg_prob = 8
        voip_prob = 3
        other_prob = 2
    else:
        voip_prob = 60
        web_prob = 20
        msg_prob = 10
        file_prob = 5
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
