export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type Status = "fail" | "warn" | "pass" | "info";
export type Confidence = "low" | "medium" | "high";
export type EventSource =
	| "http"
	| "dns"
	| "dhcp"
	| "arp"
	| "icmp"
	| "tcp"
	| "tls"
	| "smtp"
	| "ftp"
	| "imap"
	| "smb";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export interface JsonObject {
	[key: string]: JsonValue;
}

export interface Finding {
	id: string;
	title: string;
	category: string;
	severity: Severity;
	status: Status;
	confidence: Confidence;
	detail: string;
	evidence: string[];
}

export interface PacketSummary {
	packet_id: number;
	ts: number;
	src_ip: string;
	dst_ip: string;
	src_port: number | null;
	dst_port: number | null;
	protocol: string;
	length: number;
	tcp_flags: number;
}

export interface Flow {
	flow_id: string;
	src_ip: string;
	dst_ip: string;
	src_port: number | null;
	dst_port: number | null;
	protocol: string;
	start_ts: number;
	end_ts: number;
	packet_count: number;
	byte_count: number;
	dns_name: string | null;
}

export interface AnalysisEvent {
	id: string;
	ts: number;
	source: EventSource | string;
	kind: string;
	summary: string;
	details: JsonObject;
	flow_id: string | null;
}

export interface AnalysisSummary {
	packets: number;
	flows: number;
	events: number;
}

export interface AnalysisResponse {
	summary: AnalysisSummary;
	count: number;
	findings: Finding[];
	packets: PacketSummary[];
	flows: Flow[];
	events: AnalysisEvent[];
}
