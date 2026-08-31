import React from 'react';
import { useAnalysisContext } from '../context/AnalysisContext';
import { History, ArrowRight } from 'lucide-react';
import { formatTimestamp } from '../utils/formatters';

export const HistoryPage = () => {
  const { history, selectHistorySession } = useAnalysisContext();

  return (
    <div className="soc-card">
      <div className="soc-card-header">
        <span className="soc-card-title">
          <History size={18} color="var(--accent-cyan)" />
          <span>Analysis Session History</span>
        </span>
        <span className="soc-badge observed">SESSION LOG</span>
      </div>

      <div className="soc-table-container">
        <table className="soc-table">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Date / Time</th>
              <th>Capture Source</th>
              <th>Detected VPN</th>
              <th>Security Score</th>
              <th>Risk Level</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((sess) => (
              <tr key={sess.id}>
                <td className="font-mono" style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{sess.id}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{formatTimestamp(sess.timestamp)}</td>
                <td className="font-mono" style={{ color: 'var(--text-primary)' }}>{sess.source}</td>
                <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{sess.vpnType}</td>
                <td>
                  <span className="font-mono" style={{ fontWeight: 700, color: 'var(--color-success)' }}>{sess.securityScore} / 100</span>
                </td>
                <td>
                  <span className={`sev-badge ${sess.riskLevel.toLowerCase()}`}>{sess.riskLevel}</span>
                </td>
                <td>
                  <button
                    onClick={() => selectHistorySession(sess.id)}
                    className="soc-btn soc-btn-secondary"
                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                  >
                    <span>Load Session</span>
                    <ArrowRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
