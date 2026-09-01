import React from 'react';
import { useAnalysisContext } from '../context/AnalysisContext';
import { BrainCircuit, Sparkles, Activity, CheckCircle2 } from 'lucide-react';

export const AIInsightsPage = () => {
  const { currentAnalysis } = useAnalysisContext();
  const aiData = currentAnalysis?.aiExplanations || { observableFeatures: [] };
  const trafficType = currentAnalysis?.trafficAnalysis?.predictedType || 'Encrypted Traffic';
  const confidence = currentAnalysis?.trafficAnalysis?.confidence || 0;
  const filename = currentAnalysis?.captureInfo?.filename || 'Active Capture';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="soc-card">
        <div className="soc-card-header">
          <span className="soc-card-title">
            <BrainCircuit size={18} color="var(--accent-purple)" />
            <span>AI Model Evidence & Feature Explanation ({filename})</span>
          </span>
          <span className="soc-badge ai-predicted">{trafficType} ({confidence}% Conf.)</span>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Statistical feature importance attribution explaining why the classifier predicted <strong style={{ color: 'var(--accent-purple)' }}>{trafficType}</strong> inside the encrypted IPsec tunnel without decrypting ESP payloads.
        </p>

        <div className="soc-table-container">
          <table className="soc-table">
            <thead>
              <tr>
                <th>Observable Feature</th>
                <th>Measured Value</th>
                <th>Importance</th>
                <th>Model Explanation</th>
              </tr>
            </thead>
            <tbody>
              {(aiData.observableFeatures || []).map((feat, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{feat.feature}</td>
                  <td className="font-mono" style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{feat.value}</td>
                  <td>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(168, 85, 247, 0.15)', color: 'var(--accent-purple)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                      {feat.importance}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{feat.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
