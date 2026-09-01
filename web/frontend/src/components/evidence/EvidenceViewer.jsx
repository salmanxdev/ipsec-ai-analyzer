import React, { useState } from 'react';
import { FileCode, Terminal, Copy, Check } from 'lucide-react';
import { useAnalysisContext } from '../../context/AnalysisContext';

export const EvidenceViewer = () => {
  const { currentAnalysis } = useAnalysisContext();
  const [activeSource, setActiveSource] = useState('strongswan');
  const [copied, setCopied] = useState(false);

  const logs = currentAnalysis?.evidenceLogs || {
    strongswanLog: "[IKE] No active strongSwan logs available for current session.",
    xfrmState: "src 0.0.0.0 dst 0.0.0.0\n\tproto esp reqid 1 mode tunnel"
  };

  const cap = currentAnalysis?.captureInfo || {};
  const vpn = currentAnalysis?.vpnDetection || {};

  const getActiveContent = () => {
    switch (activeSource) {
      case 'strongswan':
        return logs.strongswanLog || "[IKE] Trace logs active.";
      case 'xfrm':
        return logs.xfrmState || "XFRM State established.";
      case 'pcap':
        return `File: ${cap.filename || 'unknown.pcap'}
Captured Packets: ${cap.packetCount || 0}
Duration: ${cap.durationSeconds || 0}s
File Size: ${cap.fileSize ? (cap.fileSize / 1024).toFixed(1) + ' KB' : '0 KB'}
IKE Packets: ${cap.ikePackets || 0}
ESP Packets: ${cap.espPackets || 0}
Other Packets: ${cap.otherPackets || 0}
Protocol Identified: ${vpn.protocol || 'IPsec'} (${vpn.ikeVersion || 'IKEv2'})
Encryption Cipher: ${vpn.encryption || 'Unknown'}
Integrity Algorithm: ${vpn.authentication || 'Unknown'}
Diffie-Hellman Group: ${vpn.dhGroup || 'Unknown'}`;
      default:
        return logs.strongswanLog;
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
          <span>Raw Capture Evidence Viewer ({cap.filename || 'Active File'})</span>
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
              {src === 'strongswan' ? 'strongSwan Trace' : src === 'xfrm' ? 'XFRM State' : 'PCAP Forensics'}
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
