from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from .traffic import TrafficAnalysisResult
from .security import SecurityAssessment, ThreatItem

class CaptureInfo(BaseModel):
    filename: str = ""
    fileSize: int = 0
    durationSeconds: float = 0.0
    packetCount: int = 0
    ikePackets: int = 0
    espPackets: int = 0
    ahPackets: int = 0
    otherPackets: int = 0
    udpPackets: int = 0
    tcpPackets: int = 0
    icmpPackets: int = 0
    uploadStatus: str = "COMPLETED"

class VPNDetection(BaseModel):
    protocol: str = "IPsec"
    ikeVersion: str = "IKEv2"
    operatingMode: str = "Tunnel Mode"
    ipVersion: str = "IPv4"
    keyExchange: str = "Diffie-Hellman"
    dhGroup: str = "MODP-2048 (Group 14)"
    encryption: str = "AES-128-CBC"
    authentication: str = "HMAC-SHA256"
    pfs: str = "Enabled"
    replayProtection: str = "Enabled"
    natTraversal: str = "Detected"
    detectedStatus: str = "Active Tunnel"

class Topology(BaseModel):
    clientIp: str = "10.0.2.4"
    clientPort: int = 4500
    serverIp: str = "10.0.2.5"
    serverPort: int = 4500
    clientSubnet: str = "10.0.2.0/24"
    serverSubnet: str = "10.0.3.0/24"
    tunnelState: str = "ESTABLISHED"
    activeSaCount: int = 2

class ScoreComponents(BaseModel):
    cryptography: int = 90
    authentication: int = 90
    keyExchange: int = 85
    saConfiguration: int = 88
    replayProtection: int = 100
    forwardSecrecy: int = 75
    keyLifetime: int = 90
    metadataExposure: int = 72

class Scores(BaseModel):
    securityScore: int = 85
    securityGrade: str = "GOOD"
    riskScore: int = 30
    riskLevel: str = "MEDIUM"
    aiConfidence: float = 90.0
    aiConfidenceLevel: str = "HIGH"
    components: ScoreComponents = Field(default_factory=ScoreComponents)

class ObservableFeature(BaseModel):
    feature: str
    value: str
    importance: str
    description: str

class AIExplanations(BaseModel):
    protocolConfidence: float = 95.0
    operatingModeConfidence: float = 90.0
    trafficClassificationConfidence: float = 85.0
    observableFeatures: List[ObservableFeature] = []

class EvidenceLogs(BaseModel):
    strongswanLog: str = ""
    xfrmState: str = ""
    pcapSummary: str = ""

class AnalysisResult(BaseModel):
    id: str
    timestamp: str
    captureInfo: CaptureInfo = Field(default_factory=CaptureInfo)
    vpnDetection: VPNDetection = Field(default_factory=VPNDetection)
    topology: Topology = Field(default_factory=Topology)
    scores: Scores = Field(default_factory=Scores)
    trafficAnalysis: TrafficAnalysisResult = Field(default_factory=TrafficAnalysisResult)
    securityAssessment: SecurityAssessment = Field(default_factory=SecurityAssessment)
    threatMatrix: List[ThreatItem] = []
    aiExplanations: AIExplanations = Field(default_factory=AIExplanations)
    evidenceLogs: EvidenceLogs = Field(default_factory=EvidenceLogs)

class HistoryItem(BaseModel):
    id: str
    timestamp: str
    source: str
    vpnType: str
    securityScore: int
    riskLevel: str
    status: str = "COMPLETED"
