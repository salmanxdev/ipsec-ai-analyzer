import React from 'react';
import { useAnalysisContext } from '../context/AnalysisContext';
import { PCAPUploader } from '../components/analysis/PCAPUploader';
import { LiveCapturePanel } from '../components/analysis/LiveCapturePanel';
import { FileUp, Radio } from 'lucide-react';

export const Analyze = () => {
  const { activeAnalysisMode, setActiveAnalysisMode } = useAnalysisContext();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Mode Selector Header */}
      <div className="soc-card" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveAnalysisMode('pcap')}
            className={`soc-btn ${activeAnalysisMode === 'pcap' ? 'soc-btn-primary' : 'soc-btn-secondary'}`}
          >
            <FileUp size={16} />
            <span>PCAP Upload Mode</span>
          </button>

          <button
            onClick={() => setActiveAnalysisMode('live')}
            className={`soc-btn ${activeAnalysisMode === 'live' ? 'soc-btn-primary' : 'soc-btn-secondary'}`}
          >
            <Radio size={16} />
            <span>Live Capture Mode</span>
          </button>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Mode: <strong style={{ color: 'var(--accent-cyan)' }}>{activeAnalysisMode.toUpperCase()} ANALYSIS</strong>
        </div>
      </div>

      {/* Render Active Mode */}
      {activeAnalysisMode === 'pcap' ? <PCAPUploader /> : <LiveCapturePanel />}
    </div>
  );
};
