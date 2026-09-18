from backend.app.extractors import *

from .models import Event, Finding, Flow

def extract_events(flows):
    events = []
    events +=  export_http_flows(flows)
    events += export_dns_flows(flows)
    events += export_tls_flows(flows)
    events += export_arp_flows(flows)
    events += export_dhcp_flows(flows)
    events += export_smtp_ftp_imap_flows(flows)
    events += export_arp_flows(flows)
    events += export_icmp_flows(flows)

    return events
