"""
IPsec AI Analyzer - Demo PCAP Generator
Generates 5 realistic demo PCAP scenarios with distinct cryptographic configurations and traffic profiles.

Scenarios:
  1. ipsec_ikev2_voip_tunnel.pcap       - IKEv2 + AES-128-CBC + HMAC-SHA256 + MODP-2048 (VoIP RTP)
  2. ipsec_ikev2_file_transfer.pcap     - IKEv2 + AES-256-GCM + AEAD + ECP-384 (File Transfer)
  3. ipsec_ikev1_legacy_weak.pcap       - IKEv1 + 3DES-CBC + HMAC-MD5 + MODP-1024 (Legacy Weak)
  4. ipsec_ikev2_web_browsing.pcap      - IKEv2 + AES-128-GCM + AEAD + ECP-256 (Web Browsing)
  5. ipsec_natt_mobile_vpn.pcap         - IKEv2 + AES-256-CBC + HMAC-SHA256 + NAT-T (Mobile VPN)

Run: python data/generate_demo_pcaps.py
"""
import struct
import os
import time
import random

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "pcaps")
os.makedirs(OUTPUT_DIR, exist_ok=True)

PCAP_GLOBAL_HEADER = struct.pack("<IHHiIII",
    0xa1b2c3d4,  # magic number
    2, 4,        # version major/minor
    0,           # timezone offset
    0,           # timestamp accuracy
    65535,       # snaplen
    1            # link type (Ethernet)
)

def eth_hdr(src_mac="00:11:22:33:44:55", dst_mac="66:77:88:99:aa:bb"):
    src = bytes(int(x, 16) for x in src_mac.split(":"))
    dst = bytes(int(x, 16) for x in dst_mac.split(":"))
    return dst + src + b'\x08\x00'  # EtherType IPv4

def ip_hdr(src_ip, dst_ip, proto, payload_len):
    total_len = 20 + payload_len
    src = bytes(int(x) for x in src_ip.split("."))
    dst = bytes(int(x) for x in dst_ip.split("."))
    hdr = struct.pack("!BBHHHBBH4s4s",
        0x45, 0, total_len,
        random.randint(0x1000, 0xffff), 0,
        64, proto, 0,
        src, dst
    )
    return hdr

def udp_hdr(sport, dport, payload_len):
    total_len = 8 + payload_len
    return struct.pack("!HHHH", sport, dport, total_len, 0)

def pcap_packet_hdr(ts, pkt_len):
    ts_sec = int(ts)
    ts_usec = int((ts % 1) * 1_000_000)
    return struct.pack("<IIII", ts_sec, ts_usec, pkt_len, pkt_len)

def build_packet(src_ip, dst_ip, sport, dport, payload, proto=17, ts=None):
    if ts is None:
        ts = time.time()
    udp = udp_hdr(sport, dport, len(payload))
    ip = ip_hdr(src_ip, dst_ip, proto, len(udp) + len(payload))
    eth = eth_hdr()
    raw = eth + ip + udp + payload
    return pcap_packet_hdr(ts, len(raw)) + raw

# ─────────────────────────────────────────────
# IKE & ESP Payload Generators
# ─────────────────────────────────────────────

def ike_sa_init_packet(cipher="AES-128-CBC", dh="MODP-2048", auth="HMAC-SHA256", is_v1=False):
    init_spi = bytes(random.randint(0, 255) for _ in range(8))
    resp_spi = b'\x00' * 8
    
    if is_v1:
        # IKEv1 Header (version 0x10)
        hdr = init_spi + resp_spi + struct.pack("!BBBBII", 1, 0x10, 2, 0x00, 0, 0x00000060)
        body = f"IKEv1 Proposal 3DES-CBC HMAC-MD5 MODP-1024 Group 2 legacy".encode('ascii') + b'\x00' * 20
    else:
        # IKEv2 Header (version 0x20)
        hdr = init_spi + resp_spi + struct.pack("!BBBBII", 33, 0x20, 34, 0x08, 0, 0x00000080)
        body = f"IKEv2 Proposal {cipher} {auth} {dh}".encode('ascii') + b'\x00' * 20
        
    return hdr + body

def esp_payload(spi, seq_num, data_len=180):
    # RFC 3948: Direct SPI (no zero marker for ESP traffic on 4500)
    spi_bytes = struct.pack("!I", spi)
    seq = struct.pack("!I", seq_num)
    padding = bytes(random.randint(0, 255) for _ in range(data_len))
    return spi_bytes + seq + padding

