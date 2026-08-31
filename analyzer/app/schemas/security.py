from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class CryptographyDetails(BaseModel):
    algorithm: str = "Unknown"
    keyLengthBits: int = 128
    integrity: str = "Unknown"
    cipherRating: str = "ACCEPTABLE"
    cipherRatingReason: str = ""

class SADetails(BaseModel):
    status: str = "INSTANTIATED"
    initiatorSpi: str = "Unknown"
    responderSpi: str = "Unknown"
    espSpiInbound: str = "Unknown"
    espSpiOutbound: str = "Unknown"
    mode: str = "Tunnel"
    direction: str = "Bi-directional"
    trafficSelectors: str = "Unknown"

class KeyLifetimes(BaseModel):
    ikeSaLifetimeSec: int = 86400
    childSaLifetimeSec: int = 28800
    rekeyIntervalSec: int = 3600
    lifetimeStatus: str = "COMPLIANT"

class ReplayProtection(BaseModel):
    enabled: bool = True
    windowSizeBits: int = 64
    replayEventsCount: int = 0
    status: str = "OPTIMAL"

class ForwardSecrecy(BaseModel):
    pfsEnabled: bool = True
    dhGroup: str = "Unknown"
    riskLevel: str = "LOW"

class MetadataExposure(BaseModel):
    endpointVisibility: str = "EXPOSED"
    packetTimingPattern: str = "PERIODIC"
    packetSizeVariance: str = "LOW VARIANCE"
    fingerprintability: str = "HIGH"

class SecurityAssessment(BaseModel):
    cryptography: CryptographyDetails = Field(default_factory=CryptographyDetails)
    saDetails: SADetails = Field(default_factory=SADetails)
    keyLifetimes: KeyLifetimes = Field(default_factory=KeyLifetimes)
    replayProtection: ReplayProtection = Field(default_factory=ReplayProtection)
    forwardSecrecy: ForwardSecrecy = Field(default_factory=ForwardSecrecy)
    metadataExposure: MetadataExposure = Field(default_factory=MetadataExposure)

class ThreatItem(BaseModel):
    id: str
    threat: str
    severity: str
    evidence: str
    impact: str
    recommendation: str
    status: str = "OPEN"
