from .correlator import correlate
from .extractors import extract_events
from .findings import analyze_events
from .models import Finding
from .parser import pcap_file
from .session import sessionize


SEVERITY_ORDER = {
    "critical": 0,
    "high": 1,
    "medium": 2,
    "low": 3,
    "info": 4,
}


def analyze_capture(raw: bytes):
    if not raw:
        raise ValueError("PCAP data is empty")

    packets = pcap_file(raw)
    flows = sessionize(packets)
    events = correlate(extract_events(flows), flows)
    findings = analyze_events(events, flows)

    findings.sort(
        key=lambda finding: SEVERITY_ORDER.get(finding.severity, 99)
    )

    return packets, flows, events, findings


def analyze_pcap(raw: bytes) -> list[Finding]:
    _, _, _, findings = analyze_capture(raw)
    return findings


def build_response(findings: list[Finding], packets: list, flows: list, events: list) -> dict:
    return {
        "summary": {
            "packets": len(packets),
            "flows": len(flows),
            "events": len(events),
        },
        "count": len(findings),
        "findings": [finding.model_dump() for finding in findings],
        "packets": [
            packet.model_dump(exclude={"payload"})
            for packet in packets
        ],
        "flows": [
            flow.model_dump(exclude={"packets"})
            for flow in flows
        ],
        "events": [event.model_dump() for event in events],
    }