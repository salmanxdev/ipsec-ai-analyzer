import React, { useState } from 'react';
import { Lock, HelpCircle, ChevronDown, ChevronUp, CheckCircle, Info } from 'lucide-react';

export const VPNConfiguration = ({ vpnData }) => {
  const [expandedKey, setExpandedKey] = useState(null);

  const data = vpnData || {
    protocol: "IPsec",
    ikeVersion: "IKEv2",
    operatingMode: "Tunnel Mode",
    ipVersion: "IPv4",
    keyExchange: "Diffie-Hellman",
    dhGroup: "MODP-2048 (Group 14)",
    encryption: "AES-128-CBC",
    authentication: "HMAC-SHA256",
    pfs: "Enabled",
    replayProtection: "Enabled (64-bit window)"
  };

  const propertyDetails = {
    protocol: {
      label: "VPN Protocol",
      value: data.protocol,
      sourceTag: "OBSERVED",
      conf: "100%",
      explanation: "Internet Protocol Security (IPsec) standardsuite used for authenticating and encrypting IP packets.",
      details: "Observed through ISAKMP / IKE (UDP port 500/4500) and ESP protocol headers (IP Protocol 50)."
    },
    ikeVersion: {
      label: "IKE Version",
      value: data.ikeVersion,
      sourceTag: "OBSERVED",
      conf: "100%",
      explanation: "Internet Key Exchange v2 defined in RFC 7296.",
      details: "IKEv2 features lower latency setup, built-in NAT traversal, and higher resilience to DoS attacks compared to IKEv1."
    },
    operatingMode: {
      label: "Operating Mode",
      value: data.operatingMode,
      sourceTag: "OBSERVED",
      conf: "98%",
      explanation: "Tunnel mode encrypts both the original IP payload and the original IP header.",
      details: "Outer IP header contains endpoint gateway IPs; inner encapsulated payload carries local subnet traffic."
    },
    ipVersion: {
      label: "IP Version",
      value: data.ipVersion,
      sourceTag: "OBSERVED",
      conf: "100%",
      explanation: "IPv4 network layer address space.",
      details: "Packets use 32-bit source and destination network addressing."
    },
    keyExchange: {
      label: "Key Exchange",
      value: data.keyExchange,
      sourceTag: "OBSERVED",
      conf: "100%",
      explanation: "Asymmetric mathematical algorithm allowing two parties to establish a shared secret over an insecure channel.",
      details: "Executed during IKE_SA_INIT phase."
    },
    dhGroup: {
      label: "DH Group",
      value: data.dhGroup,
      sourceTag: "OBSERVED",
      conf: "100%",
      explanation: "Modular Exponential 2048-bit prime key exchange group (Group 14).",
      details: "Offers 112 bits of equivalent security strength. Upgrades to Group 15 (MODP-3072) or ECP-384 are recommended."
    },
    encryption: {
      label: "Encryption Cipher",
      value: data.encryption,
      sourceTag: "OBSERVED",
      conf: "100%",
      explanation: "Advanced Encryption Standard with 128-bit key in Cipher Block Chaining mode.",
      details: "Symmetric cipher requiring Initialization Vectors (IV) for block randomness."
    },
    authentication: {
      label: "Integrity / Auth",
      value: data.authentication,
      sourceTag: "OBSERVED",
      conf: "100%",
      explanation: "Hash-based Message Authentication Code with SHA-256 algorithm.",
      details: "Truncated to 128 bits in ESP trailer for data integrity verification."
    },
    pfs: {
      label: "Perfect Forward Secrecy",
      value: data.pfs,
      sourceTag: "ASSESSED",
      conf: "100%",
      explanation: "Ensures compromise of long-term secret keys does not compromise past session keys.",
      details: "Child SA performs fresh DH exchange during rekeying."
    },
    replayProtection: {
      label: "Replay Protection",
      value: data.replayProtection,
      sourceTag: "ASSESSED",
      conf: "100%",
      explanation: "Sequence number window tracking to block replayed packets.",
      details: "Anti-replay window size set to 64 packets in XFRM engine."
    }
  };

  return (
    <div className="soc-card">
      <div className="soc-card-header">
        <span className="soc-card-title">
          <Lock size={18} color="var(--accent-cyan)" />
          <span>Protocol & VPN Configuration</span>
        </span>
        <span className="soc-badge observed">OBSERVED CONFIG</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {Object.entries(propertyDetails).map(([key, prop]) => {
          const isExpanded = expandedKey === key;

          return (
            <div 
              key={key} 
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '0.85rem 1rem',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {prop.label}
                </span>
                <span className={`soc-badge ${prop.sourceTag.toLowerCase().replace(' ', '-')}`} style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>
                  {prop.sourceTag}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {prop.value}
                </div>

                <button
                  onClick={() => setExpandedKey(isExpanded ? null : key)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}
                >
                  <span>Details</span>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                {prop.explanation}
              </div>

              {/* Expandable Explanation Details */}
              {isExpanded && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px dashed var(--border-color)', fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg-card)', padding: '0.6rem', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '0.25rem' }}>
                    <Info size={14} />
                    <span>Technical Explanation</span>
                  </div>
                  <p>{prop.details}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
