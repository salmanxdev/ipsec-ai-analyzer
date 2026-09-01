import React from 'react';
import { useAnalysisContext } from '../context/AnalysisContext';
import { SecurityScore } from '../components/SecurityScore';
import { RiskScore } from '../components/RiskScore';
import { AIConfidence } from '../components/AIConfidence';
import { VPNConfiguration } from '../components/VPNConfiguration';
import { VPNTopology } from '../components/VPNTopology';
import { MetadataAnalysis } from '../components/MetadataAnalysis';
import { ShieldCheck, Play, Radio, UploadCloud, FileText, CheckCircle2 } from 'lucide-react';

export const Dashboard = () => {
  const { currentAnalysis, setActivePage, setActiveAnalysisMode } = useAnalysisContext();
  const filename = currentAnalysis?.captureInfo?.filename || 'No Active Capture';
  const packetCount = currentAnalysis?.captureInfo?.packetCount || 0;
  const vpnProto = currentAnalysis?.vpnDetection?.protocol || 'IPsec';
  const ikeVer = currentAnalysis?.vpnDetection?.ikeVersion || 'IKEv2';
  const enc = currentAnalysis?.vpnDetection?.encryption || 'Unknown';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Active Capture Context Header */}
      <div style={{ background: 'linear-gradient(135deg, #0d121f 0%, #162035 100%)', padding: '1.5rem 2rem', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="soc-badge assessed" style={{ fontSize: '0.75rem' }}>ACTIVE ANALYSIS</span>
            <span className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              {filename}
            </span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem', display: 'flex', gap: '1.25rem' }}>
            <span>Packets: <strong style={{ color: 'var(--text-primary)' }}>{packetCount.toLocaleString()}</strong></span>
            <span>Protocol: <strong style={{ color: 'var(--text-primary)' }}>{vpnProto} ({ikeVer})</strong></span>
            <span>Cipher: <strong style={{ color: 'var(--text-primary)' }}>{enc}</strong></span>
            <span>Session ID: <strong className="font-mono" style={{ color: 'var(--text-muted)' }}>{currentAnalysis?.id}</strong></span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => {
              setActivePage('analyze');
              setActiveAnalysisMode('pcap');
            }}
            className="soc-btn soc-btn-primary"
          >
            <UploadCloud size={16} />
            <span>Upload New PCAP</span>
          </button>
          <button
            onClick={() => {
              setActivePage('reports');
            }}
            className="soc-btn soc-btn-secondary"
          >
            <FileText size={16} />
            <span>View Reports</span>
          </button>
        </div>
      </div>

      {/* Top 3 Summary Cards Grid */}
      <div className="grid-3">
        <SecurityScore scores={currentAnalysis.scores} />
        <RiskScore scores={currentAnalysis.scores} />
        <AIConfidence scores={currentAnalysis.scores} />
      </div>

      {/* VPN Session Topology Map */}
      <VPNTopology topology={currentAnalysis.topology} />

      {/* VPN Protocol Identification Section */}
      <VPNConfiguration vpnData={currentAnalysis.vpnDetection} />

      {/* Metadata Analysis Panel */}
      <MetadataAnalysis metadata={currentAnalysis.securityAssessment?.metadataExposure} />
    </div>
  );
};
