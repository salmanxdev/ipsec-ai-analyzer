export const mockAnalysisData = {
  id: "sess_20260831_001",
  timestamp: "2026-08-31T03:45:00Z",
  captureInfo: {
    filename: "ipsec_voip_tunnel_01.pcap",
    fileSize: 14889728, // ~14.2 MB
    durationSeconds: 184,
    packetCount: 12482,
    ikePackets: 14,
    espPackets: 11921,
    ahPackets: 0,
    otherPackets: 547,
    udpPackets: 12470,
    tcpPackets: 0,
    icmpPackets: 12,
    uploadStatus: "COMPLETED"
  },
  vpnDetection: {
    protocol: "IPsec",
    ikeVersion: "IKEv2",
    operatingMode: "Tunnel Mode",
    ipVersion: "IPv4",
    keyExchange: "Diffie-Hellman",
    dhGroup: "MODP-2048 (Group 14)",
    encryption: "AES-128-CBC",
    authentication: "HMAC-SHA256",
    pfs: "Enabled",
    replayProtection: "Enabled",
    natTraversal: "Detected (UDP/4500)",
    detectedStatus: "Active Tunnel"
  },
  topology: {
    clientIp: "10.0.2.4",
    clientPort: 4500,
    serverIp: "10.0.2.5",
    serverPort: 4500,
    clientSubnet: "10.0.2.0/24",
    serverSubnet: "10.0.3.0/24",
    tunnelState: "ESTABLISHED",
    activeSaCount: 2
  },
  scores: {
    securityScore: 87,
    securityGrade: "GOOD",
    riskScore: 31,
    riskLevel: "MEDIUM",
    aiConfidence: 91,
    aiConfidenceLevel: "HIGH",
    components: {
      cryptography: 92,
      authentication: 90,
      keyExchange: 85,
      saConfiguration: 88,
      replayProtection: 100,
      forwardSecrecy: 75,
      keyLifetime: 90,
      metadataExposure: 72
    }
  },
  trafficAnalysis: {
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
      { timestamp: "00:00", packets: 120, bytes: 142000, pps: 60 },
      { timestamp: "00:30", packets: 340, bytes: 405000, pps: 68 },
      { timestamp: "01:00", packets: 670, bytes: 801000, pps: 71 },
      { timestamp: "01:30", packets: 980, bytes: 1180000, pps: 66 },
      { timestamp: "02:00", packets: 1350, bytes: 1610000, pps: 74 },
      { timestamp: "02:30", packets: 1620, bytes: 1940000, pps: 64 },
      { timestamp: "03:00", packets: 1980, bytes: 2370000, pps: 70 }
    ]
  },
  securityAssessment: {
    cryptography: {
      algorithm: "AES-128-CBC",
      keyLengthBits: 128,
      integrity: "HMAC-SHA256",
      cipherRating: "ACCEPTABLE",
      cipherRatingReason: "AES-128-CBC with SHA256 is acceptable for corporate VPNs; GCM mode is recommended for higher performance and authenticated encryption."
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
  },
  threatMatrix: [
    {
      id: "TH-01",
      threat: "Moderate Diffie-Hellman Group Strength",
      severity: "MEDIUM",
      evidence: "MODP-2048 (Group 14) identified in IKE_SA_INIT exchange",
      impact: "Sufficient for standard threat models, but vulnerable to future nation-state quantum/pre-computation risks",
      recommendation: "Upgrade DH Group to MODP-3072 (Group 15) or ECP-384 (Group 20)",
      status: "OPEN"
    },
    {
      id: "TH-02",
      threat: "CBC Cipher Mode Utilization",
      severity: "LOW",
      evidence: "AES-128-CBC selected instead of AEAD cipher suite",
      impact: "Requires separate HMAC calculation and vulnerable to padding oracle attacks if improperly implemented",
      recommendation: "Transition to AEAD mode such as AES-128-GCM or AES-256-GCM",
      status: "OPEN"
    },
    {
      id: "TH-03",
      threat: "Unencrypted Endpoint IP Metadata",
      severity: "INFO",
      evidence: "Outer IP header exposed 10.0.2.4 ↔ 10.0.2.5",
      impact: "Traffic flow endpoints and activity times are observable to network eavesdroppers",
      recommendation: "Consider routing traffic through an anonymizing gateway or multi-hop overlay if endpoint privacy is required",
      status: "ACKNOWLEDGED"
    }
  ],
  aiExplanations: {
    protocolConfidence: 96,
    operatingModeConfidence: 94,
    trafficClassificationConfidence: 87,
    observableFeatures: [
      { feature: "Inter-Arrival Time Mean", value: "14.7 ms", importance: "HIGH", description: "Consistent ~15ms packet intervals strongly correlate with VoIP RTP audio framing." },
      { feature: "Packet Size Mode", value: "210 Bytes", importance: "HIGH", description: "Small, fixed packet payload size typical of Opus/G.711 audio codecs." },
      { feature: "Direction Ratio", value: "1.09", importance: "MEDIUM", description: "Symmetric upstream/downstream flow indicates bi-directional voice stream." },
      { feature: "Burst Interval", value: "0.02 s", importance: "LOW", description: "Continuous stream with minimal silent intervals." }
    ]
  },
  evidenceLogs: {
    strongswanLog: `[IKE] initiating IKE_SA net_vpn[1] to 10.0.2.5
[ENC] generating IKE_SA_INIT request 0 [ SA KE No N(NATD_S_IP) N(NATD_D_IP) ]
[NET] sending packet: from 10.0.2.4[500] to 10.0.2.5[500] (432 bytes)
[NET] received packet: from 10.0.2.5[500] to 10.0.2.4[500] (448 bytes)
[ENC] parsed IKE_SA_INIT response 0 [ SA KE No N(NATD_S_IP) N(NATD_D_IP) MULTIPLE_AUTH ]
[IKE] selected proposal: IKE:AES_CBC_128/HMAC_SHA2_256_128/PRF_HMAC_SHA2_256/MODP_2048
[IKE] local host is behind NAT, sending keep-alives to 10.0.2.5[4500]
[IKE] ESTABLISHED IKE_SA net_vpn[1] between 10.0.2.4[10.0.2.4]...10.0.2.5[10.0.2.5]
[IKE] child SA net_vpn{1} established: 10.0.2.0/24 === 10.0.3.0/24`,
    xfrmState: `src 10.0.2.4 dst 10.0.2.5
\tproto esp spi 0xc849102f reqid 1 mode tunnel
\treplay-window 64 flag af-unspec
\tauth-trunc hmac(sha256) 0x16b0a... 128
\tenc cbc(aes) 0x48912...
\tencap type espinudp sport 4500 dport 4500 addr 0.0.0.0
src 10.0.2.5 dst 10.0.2.4
\tproto esp spi 0xd910427a reqid 1 mode tunnel
\treplay-window 64 flag af-unspec
\tauth-trunc hmac(sha256) 0x94fa1... 128
\tenc cbc(aes) 0x82b1c...
\tencap type espinudp sport 4500 dport 4500 addr 0.0.0.0`
  }
};

