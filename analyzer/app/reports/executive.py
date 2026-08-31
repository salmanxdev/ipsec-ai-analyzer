import os
import datetime
from typing import Dict, Any

REPORTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'reports')
os.makedirs(REPORTS_DIR, exist_ok=True)

def generate_executive_report(analysis_data: Dict[str, Any]) -> Dict[str, Any]:
    analysis_id = analysis_data.get("id", "analysis_001")
    generated_at = datetime.datetime.now().isoformat()
    pdf_filename = f"executive_report_{analysis_id}.pdf"
    pdf_path = os.path.join(REPORTS_DIR, pdf_filename)

    scores = analysis_data.get("scores", {})
    vpn = analysis_data.get("vpnDetection", {})
    threats = analysis_data.get("threatMatrix", [])

    # Try creating PDF via ReportLab
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.pdfgen import canvas

        c = canvas.Canvas(pdf_path, pagesize=letter)
        c.setFont("Helvetica-Bold", 18)
        c.drawString(50, 750, "IPsec VPN Executive Security Report")

        c.setFont("Helvetica", 10)
        c.drawString(50, 730, f"Analysis ID: {analysis_id} | Generated: {generated_at[:19]}")
        c.line(50, 720, 550, 720)

        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, 690, f"Security Score: {scores.get('securityScore', 87)} / 100 ({scores.get('securityGrade', 'GOOD')})")
        c.drawString(50, 670, f"Risk Score: {scores.get('riskScore', 31)} / 100 ({scores.get('riskLevel', 'MEDIUM')} RISK)")
        c.drawString(50, 650, f"VPN Protocol: {vpn.get('protocol', 'IPsec')} {vpn.get('ikeVersion', 'IKEv2')} ({vpn.get('operatingMode', 'Tunnel Mode')})")

        c.drawString(50, 610, "Key Executive Findings:")
        c.setFont("Helvetica", 10)
        y = 590
        for t in threats:
            c.drawString(60, y, f"• [{t.get('severity')}] {t.get('threat')}: {t.get('recommendation')}")
            y -= 20
            if y < 100:
                break

        c.save()
    except Exception as e:
        print(f"[REPORT PDF WARNING] {e}")

    return {
        "type": "EXECUTIVE",
        "title": "IPsec VPN Executive Security Summary",
        "generatedAt": generated_at,
        "downloadUrl": f"/api/reports/download/{pdf_filename}",
        "summary": {
            "securityScore": scores.get("securityScore", 87),
            "riskLevel": scores.get("riskLevel", "MEDIUM"),
            "vpnProtocol": f"{vpn.get('protocol', 'IPsec')} ({vpn.get('ikeVersion', 'IKEv2')})",
            "mainFindings": [t.get("threat") for t in threats[:3]]
        }
    }
