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

    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.pdfgen import canvas

        c = canvas.Canvas(pdf_path, pagesize=letter)
        c.setFont("Helvetica-Bold", 18)
        c.drawString(50, 750, "IPsec VPN Technical & Forensic Audit Report")
        c.setFont("Helvetica", 10)
        c.drawString(50, 730, f"Analysis ID: {analysis_id} | Generated: {generated_at[:19]}")
        c.line(50, 720, 550, 720)
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
