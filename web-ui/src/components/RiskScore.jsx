import React from 'react';
import { AlertOctagon, Info } from 'lucide-react';

export const RiskScore = ({ scores }) => {
  const risk = scores?.riskScore ?? 31;
  const level = scores?.riskLevel ?? 'MEDIUM';

  const getRiskColor = (lvl) => {
    switch (lvl) {
      case 'CRITICAL': return 'var(--color-danger)';
      case 'HIGH': return '#fb923c';
      case 'MEDIUM': return 'var(--color-warning)';
      default: return 'var(--color-success)';
    }
  };

  const riskColor = getRiskColor(level);

  return (
    <div className="soc-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div className="soc-card-header">
        <span className="soc-card-title">
          <AlertOctagon size={18} color={riskColor} />
          <span>Risk Score</span>
        </span>
        <span className="soc-badge assessed">ASSESSED</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '0.75rem 0 1rem 0' }}>
        <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '50%', background: `conic-gradient(${riskColor} 0% ${risk}%, #1e293b ${risk}% 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${riskColor}33` }}>
          <div style={{ width: '82px', height: '82px', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{risk}</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>OUT OF 100</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: riskColor, letterSpacing: '0.05em' }}>
            {level} RISK
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Calculated based on DH-2048 key exchange size and unencrypted outer IP metadata exposure.
          </p>
        </div>
      </div>

      <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
        <Info size={16} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <span>
          <strong>Risk vs Security Score:</strong> Security score evaluates cryptographic correctness; Risk score measures potential threat impact and exposure.
        </span>
      </div>
    </div>
  );
};
