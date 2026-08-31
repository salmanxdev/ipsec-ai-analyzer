import struct
from typing import Dict, Any, Optional

def parse_raw_packet(pkt_bytes: bytes, timestamp: float = 0.0) -> Dict[str, Any]:

    info = {
        "timestamp": timestamp,
        "length": len(pkt_bytes),
        "ip_version": None,
        "src_ip": None,
        "dst_ip": None,
        "protocol": None,
        "transport_proto": None,
        "src_port": None,
        "dst_port": None,
        "is_ike": False,
        "is_esp": False,
        "is_ah": False,
        "esp_spi": None,
        "esp_seq": None,
        "payload": b""
    }

    if len(pkt_bytes) < 14:
        return info

    # Check Ethernet type
    eth_type = struct.unpack("!H", pkt_bytes[12:14])[0]
    offset = 14

    if eth_type == 0x0800: # IPv4
        if len(pkt_bytes) < offset + 20:
            return info
        ip_header = pkt_bytes[offset:offset+20]
        version_ihl = ip_header[0]
        ihl = (version_ihl & 0x0F) * 4
        proto = ip_header[9]
        src_ip = ".".join(map(str, ip_header[12:16]))
        dst_ip = ".".join(map(str, ip_header[16:20]))

        info["ip_version"] = "IPv4"
        info["src_ip"] = src_ip
        info["dst_ip"] = dst_ip
        info["protocol"] = proto

        payload_offset = offset + ihl
        transport_payload = pkt_bytes[payload_offset:]

        if proto == 17: # UDP
            info["transport_proto"] = "UDP"
            if len(transport_payload) >= 8:
                src_port, dst_port, udp_len = struct.unpack("!HHH", transport_payload[:6])
                info["src_port"] = src_port
                info["dst_port"] = dst_port
                udp_data = transport_payload[8:]
                info["payload"] = udp_data

                # Check IKE / NAT-T
                if src_port in (500, 4500) or dst_port in (500, 4500):
                    # Check for non-ESP marker in NAT-T (4 zero bytes)
                    if len(udp_data) >= 4 and udp_data[:4] == b'\x00\x00\x00\x00':
                        info["is_ike"] = True
                        info["payload"] = udp_data[4:]
                    elif src_port == 500 or dst_port == 500:
                        info["is_ike"] = True
                    elif src_port == 4500 or dst_port == 4500:
                        # Could be encapsulated ESP
                        if len(udp_data) >= 8 and udp_data[:4] != b'\x00\x00\x00\x00':
                            info["is_esp"] = True
                            spi_num = struct.unpack("!I", udp_data[:4])[0]
                            seq_num = struct.unpack("!I", udp_data[4:8])[0]
                            info["esp_spi"] = f"0x{spi_num:08x}"
                            info["esp_seq"] = seq_num

        elif proto == 6: # TCP
            info["transport_proto"] = "TCP"
            if len(transport_payload) >= 20:
                src_port, dst_port = struct.unpack("!HH", transport_payload[:4])
                info["src_port"] = src_port
                info["dst_port"] = dst_port

        elif proto == 50: # ESP
            info["transport_proto"] = "ESP"
            info["is_esp"] = True
            if len(transport_payload) >= 8:
                spi_num = struct.unpack("!I", transport_payload[:4])[0]
                seq_num = struct.unpack("!I", transport_payload[4:8])[0]
                info["esp_spi"] = f"0x{spi_num:08x}"
                info["esp_seq"] = seq_num

        elif proto == 51: # AH
            info["transport_proto"] = "AH"
            info["is_ah"] = True

        elif proto == 1: # ICMP
            info["transport_proto"] = "ICMP"

    elif eth_type == 0x86DD: # IPv6
        info["ip_version"] = "IPv6"

    return info
