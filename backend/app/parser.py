import dpkt
import dpkt.utils
import io
from .models import Packet

def parse_one_packet(packet_id: int, ts: float, buf: bytes) -> Packet:
  eth = dpkt.ethernet.Ethernet(buf)
  if isinstance(eth.data, dpkt.ip.IP):
    pkt = Packet(
      packet_id=0,  # set to 0 for now; can be updated later
      ts=ts,
      src_ip=dpkt.utils.inet_to_str(eth.data.src),
      dst_ip=dpkt.utils.inet_to_str(eth.data.dst),
      src_port=eth.data.data.sport if hasattr(eth.data.data, 'sport') else None,
      dst_port=eth.data.data.dport if hasattr(eth.data.data, 'dport') else None,
      protocol=eth.data.p,
      length=len(buf),
      payload=buf
    )
  else:
        pkt = Packet(
        packet_id=0,  # set to 0 for now; can be updated later
        ts=ts,
        src_ip="",
        dst_ip="",
        src_port=None,
        dst_port=None,
        protocol="OTHER",
        length=len(buf),
        payload=buf
      )
return pkt 


def pcap_file(raw:bytes)-> list[Packet]:
  packets = []
  pcap = dpkt.pcap.Reader(io.BytesIO(raw))
  try:
    for ts, buf in pcap:
      packet =
      packets.append(packet)
    return packets
  except Exception as e:
    print(f"Error parsing pcap file: {e}")
    return []
