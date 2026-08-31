import React from 'react';
import { useAnalysisContext } from '../context/AnalysisContext';
import { SecurityScore } from '../components/SecurityScore';
import { RiskScore } from '../components/RiskScore';
import { AIConfidence } from '../components/AIConfidence';
import { VPNConfiguration } from '../components/VPNConfiguration';
import { VPNTopology } from '../components/VPNTopology';
import { MetadataAnalysis } from '../components/MetadataAnalysis';
import { ShieldCheck, Play, Radio, UploadCloud, ArrowRight } from 'lucide-react';

export const Dashboard = () => {
  const { currentAnalysis, setActivePage, setActiveAnalysisMode } = useAnalysisContext();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Landing / Welcome Screen Header */}
      <div style={{ background: 'linear-gradient(135deg, #0d121f 0%, #162035 100%)', padding: '1.75rem 2rem', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
            Understand Your VPN Security with AI-Powered IPsec Analysis
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem', maxWidth: '750px' }}>
            Analyze captured or live network traffic, identify IPsec characteristics, classify encrypted traffic patterns, and automatically assess VPN security posture.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => {
              setActivePage('analyze');
              setActiveAnalysisMode('pcap');
            }}
            className="soc-btn soc-btn-secondary"
          >
            <UploadCloud size={16} />
            <span>Analyze PCAP</span>
          </button>
          <button
            onClick={() => {
              setActivePage('analyze');
              setActiveAnalysisMode('live');
            }}
            className="soc-btn soc-btn-primary"
          >
            <Radio size={16} />
            <span>Start Live Analysis</span>
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
