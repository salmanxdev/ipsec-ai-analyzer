from typing import Dict, Any
from .traffic_model import predict_traffic_class
from .explain import get_observable_feature_importance

def run_ml_inference(flow_stats: Dict[str, Any]) -> Dict[str, Any]:
    traffic_pred = predict_traffic_class(flow_stats)
    features_explain = get_observable_feature_importance(flow_stats, traffic_pred["predictedType"])

    return {
        "traffic": traffic_pred,
        "aiExplanations": {
            "protocolConfidence": 96.0,
            "operatingModeConfidence": 94.0,
            "trafficClassificationConfidence": float(traffic_pred["confidence"]),
            "observableFeatures": features_explain
        }
    }
