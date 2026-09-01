import React, { useState } from 'react';
import { UploadCloud, FileCheck, Play, Sparkles, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { useAnalysisContext } from '../../context/AnalysisContext';

const DEMO_PRESETS = [
  {
    name: 'ipsec_ikev1_legacy_weak.pcap',
    label: 'IKEv1 Legacy Weak (3DES + MD5)',
    badge: 'CRITICAL RISK',
    badgeColor: 'var(--color-danger)',
    desc: 'Demonstrates deprecated IKEv1, 3DES cipher, HMAC-MD5, and MODP-1024'
  },
  {
    name: 'ipsec_ikev2_file_transfer.pcap',
    label: 'IKEv2 File Transfer (AES-256-GCM)',
    badge: 'EXCELLENT',
    badgeColor: 'var(--color-success)',
    desc: 'High throughput file transfer with modern AEAD encryption'
  },
  {
    name: 'ipsec_ikev2_voip_tunnel.pcap',
    label: 'IKEv2 VoIP Stream (AES-128-CBC)',
    badge: 'GOOD / 88% VoIP',
    badgeColor: 'var(--accent-cyan)',
    desc: 'Periodic RTP audio frame pattern with standard AES-128-CBC tunnel'
  },
  {
    name: 'ipsec_natt_mobile_vpn.pcap',
    label: 'Mobile Client (NAT-T / UDP 4500)',
    badge: 'NAT TRAVERSAL',
    badgeColor: 'var(--accent-purple)',
    desc: 'NAT-T encapsulation, port 4500 keepalives, and mobile roaming session'
  },
  {
    name: 'ipsec_ikev2_web_browsing.pcap',
    label: 'IKEv2 Web Browsing (AES-128-GCM)',
    badge: 'BURSTY WEB',
    badgeColor: 'var(--color-warning)',
    desc: 'Bursty HTTP request/response patterns over encrypted tunnel'
  }
];

export const PCAPUploader = () => {
  const { startPcapAnalysis, isAnalyzing, analysisProgress } = useAnalysisContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setSelectedPreset(null);
    }
  };

  const handleSelectPreset = (presetName) => {
    setSelectedPreset(presetName);
    setSelectedFile(null);
  };

  const handleStart = () => {
    if (selectedFile) {
      startPcapAnalysis(selectedFile);
    } else if (selectedPreset) {
      startPcapAnalysis({ name: selectedPreset, isPreset: true });
    } else {
      // Default to first demo preset if neither picked
      startPcapAnalysis({ name: DEMO_PRESETS[0].name, isPreset: true });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px', margin: '0 auto' }}>
      <div className="soc-card">
        <div className="soc-card-header">
          <span className="soc-card-title">
            <UploadCloud size={18} color="var(--accent-cyan)" />
            <span>Upload Network Capture (.pcap / .pcapng)</span>
          </span>
          <span className="soc-badge observed">PCAP MODE</span>
        </div>

        {/* Drag & Drop Area */}
        <div style={{ border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '2rem', textAlign: 'center', background: 'var(--bg-secondary)', marginBottom: '1.25rem', cursor: 'pointer' }}>
          <input type="file" accept=".pcap,.pcapng" onChange={handleFileChange} style={{ display: 'none' }} id="pcap-upload-input" />
          <label htmlFor="pcap-upload-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <UploadCloud size={42} color="var(--accent-cyan)" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                {selectedFile ? selectedFile.name : 'Drag & drop any Wireshark / tcpdump .pcap file here'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Files will be analyzed by the local Python engine in real time
              </div>
            </div>
          </label>
        </div>

        {/* Selected Custom File Details */}
        {selectedFile && (
          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--accent-cyan)', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileCheck size={20} color="var(--color-success)" />
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{selectedFile.name}</div>
                <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {(selectedFile.size / 1024).toFixed(1)} KB (Custom Upload)
                </div>
              </div>
            </div>
            <span className="soc-badge assessed">READY TO ANALYZE</span>
          </div>
        )}

        {/* Preset Demo PCAPs Selector */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="var(--accent-purple)" />
            <span>Or Choose a Generated Demo Scenario:</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
            {DEMO_PRESETS.map((p) => {
              const isSelected = selectedPreset === p.name;
              return (
                <div
                  key={p.name}
                  onClick={() => handleSelectPreset(p.name)}
                  style={{
                    padding: '0.75rem 1rem',
                    background: isSelected ? 'rgba(0, 229, 255, 0.08)' : 'var(--bg-secondary)',
                    border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: isSelected ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                      {p.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      {p.desc}
                    </div>
                  </div>

                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: p.badgeColor, border: `1px solid ${p.badgeColor}`, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {p.badge}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Pipeline */}
        {isAnalyzing && analysisProgress && (
          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-accent)', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              <span>Engine Status: {analysisProgress.stage}</span>
              <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>{analysisProgress.percent}%</span>
            </div>
            <div style={{ height: '6px', width: '100%', background: 'var(--bg-input)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${analysisProgress.percent}%`, background: 'var(--accent-cyan)', transition: 'width 0.3s ease' }}></div>
            </div>
          </div>
        )}

        <button
          onClick={handleStart}
          disabled={isAnalyzing}
          className="soc-btn soc-btn-primary"
          style={{ width: '100%', padding: '0.85rem' }}
        >
          <Play size={18} />
          <span>{isAnalyzing ? 'Executing Python Analysis Pipeline...' : `Run Analysis on ${selectedFile ? selectedFile.name : (selectedPreset || 'Selected PCAP')}`}</span>
        </button>
      </div>
    </div>
  );
};