def esp_payload_large(spi, seq_num, chunk_size=1400):
    # RFC 3948: Direct SPI for ESP traffic
    spi_bytes = struct.pack("!I", spi)
    seq = struct.pack("!I", seq_num)
    padding = bytes(random.randint(0, 255) for _ in range(chunk_size))
    return spi_bytes + seq + padding

def write_pcap(filename, packets):
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, "wb") as f:
        f.write(PCAP_GLOBAL_HEADER)
        for pkt in packets:
            f.write(pkt)
    size_kb = os.path.getsize(path) / 1024
    print(f"  [OK] {filename:50s} ({len(packets):4d} pkts, {size_kb:.1f} KB)")
    return path

# ─────────────────────────────────────────────
# SCENARIO GENERATORS
# ─────────────────────────────────────────────

def gen_ikev2_voip_tunnel():
    """Scenario 1: IKEv2 + AES-128-CBC + HMAC-SHA256 + MODP-2048 (VoIP RTP)"""
    pkts = []
    t = time.time() - 240
    spi = 0xc849102f
    client_ip = "10.0.1.10"
    server_ip = "203.0.113.1"

    # IKEv2 Exchange on port 500
    for _ in range(4):
        p = ike_sa_init_packet(cipher="AES-128-CBC", dh="MODP-2048", auth="HMAC-SHA256")
        pkts.append(build_packet(client_ip, server_ip, 500, 500, p, ts=t))
        t += 0.005
        pkts.append(build_packet(server_ip, client_ip, 500, 500, p[:60], ts=t))
        t += 0.005

    # VoIP traffic (small RTP packets ~160-200 bytes, ~20ms interval)
    for seq in range(1, 500):
        psize = random.randint(160, 200)
        p = esp_payload(spi, seq, data_len=psize)
        pkts.append(build_packet(client_ip, server_ip, 4500, 4500, p, ts=t))
        t += 0.020
        if seq % 4 == 0:
            resp = esp_payload(spi + 1, seq, data_len=psize)
            pkts.append(build_packet(server_ip, client_ip, 4500, 4500, resp, ts=t))
            t += 0.001

    return pkts

def gen_ikev2_file_transfer():
    """Scenario 2: IKEv2 + AES-256-GCM + AEAD + ECP-384 (File Transfer)"""
    pkts = []
    t = time.time() - 120
    spi = 0xe41029ab
    client_ip = "192.168.1.5"
    server_ip = "10.100.0.1"

    # IKEv2 Exchange with AES-256-GCM & ECP-384
    for _ in range(4):
        p = ike_sa_init_packet(cipher="AES-256-GCM", dh="ECP-384 (Group 20)", auth="AEAD")
        pkts.append(build_packet(client_ip, server_ip, 500, 500, p, ts=t))
        t += 0.005
        pkts.append(build_packet(server_ip, client_ip, 500, 500, p[:60], ts=t))
        t += 0.005

    # Large file transfer (1400 byte chunks, high throughput)
    for seq in range(1, 800):
        p = esp_payload_large(spi, seq, chunk_size=1400)
        pkts.append(build_packet(client_ip, server_ip, 4500, 4500, p, ts=t))
        t += random.uniform(0.0005, 0.0015)
        if seq % 20 == 0:
            ack = esp_payload(spi + 1, seq, data_len=64)
            pkts.append(build_packet(server_ip, client_ip, 4500, 4500, ack, ts=t))

    return pkts

def gen_ikev1_legacy_weak():
    """Scenario 3: IKEv1 + 3DES-CBC + HMAC-MD5 + MODP-1024 (Legacy Weak)"""
    pkts = []
    t = time.time() - 360
    spi = 0x11223344
    client_ip = "172.16.0.10"
    server_ip = "172.16.0.1"

    # IKEv1 Exchange with 3DES-CBC, HMAC-MD5, MODP-1024 Group 2
    for phase in range(6):
        p = ike_sa_init_packet(is_v1=True)
        pkts.append(build_packet(client_ip, server_ip, 500, 500, p, ts=t))
        t += 0.01
        pkts.append(build_packet(server_ip, client_ip, 500, 500, p[:50], ts=t))
        t += 0.01

    # Weak traffic with irregular timings
    for seq in range(1, 400):
        psize = random.randint(100, 300)
        p = esp_payload(spi, seq, data_len=psize)
        pkts.append(build_packet(client_ip, server_ip, 4500, 4500, p, ts=t))
        t += random.uniform(0.01, 0.1)
        if seq % 3 == 0:
            resp = esp_payload(spi + 1, seq, data_len=psize)
            pkts.append(build_packet(server_ip, client_ip, 4500, 4500, resp, ts=t))

    return pkts

