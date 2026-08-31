from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class CategoryProbability(BaseModel):
    category: str
    probability: float

class FlowMetrics(BaseModel):
    packetsPerSec: float = 0.0
    bytesPerSec: float = 0.0
    avgPacketSize: float = 0.0
    flowDurationSeconds: float = 0.0
    upstreamBytes: int = 0
    downstreamBytes: int = 0
    interArrivalTimeMs: float = 0.0
    flowCount: int = 1
    directionRatio: float = 1.0

class TimelinePoint(BaseModel):
    timestamp: str
    packets: int
    bytes: Optional[int] = 0
    pps: float = 0.0

class TrafficAnalysisResult(BaseModel):
    predictedType: str = "Unknown"
    confidence: float = 0.0
    distribution: List[CategoryProbability] = []
    metrics: FlowMetrics = Field(default_factory=FlowMetrics)
    timeline: List[TimelinePoint] = []
