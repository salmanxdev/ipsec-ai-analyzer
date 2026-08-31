import { apiClient } from './api';
import { mockAnalysisData } from '../mock/mockData';

export const reportService = {
  async generateExecutiveReport(analysisId) {
    await apiClient.post('/reports/executive', { analysisId });
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
    await apiClient.post('/reports/technical', { analysisId });
    return {
      type: 'TECHNICAL',
      title: 'IPsec VPN Technical & Forensic Audit Report',
      generatedAt: new Date().toISOString(),
      details: mockAnalysisData
    };
  },

  downloadReportFile(reportData, format = 'json') {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ipsec_security_report_${format}_${Date.now()}.${format}`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
};
