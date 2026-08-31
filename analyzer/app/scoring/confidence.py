from typing import Dict, Any

def calculate_ai_confidence(packet_count: int, flow_stats: Dict[str, Any], ml_confidence: float = 87.0) -> Dict[str, Any]:
    # Higher packet counts provide stronger statistical confidence
    data_quality_factor = min(packet_count / 100.0, 1.0)
    adjusted_conf = round(ml_confidence * 0.8 + (data_quality_factor * 20.0), 1)
    adjusted_conf = min(adjusted_conf, 99.0)

    level = "HIGH" if adjusted_conf >= 80 else ("MEDIUM" if adjusted_conf >= 60 else "LOW")

    return {
        "confidence": adjusted_conf,
        "level": level
    }
