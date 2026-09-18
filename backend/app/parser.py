import io

import dpkt
import dpkt.utils

from .models import Packet


def parse_one_packet(
    packet_id: int,
    ts: float,
    buf: bytes,
) -> Packet | None:
    try:
        eth = dpkt.ethernet.Ethernet(buf)
    except (dpkt.dpkt.UnpackError, dpkt.dpkt.NeedData, ValueError):
        return None

    if not isinstance(eth.data, dpkt.ip.IP):
        return None

    ip = eth.data
    tcp_flags = 0
    src_port: int | None = None
    dst_port: int | None = None

    protocol = {1: "ICMP", 6: "TCP", 17: "UDP"}.get(ip.p, "OTHER")
    is_non_first_fragment = (ip.off & 0x1FFF) != 0

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


def _iter_capture_records(raw: bytes):
    readers = (
        dpkt.pcap.Reader,
        getattr(getattr(dpkt, "pcapng", None), "Reader", None),
    )
    for reader in readers:
        if reader is None:
            continue
        try:
            stream = io.BytesIO(raw)
            yield from reader(stream)
            return
        except (ValueError, dpkt.dpkt.NeedData, dpkt.dpkt.UnpackError, OSError):
            continue

    raise ValueError("Unsupported or corrupt capture")


def pcap_file(raw: bytes) -> list[Packet]:
    if not raw:
        raise ValueError("PCAP data is empty")

    packets: list[Packet] = []

    try:
        for packet_id, (ts, buf) in enumerate(_iter_capture_records(raw)):
            packet = parse_one_packet(packet_id, ts, buf)
            if packet is not None:
                packets.append(packet)
    except ValueError:
        raise
    except (dpkt.dpkt.NeedData, dpkt.dpkt.UnpackError):
        raise ValueError("Unsupported or corrupt capture") from None

    return packets