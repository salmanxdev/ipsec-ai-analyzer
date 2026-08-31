import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export const SecurityScore = ({ scores }) => {
  const score = scores?.securityScore ?? 87;
  const grade = scores?.securityGrade ?? 'GOOD';
  const components = scores?.components || {
    cryptography: 92,
    authentication: 90,
    keyExchange: 85,
    saConfiguration: 88,
    replayProtection: 100,
    forwardSecrecy: 75,
    keyLifetime: 90,
    metadataExposure: 72
  };

  return (
    <div className="soc-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div className="soc-card-header">
        <span className="soc-card-title">
          <ShieldCheck size={18} color="var(--color-success)" />
          <span>Security Score</span>
        </span>
        <span className="soc-badge assessed">ASSESSED</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '0.75rem 0 1.25rem 0' }}>
        {/* Visual score circle / gauge */}
        <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '50%', background: 'conic-gradient(#10b981 0% 87%, #1e293b 87% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)' }}>
          <div style={{ width: '82px', height: '82px', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>OUT OF 100</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-success)', letterSpacing: '0.05em' }}>{grade}</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', maxWidth: '240px' }}>
            Strong encryption and authentication protocols identified with active replay windows.
          </p>
        </div>
      </div>

      {/* Component breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
        {Object.entries(components).map(([key, val]) => (
          <div key={key} style={{ fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
              <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                {key.replace(/([A-Z])/g, ' $1')}
              </span>
              <span className="font-mono" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{val}</span>
            </div>
            <div style={{ height: '4px', width: '100%', background: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${val}%`, background: val > 80 ? 'var(--color-success)' : val > 60 ? 'var(--color-warning)' : 'var(--color-danger)' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
