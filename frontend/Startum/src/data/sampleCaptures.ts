import type { SampleCapture } from "@/types/samples";

const WIRESHARK_SAMPLES = "https://wiki.wireshark.org/SampleCaptures";

function wikiDownload(name: string) {
	return (
		"https://wiki.wireshark.org/" +
		"SampleCaptures?action=AttachFile&do=get&target=" +
		encodeURIComponent(name)
	);
}

export const sampleCaptures: SampleCapture[] = [
	{
		name: "http.cap",
		category: "HTTP",
		description: "Simple HTTP request and response.",
		sourceName: "Wireshark Sample Captures",
		sourcePage: WIRESHARK_SAMPLES,
		downloadUrl: wikiDownload("http.cap"),
		fetchMode: "manual",
	},
	{
		name: "dns.cap",
		category: "DNS",
		description: "DNS lookup traffic for protocol inspection.",
		sourceName: "Wireshark Sample Captures",
		sourcePage: WIRESHARK_SAMPLES,
		downloadUrl: wikiDownload("dns.cap"),
		fetchMode: "manual",
	},
	{
		name: "smtp.pcap",
		category: "SMTP",
		description: "Simple SMTP traffic example.",
		sourceName: "Wireshark Sample Captures",
		sourcePage: WIRESHARK_SAMPLES,
		downloadUrl: wikiDownload("smtp.pcap"),
		fetchMode: "manual",
	},
	{
		name: "ipv4frags.pcap",
		category: "IPv4 / ICMP",
		description: "ICMP traffic demonstrating IPv4 fragmentation.",
		sourceName: "Wireshark Sample Captures",
		sourcePage: WIRESHARK_SAMPLES,
		downloadUrl: wikiDownload("ipv4frags.pcap"),
		fetchMode: "manual",
	},
	{
		name: "http-chunked-gzip.pcap",
		category: "HTTP",
		description: "HTTP response using gzip and chunked transfer encoding.",
		sourceName: "Wireshark Sample Captures",
		sourcePage: WIRESHARK_SAMPLES,
		downloadUrl: wikiDownload("http-chunked-gzip.pcap"),
		fetchMode: "manual",
	},
	{
		name: "http_redirects.pcapng",
		category: "HTTP",
		description: "HTTP traffic containing multiple redirects.",
		sourceName: "Wireshark Sample Captures",
		sourcePage: WIRESHARK_SAMPLES,
		downloadUrl: wikiDownload("http_redirects.pcapng"),
		fetchMode: "manual",
	},
	{
		name: "tcp-ecn-sample.pcap",
		category: "TCP / HTTP",
		description:
			"TCP/HTTP transfer demonstrating Explicit Congestion Notification.",
		sourceName: "Wireshark Sample Captures",
		sourcePage: WIRESHARK_SAMPLES,
		downloadUrl: wikiDownload("tcp-ecn-sample.pcap"),
		fetchMode: "manual",
	},
	{
		name: "Network_Join_Nokia_Mobile.pcap",
		category: "Wi-Fi",
		description:
			"802.11 client joining and authenticating with a wireless network.",
		sourceName: "Wireshark Sample Captures",
		sourcePage: WIRESHARK_SAMPLES,
		downloadUrl: wikiDownload("Network_Join_Nokia_Mobile.pcap"),
		fetchMode: "manual",
	},
	{
		name: "fix.pcap",
		category: "FIX",
		description: "Financial Information eXchange protocol traffic.",
		sourceName: "Wireshark Sample Captures",
		sourcePage: WIRESHARK_SAMPLES,
		downloadUrl: wikiDownload("fix.pcap"),
		fetchMode: "manual",
	},
	{
		name: "protobuf_udp_addressbook.pcapng",
		category: "Protobuf / UDP",
		description: "Protocol Buffers address-book data transported over UDP.",
		sourceName: "Wireshark Sample Captures",
		sourcePage: WIRESHARK_SAMPLES,
		downloadUrl: wikiDownload("protobuf_udp_addressbook.pcapng"),
		fetchMode: "manual",
	},
	{
		name: "protobuf_tcp_addressbook.pcapng",
		category: "Protobuf / TCP",
		description: "Protocol Buffers address-book data transported over TCP.",
		sourceName: "Wireshark Sample Captures",
		sourcePage: WIRESHARK_SAMPLES,
		downloadUrl: wikiDownload("protobuf_tcp_addressbook.pcapng"),
		fetchMode: "manual",
	},
	{
		name: "http2-data-reassembly.pcap",
		category: "HTTP/2",
		description: "HTTP/2 capture demonstrating data reassembly.",
		sourceName: "Wireshark project",
		sourcePage:
			"https://github.com/wireshark/wireshark/blob/master/test/captures/http2-data-reassembly.pcap",
		downloadUrl:
			"https://raw.githubusercontent.com/wireshark/wireshark/master/test/captures/http2-data-reassembly.pcap",
		fetchMode: "direct",
	},
];
