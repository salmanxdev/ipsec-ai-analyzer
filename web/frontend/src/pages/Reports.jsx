import React from 'react';
import { useAnalysisContext } from '../context/AnalysisContext';
import { ReportActions } from '../components/ReportActions';

export const Reports = () => {
  const { currentAnalysis } = useAnalysisContext();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="soc-card">
        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Automated Report Generator
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
          Generate cryptographic audit summaries and executive briefing documents for session <strong>{currentAnalysis.id}</strong>.
        </p>
      </div>

      <ReportActions analysisId={currentAnalysis.id} />
    </div>
  );
};
