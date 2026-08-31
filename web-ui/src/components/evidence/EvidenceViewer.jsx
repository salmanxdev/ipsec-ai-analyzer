import React, { useState } from 'react';
import { FileCode, Terminal, Copy, Check } from 'lucide-react';
import { mockAnalysisData } from '../../mock/mockData';

export const EvidenceViewer = () => {
  const [activeSource, setActiveSource] = useState('strongswan');
  const [copied, setCopied] = useState(false);

  const logs = mockAnalysisData.evidenceLogs;

  const getActiveContent = () => {
    switch (activeSource) {
      case 'strongswan': return logs.strongswanLog;
      case 'xfrm': return logs.xfrmState;
      case 'pcap': return `File: ipsec_voip_tunnel_01.pcap
Magic: 0xa1b2c3d4 (pcap format)
Version: 2.4
Snaplen: 262144
LinkType: LINKTYPE_ETHERNET (1)
Packets Captured: 12482
Protocols Identified: IP (0x0800), UDP (17), ESP (50)`;
      default: return logs.strongswanLog;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="soc-card">
      <div className="soc-card-header">
        <span className="soc-card-title">
          <Terminal size={18} color="var(--accent-cyan)" />
          <span>Raw Capture Evidence Viewer</span>
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {['strongswan', 'xfrm', 'pcap'].map((src) => (
            <button
              key={src}
              onClick={() => setActiveSource(src)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: activeSource === src ? 'var(--accent-cyan)' : 'var(--bg-secondary)',
                color: activeSource === src ? 'var(--text-inverse)' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                textTransform: 'uppercase'
              }}
            >
              {src === 'strongswan' ? 'strongSwan Trace' : src === 'xfrm' ? 'XFRM State' : 'PCAP Header'}
            </button>
          ))}

          <button onClick={handleCopy} className="soc-btn soc-btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
            {copied ? <Check size={14} color="var(--color-success)" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      <pre className="font-mono" style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: '6px', fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.6, overflowX: 'auto', border: '1px solid var(--border-color)', minHeight: '300px' }}>
        {getActiveContent()}
      </pre>
    </div>
  );
};
