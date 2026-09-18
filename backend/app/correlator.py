from .models import Event, Flow


def index_flows(flows: list[Flow]) -> dict[str, Flow]:
    return {f.flow_id: f for f in flows}


def enrich_event(ev: Event, flow: Flow) -> None:
    if ev.source == "dns":
        if flow.src_port == 53:
            ev.details.setdefault("client_ip", flow.dst_ip)
            ev.details.setdefault("server_ip", flow.src_ip)
        else:
            ev.details.setdefault("client_ip", flow.src_ip)
            ev.details.setdefault("server_ip", flow.dst_ip)
    else:
        ev.details.setdefault("client_ip", flow.src_ip)
        ev.details.setdefault("server_ip", flow.dst_ip)
        ev.details.setdefault("dst_ip", flow.dst_ip)
    ev.details.setdefault("src_port", flow.src_port)
    ev.details.setdefault("dst_port", flow.dst_port)
    ev.details.setdefault("protocol", flow.protocol)


def enrich_events(events: list[Event], flows: list[Flow]) -> list[Event]:
    by_id = index_flows(flows)
    for ev in events:
        flow = by_id.get(ev.flow_id)
        if flow is None:
            continue
        enrich_event(ev, flow)
    return events


def build_dns_index(events: list[Event]) -> dict[tuple[str, str], tuple[str, float]]:
    index: dict[tuple[str, str], tuple[str, float]] = {}
    for ev in events:
        if ev.source != "dns":
            continue
        if ev.kind != "response":
            continue
        client = ev.details.get("client_ip")
        if not client:
            continue
        for ans in ev.details.get("answers", []):
            name = ans.get("name")
            ip = ans.get("ip")
            if not name or not ip:
                continue
            key = (client, ip)
            prior = index.get(key)
            if prior is None or ev.ts > prior[1]:
                index[key] = (name, ev.ts)
    return index


def link_dns_to_connections(events: list[Event]) -> list[Event]:
    index = build_dns_index(events)
    if not index:
        return events
    for ev in events:
        if ev.source not in ("http", "tls", "ssh", "tcp"):
            continue
        client = ev.details.get("client_ip")
        dst = ev.details.get("dst_ip") or ev.details.get("server_ip")
        if not client or not dst:
            continue
        hit = index.get((client, dst))
        if hit is None:
            continue
        name, ts = hit
        if ts <= ev.ts:
            ev.details["dns_name"] = name
    return events


def link_dns_to_flows(flows: list[Flow], events: list[Event]) -> None:
    index = build_dns_index(events)
    if not index:
        return
    for flow in flows:
        if flow.protocol not in ("TCP",):
            continue
        hit = index.get((flow.src_ip, flow.dst_ip))
        if hit is None:
            continue
        flow.dns_name = hit[0]


def dedupe(events: list[Event]) -> list[Event]:
    seen: set[str] = set()
    out: list[Event] = []
    for ev in events:
        if ev.id in seen:
            continue
        seen.add(ev.id)
        out.append(ev)
    return out


def sort_timeline(events: list[Event]) -> list[Event]:
    return sorted(events, key=lambda e: e.ts)


def correlate(events: list[Event], flows: list[Flow]) -> list[Event]:
    events = enrich_events(events, flows)
    events = link_dns_to_connections(events)
    events = dedupe(events)
    events = sort_timeline(events)
    link_dns_to_flows(flows, events)
    return events