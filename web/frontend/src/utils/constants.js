export const SOURCE_TAGS = {
  OBSERVED: { label: 'OBSERVED', key: 'observed', description: 'Extracted directly from packet headers' },
  INFERRED: { label: 'INFERRED', key: 'inferred', description: 'Inferred from observable flow metadata' },
  AI_PREDICTED: { label: 'AI PREDICTED', key: 'ai-predicted', description: 'Predicted by ML model' },
  ASSESSED: { label: 'ASSESSED', key: 'assessed', description: 'Evaluated against security policy rules' }
};

export const SEVERITY_LEVELS = {
  CRITICAL: { label: 'CRITICAL', color: '#f87171' },
  HIGH: { label: 'HIGH', color: '#fb923c' },
  MEDIUM: { label: 'MEDIUM', color: '#facc15' },
  LOW: { label: 'LOW', color: '#38bdf8' },
  INFO: { label: 'INFO', color: '#94a3b8' }
};

export const CIPHER_STRENGTH = {
  STRONG: { label: 'STRONG', color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)' },
  ACCEPTABLE: { label: 'ACCEPTABLE', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' },
  WEAK: { label: 'WEAK', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  CRITICAL: { label: 'CRITICAL', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' }
};

export const ANALYSIS_MODES = {
  PCAP: 'pcap',
  LIVE: 'live',
  HISTORY: 'history'
};

export const TRAFFIC_CATEGORIES = [
  'VoIP',
  'Web Browsing',
  'Messaging',
  'Email',
  'ICMP',
  'File Transfer',
  'Video Streaming',
  'DNS',
  'Other'
];
