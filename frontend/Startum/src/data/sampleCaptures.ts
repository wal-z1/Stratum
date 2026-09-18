import type { SampleCapture } from "@/types/samples";

const WIRESHARK_SAMPLES = "https://wiki.wireshark.org/SampleCaptures";
const WIRESHARK_GITHUB =
	"https://github.com/wireshark/wireshark/blob/master/test/captures";
const WIRESHARK_RAW =
	"https://raw.githubusercontent.com/wireshark/wireshark/master/test/captures";

function wikiDownload(name: string) {
	return (
		"https://wiki.wireshark.org/" +
		"SampleCaptures?action=AttachFile&do=get&target=" +
		encodeURIComponent(name)
	);
}

function githubCapture(name: string) {
	return `${WIRESHARK_GITHUB}/${encodeURIComponent(name)}`;
}

function rawCapture(name: string) {
	return `${WIRESHARK_RAW}/${encodeURIComponent(name)}`;
}

export const sampleCaptures: SampleCapture[] = [
	{
		name: "http.cap",
		category: "HTTP",
		description: "Basic HTTP request and response exchange.",
		sourceName: "Wireshark",
		sourcePage: WIRESHARK_SAMPLES,
		downloadUrl: wikiDownload("http.cap"),
		fetchMode: "manual",
	},
	{
		name: "dns.cap",
		category: "DNS",
		description:
			"A capture containing several DNS lookup requests and responses.",
		sourceName: "Wireshark",
		sourcePage: WIRESHARK_SAMPLES,
		downloadUrl: wikiDownload("dns.cap"),
		fetchMode: "manual",
	},
	{
		name: "smtp.pcap",
		category: "SMTP",
		description: "Simple SMTP session showing email transport traffic.",
		sourceName: "Wireshark",
		sourcePage: WIRESHARK_SAMPLES,
		downloadUrl: wikiDownload("smtp.pcap"),
		fetchMode: "manual",
	},
	{
		name: "ipv4frags.pcap",
		category: "IPv4 / ICMP",
		description:
			"ICMP echo traffic showing IPv4 fragmentation across a smaller MTU.",
		sourceName: "Wireshark",
		sourcePage: WIRESHARK_SAMPLES,
		downloadUrl: wikiDownload("ipv4frags.pcap"),
		fetchMode: "manual",
	},
	{
		name: "http-chunked-gzip.pcap",
		category: "HTTP",
		description:
			"HTTP response using both gzip compression and chunked transfer encoding.",
		sourceName: "Wireshark",
		sourcePage: WIRESHARK_SAMPLES,
		downloadUrl: wikiDownload("http-chunked-gzip.pcap"),
		fetchMode: "manual",
	},
	{
		name: "http_redirects.pcapng",
		category: "HTTP",
		description: "TCP/HTTP traffic containing a chain of HTTP 302 redirects.",
		sourceName: "Wireshark",
		sourcePage: WIRESHARK_SAMPLES,
		downloadUrl: wikiDownload("http_redirects.pcapng"),
		fetchMode: "manual",
	},
	{
		name: "tcp-ecn-sample.pcap",
		category: "TCP / HTTP",
		description:
			"HTTP file transfer demonstrating TCP Explicit Congestion Notification.",
		sourceName: "Wireshark",
		sourcePage: WIRESHARK_SAMPLES,
		downloadUrl: wikiDownload("tcp-ecn-sample.pcap"),
		fetchMode: "manual",
	},
	{
		name: "Network_Join_Nokia_Mobile.pcap",
		category: "802.11",
		description:
			"Wireless client join showing authentication and WPA cipher activation.",
		sourceName: "Wireshark",
		sourcePage: "https://wiki.wireshark.org/Wi-Fi",
		downloadUrl: wikiDownload("Network_Join_Nokia_Mobile.pcap"),
		fetchMode: "manual",
	},
	{
		name: "fix.pcap",
		category: "FIX",
		description:
			"Financial Information eXchange traffic generated using the Fix8 test suite.",
		sourceName: "Wireshark",
		sourcePage: WIRESHARK_SAMPLES,
		downloadUrl: wikiDownload("fix.pcap"),
		fetchMode: "manual",
	},
	{
		name: "protobuf_udp_addressbook.pcapng",
		category: "Protobuf / UDP",
		description: "Protocol Buffers address-book messages transported over UDP.",
		sourceName: "Wireshark",
		sourcePage: "https://wiki.wireshark.org/Protobuf",
		downloadUrl: wikiDownload("protobuf_udp_addressbook.pcapng"),
		fetchMode: "manual",
	},
	{
		name: "protobuf_tcp_addressbook.pcapng",
		category: "Protobuf / TCP",
		description: "Protocol Buffers address-book messages transported over TCP.",
		sourceName: "Wireshark",
		sourcePage: "https://wiki.wireshark.org/Protobuf",
		downloadUrl: wikiDownload("protobuf_tcp_addressbook.pcapng"),
		fetchMode: "manual",
	},
	{
		name: "http2-data-reassembly.pcap",
		category: "HTTP/2",
		description: "HTTP/2 capture used to exercise data-stream reassembly.",
		sourceName: "Wireshark",
		sourcePage: githubCapture("http2-data-reassembly.pcap"),
		downloadUrl: rawCapture("http2-data-reassembly.pcap"),
		fetchMode: "direct",
	},
];