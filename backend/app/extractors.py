from .models import Flow, Packet, Event, Finding, Timeline
import dpkt
import dpkt.utils

## export useful data of the flow's packets

def export_http_flows(flow:Flow) ->list[Event]:
  events = []
  for packet in flow.packets:
    if packet.protocol == "TCP" and isinstance(packet.payload, bytes):
      try:
        http = dpkt.http.Request(packet.payload)
        event = Event(
          id=f"{flow.flow_id}-{packet.packet_id}",
          ts=packet.ts,
          source="http",
          kind=http.method,
          summary=f"HTTP {http.method} request to {http.uri}",
          details={
            "headers": dict(http.headers),
            "body": http.body.decode(errors="ignore") if http.body else None
          },
          flow_id=flow.flow_id
        )
        events.append(event)
      except (dpkt.UnpackError, dpkt.NeedData):
        continue
  return events


def export_dns_flows(flow:Flow) -> list[Event]:
  events = []
  for packet in flow.packets:
    if packet.protocol == "UDP" and isinstance(packet.payload, bytes):
      try:
        dns = dpkt.dns.DNS(packet.payload)
        if dns.qr == dpkt.dns.DNS_Q and dns.opcode == dpkt.dns.DNS_QUERY:
          for query in dns.qd:
            event = Event(
              id=f"{flow.flow_id}-{packet.packet_id}",
              ts=packet.ts,
              source="dns",
              kind="query",
              summary=f"DNS query for {query.name}",
              details={
                "type": query.type,
                "class": query.cls
              },
              flow_id=flow.flow_id
            )
            events.append(event)
      except (dpkt.UnpackError, dpkt.NeedData):
        continue
  return events


def export_dhcp_flows(flow:Flow) -> list[Event]:
  events = []
  for packet in flow.packets:
    if packet.protocol == "UDP" and isinstance(packet.payload, bytes):
      try:
        dhcp = dpkt.dhcp.DHCP(packet.payload)

        event = Event(
          id=f"{flow.flow_id}-{packet.packet_id}",
          ts=packet.ts,
          source="dhcp",
          kind="message",
          summary=f"DHCP message type {getattr(dhcp, 'op', 0)}",
          details={
            "options": getattr(dhcp, "opts", [])
          },
          flow_id=flow.flow_id
        )
        events.append(event)
      except (dpkt.UnpackError, dpkt.NeedData):
        continue
  return events


def export_arp_flows(flow:Flow) -> list[Event]:
  events = []
  for packet in flow.packets:
    if packet.protocol == "OTHER" and isinstance(packet.payload, bytes):
      try:
        arp = dpkt.arp.ARP(packet.payload)

        event = Event(
          id=f"{flow.flow_id}-{packet.packet_id}",
          ts=packet.ts,
          source="arp",
          kind="message",
          summary=f"ARP message type {getattr(arp, 'op', 0)}",
          details={
            "sender_ip": dpkt.utils.inet_to_str(arp.spa),
            "target_ip": dpkt.utils.inet_to_str(arp.tpa),
            "sender_mac": ':'.join('%02x' % b for b in arp.sha),
            "target_mac": ':'.join('%02x' % b for b in arp.tha)
          },
          flow_id=flow.flow_id
        )
        events.append(event)
      except (dpkt.UnpackError, dpkt.NeedData):
        continue
  return events


def export_icmp_flows(flow:Flow) -> list[Event]:
  events = []
  for packet in flow.packets:
    if packet.protocol == "ICMP" and isinstance(packet.payload, bytes):
      try:
        icmp = dpkt.icmp.ICMP(packet.payload)

        event = Event(
          id=f"{flow.flow_id}-{packet.packet_id}",
          ts=packet.ts,
          source="icmp",
          kind="message",
          summary=f"ICMP message type {icmp.type}",
          details={
            "code": icmp.code,
            "checksum": icmp.sum
          },
          flow_id=flow.flow_id
        )
        events.append(event)
      except (dpkt.UnpackError, dpkt.NeedData):
        continue
  return events


