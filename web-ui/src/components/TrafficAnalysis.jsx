import React from 'react';
import { Activity, Sparkles, ShieldAlert, BarChart3, Info } from 'lucide-react';
import { formatBytes, formatPackets } from '../utils/formatters';

export const TrafficAnalysis = ({ trafficData }) => {
  const data = trafficData || {
    predictedType: "VoIP",
    confidence: 87,
    distribution: [
      { category: "VoIP", probability: 87 },
      { category: "Web Browsing", probability: 6 },
      { category: "Messaging", probability: 4 },
      { category: "File Transfer", probability: 2 },
      { category: "Other", probability: 1 }
    ],
    metrics: {
      packetsPerSec: 67.8,
      bytesPerSec: 80922,
      avgPacketSize: 1193,
      flowDurationSeconds: 184,
      upstreamBytes: 7120400,
      downstreamBytes: 7769328,
      interArrivalTimeMs: 14.7,
      flowCount: 1,
      directionRatio: 1.09
    },
    timeline: [
      { timestamp: "00:00", packets: 120, pps: 60 },
      { timestamp: "00:30", packets: 340, pps: 68 },
      { timestamp: "01:00", packets: 670, pps: 71 },
      { timestamp: "01:30", packets: 980, pps: 66 },
      { timestamp: "02:00", packets: 1350, pps: 74 },
      { timestamp: "02:30", packets: 1620, pps: 64 },
      { timestamp: "03:00", packets: 1980, pps: 70 }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner Disclaimer */}
      <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '0.85rem 1.2rem', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <Info size={20} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Zero-Payload Decryption Privacy Guarantee:</strong> Traffic classification is performed strictly using observable statistical features (packet inter-arrival times, payload length variance, burst rates). Encrypted ESP payloads are never decrypted.
        </span>
      </div>

      <div className="grid-2">
        {/* Predicted Traffic Card */}
        <div className="soc-card">
          <div className="soc-card-header">
            <span className="soc-card-title">
              <Sparkles size={18} color="var(--accent-purple)" />
              <span>Predicted Traffic Payload</span>
            </span>
            <span className="soc-badge ai-predicted">AI PREDICTED</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0.75rem 0 1.25rem 0', background: 'var(--bg-secondary)', padding: '1rem 1.25rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Primary Classification</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                {data.predictedType}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-purple)' }}>{data.confidence}%</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Confidence Score</div>
            </div>
          </div>

          {/* Probability Distribution */}
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
            Probability Distribution
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {data.distribution.map((item, idx) => (
              <div key={idx} style={{ fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{item.category}</span>
                  <span className="font-mono" style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>{item.probability}%</span>
                </div>
                <div style={{ height: '6px', width: '100%', background: 'var(--bg-input)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.probability}%`, background: idx === 0 ? 'var(--accent-purple)' : 'var(--border-color)' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Metrics Grid */}
        <div className="soc-card">
          <div className="soc-card-header">
            <span className="soc-card-title">
              <Activity size={18} color="var(--accent-cyan)" />
              <span>Flow Metrics & Features</span>
            </span>
            <span className="soc-badge inferred">INFERRED METRICS</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Packet Rate</div>
              <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{data.metrics.packetsPerSec} pps</div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Throughput</div>
              <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{formatBytes(data.metrics.bytesPerSec)}/s</div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg Packet Size</div>
              <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{data.metrics.avgPacketSize} Bytes</div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Inter-Arrival Time</div>
              <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{data.metrics.interArrivalTimeMs} ms</div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Upstream Traffic</div>
              <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{formatBytes(data.metrics.upstreamBytes)}</div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Downstream Traffic</div>
              <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{formatBytes(data.metrics.downstreamBytes)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Rate Timeline SVG */}
      <div className="soc-card">
        <div className="soc-card-header">
          <span className="soc-card-title">
            <BarChart3 size={18} color="var(--accent-cyan)" />
            <span>Packet Activity Timeline</span>
          </span>
          <span className="soc-badge observed">PACKETS / SEC</span>
        </div>

        <div style={{ height: '180px', width: '100%', marginTop: '1rem', position: 'relative' }}>
          <svg width="100%" height="100%" viewBox="0 0 600 150" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M 0 120 L 80 80 L 160 50 L 240 70 L 320 30 L 400 90 L 480 40 L 560 60 L 600 60 L 600 150 L 0 150 Z"
              fill="url(#chartGrad)"
            />
            <path
              d="M 0 120 L 80 80 L 160 50 L 240 70 L 320 30 L 400 90 L 480 40 L 560 60 L 600 60"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
