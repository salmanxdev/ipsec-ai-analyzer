import React, { useState } from 'react';
import { UploadCloud, FileCheck, Play, CheckCircle2 } from 'lucide-react';
import { useAnalysisContext } from '../../context/AnalysisContext';

export const PCAPUploader = () => {
  const { startPcapAnalysis, isAnalyzing, analysisProgress } = useAnalysisContext();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleStart = () => {
    if (selectedFile) {
      startPcapAnalysis(selectedFile);
    } else {
      // Use default mock file if none dropped
      startPcapAnalysis({ name: 'ipsec_voip_tunnel_01.pcap', size: 14889728 });
    }
  };

  return (
    <div className="soc-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="soc-card-header">
        <span className="soc-card-title">
          <UploadCloud size={18} color="var(--accent-cyan)" />
          <span>Upload Network Capture (.pcap / .pcapng)</span>
        </span>
        <span className="soc-badge observed">PCAP MODE</span>
      </div>

      {/* Drag & Drop Area */}
      <div style={{ border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '2.5rem', textAlign: 'center', background: 'var(--bg-secondary)', marginBottom: '1.5rem', cursor: 'pointer' }}>
        <input type="file" accept=".pcap,.pcapng" onChange={handleFileChange} style={{ display: 'none' }} id="pcap-upload-input" />
        <label htmlFor="pcap-upload-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <UploadCloud size={48} color="var(--accent-cyan)" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
              {selectedFile ? selectedFile.name : 'Drag and drop your PCAP file here, or browse'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Supports standard Wireshark/tcpdump .pcap and .pcapng files up to 500MB
            </div>
          </div>
        </label>
      </div>

      {/* Selected File Details */}
      {selectedFile && (
        <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileCheck size={20} color="var(--color-success)" />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{selectedFile.name}</div>
              <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </div>
            </div>
          </div>

          <span className="soc-badge assessed">READY FOR ANALYSIS</span>
        </div>
      )}

      {/* Progress pipeline during analysis */}
      {isAnalyzing && analysisProgress && (
        <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: '6px', border: '1px solid var(--border-accent)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            <span>Stage: {analysisProgress.stage}</span>
            <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>{analysisProgress.percent}%</span>
          </div>
          <div style={{ height: '8px', width: '100%', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${analysisProgress.percent}%`, background: 'var(--accent-cyan)', transition: 'width 0.3s ease' }}></div>
          </div>
        </div>
      )}

      <button
        onClick={handleStart}
        disabled={isAnalyzing}
        className="soc-btn soc-btn-primary"
        style={{ width: '100%', padding: '0.8rem' }}
      >
        <Play size={18} />
        <span>{isAnalyzing ? 'Processing Pipeline...' : 'Start PCAP Analysis'}</span>
      </button>
    </div>
  );
};
