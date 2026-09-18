import io

import dpkt
import dpkt.utils

from .models import Packet


def parse_one_packet(
    packet_id: int,
    ts: float,
    buf: bytes,
) -> Packet | None:
    eth = dpkt.ethernet.Ethernet(buf)

    # Currently only IPv4
    if not isinstance(eth.data, dpkt.ip.IP):
        return None

    ip = eth.data
    tcp_flags = 0
    src_port: int | None = None
    dst_port: int | None = None

    protocol = {1: "ICMP", 6: "TCP", 17: "UDP"}.get(ip.p, "OTHER")
    is_non_first_fragment = (ip.off & 0x1FFF) != 0

    # Non-first fragments do not contain a transport header.
    if is_non_first_fragment:
        payload = bytes(ip.data)
    elif protocol in ("TCP", "UDP", "ICMP"):
        try:
            transport_data = bytes(ip.data)
            if protocol == "TCP":
                transport = dpkt.tcp.TCP(transport_data)
                src_port = transport.sport
                dst_port = transport.dport
                tcp_flags = transport.flags
                payload = bytes(transport.data)
            elif protocol == "UDP":
                transport = dpkt.udp.UDP(transport_data)
                src_port = transport.sport
                dst_port = transport.dport
                payload = bytes(transport.data)
            else:
                transport = dpkt.icmp.ICMP(transport_data)
                payload = bytes(transport.data)
        except (dpkt.dpkt.UnpackError, dpkt.dpkt.NeedData):
            src_port = None
            dst_port = None
            payload = bytes(ip.data)
    else:
        payload = bytes(ip.data)

    return Packet(
        packet_id=packet_id,
        ts=float(ts),
        src_ip=dpkt.utils.inet_to_str(ip.src),
        dst_ip=dpkt.utils.inet_to_str(ip.dst),
        src_port=src_port,
        dst_port=dst_port,
        protocol=protocol,
        tcp_flags=tcp_flags,
        length=len(buf),
        payload=payload,
    )


def pcap_file(raw: bytes) -> list[Packet]:
    packets: list[Packet] = []

    try:
        pcap = dpkt.pcap.Reader(io.BytesIO(raw))
    except (ValueError, dpkt.dpkt.NeedData, dpkt.dpkt.UnpackError):
        return []

    for packet_id, (ts, buf) in enumerate(pcap):
        try:
            packet = parse_one_packet(packet_id, ts, buf)
        except (dpkt.dpkt.NeedData, dpkt.dpkt.UnpackError):
            # Skip malformed packets
            continue

        if packet is not None:
            packets.append(packet)

    return packets