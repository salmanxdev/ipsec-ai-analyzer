import React, { useState } from 'react';
import { FileText, Download, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { reportService } from '../services/reportService';

export const ReportActions = ({ analysisId }) => {
  const [activeReport, setActiveReport] = useState(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async (type) => {
    setGenerating(true);
    try {
      if (type === 'EXECUTIVE') {
        const rep = await reportService.generateExecutiveReport(analysisId);
        setActiveReport(rep);
      } else {
        const rep = await reportService.generateTechnicalReport(analysisId);
        setActiveReport(rep);
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (format) => {
    if (activeReport) {
      reportService.downloadReportFile(activeReport, format);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="grid-2">
        {/* Executive Report Card */}
        <div className="soc-card">
          <div className="soc-card-header">
            <span className="soc-card-title">
              <Sparkles size={18} color="var(--accent-purple)" />
              <span>Executive Security Report</span>
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MANAGEMENT SUMMARY</span>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            High-level overview suitable for CISOs, leadership, and auditors. Summarizes overall security score, risk level, major threats, and recommendations.
          </p>

          <button
            onClick={() => handleGenerate('EXECUTIVE')}
            disabled={generating}
            className="soc-btn soc-btn-primary"
            style={{ width: '100%' }}
          >
            <FileText size={16} />
            <span>Generate Executive Report</span>
          </button>
        </div>

        {/* Technical Report Card */}
        <div className="soc-card">
          <div className="soc-card-header">
            <span className="soc-card-title">
              <ShieldAlert size={18} color="var(--accent-cyan)" />
              <span>Technical Audit Report</span>
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FORENSIC DETAILS</span>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Comprehensive analysis report for network security engineers. Includes IKE/ESP parameters, SA states, cipher ratings, AI feature importance, and threat matrix.
          </p>

          <button
            onClick={() => handleGenerate('TECHNICAL')}
            disabled={generating}
            className="soc-btn soc-btn-secondary"
            style={{ width: '100%' }}
          >
            <FileText size={16} />
            <span>Generate Technical Report</span>
          </button>
        </div>
      </div>

      {/* Generated Report Preview Area */}
      {activeReport && (
        <div className="soc-card" style={{ border: '1px solid var(--border-accent)' }}>
          <div className="soc-card-header">
            <span className="soc-card-title">
              <CheckCircle size={18} color="var(--color-success)" />
              <span>{activeReport.title} (Preview)</span>
            </span>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => handleDownload('json')} className="soc-btn soc-btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                <Download size={14} />
                <span>JSON Export</span>
              </button>
              <button onClick={() => handleDownload('pdf')} className="soc-btn soc-btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                <Download size={14} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          <pre className="font-mono" style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--accent-cyan)', overflowX: 'auto', maxHeight: '300px' }}>
            {JSON.stringify(activeReport, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
