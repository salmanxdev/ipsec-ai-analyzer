from typing import List, Dict, Any

class FlowTracker:
    def __init__(self):
        self.flows: Dict[str, Dict[str, Any]] = {}

    def get_flow_key(self, pkt: Dict[str, Any]) -> str:
        src = pkt.get("src_ip", "0.0.0.0")
        dst = pkt.get("dst_ip", "0.0.0.0")
        sport = pkt.get("src_port") or 0
        dport = pkt.get("dst_port") or 0
        proto = pkt.get("protocol") or 0

        # Sort IP/ports for bi-directional flow key
        if (src, sport) > (dst, dport):
            return f"{dst}:{dport}<->{src}:{sport}:{proto}"
        return f"{src}:{sport}<->{dst}:{dport}:{proto}"

    def add_packet(self, pkt: Dict[str, Any]):
        key = self.get_flow_key(pkt)
        ts = pkt.get("timestamp", 0.0)
        length = pkt.get("length", 0)

        if key not in self.flows:
            self.flows[key] = {
                "key": key,
                "src_ip": pkt.get("src_ip"),
                "dst_ip": pkt.get("dst_ip"),
                "src_port": pkt.get("src_port"),
                "dst_port": pkt.get("dst_port"),
                "protocol": pkt.get("protocol"),
                "is_ipsec": pkt.get("is_ike") or pkt.get("is_esp") or pkt.get("is_ah"),
                "start_time": ts,
                "end_time": ts,
                "packets": [],
                "total_packets": 0,
                "total_bytes": 0,
                "upstream_packets": 0,
                "downstream_packets": 0,
                "upstream_bytes": 0,
                "downstream_bytes": 0
            }

        flow = self.flows[key]
        flow["end_time"] = ts
        flow["total_packets"] += 1
        flow["total_bytes"] += length

        is_upstream = (pkt.get("src_ip") == flow["src_ip"])
        if is_upstream:
            flow["upstream_packets"] += 1
            flow["upstream_bytes"] += length
        else:
            flow["downstream_packets"] += 1
            flow["downstream_bytes"] += length

        flow["packets"].append({
            "timestamp": ts,
            "length": length,
            "is_upstream": is_upstream
        })

def extract_flows_from_packets(packets: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    tracker = FlowTracker()
    for pkt in packets:
        tracker.add_packet(pkt)
    return list(tracker.flows.values())
