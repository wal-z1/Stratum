from collections import Counter, defaultdict

from .models import Event, Finding, Flow


MB = 1024 * 1024


def analyze_events(events: list[Event], flows: list[Flow]) -> list[Finding]:
    if events is None or flows is None:
        raise ValueError("events and flows are required")

    findings = []

    for detector in DETECTORS:
        findings.extend(detector(events, flows))

    return findings


def check_port_scan(events: list[Event], flows: list[Flow]) -> list[Finding]:
    ports = defaultdict(set)

    for flow in flows:
        if flow.protocol == "TCP" and flow.dst_port is not None:
            ports[(flow.src_ip, flow.dst_ip)].add(flow.dst_port)

    findings = []

    for (src, dst), scanned in ports.items():
        count = len(scanned)

        if count < 15:
            continue

        findings.append(Finding(
            id=f"port-scan-{src}-{dst}",
            title="Possible port scan",
            category="recon",
            severity="high" if count >= 50 else "medium",
            status="warn",
            confidence="high" if count >= 50 else "medium",
            detail=f"{src} contacted {count} TCP ports on {dst}",
            evidence=[
                f"{src} -> {dst}",
                f"ports: {sorted(scanned)[:20]}",
            ],
        ))

    return findings


def check_cleartext_credentials(
    events: list[Event],
    flows: list[Flow],
) -> list[Finding]:
    findings = []

    for event in events:
        if event.source != "http":
            continue

        headers = event.details.get("headers", {})

        if not isinstance(headers, dict):
            continue

        auth = next(
            (
                value
                for key, value in headers.items()
                if key.lower() == "authorization"
            ),
            None,
        )

        if not isinstance(auth, str):
            continue

        if not auth.lower().startswith("basic "):
            continue

        findings.append(Finding(
            id=f"cleartext-creds-{event.id}",
            title="Cleartext HTTP credentials",
            category="credentials",
            severity="high",
            status="fail",
            confidence="high",
            detail="HTTP Basic credentials were sent without TLS",
            evidence=[event.id, event.summary],
        ))

    return findings


def check_dns_nxdomain(
    events: list[Event],
    flows: list[Flow],
) -> list[Finding]:
    total = Counter()
    failed = Counter()

    for event in events:
        if event.source != "dns" or event.kind != "response":
            continue

        client = event.details.get("client_ip")

        if not client:
            continue

        total[client] += 1

        if event.details.get("rcode") in (3, "NXDOMAIN"):
            failed[client] += 1

    findings = []

    for client, count in total.items():
        if count < 20:
            continue

        ratio = failed[client] / count

        if ratio < 0.40:
            continue

        findings.append(Finding(
            id=f"dns-nxdomain-{client}",
            title="High NXDOMAIN ratio",
            category="dns",
            severity="high" if ratio >= 0.70 else "medium",
            status="warn",
            confidence="medium",
            detail=(
                f"{client} received {failed[client]}/{count} "
                f"NXDOMAIN responses ({ratio:.0%})"
            ),
            evidence=[
                f"client: {client}",
                f"queries: {count}",
                f"nxdomain: {failed[client]}",
            ],
        ))

    return findings


def check_large_transfers(
    events: list[Event],
    flows: list[Flow],
) -> list[Finding]:
    findings = []

    for flow in flows:
        if flow.protocol not in ("TCP", "UDP"):
            continue

        if flow.byte_count < 10 * MB:
            continue

        findings.append(Finding(
            id=f"large-transfer-{flow.flow_id}",
            title="Large network transfer",
            category="transfer",
            severity="medium",
            status="info",
            confidence="high",
            detail=(
                f"{flow.src_ip}:{flow.src_port} -> "
                f"{flow.dst_ip}:{flow.dst_port} transferred "
                f"{flow.byte_count / MB:.1f} MB"
            ),
            evidence=[
                f"flow: {flow.flow_id}",
                f"packets: {flow.packet_count}",
            ],
        ))

    return findings


DETECTORS = (
    check_port_scan,
    check_cleartext_credentials,
    check_dns_nxdomain,
    check_large_transfers,
)