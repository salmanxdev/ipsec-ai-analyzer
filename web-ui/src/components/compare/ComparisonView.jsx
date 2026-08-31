import React from 'react';
import { GitCompare, ShieldCheck, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { mockComparisonData } from '../../mock/mockData';

export const ComparisonView = () => {
  const { configA, configB } = mockComparisonData;

  const compareRows = [
    { label: "Security Score", a: `${configA.securityScore} / 100`, b: `${configB.securityScore} / 100`, better: 'b' },
    { label: "Risk Score", a: `${configA.riskScore} / 100 (Medium)`, b: `${configB.riskScore} / 100 (Low)`, better: 'b' },
    { label: "Cipher Suite Strength", a: configA.cipherStrength, b: configB.cipherStrength, better: 'b' },
    { label: "Encryption Algorithm", a: configA.encryption, b: configB.encryption, better: 'b' },
    { label: "Integrity / Auth", a: configA.authentication, b: configB.authentication, better: 'b' },
    { label: "Diffie-Hellman Group", a: configA.dhGroup, b: configB.dhGroup, better: 'b' },
    { label: "Perfect Forward Secrecy", a: configA.pfs, b: configB.pfs, better: 'equal' },
    { label: "Replay Protection Window", a: configA.replayProtection, b: configB.replayProtection, better: 'b' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="soc-card">
        <div className="soc-card-header">
          <span className="soc-card-title">
            <GitCompare size={18} color="var(--accent-cyan)" />
            <span>VPN Configuration Comparative Analysis</span>
          </span>
          <span className="soc-badge assessed">EXPERIMENT COMPARISON</span>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Evaluate security score improvements and risk reduction between alternative VPN testbed variations.
        </p>

        <div className="soc-table-container">
          <table className="soc-table">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Evaluation Metric</th>
                <th style={{ width: '35%', color: 'var(--accent-cyan)' }}>{configA.name}</th>
                <th style={{ width: '35%', color: 'var(--accent-emerald)' }}>{configB.name}</th>
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row.label}</td>
                  <td className="font-mono" style={{ color: row.better === 'a' ? 'var(--color-success)' : 'var(--text-secondary)' }}>
                    {row.a}
                  </td>
                  <td className="font-mono" style={{ color: row.better === 'b' ? 'var(--color-success)' : 'var(--text-secondary)', fontWeight: row.better === 'b' ? 700 : 400 }}>
                    {row.b}
                    {row.better === 'b' && <CheckCircle2 size={14} color="var(--color-success)" style={{ display: 'inline', marginLeft: '0.4rem' }} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
