import React, { useState } from 'react';
import { Radio, Play, Square, Cpu, ShieldCheck, Activity } from 'lucide-react';
import { useAnalysisContext } from '../../context/AnalysisContext';
import { formatPackets } from '../../utils/formatters';

export const LiveCapturePanel = () => {
  const { isCapturing, liveState, startLiveCapture, stopLiveCapture } = useAnalysisContext();
  const [selectedIface, setSelectedIface] = useState('eth0');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Controls Card */}
      <div className="soc-card">
        <div className="soc-card-header">
          <span className="soc-card-title">
            <Radio size={18} color={isCapturing ? 'var(--color-success)' : 'var(--accent-cyan)'} />
            <span>Live Capture Configuration</span>
          </span>
          {isCapturing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-success)', fontSize: '0.75rem', fontWeight: 700 }}>
              <span className="ping-indicator" style={{ width: '8px', height: '8px' }}></span>
              <span>CAPTURING ACTIVE</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
              NETWORK INTERFACE
            </label>
            <select
              value={selectedIface}
              onChange={(e) => setSelectedIface(e.target.value)}
              disabled={isCapturing}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '0.55rem 1rem',
                borderRadius: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem'
              }}
            >
              <option value="eth0">eth0 (Primary Ethernet)</option>
              <option value="wlan0">wlan0 (Wireless Interface)</option>
              <option value="lo">lo (Loopback Testbed)</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            {!isCapturing ? (
              <button onClick={() => startLiveCapture(selectedIface)} className="soc-btn soc-btn-primary">
                <Play size={16} />
                <span>Start Capture</span>
              </button>
            ) : (
              <button onClick={stopLiveCapture} className="soc-btn soc-btn-danger">
                <Square size={16} />
                <span>Stop Capture</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Packet Counters Grid */}
      <div className="grid-4">
        <div className="soc-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Packets</div>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>
            {formatPackets(liveState.packets)}
          </div>
        </div>

        <div className="soc-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>IKE Packets</div>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-purple)', marginTop: '0.2rem' }}>
            {formatPackets(liveState.ike)}
          </div>
        </div>

        <div className="soc-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ESP Packets</div>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '0.2rem' }}>
            {formatPackets(liveState.esp)}
          </div>
        </div>

        <div className="soc-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>AH Packets</div>
          <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {formatPackets(liveState.ah)}
          </div>
        </div>
      </div>

      {/* Live Stream Console Feed */}
      <div className="soc-card">
        <div className="soc-card-header">
          <span className="soc-card-title">
            <Activity size={18} color="var(--accent-cyan)" />
            <span>Live Capture Event Console</span>
          </span>
          <span className="soc-badge observed">CONSOLE STREAM</span>
        </div>

        <div className="font-mono" style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--color-success)', minHeight: '160px', maxHeight: '240px', overflowY: 'auto' }}>
          {liveState.logs.length === 0 ? (
            <span style={{ color: 'var(--text-muted)' }}>Console idle. Click 'Start Capture' to initiate live interface polling.</span>
          ) : (
            liveState.logs.map((log, i) => <div key={i} style={{ marginBottom: '0.3rem' }}>{log}</div>)
          )}
        </div>
      </div>
    </div>
  );
};
