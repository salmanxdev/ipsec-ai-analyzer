import os
import json
from typing import Optional, Dict, Any

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'models')

class ModelRegistry:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelRegistry, cls).__new__(cls)
            cls._instance.loaded_models = {}
            cls._instance.metadata = cls._instance.load_metadata()
        return cls._instance

    def load_metadata(self) -> Dict[str, Any]:
        meta_path = os.path.join(MODELS_DIR, 'metadata.json')
        if os.path.exists(meta_path):
            try:
                with open(meta_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception:
                pass
        return {
            "model_version": "1.0.0",
            "status": "baseline_heuristics_active",
            "description": "Rule-based statistical heuristic model active until custom XGBoost model.joblib is trained."
        }

    def get_model(self, name: str) -> Optional[Any]:
        if name in self.loaded_models:
            return self.loaded_models[name]

        model_path = os.path.join(MODELS_DIR, f"{name}.joblib")
        if os.path.exists(model_path):
            try:
                import joblib
                model = joblib.load(model_path)
                self.loaded_models[name] = model
                return model
            except Exception:
                pass
        return None