def export_tcp_flags(flow:Flow) -> list[Event]:
  events = []
  for packet in flow.packets:
    if packet.protocol == "TCP":

      tcp_flags = getattr(packet, "tcp_flags", 0)

      if tcp_flags is None:
        tcp_flags = 0

      flags = []

      if tcp_flags & dpkt.tcp.TH_SYN:
        flags.append("SYN")

      if tcp_flags & dpkt.tcp.TH_ACK:
        flags.append("ACK")

      if tcp_flags & dpkt.tcp.TH_FIN:
        flags.append("FIN")

      if tcp_flags & dpkt.tcp.TH_RST:
        flags.append("RST")

      if tcp_flags & dpkt.tcp.TH_PUSH:
        flags.append("PSH")

      if tcp_flags & dpkt.tcp.TH_URG:
        flags.append("URG")

      if flags:
        event = Event(
          id=f"{flow.flow_id}-{packet.packet_id}",
          ts=packet.ts,
          source="tcp",
          kind="flags",
          summary=f"TCP flags: {', '.join(flags)}",
          details={
            "flags": flags
          },
          flow_id=flow.flow_id
        )
        events.append(event)

  return events


def export_tls_flows(flow:Flow) -> list[Event]:
  events = []
  for packet in flow.packets:
    if packet.protocol == "TCP" and isinstance(packet.payload, bytes):
      try:
        tls = dpkt.ssl.TLS(packet.payload)

        event = Event(
          id=f"{flow.flow_id}-{packet.packet_id}",
          ts=packet.ts,
          source="tls",
          kind="message",
          summary=f"TLS message type {getattr(tls, 'type', 0)}",
          details={
            "version": getattr(tls, "version", None),
            "length": getattr(tls, "length", None)
          },
          flow_id=flow.flow_id
        )
        events.append(event)
      except (dpkt.UnpackError, dpkt.NeedData):
        continue
  return events


def export_smtp_ftp_imap_flows(flow:Flow) -> list[Event]:
  events = []

  for packet in flow.packets:
    if packet.protocol == "TCP" and isinstance(packet.payload, bytes):
      try:

        # Check for SMTP
        if packet.payload.startswith(b"220") or packet.payload.startswith(b"250"):
          event = Event(
            id=f"{flow.flow_id}-{packet.packet_id}",
            ts=packet.ts,
            source="smtp",
            kind="message",
            summary=f"SMTP message: {packet.payload.decode(errors='ignore')}",
            details={
              "payload": packet.payload.decode(errors='ignore')
            },
            flow_id=flow.flow_id
          )
          events.append(event)

        # Check for FTP
        elif packet.payload.startswith(b"220") or packet.payload.startswith(b"331"):
          event = Event(
            id=f"{flow.flow_id}-{packet.packet_id}",
            ts=packet.ts,
            source="ftp",
            kind="message",
            summary=f"FTP message: {packet.payload.decode(errors='ignore')}",
            details={
              "payload": packet.payload.decode(errors='ignore')
            },
            flow_id=flow.flow_id
          )
          events.append(event)

        # Check for IMAP
        elif packet.payload.startswith(b"* OK") or packet.payload.startswith(b"* NO"):
          event = Event(
            id=f"{flow.flow_id}-{packet.packet_id}",
            ts=packet.ts,
            source="imap",
            kind="message",
            summary=f"IMAP message: {packet.payload.decode(errors='ignore')}",
            details={
              "payload": packet.payload.decode(errors='ignore')
            },
            flow_id=flow.flow_id
          )
          events.append(event)

      except (dpkt.UnpackError, dpkt.NeedData):
        continue

  return events


def export_smb_flows(flow:Flow) -> list[Event]:
  events = []

  for packet in flow.packets:
    if packet.protocol == "TCP" and isinstance(packet.payload, bytes):
      try:
        smb = dpkt.smb.SMB(packet.payload)

        event = Event(
          id=f"{flow.flow_id}-{packet.packet_id}",
          ts=packet.ts,
          source="smb",
          kind="message",
          summary=f"SMB message type {getattr(smb, 'command', 0)}",
          details={
            "command": getattr(smb, "command", None),
            "flags": getattr(smb, "flags", None),
            "flags2": getattr(smb, "flags2", None)
          },
          flow_id=flow.flow_id
        )
        events.append(event)

      except (dpkt.UnpackError, dpkt.NeedData):
        continue

  return events