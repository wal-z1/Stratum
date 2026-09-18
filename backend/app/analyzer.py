from .extractors import (
    export_arp_flows,
    export_dhcp_flows,
    export_dns_flows,
    export_http_flows,
    export_icmp_flows,
    export_smtp_ftp_imap_flows,
    export_tcp_flags,
    export_tls_flows,
)
from .models import Event, Flow


def extract_events(flows: list[Flow]) -> list[Event]:
    events: list[Event] = []
    for flow in flows:
        events.extend(export_http_flows(flow))
        events.extend(export_dns_flows(flow))
        events.extend(export_tls_flows(flow))
        events.extend(export_arp_flows(flow))
        events.extend(export_dhcp_flows(flow))
        events.extend(export_smtp_ftp_imap_flows(flow))
        events.extend(export_icmp_flows(flow))
        events.extend(export_tcp_flags(flow))
    return events