def gen_ikev2_web_browsing():
    """Scenario 4: IKEv2 + AES-128-GCM + AEAD + ECP-256 (Web Browsing)"""
    pkts = []
    t = time.time() - 180
    spi = 0x5a9018bc
    client_ip = "192.168.10.20"
    server_ip = "8.8.8.1"

    # IKEv2 with AES-128-GCM & ECP-256
    for _ in range(4):
        p = ike_sa_init_packet(cipher="AES-128-GCM", dh="ECP-256 (Group 19)", auth="AEAD")
        pkts.append(build_packet(client_ip, server_ip, 500, 500, p, ts=t))
        t += 0.005
        pkts.append(build_packet(server_ip, client_ip, 500, 500, p[:60], ts=t))
        t += 0.005

    # Web browsing pattern: request small -> response burst -> idle
    for page in range(15):
        req = esp_payload(spi, page * 30, data_len=random.randint(120, 250))
        pkts.append(build_packet(client_ip, server_ip, 4500, 4500, req, ts=t))
        t += random.uniform(0.002, 0.006)
        for c in range(random.randint(4, 18)):
            resp = esp_payload_large(spi + 1, page * 30 + c, chunk_size=random.randint(700, 1400))
            pkts.append(build_packet(server_ip, client_ip, 4500, 4500, resp, ts=t))
            t += random.uniform(0.001, 0.004)
        t += random.uniform(1.5, 4.0)

    return pkts

def gen_natt_mobile_vpn():
    """Scenario 5: IKEv2 + AES-256-CBC + HMAC-SHA256 + NAT-T (Mobile VPN)"""
    pkts = []
    t = time.time() - 150
    spi = 0x98765432
    client_ip = "100.64.0.5"
    server_ip = "203.0.113.50"

    # Port 500 initiation -> switch to Port 4500
    p = ike_sa_init_packet(cipher="AES-256-CBC", dh="MODP-2048", auth="HMAC-SHA256")
    pkts.append(build_packet(client_ip, server_ip, 500, 500, p, ts=t))
    t += 0.05
    pkts.append(build_packet(server_ip, client_ip, 500, 500, p[:60], ts=t))
    t += 0.05

    # NAT-T on 4500 (IKE on 4500 has 4 zero byte non-ESP marker)
    natt_ike = b'\x00\x00\x00\x00' + p
    pkts.append(build_packet(client_ip, server_ip, 4500, 4500, natt_ike, ts=t))
    t += 0.05
    pkts.append(build_packet(server_ip, client_ip, 4500, 4500, natt_ike[:64], ts=t))
    t += 0.05

    # ESP data on 4500 (no zero marker)
    for seq in range(1, 600):
        psize = random.choice([160, 250, 400, 1400])
        esp_data = esp_payload(spi, seq, data_len=psize)
        pkts.append(build_packet(client_ip, server_ip, 4500, 4500, esp_data, ts=t))
        t += random.uniform(0.005, 0.035)
        if seq % 2 == 0:
            resp = esp_payload(spi + 1, seq, data_len=psize)
            pkts.append(build_packet(server_ip, client_ip, 4500, 4500, resp, ts=t))

    return pkts

if __name__ == "__main__":
    print("\n[*] IPsec AI Analyzer - Generating Realistic Demo PCAPs")
    print("=" * 60)

    scenarios = [
        ("ipsec_ikev2_voip_tunnel.pcap",     gen_ikev2_voip_tunnel),
        ("ipsec_ikev2_file_transfer.pcap",   gen_ikev2_file_transfer),
        ("ipsec_ikev1_legacy_weak.pcap",     gen_ikev1_legacy_weak),
        ("ipsec_ikev2_web_browsing.pcap",    gen_ikev2_web_browsing),
        ("ipsec_natt_mobile_vpn.pcap",       gen_natt_mobile_vpn),
    ]

    print(f"\n[+] Output directory: {OUTPUT_DIR}\n")
    paths = []
    for filename, generator in scenarios:
        pkts = generator()
        path = write_pcap(filename, pkts)
        paths.append(path)

    print(f"\n[+] All {len(scenarios)} demo PCAPs generated successfully!")
