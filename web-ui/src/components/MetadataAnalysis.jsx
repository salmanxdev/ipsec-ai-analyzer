import React from 'react';
import { Eye, ShieldAlert, Cpu } from 'lucide-react';

export const MetadataAnalysis = ({ metadata }) => {
  const meta = metadata || {
    endpointVisibility: "EXPOSED (Public WAN IPs)",
    packetTimingPattern: "PERIODIC (RTP Audio Frame Cadence)",
    packetSizeVariance: "LOW VARIANCE (Fixed payload frame sizes)",
    fingerprintability: "HIGH (Identifiable as IPsec ESP over NAT-T)"
  };

  const observations = [
    { label: "Endpoint IPs", value: "10.0.2.4 ↔ 10.0.2.5", type: "OBSERVED" },
    { label: "Transport Layer", value: "UDP / 4500 (NAT-Traversal)", type: "OBSERVED" },
    { label: "IKE Protocol", value: "IKEv2 (Key Exchange)", type: "OBSERVED" },
    { label: "ESP Protocol", value: "IP Protocol 50 Observed", type: "OBSERVED" },
    { label: "NAT-T Header", value: "Detected (RFC 3948 Encapsulation)", type: "OBSERVED" },
    { label: "Traffic Cadence", value: "Periodic ~15ms burst intervals", type: "INFERRED" },
    { label: "Payload Fingerprint", value: "VoIP (Opus/G.711 Audio Codec)", type: "AI PREDICTED" }
  ];

  return (
    <div className="soc-card">
      <div className="soc-card-header">
        <span className="soc-card-title">
          <Eye size={18} color="var(--accent-cyan)" />
          <span>Metadata Inference & Side-Channel Exposure</span>
        </span>
        <span className="soc-badge inferred">INFERRED METADATA</span>
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Even without decrypting ESP payloads, eavesdroppers can infer communication patterns from packet timing, sizes, and headers.
      </p>

      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {observations.map((item, idx) => (
            <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{item.label}</div>
                <div className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</div>
              </div>
              <span className={`soc-badge ${item.type.toLowerCase().replace(' ', '-')}`} style={{ fontSize: '0.6rem', padding: '0.1rem 0.35rem' }}>
                {item.type}
              </span>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Side-Channel Fingerprint Risk
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              The current stream shows <strong>HIGH fingerprintability</strong>. An adversary monitoring network transit can infer that a voice call is active between 10.0.2.4 and 10.0.2.5 due to uniform packet inter-arrival times and minimal frame length jitter.
            </div>
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Cpu size={14} />
            <span>Countermeasure: Enable IPsec Traffic Flow Confidentiality (TFC) padding.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
