import React from 'react';
import { useAnalysisContext } from '../context/AnalysisContext';
import { ReportActions } from '../components/ReportActions';
import { FileText, ShieldCheck } from 'lucide-react';

export const Reports = () => {
  const { currentAnalysis } = useAnalysisContext();
  const filename = currentAnalysis.captureInfo?.filename || 'Active Analysis';
  const score = currentAnalysis.scores?.securityScore;
  const grade = currentAnalysis.scores?.securityGrade;
  const cipher = currentAnalysis.vpnDetection?.encryption;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="soc-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="var(--accent-cyan)" />
            <span>Automated Report Generator</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            Target File: <strong style={{ color: 'var(--accent-cyan)' }}>{filename}</strong> | Session: <strong className="font-mono">{currentAnalysis.id}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Security Score</div>
            <div style={{ fontWeight: 800, color: 'var(--accent-cyan)', fontSize: '1.1rem' }}>{score} / 100 ({grade})</div>
          </div>
          <div style={{ textAlign: 'right', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cipher Suite</div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.85rem' }}>{cipher}</div>
          </div>
        </div>
      </div>

      <ReportActions analysisId={currentAnalysis.id} />
    </div>
  );
};
