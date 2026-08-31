import React, { useState } from 'react';
import { Settings as SettingsIcon, Server, Shield, CheckCircle } from 'lucide-react';

export const Settings = () => {
  const [apiUrl, setApiUrl] = useState('http://localhost:5000/api');
  const [minDhGroup, setMinDhGroup] = useState('MODP-2048');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="soc-card" style={{ maxWidth: '800px' }}>
      <div className="soc-card-header">
        <span className="soc-card-title">
          <SettingsIcon size={18} color="var(--accent-cyan)" />
          <span>Platform & Analyzer Settings</span>
        </span>
        <span className="soc-badge assessed">CONFIG</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
            Analyzer Backend Bridge API Base URL
          </label>
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '0.65rem 0.85rem',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem'
            }}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
            The Web UI will forward PCAP files and live capture triggers to this Python bridge service.
          </span>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
            Minimum Compliant DH Group Policy Threshold
          </label>
          <select
            value={minDhGroup}
            onChange={(e) => setMinDhGroup(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '0.65rem 0.85rem',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem'
            }}
          >
            <option value="MODP-2048">MODP-2048 (Group 14) - Standard</option>
            <option value="MODP-3072">MODP-3072 (Group 15) - High Security</option>
            <option value="ECP-384">ECP-384 (Group 20) - Elliptic Curve</option>
          </select>
        </div>

        <button onClick={handleSave} className="soc-btn soc-btn-primary" style={{ alignSelf: 'flex-start' }}>
          {saved ? <CheckCircle size={16} /> : <Server size={16} />}
          <span>{saved ? 'Settings Saved' : 'Save Configurations'}</span>
        </button>
      </div>
    </div>
  );
};