export const mockHistoryList = [
  {
    id: "sess_20260831_001",
    timestamp: "2026-08-31 03:45:00",
    source: "ipsec_voip_tunnel_01.pcap",
    vpnType: "IPsec IKEv2",
    securityScore: 87,
    riskLevel: "MEDIUM",
    status: "COMPLETED"
  },
  {
    id: "sess_20260830_004",
    timestamp: "2026-08-30 18:20:12",
    source: "live_capture_eth0.pcap",
    vpnType: "IPsec IKEv2 (AES-256-GCM)",
    securityScore: 94,
    riskLevel: "LOW",
    status: "COMPLETED"
  },
  {
    id: "sess_20260829_002",
    timestamp: "2026-08-29 11:05:44",
    source: "legacy_vpn_test.pcap",
    vpnType: "IPsec IKEv1 (3DES)",
    securityScore: 42,
    riskLevel: "HIGH",
    status: "COMPLETED"
  }
];

export const mockComparisonData = {
  configA: {
    name: "Scenario A: Current Deployment (AES-128-CBC)",
    securityScore: 87,
    riskScore: 31,
    cipherStrength: "ACCEPTABLE",
    encryption: "AES-128-CBC",
    authentication: "HMAC-SHA256",
    dhGroup: "MODP-2048",
    pfs: "Enabled",
    replayProtection: "64-bit window"
  },
  configB: {
    name: "Scenario B: Recommended Hardened (AES-256-GCM)",
    securityScore: 96,
    riskScore: 12,
    cipherStrength: "STRONG",
    encryption: "AES-256-GCM",
    authentication: "AEAD (Built-in)",
    dhGroup: "ECP-384",
    pfs: "Enabled",
    replayProtection: "128-bit window"
  }
};
