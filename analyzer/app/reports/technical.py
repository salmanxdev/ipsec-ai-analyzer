import os
import datetime
from typing import Dict, Any

REPORTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'reports')
os.makedirs(REPORTS_DIR, exist_ok=True)

def generate_technical_report(analysis_data: Dict[str, Any]) -> Dict[str, Any]:
    analysis_id = analysis_data.get("id", "analysis_001")
    generated_at = datetime.datetime.now().isoformat()
    pdf_filename = f"technical_report_{analysis_id}.pdf"
    pdf_path = os.path.join(REPORTS_DIR, pdf_filename)

    cap = analysis_data.get("captureInfo", {})
    scores = analysis_data.get("scores", {})
    vpn = analysis_data.get("vpnDetection", {})
    threats = analysis_data.get("threatMatrix", [])
    traffic = analysis_data.get("trafficAnalysis", {})

    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.pdfgen import canvas

        c = canvas.Canvas(pdf_path, pagesize=letter)
        c.setFont("Helvetica-Bold", 16)
        c.drawString(50, 750, "IPsec VPN Technical & Forensic Audit Report")
        
        c.setFont("Helvetica", 9)
        c.drawString(50, 732, f"Target File: {cap.get('filename')} | Session: {analysis_id} | Timestamp: {generated_at[:19]}")
        c.line(50, 725, 550, 725)

        # Section 1: Capture Summary
        c.setFont("Helvetica-Bold", 11)
        c.drawString(50, 705, "1. Capture & Tunnel Forensics")
        c.setFont("Helvetica", 9)
        c.drawString(60, 690, f"• Packets Analyzed: {cap.get('packetCount')} (IKE: {cap.get('ikePackets')}, ESP: {cap.get('espPackets')}, Other: {cap.get('otherPackets')})")
        c.drawString(60, 675, f"• Captured Duration: {cap.get('durationSeconds')}s | Size: {(cap.get('fileSize', 0)/1024):.1f} KB")
        c.drawString(60, 660, f"• Protocol: {vpn.get('protocol')} ({vpn.get('ikeVersion')}) | Mode: {vpn.get('operatingMode')}")

        # Section 2: Cryptographic Parameters
        c.setFont("Helvetica-Bold", 11)
        c.drawString(50, 635, "2. Cryptographic Security Assessment")
        c.setFont("Helvetica", 9)
        c.drawString(60, 620, f"• Encryption Cipher: {vpn.get('encryption')}")
        c.drawString(60, 605, f"• Integrity / Authentication: {vpn.get('authentication')}")
        c.drawString(60, 590, f"• Diffie-Hellman Group: {vpn.get('dhGroup')}")
        c.drawString(60, 575, f"• Perfect Forward Secrecy: {vpn.get('pfs')} | Replay Protection: {vpn.get('replayProtection')}")

        # Section 3: Traffic Classification
        c.setFont("Helvetica-Bold", 11)
        c.drawString(50, 550, "3. AI Traffic Classification")
        c.setFont("Helvetica", 9)
        c.drawString(60, 535, f"• Predicted Application: {traffic.get('predictedType')} ({traffic.get('confidence')}% Confidence)")
        c.drawString(60, 520, f"• Overall Security Score: {scores.get('securityScore')}/100 ({scores.get('securityGrade')}) | Risk: {scores.get('riskScore')}/100 ({scores.get('riskLevel')})")

        # Section 4: Threat Matrix
        c.setFont("Helvetica-Bold", 11)
        c.drawString(50, 495, "4. Detected Threat Findings")
        c.setFont("Helvetica", 8)
        y = 480
        for t in threats[:6]:
            c.drawString(60, y, f"• [{t.get('severity')}] {t.get('threat')}: {t.get('recommendation')}")
            y -= 15

        c.save()
    except Exception as e:
        print(f"[TECHNICAL REPORT PDF WARNING] {e}")

    return {
        "type": "TECHNICAL",
        "title": "IPsec VPN Technical & Forensic Audit Report",
        "generatedAt": generated_at,
        "downloadUrl": f"/api/reports/download/{pdf_filename}",
        "details": analysis_data
    }
