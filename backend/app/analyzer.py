from .models import Event, Finding, Flow

def analyze_events_to_findings(events:list[Event],flows: list[Flows]) -> list[Finding]:
    findings: list[Finding] = []
    for ev in events:
        flow = next((f for f in flows if f.flow_id == ev.flow_id), None)
        if flow is None:
            continue
        finding = Finding(
            id=ev.id,
            title=f"{ev.source} {ev.kind}",
            category=ev.source,
            severity="medium",
            status="warn",
            confidence="medium",
            detail=ev.summary,
            evidence=[f"Flow ID: {flow.flow_id}"]
        )
        findings.append(finding)
    return findings