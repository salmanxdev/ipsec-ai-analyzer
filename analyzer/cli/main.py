import sys
import os
import argparse
import json

# Ensure parent analyzer package is in path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.analysis_engine import analyze_pcap_file
from app.reports.executive import generate_executive_report
from app.reports.technical import generate_technical_report

def main():
    parser = argparse.ArgumentParser(prog="ipsec-analyzer", description="IPsec AI Analyzer - Standalone Network Security CLI")
    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")

    # Command: analyze
    analyze_parser = subparsers.add_parser("analyze", help="Analyze a PCAP/PCAPNG capture file")
    analyze_parser.add_argument("pcap_file", help="Path to .pcap or .pcapng file")
    analyze_parser.add_argument("--json", action="store_true", help="Output raw JSON analysis result")

    # Command: live
    live_parser = subparsers.add_parser("live", help="Capture live network traffic on an interface")
    live_parser.add_argument("--interface", default="eth0", help="Network interface name (default: eth0)")
    live_parser.add_argument("--duration", type=int, default=10, help="Duration in seconds (default: 10)")

    # Command: features
    feat_parser = subparsers.add_parser("features", help="Extract flow features from PCAP file")
    feat_parser.add_argument("pcap_file", help="Path to .pcap or .pcapng file")

    # Command: report
    report_parser = subparsers.add_parser("report", help="Generate executive & technical reports")
    report_parser.add_argument("pcap_file", help="Path to .pcap or .pcapng file")

    # Command: version
    subparsers.add_parser("version", help="Display software version")

    args = parser.parse_args()

    if args.command == "version":
        print("IPsec AI Analyzer Engine v1.0.0 (Standalone CLI)")
        return

    elif args.command == "analyze":
        pcap_path = os.path.abspath(args.pcap_file)
        if not os.path.exists(pcap_path):
            print(f"Error: Capture file '{pcap_path}' not found.")
            sys.exit(1)

        result = analyze_pcap_file(pcap_path)

        if args.json:
            print(json.dumps(result, indent=2))
        else:
            vpn = result.get("vpnDetection", {})
            scores = result.get("scores", {})
            traffic = result.get("trafficAnalysis", {})

            print("==================================================")
            print("         IPsec AI Analyzer Summary Result         ")
            print("==================================================")
            print(f"Capture File   : {result.get('captureInfo', {}).get('filename')}")
            print(f"Packets Analyzed: {result.get('captureInfo', {}).get('packetCount')}")
            print(f"Protocol       : {vpn.get('protocol')} ({vpn.get('ikeVersion')})")
            print(f"Operating Mode : {vpn.get('operatingMode')}")
            print(f"Encryption     : {vpn.get('encryption')}")
            print(f"Integrity/Auth : {vpn.get('authentication')}")
            print(f"Key Exchange   : {vpn.get('dhGroup')}")
            print(f"PFS / Replay   : PFS {vpn.get('pfs')}, Replay {vpn.get('replayProtection')}")
            print("--------------------------------------------------")
            print(f"Predicted Traffic : {traffic.get('predictedType')} ({traffic.get('confidence')}% Confidence)")
            print(f"Security Score    : {scores.get('securityScore')} / 100 ({scores.get('securityGrade')})")
            print(f"Risk Score        : {scores.get('riskScore')} / 100 ({scores.get('riskLevel')} RISK)")
            print(f"AI Confidence     : {scores.get('aiConfidence')}% ({scores.get('aiConfidenceLevel')})")
            print("==================================================")

    elif args.command == "features":
        pcap_path = os.path.abspath(args.pcap_file)
        result = analyze_pcap_file(pcap_path)
        print(json.dumps(result.get("trafficAnalysis", {}).get("metrics", {}), indent=2))

    elif args.command == "report":
        pcap_path = os.path.abspath(args.pcap_file)
        result = analyze_pcap_file(pcap_path)
        exec_rep = generate_executive_report(result)
        tech_rep = generate_technical_report(result)
        print(f"Executive Report PDF: {exec_rep.get('downloadUrl')}")
        print(f"Technical Report PDF: {tech_rep.get('downloadUrl')}")

    elif args.command == "live":
        print(f"Initiating live network capture on interface '{args.interface}' for {args.duration}s...")
        from app.capture.live_capture import LiveCaptureSession
        import time
        session = LiveCaptureSession(interface=args.interface)
        session.start()
        time.sleep(args.duration)
        session.stop()
        print("Live capture complete:")
        print(json.dumps(session.get_status(), indent=2))

    else:
        parser.print_help()

if __name__ == "__main__":
    main()
