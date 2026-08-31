import os
from typing import List, Dict, Any
from ..parser.packet_parser import parse_raw_packet

def read_pcap_file(file_path: str) -> List[Dict[str, Any]]:
    packets = []
    if not os.path.exists(file_path):
        return packets

    # Attempt parsing via Scapy rdpcap
    try:
        from scapy.all import rdpcap, raw
        scapy_pkts = rdpcap(file_path)
        for p in scapy_pkts:
            ts = float(p.time)
            pkt_bytes = raw(p)
            parsed = parse_raw_packet(pkt_bytes, timestamp=ts)
            packets.append(parsed)
        return packets
    except Exception as e:
        print(f"[PCAP READ WARNING] Scapy rdpcap fallback: {e}")

    # Pure Python binary PCAP parser fallback
    try:
        with open(file_path, 'rb') as f:
            header = f.read(24)
            if len(header) < 24:
                return packets
            magic = header[:4]
            is_little_endian = magic in (b'\xd4\xc3\xb2\xa1', b'\x4d\x3c\xb2\xa1')

            import struct
            fmt = "<IIII" if is_little_endian else ">IIII"

            while True:
                p_hdr = f.read(16)
                if len(p_hdr) < 16:
                    break
                ts_sec, ts_usec, incl_len, orig_len = struct.unpack(fmt, p_hdr)
                p_data = f.read(incl_len)
                ts = ts_sec + (ts_usec / 1000000.0)
                parsed = parse_raw_packet(p_data, timestamp=ts)
                packets.append(parsed)
    except Exception as ex:
        print(f"[PCAP BINARY READ ERROR] {ex}")

    return packets
