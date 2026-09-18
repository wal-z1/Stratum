from backend.app.extractors import *

from .models import Event, Finding, Flow

def extract_events(flows : list[Flow]) -> list[Event]:
    events = []
    for aflow in flows:
        events += export_http_flows(aflow)
        events += export_dns_flows(aflow)
        events += export_tls_flows(aflow)
        events += export_arp_flows(aflow)
        events += export_dhcp_flows(aflow)
        events += export_smtp_ftp_imap_flows(aflow)
        events += export_arp_flows(aflow)
        events += export_icmp_flows(aflow)

    return events
