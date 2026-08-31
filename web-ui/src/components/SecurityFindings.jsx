import React from 'react';
import { ShieldCheck, Lock, RefreshCw, Eye, Award } from 'lucide-react';
import { CIPHER_STRENGTH } from '../utils/constants';

export const SecurityFindings = ({ securityAssessment }) => {
  const sa = securityAssessment || {
    cryptography: {
      algorithm: "AES-128-CBC",
      keyLengthBits: 128,
      integrity: "HMAC-SHA256",
      cipherRating: "ACCEPTABLE",
      cipherRatingReason: "AES-128-CBC with SHA256 is acceptable for corporate VPNs; GCM mode is recommended."
    },
    saDetails: {
      status: "INSTANTIATED",
      initiatorSpi: "0x7a3f891b9c2041e2",
      responderSpi: "0xf412b083d91785ab",
      espSpiInbound: "0xc849102f",
      espSpiOutbound: "0xd910427a",
      mode: "Tunnel",
      direction: "Bi-directional",
      trafficSelectors: "10.0.2.0/24 === 10.0.3.0/24"
    },
    keyLifetimes: {
      ikeSaLifetimeSec: 86400,
      childSaLifetimeSec: 28800,
      rekeyIntervalSec: 3600,
      lifetimeStatus: "COMPLIANT"
    },
    replayProtection: {
      enabled: true,
      windowSizeBits: 64,
      replayEventsCount: 0,
      status: "OPTIMAL"
    },
    forwardSecrecy: {
      pfsEnabled: true,
      dhGroup: "MODP-2048",
      riskLevel: "LOW"
    },
    metadataExposure: {
      endpointVisibility: "EXPOSED (Public WAN IPs)",
      packetTimingPattern: "PERIODIC (RTP Audio Frame Cadence)",
      packetSizeVariance: "LOW VARIANCE (Fixed payload frame sizes)",
      fingerprintability: "HIGH (Identifiable as IPsec ESP over NAT-T)"
    }
  };

  const ratingInfo = CIPHER_STRENGTH[sa.cryptography.cipherRating] || CIPHER_STRENGTH.ACCEPTABLE;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Cipher Rating */}
      <div className="soc-card">
        <div className="soc-card-header">
          <span className="soc-card-title">
            <Award size={18} color={ratingInfo.color} />
            <span>Cipher Suite Strength Rating</span>
          </span>
          <span className="soc-badge assessed">POLICY EVALUATED</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: ratingInfo.bg, padding: '1rem 1.25rem', borderRadius: '6px', border: `1px solid ${ratingInfo.color}44` }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Overall Rating</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: ratingInfo.color }}>
              {sa.cryptography.cipherRating}
            </div>
          </div>

          <div style={{ maxWidth: '600px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
            {sa.cryptography.cipherRatingReason}
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Security Association details */}
        <div className="soc-card">
          <div className="soc-card-header">
            <span className="soc-card-title">
              <Lock size={18} color="var(--accent-cyan)" />
              <span>Security Association (SA) Parameters</span>
            </span>
            <span className="soc-badge observed">OBSERVED SA</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Initiator SPI</span>
              <span className="font-mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{sa.saDetails.initiatorSpi}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Responder SPI</span>
              <span className="font-mono" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{sa.saDetails.responderSpi}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>ESP Inbound SPI</span>
              <span className="font-mono" style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{sa.saDetails.espSpiInbound}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>ESP Outbound SPI</span>
              <span className="font-mono" style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{sa.saDetails.espSpiOutbound}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Traffic Selectors</span>
              <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{sa.saDetails.trafficSelectors}</span>
            </div>
          </div>
        </div>

        {/* Key Lifetimes & Protection */}
        <div className="soc-card">
          <div className="soc-card-header">
            <span className="soc-card-title">
              <RefreshCw size={18} color="var(--accent-emerald)" />
              <span>Key Lifetime & Protection</span>
            </span>
            <span className="soc-badge assessed">ASSESSED</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>IKE SA Lifetime</span>
                <span className="font-mono" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>86,400s (24h)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>CHILD SA Lifetime</span>
                <span className="font-mono" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>28,800s (8h)</span>
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Anti-Replay Window</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>64-bit sequence window active</div>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-success)', background: 'rgba(16, 185, 129, 0.15)', padding: '0.25rem 0.6rem', borderRadius: '4px' }}>
                0 REPLAY DROPS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
