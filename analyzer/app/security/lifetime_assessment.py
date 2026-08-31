from typing import Dict, Any

def evaluate_key_lifetimes() -> Dict[str, Any]:
    return {
        "ikeSaLifetimeSec": 86400,
        "childSaLifetimeSec": 28800,
        "rekeyIntervalSec": 3600,
        "lifetimeStatus": "COMPLIANT"
    }
