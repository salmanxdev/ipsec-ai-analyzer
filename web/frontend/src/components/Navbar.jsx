import React from 'react';
import { useAnalysisContext } from '../context/AnalysisContext';
import { FileUp, Radio, ShieldCheck, Cpu } from 'lucide-react';

export const Navbar = () => {
  const { currentAnalysis, isCapturing, setActivePage, setActiveAnalysisMode } = useAnalysisContext();

  return (
    <header style={{ height: 'var(--header-height)', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* Session summary indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
          <ShieldCheck size={16} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Active Capture:</span>
          <span className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
            {currentAnalysis?.captureInfo?.filename || 'No Active File'}
          </span>
        </div>

        {isCapturing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)', padding: '0.35rem 0.75rem', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.75rem', fontWeight: 700 }}>
            <span className="ping-indicator" style={{ width: '8px', height: '8px' }}></span>
            <span>LIVE CAPTURING ON eth0</span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={() => {
            setActivePage('analyze');
            setActiveAnalysisMode('pcap');
          }}
          className="soc-btn soc-btn-secondary"
        >
          <FileUp size={15} />
          <span>Analyze PCAP</span>
        </button>

        <button
          onClick={() => {
            setActivePage('analyze');
            setActiveAnalysisMode('live');
          }}
          className="soc-btn soc-btn-primary"
        >
          <Radio size={15} />
          <span>Live Capture</span>
        </button>
      </div>
    </header>
  );
};
