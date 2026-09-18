from .models import Flow, Packet, Event, Finding
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
        elif dns.qr == dpkt.dns.DNS_R:
        answers = []
        for ans in dns.an:
            ip = None
            if getattr(ans, "ip", None):
                ip = dpkt.utils.inet_to_str(ans.ip)
            elif getattr(ans, "ip6", None):
                ip = dpkt.utils.inet_to_str(ans.ip6)
            answers.append({"name": ans.name, "ip": ip, "type": ans.type, "ttl": ans.ttl})
        if answers:
            events.append(Event(
                id=f"{flow.flow_id}-{packet.packet_id}",
                ts=packet.ts,
                source="dns",
                kind="response",
                summary=f"DNS response for {answers[0]['name']}",
                details={
                    "name": dns.qd[0].name if dns.qd else answers[0]["name"],
                    "rcode": dns.rcode,
                    "answers": answers,
                },
                flow_id=flow.flow_id,
            ))
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

      if (
        len(packet.payload) < 5
        or packet.payload[0] not in (20, 21, 22, 23, 24)
        or packet.payload[1] != 3
      ):
        continue

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
            "length": getattr(tls, "len", None)
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
        payload = packet.payload
        source = None

        # SMTP
        if payload.startswith(b"250"):
          source = "smtp"

        # FTP
        elif payload.startswith(b"331"):
          source = "ftp"

        # 220 can belong to either SMTP or FTP
        elif payload.startswith(b"220"):
          lower_payload = payload.lower()

          if b"ftp" in lower_payload:
            source = "ftp"

          elif b"smtp" in lower_payload or b"esmtp" in lower_payload:
            source = "smtp"

        # IMAP
        elif payload.startswith(b"* OK") or payload.startswith(b"* NO"):
          source = "imap"

        if source:
          decoded_payload = payload.decode(errors="ignore")

          event = Event(
            id=f"{flow.flow_id}-{packet.packet_id}",
            ts=packet.ts,
            source=source,
            kind="message",
            summary=f"{source.upper()} message: {decoded_payload}",
            details={
              "payload": decoded_payload
            },
            flow_id=flow.flow_id
          )
          events.append(event)

      except (dpkt.UnpackError, dpkt.NeedData):
        continue

  return events
