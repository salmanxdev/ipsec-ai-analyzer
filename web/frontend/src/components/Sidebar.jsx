import React from 'react';
import { useAnalysisContext } from '../context/AnalysisContext';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Search, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  BrainCircuit, 
  FileCode, 
  GitCompare, 
  FileText, 
  History, 
  Settings,
  Radio,
  FileCheck
} from 'lucide-react';

export const Sidebar = () => {
  const { activePage, setActivePage, setActiveAnalysisMode } = useAnalysisContext();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'analyze', 
      label: 'Analyze', 
      icon: Search,
      subItems: [
        { id: 'pcap', label: 'PCAP Analysis', mode: 'pcap', icon: FileCheck },
        { id: 'live', label: 'Live Analysis', mode: 'live', icon: Radio }
      ]
    },
    { id: 'traffic', label: 'Traffic Analysis', icon: Activity },
    { id: 'security', label: 'Security Assessment', icon: ShieldCheck },
    { id: 'threats', label: 'Threat Matrix', icon: AlertTriangle },
    { id: 'ai', label: 'AI Insights', icon: BrainCircuit },
    { id: 'evidence', label: 'Evidence', icon: FileCode },
    { id: 'compare', label: 'Compare', icon: GitCompare },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside style={{ width: 'var(--sidebar-width)', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
      {/* Brand Header */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(56, 189, 248, 0.3)' }}>
          <ShieldAlert size={20} color="#ffffff" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.02em', color: 'var(--text-primary)' }}>IPsec AI</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 600, letterSpacing: '0.1em' }}>ANALYZER</div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <div key={item.id} style={{ marginBottom: '0.25rem' }}>
              <button
                onClick={() => {
                  setActivePage(item.id);
                  if (item.id === 'analyze') setActiveAnalysisMode('pcap');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--accent-cyan)' : '3px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={18} />
                <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
              </button>

              {/* Sub items if any */}
              {item.subItems && (activePage === 'analyze' || isActive) && (
                <div style={{ marginLeft: '1.75rem', marginTop: '0.25rem', borderLeft: '1px dashed var(--border-color)', paddingLeft: '0.5rem' }}>
                  {item.subItems.map((sub) => {
                    const SubIcon = sub.icon;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setActivePage('analyze');
                          setActiveAnalysisMode(sub.mode);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.45rem 0.65rem',
                          fontSize: '0.8rem',
                          color: 'var(--text-secondary)',
                          borderRadius: '4px'
                        }}
                      >
                        <SubIcon size={14} />
                        <span>{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer info */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success)' }}></div>
          <span>Analyzer API Ready</span>
        </div>
        <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>v1.0.0-frontend</div>
      </div>
    </aside>
  );
};
