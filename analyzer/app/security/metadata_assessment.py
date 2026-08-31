from typing import Dict, Any

def evaluate_metadata_exposure(features: Dict[str, Any]) -> Dict[str, Any]:
    ipsec_feats = features.get("ipsec_features", {})
    return {
        "endpointVisibility": "EXPOSED (Public WAN IPs)",
        "packetTimingPattern": f"{ipsec_feats.get('packet_timing_pattern', 'PERIODIC')} (RTP Audio Frame Cadence)",
        "packetSizeVariance": f"{ipsec_feats.get('packet_size_variance', 'LOW VARIANCE')} (Fixed payload frame sizes)",
        "fingerprintability": f"{ipsec_feats.get('fingerprintability', 'HIGH')} (Identifiable as IPsec ESP over NAT-T)"
    }
