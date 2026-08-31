import React from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';

export const AIConfidence = ({ scores }) => {
  const confidence = scores?.aiConfidence ?? 91;
  const level = scores?.aiConfidenceLevel ?? 'HIGH';

  const predictions = [
    { label: 'IKE Version Identification', value: 'IKEv2', conf: 96 },
    { label: 'Operating Mode Prediction', value: 'Tunnel Mode', conf: 94 },
    { label: 'Traffic Payload Class', value: 'VoIP (RTP)', conf: 87 }
  ];

  return (
    <div className="soc-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div className="soc-card-header">
        <span className="soc-card-title">
          <BrainCircuit size={18} color="var(--accent-purple)" />
          <span>AI Confidence</span>
        </span>
        <span className="soc-badge ai-predicted">AI PREDICTED</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '0.75rem 0 1rem 0' }}>
        <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '50%', background: 'conic-gradient(#a855f7 0% 91%, #1e293b 91% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)' }}>
          <div style={{ width: '82px', height: '82px', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{confidence}%</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACCURACY</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-purple)', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={16} />
            <span>{level} CONFIDENCE</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            High feature correlation across packet inter-arrival cadence and payload sizing.
          </p>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.85rem' }}>
        {predictions.map((p, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{p.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="font-mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{p.value}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-purple)', background: 'rgba(168, 85, 247, 0.15)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                {p.conf}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
