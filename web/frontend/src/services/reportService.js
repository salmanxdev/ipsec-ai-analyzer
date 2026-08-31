import { apiClient } from './api';
import { mockAnalysisData } from '../mock/mockData';

export const reportService = {
  async generateExecutiveReport(analysisId) {
    const res = await apiClient.post('/reports/executive', { analysisId });
    if (res) return res;

    return {
      type: 'EXECUTIVE',
      title: 'IPsec VPN Executive Security Summary',
      generatedAt: new Date().toISOString(),
      summary: {
        securityScore: mockAnalysisData.scores.securityScore,
        riskLevel: mockAnalysisData.scores.riskLevel,
        vpnProtocol: `${mockAnalysisData.vpnDetection.protocol} (${mockAnalysisData.vpnDetection.ikeVersion})`,
        mainFindings: [
          'Strong cryptographic cipher suite (AES-128-CBC + HMAC-SHA256) detected.',
          'PFS (Perfect Forward Secrecy) and Replay Protection enabled.',
          'Moderate Diffie-Hellman Group 14 (MODP-2048) recommended for quantum-resilient upgrade.'
        ]
      }
    };
  },

  async generateTechnicalReport(analysisId) {
    const res = await apiClient.post('/reports/technical', { analysisId });
    if (res) return res;

    return {
      type: 'TECHNICAL',
      title: 'IPsec VPN Technical & Forensic Audit Report',
      generatedAt: new Date().toISOString(),
      details: mockAnalysisData
    };
  },

  downloadReportFile(reportData, format = 'json') {
    if (reportData && reportData.downloadUrl && format === 'pdf') {
      window.open(`http://localhost:8000${reportData.downloadUrl}`, '_blank');
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ipsec_security_report_${format}_${Date.now()}.${format}`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
};
