import React, { useState } from 'react';
import { AlertTriangle, Filter, CheckCircle2 } from 'lucide-react';

export const ThreatMatrix = ({ threats }) => {
  const [filterSev, setFilterSev] = useState('ALL');

  const threatList = threats || [
    {
      id: "TH-01",
      threat: "Moderate Diffie-Hellman Group Strength",
      severity: "MEDIUM",
      evidence: "MODP-2048 (Group 14) identified in IKE_SA_INIT exchange",
      impact: "Sufficient for standard threat models, but vulnerable to future quantum/pre-computation risks",
      recommendation: "Upgrade DH Group to MODP-3072 (Group 15) or ECP-384 (Group 20)",
      status: "OPEN"
    },
    {
      id: "TH-02",
      threat: "CBC Cipher Mode Utilization",
      severity: "LOW",
      evidence: "AES-128-CBC selected instead of AEAD cipher suite",
      impact: "Requires separate HMAC calculation and vulnerable to padding oracle attacks if improperly implemented",
      recommendation: "Transition to AEAD mode such as AES-128-GCM or AES-256-GCM",
      status: "OPEN"
    },
    {
      id: "TH-03",
      threat: "Unencrypted Endpoint IP Metadata",
      severity: "INFO",
      evidence: "Outer IP header exposed 10.0.2.4 ↔ 10.0.2.5",
      impact: "Traffic flow endpoints and activity times are observable to network eavesdroppers",
      recommendation: "Consider routing traffic through an anonymizing gateway or overlay if required",
      status: "ACKNOWLEDGED"
    }
  ];

  const filtered = filterSev === 'ALL' ? threatList : threatList.filter(t => t.severity === filterSev);

  return (
    <div className="soc-card">
      <div className="soc-card-header">
        <span className="soc-card-title">
          <AlertTriangle size={18} color="var(--color-warning)" />
          <span>Threat & Risk Matrix</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={14} color="var(--text-muted)" />
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSev(sev)}
              style={{
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.7rem',
                fontWeight: 600,
                background: filterSev === sev ? 'var(--accent-cyan)' : 'var(--bg-secondary)',
                color: filterSev === sev ? 'var(--text-inverse)' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)'
              }}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      <div className="soc-table-container">
        <table className="soc-table">
          <thead>
            <tr>
              <th>Threat</th>
              <th>Severity</th>
              <th>Evidence</th>
              <th>Impact</th>
              <th>Recommendation</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id}>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.threat}</td>
                <td>
                  <span className={`sev-badge ${t.severity.toLowerCase()}`}>{t.severity}</span>
                </td>
                <td className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.evidence}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{t.impact}</td>
                <td style={{ color: 'var(--accent-cyan)' }}>{t.recommendation}</td>
                <td>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: t.status === 'OPEN' ? 'var(--color-warning)' : 'var(--color-success)' }}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
