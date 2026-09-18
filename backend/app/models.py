from typing import Any, Literal
from pydantic import BaseModel, Field

#define types for protocol, severity, status, event source, and confidence
#to be used in backend models


Protocol = Literal["TCP", "UDP", "ICMP", "OTHER"]
Severity = Literal["critical", "high", "medium", "low", "info"]
Status = Literal["fail", "warn", "pass", "info"]
from typing import Literal

EventSource = Literal[
    "http",
    "dns",
    "dhcp",
    "arp",
    "icmp",
    "tcp",
    "tls",
    "smtp",
    "ftp",
    "imap",
    "smb",
]
Confidence = Literal["low", "medium", "high"]

class Packet(BaseModel):
    packet_id: int
    ts: float
    src_ip: str
    dst_ip: str
    src_port: int | None = None
    dst_port: int | None = None
    protocol: Protocol
    payload: bytes | None = None
    length:int = 0
    tcp_flags: int = 0

class Flow(BaseModel):
    flow_id: str
    src_ip: str
    dst_ip: str
    src_port: int | None  ## for icmp packets they dont have port values
    dst_port: int | None
    protocol: Protocol
    start_ts: float
    end_ts: float
    packets: list[Packet] = Field(default_factory=list)
    packet_count: int = 0
    byte_count: int = 0
    dns_name: str | None = None

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

