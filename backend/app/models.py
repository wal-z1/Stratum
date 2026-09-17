from typing import Any, Literal
from pydantic import BaseModel, Field

#define types for protocol, severity, status, event source, and confidence
#to be used in backend models


Protocol = Literal["TCP", "UDP", "ICMP", "OTHER"]
Severity = Literal["critical", "high", "medium", "low", "info"]
Status = Literal["fail", "warn", "pass", "info"]
EventSource = Literal["dns", "http", "tls", "tcp"]
Confidence = Literal["low", "medium", "high"]

class Packet(BaseModel):
    packet_id: int
    ts: float
    src_ip: str
    dst_ip: str
    src_port: int | None = None
    dst_port: int | None = None
    protocol: Protocol
    length: int
    payload: bytes | None = None  # raw bytes

class Flow(BaseModel):
    flow_id: str                    #hash
    src_ip: str
    dst_ip: str
    src_port: int
    dst_port: int
    protocol: Protocol
    start_ts: float
    end_ts: float
    packets: list[Packet] = Field(default_factory=list)
    packet_count: int = 0
    byte_count: int = 0

class Event(BaseModel):
    id: str
    ts: float
    source: EventSource
    kind: str                        # depends on the source 
    summary: str
    details: dict[str, Any] = Field(default_factory=dict)
    flow_id: str | None = None

class Finding(BaseModel):
    id: str
    title: str
    category: str
    severity: Severity
    status: Status
    confidence: Confidence = "medium"
    detail: str
    evidence: list[str] = Field(default_factory=list)

class Timeline(BaseModel):
    events: list[Event] = Field(default_factory=list)
    flows: list[Flow] = Field(default_factory=list)