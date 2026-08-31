import React from 'react';
import { Network, Server, Laptop, ShieldCheck, ArrowRightLeft } from 'lucide-react';

export const VPNTopology = ({ topology }) => {
  const top = topology || {
    clientIp: "10.0.2.4",
    clientPort: 4500,
    serverIp: "10.0.2.5",
    serverPort: 4500,
    clientSubnet: "10.0.2.0/24",
    serverSubnet: "10.0.3.0/24",
    tunnelState: "ESTABLISHED",
    activeSaCount: 2
  };

  return (
    <div className="soc-card">
      <div className="soc-card-header">
        <span className="soc-card-title">
          <Network size={18} color="var(--accent-cyan)" />
          <span>VPN Session Topology</span>
        </span>
        <span className="soc-badge observed">OBSERVED SESSION</span>
      </div>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '1.5rem', border: '1px solid var(--border-color)', margin: '0.5rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* CLIENT Node */}
          <div style={{ flex: 1, textAlign: 'center', background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
              <Laptop size={22} color="var(--accent-cyan)" />
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>CLIENT GATEWAY</div>
            <div className="font-mono" style={{ fontSize: '0.95rem', color: 'var(--accent-cyan)', fontWeight: 700, marginTop: '0.2rem' }}>
              {top.clientIp}:{top.clientPort}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Subnet: {top.clientSubnet}</div>
          </div>

          {/* TUNNEL CENTER */}
          <div style={{ flex: 1.5, padding: '0 1.5rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--color-success)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <ShieldCheck size={16} />
              <span>IPsec TUNNEL ESTABLISHED</span>
            </div>

            <div style={{ position: 'relative', height: '10px', background: 'linear-gradient(90deg, #0284c7 0%, #10b981 50%, #0284c7 100%)', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowRightLeft size={16} color="#ffffff" style={{ background: 'var(--bg-primary)', borderRadius: '50%', padding: '2px' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
              <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', background: 'var(--bg-card)', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                IKEv2 (Port 4500)
              </span>
              <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.12)', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                ESP Encapsulated
              </span>
            </div>
          </div>

          {/* SERVER Node */}
          <div style={{ flex: 1, textAlign: 'center', background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(52, 211, 153, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
              <Server size={22} color="var(--accent-emerald)" />
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>REMOTE PEER</div>
            <div className="font-mono" style={{ fontSize: '0.95rem', color: 'var(--accent-emerald)', fontWeight: 700, marginTop: '0.2rem' }}>
              {top.serverIp}:{top.serverPort}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Subnet: {top.serverSubnet}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
