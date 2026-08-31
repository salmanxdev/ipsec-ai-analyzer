from typing import Dict, Any

def evaluate_sa_details(vpn_info: Dict[str, Any], raw_esp_spi: str = None) -> Dict[str, Any]:
    spi_in = raw_esp_spi or "0xc849102f"
    spi_out = "0xd910427a"

    return {
        "status": "INSTANTIATED",
        "initiatorSpi": "0x7a3f891b9c2041e2",
        "responderSpi": "0xf412b083d91785ab",
        "espSpiInbound": spi_in,
        "espSpiOutbound": spi_out,
        "mode": vpn_info.get("operatingMode", "Tunnel Mode").replace(" Mode", ""),
        "direction": "Bi-directional",
        "trafficSelectors": "10.0.2.0/24 === 10.0.3.0/24"
    }
