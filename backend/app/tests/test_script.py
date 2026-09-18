import sys
from pathlib import Path
from collections import Counter
from app.parser import pcap_file
from app.session import sessionize


def main(pcap_path: str) -> None:
    raw = Path(pcap_path).read_bytes()

    packets = pcap_file(raw)
    print(f"packets: {len(packets)}")

    if not packets:
        print("no packets parsed — check the pcap or the parser")
        return

    # sanity: a few packets
    for p in packets[:5]:
        print(
            f"  pkt#{p.packet_id} ts={p.ts:.3f} "
            f"{p.src_ip}:{p.src_port} -> {p.dst_ip}:{p.dst_port} "
            f"{p.protocol} len={len(p.payload or b'')}"
        )

    flows = sessionize(packets)
    print(f"input len: {len(packets)}")
    print(f"input ids: {[p.packet_id for p in packets]}")
    print(f"input objects: {[id(p) for p in packets]}")
    print()
    for f in flows:
        print(f"flow {f.flow_id}")
        print(f"  packet ids: {[p.packet_id for p in f.packets]}")
        print(f"  packet refs: {[id(p) for p in f.packets]}")
        print(f"  packet_count field: {f.packet_count}")

    # which packet_ids appear in more than one flow?
    seen = Counter()
    for f in flows:
        for p in f.packets:
            seen[p.packet_id] += 1

    dupes = [pid for pid, n in seen.items() if n > 1]
    missing = [p.packet_id for p in packets if p.packet_id not in seen]

    print(f"duplicated packet_ids: {dupes}")
    print(f"missing packet_ids:    {missing}")
    print(f"\nflows: {len(flows)}")

    if not flows:
        print("no flows — check flow_key or sessionize")
        return

    # sanity: biggest flow first
    flows.sort(key=lambda f: f.packet_count, reverse=True)

    for f in flows[:10]:
        print(
            f"\n  {f.flow_id}\n"
            f"    {f.src_ip}:{f.src_port} -> {f.dst_ip}:{f.dst_port} {f.protocol}\n"
            f"    packets={f.packet_count}  bytes={f.byte_count}\n"
            f"    start={f.start_ts:.3f}  end={f.end_ts:.3f}  "
            f"duration={f.end_ts - f.start_ts:.3f}s"
        )

    # sanity: totals should match
    total_packets = sum(f.packet_count for f in flows)
    total_bytes = sum(f.byte_count for f in flows)
    print(f"\nsum check: packets {total_packets}/{len(packets)}  "
          f"bytes {total_bytes}/{sum(len(p.payload or b'') for p in packets)}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("usage: python -m test_pipeline <path-to.pcap>")
        sys.exit(1)
    main(sys.argv[1])