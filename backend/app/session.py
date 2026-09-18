from .models import Packet, Flow

### functions to analyze full sessions of tcp rather than having the user read 300+ raws

def flow_key(packet: Packet) -> tuple[str, str, int | None, int | None, str]:
    try:
        assert packet.src_ip is not None
        assert packet.dst_ip is not None
        assert packet.protocol is not None
    except AssertionError:
        raise ValueError("Packet must have src_ip, dst_ip, and protocol defined")
    return (
        packet.src_ip,
        packet.dst_ip,
        packet.src_port,
        packet.dst_port,
        packet.protocol,
    )

def sessionize(packets: list[Packet]) -> list[Flow]:
    flows_dict: dict[tuple[str, str, int | None, int | None, str], Flow] = {}
    for packet in packets:
        key = flow_key(packet)
        if key not in flows_dict:
            flows_dict[key] = Flow(
                flow_id=f"{packet.src_ip}:{packet.src_port}-{packet.dst_ip}:{packet.dst_port}-{packet.protocol}",
                src_ip=packet.src_ip,
                dst_ip=packet.dst_ip,
                src_port=packet.src_port,
                dst_port=packet.dst_port,
                protocol=packet.protocol,
                start_ts=packet.ts,
                end_ts=packet.ts,
                packets=[],
                packet_count=0,
                byte_count=0,
            )

        flow = flows_dict[key]
        flow.packets.append(packet)
        flow.packet_count += 1
        flow.byte_count += packet.length
        flow.start_ts = min(flow.start_ts, packet.ts)
        flow.end_ts = max(flow.end_ts, packet.ts)

    return list(flows_dict.values())