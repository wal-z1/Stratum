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
    segment = ip.data

    src_port: int | None = None
    dst_port: int | None = None

    if isinstance(segment, dpkt.tcp.TCP):
        protocol = "TCP"
        src_port = segment.sport
        dst_port = segment.dport
        payload = bytes(segment.data)

    elif isinstance(segment, dpkt.udp.UDP):
        protocol = "UDP"
        src_port = segment.sport
        dst_port = segment.dport
        payload = bytes(segment.data)

    elif isinstance(segment, dpkt.icmp.ICMP):
        protocol = "ICMP"
        payload = bytes(segment.data)

    else:
        protocol = "OTHER"
        payload = (
            bytes(segment.data)
            if hasattr(segment, "data")
            else bytes(segment)
        )

    return Packet(
        packet_id=packet_id,
        ts=float(ts),
        src_ip=dpkt.utils.inet_to_str(ip.src),
        dst_ip=dpkt.utils.inet_to_str(ip.dst),
        src_port=src_port,
        dst_port=dst_port,
        protocol=protocol,
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