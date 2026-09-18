import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type {
	AnalysisEvent,
	AnalysisResponse,
	Finding,
	Flow,
	JsonValue,
	PacketSummary,
} from "@/types/analysis";

interface InvestigationResultsProps {
	analysis: AnalysisResponse;
	selectedFile: File | null;
}

type ResultTab =
	| "overview"
	| "flows"
	| "events"
	| "findings"
	| "hosts"
	| "technical";

interface HostSummary {
	ip: string;
	packets: number;
	bytes: number;
	protocols: Set<string>;
	ports: Set<number>;
}

const INITIAL_ROWS = 10;

function formatTimestamp(timestamp: number) {
	return new Date(timestamp * 1000)
		.toISOString()
		.replace("T", " ")
		.replace(".000Z", " UTC");
}

function formatDuration(seconds: number) {
	if (seconds < 1) return `${Math.round(seconds * 1000)} ms`;
	if (seconds < 60) return `${seconds.toFixed(2)} s`;
	return `${Math.floor(seconds / 60)}m ${(seconds % 60).toFixed(1)}s`;
}

function formatBytes(bytes: number) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatJsonValue(value: JsonValue) {
	if (typeof value === "string") return value;
	if (value === null || typeof value === "number" || typeof value === "boolean")
		return String(value);
	return JSON.stringify(value);
}

function endpointLabel(ip: string, port: number | null) {
	return port === null ? ip : `${ip}:${port}`;
}

function EmptyState({ children }: { children: string }) {
	return (
		<p className="border border-dashed border-[var(--border)] p-3 text-sm text-[var(--muted)]">
			{children}
		</p>
	);
}

function ShowMore({
	shown,
	total,
	onClick,
}: {
	shown: number;
	total: number;
	onClick: () => void;
}) {
	if (shown >= total) return null;
	return (
		<button
			type="button"
			onClick={onClick}
			className="text-xs font-semibold text-[var(--accent-strong)] hover:text-[var(--accent)]">
			Show more ({total - shown})
		</button>
	);
}

function summarizeHosts(packets: PacketSummary[]) {
	const hosts = new Map<string, HostSummary>();
	for (const packet of packets) {
		for (const endpoint of [
			{ ip: packet.src_ip, port: packet.src_port },
			{ ip: packet.dst_ip, port: packet.dst_port },
		]) {
			const host = hosts.get(endpoint.ip) ?? {
				ip: endpoint.ip,
				packets: 0,
				bytes: 0,
				protocols: new Set<string>(),
				ports: new Set<number>(),
			};
			host.packets += 1;
			host.bytes += packet.length;
			host.protocols.add(packet.protocol);
			if (endpoint.port !== null) host.ports.add(endpoint.port);
			hosts.set(endpoint.ip, host);
		}
	}
	return [...hosts.values()].sort((a, b) => b.bytes - a.bytes);
}

function FindingsPanel({ findings }: { findings: Finding[] }) {
	if (findings.length === 0) {
		return (
			<div className="border border-emerald-400/30 bg-emerald-500/5 px-4 py-3">
				<p className="font-semibold text-[var(--text)]">Clean result</p>
				<p className="mt-1 text-sm text-[var(--muted)]">
					No detector findings were reported for this capture.
				</p>
			</div>
		);
	}
	return (
		<div className="space-y-2">
			{findings.map((finding) => (
				<details
					key={finding.id}
					className="border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-2">
					<summary className="flex cursor-pointer list-none flex-wrap items-center gap-2">
						<Badge variant={finding.severity}>{finding.severity}</Badge>
						<Badge>{finding.category}</Badge>
						<span className="text-sm font-semibold text-[var(--text)]">
							{finding.title}
						</span>
						<span className="ml-auto text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
							{finding.confidence}
						</span>
					</summary>
					<div className="mt-2 border-t border-[var(--border)] pt-2 text-xs text-[var(--muted)]">
						<p>{finding.detail}</p>
						{finding.evidence.length > 0 ? (
							<ul className="mt-2 list-disc space-y-1 pl-4">
								{finding.evidence.map((item) => (
									<li key={`${finding.id}-${item}`}>{item}</li>
								))}
							</ul>
						) : null}
					</div>
				</details>
			))}
		</div>
	);
}

function FlowPanel({ flows }: { flows: Flow[] }) {
	const [limit, setLimit] = useState(INITIAL_ROWS);
	if (flows.length === 0)
		return (
			<EmptyState>No network flows were produced for this capture.</EmptyState>
		);
	return (
		<div className="space-y-3">
			<div className="overflow-x-auto border border-[var(--border)]">
				<table className="w-full min-w-[680px] text-left text-xs">
					<thead className="bg-[var(--surface-strong)] text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
						<tr>
							<th className="px-3 py-2">Conversation</th>
							<th className="px-3 py-2">Protocol</th>
							<th className="px-3 py-2">Packets / bytes</th>
							<th className="px-3 py-2">Duration</th>
							<th className="px-3 py-2">More</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-[var(--border)]">
						{flows.slice(0, limit).map((flow) => (
							<tr key={flow.flow_id} className="align-top">
								<td className="px-3 py-2 font-mono text-[11px] text-[var(--text)]">
									{endpointLabel(flow.src_ip, flow.src_port)}{" "}
									<span className="text-[var(--muted)]">to</span>{" "}
									{endpointLabel(flow.dst_ip, flow.dst_port)}
								</td>
								<td className="px-3 py-2">
									<Badge>{flow.protocol}</Badge>
								</td>
								<td className="px-3 py-2 text-[var(--muted)]">
									{flow.packet_count} / {formatBytes(flow.byte_count)}
								</td>
								<td className="px-3 py-2 text-[var(--muted)]">
									{formatDuration(flow.end_ts - flow.start_ts)}
								</td>
								<td className="px-3 py-2">
									<details>
										<summary className="cursor-pointer text-[var(--accent-strong)]">
											Inspect
										</summary>
										<div className="mt-2 space-y-1 text-[11px] text-[var(--muted)]">
											<p>
												Flow ID:{" "}
												<span className="font-mono">{flow.flow_id}</span>
											</p>
											<p>Start: {formatTimestamp(flow.start_ts)}</p>
											<p>End: {formatTimestamp(flow.end_ts)}</p>
											{flow.dns_name ? <p>DNS: {flow.dns_name}</p> : null}
										</div>
									</details>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<ShowMore
				shown={Math.min(limit, flows.length)}
				total={flows.length}
				onClick={() => setLimit((current) => current + INITIAL_ROWS)}
			/>
		</div>
	);
}

function EventPanel({ events }: { events: AnalysisEvent[] }) {
	const [limit, setLimit] = useState(INITIAL_ROWS);
	if (events.length === 0)
		return (
			<EmptyState>No protocol or connection events were extracted.</EmptyState>
		);
	return (
		<div className="space-y-2">
			{events.slice(0, limit).map((event) => (
				<details
					key={event.id}
					className="border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-2">
					<summary className="flex cursor-pointer list-none flex-wrap items-center gap-2">
						<Badge>{event.source}</Badge>
						<Badge variant="default">{event.kind}</Badge>
						<span className="text-sm font-semibold text-[var(--text)]">
							{event.summary}
						</span>
						<time className="ml-auto font-mono text-[10px] text-[var(--muted)]">
							{formatTimestamp(event.ts)}
						</time>
					</summary>
					<div className="mt-2 grid gap-x-4 gap-y-1 border-t border-[var(--border)] pt-2 text-[11px] text-[var(--muted)] sm:grid-cols-2">
						<p>
							Flow:{" "}
							<span className="font-mono">{event.flow_id ?? "unlinked"}</span>
						</p>
						{Object.entries(event.details).map(([key, value]) => (
							<p key={key}>
								<span className="uppercase tracking-[0.1em]">{key}:</span>{" "}
								{formatJsonValue(value)}
							</p>
						))}
					</div>
				</details>
			))}
			<ShowMore
				shown={Math.min(limit, events.length)}
				total={events.length}
				onClick={() => setLimit((current) => current + INITIAL_ROWS)}
			/>
		</div>
	);
}

function HostsPanel({ packets }: { packets: PacketSummary[] }) {
	const hosts = summarizeHosts(packets);
	if (hosts.length === 0)
		return (
			<EmptyState>No endpoint data was produced for this capture.</EmptyState>
		);
	return (
		<div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
			{hosts.map((host) => (
				<div
					key={host.ip}
					className="border border-[var(--border)] bg-[var(--surface-strong)] p-3">
					<p className="font-mono text-xs font-semibold text-[var(--text)]">
						{host.ip}
					</p>
					<div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
						<span>{host.packets} packets</span>
						<span>{formatBytes(host.bytes)}</span>
						<span>{[...host.protocols].join(", ")}</span>
						<span>
							ports {[...host.ports].sort((a, b) => a - b).join(", ") || "none"}
						</span>
					</div>
				</div>
			))}
		</div>
	);
}

function ProtocolPanel({ events }: { events: AnalysisEvent[] }) {
	const sources = [...new Set(events.map((event) => event.source))];
	if (sources.length === 0)
		return (
			<EmptyState>No protocol-specific metadata was extracted.</EmptyState>
		);
	return (
		<div className="grid gap-2 md:grid-cols-2">
			{sources.map((source) => {
				const sourceEvents = events.filter((event) => event.source === source);
				return (
					<details
						key={source}
						className="border border-[var(--border)] bg-[var(--surface-strong)] p-3">
						<summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-[var(--text)]">
							<span>{source.toUpperCase()}</span>
							<Badge>{sourceEvents.length}</Badge>
						</summary>
						<div className="mt-2 space-y-2 border-t border-[var(--border)] pt-2 text-xs text-[var(--muted)]">
							{sourceEvents.slice(0, 5).map((event) => (
								<div key={event.id}>
									<p className="font-semibold text-[var(--text)]">
										{event.kind}: {event.summary}
									</p>
									{Object.entries(event.details)
										.slice(0, 6)
										.map(([key, value]) => (
											<p key={key}>
												{key}: {formatJsonValue(value)}
											</p>
										))}
								</div>
							))}
						</div>
					</details>
				);
			})}
		</div>
	);
}

export function InvestigationResults({
	analysis,
	selectedFile,
}: InvestigationResultsProps) {
	const [activeTab, setActiveTab] = useState<ResultTab>("overview");
	const [showTechnical, setShowTechnical] = useState(false);
	const timestamps = analysis.packets.map((packet) => packet.ts);
	const start = timestamps.length > 0 ? Math.min(...timestamps) : null;
	const end = timestamps.length > 0 ? Math.max(...timestamps) : null;
	const protocolCounts = analysis.packets.reduce<Record<string, number>>(
		(counts, packet) => {
			counts[packet.protocol] = (counts[packet.protocol] ?? 0) + 1;
			return counts;
		},
		{},
	);
	const tabs: { id: ResultTab; label: string; count?: number }[] = [
		{ id: "overview", label: "Overview" },
		{ id: "flows", label: "Flows", count: analysis.flows.length },
		{ id: "events", label: "Events", count: analysis.events.length },
		{ id: "findings", label: "Findings", count: analysis.findings.length },
		{ id: "hosts", label: "Hosts / Protocols" },
		{ id: "technical", label: "Technical details" },
	];

	return (
		<div className="space-y-4">
			<div
				className="flex flex-wrap border border-[var(--border)] bg-[var(--surface)]"
				role="tablist"
				aria-label="Analysis views">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						type="button"
						role="tab"
						aria-selected={activeTab === tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`border-r border-[var(--border)] px-3 py-2 text-xs font-semibold transition-colors last:border-r-0 ${activeTab === tab.id ? "bg-[var(--accent)] text-[var(--button-text)]" : "text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"}`}>
						{tab.label}
						{tab.count !== undefined ? ` (${tab.count})` : ""}
					</button>
				))}
			</div>
			{activeTab === "overview" ? (
				<div className="space-y-4">
					<div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
						{[
							["Packets", analysis.summary.packets],
							["Flows", analysis.summary.flows],
							["Events", analysis.summary.events],
							["Findings", analysis.count],
						].map(([label, value]) => (
							<Card
								key={String(label)}
								className="border-[var(--border)] bg-[var(--surface)]">
								<CardContent className="p-3">
									<p className="metadata-label">{label}</p>
									<p className="mt-1 text-2xl font-semibold text-[var(--text)]">
										{value}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
					<div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
						<Card className="border-[var(--border)] bg-[var(--surface)]">
							<CardContent className="grid gap-3 p-4 text-xs sm:grid-cols-2">
								<div>
									<p className="metadata-label">Status</p>
									<p
										className={`mt-1 font-semibold ${analysis.findings.length > 0 ? "text-rose-400" : "text-emerald-400"}`}>
										{analysis.findings.length > 0
											? "Suspicious activity detected"
											: "Clean result"}
									</p>
								</div>
								<div>
									<p className="metadata-label">Capture</p>
									<p className="mt-1 break-all font-mono text-[11px] text-[var(--text)]">
										{selectedFile?.name ?? "API response"}
									</p>
								</div>
								<div>
									<p className="metadata-label">Duration</p>
									<p className="mt-1 text-[var(--text)]">
										{start !== null && end !== null
											? formatDuration(end - start)
											: "Unavailable"}
									</p>
								</div>
								<div>
									<p className="metadata-label">Time range</p>
									<p className="mt-1 text-[var(--text)]">
										{start !== null && end !== null
											? `${formatTimestamp(start)} to ${formatTimestamp(end)}`
											: "Unavailable"}
									</p>
								</div>
							</CardContent>
						</Card>
						<Card className="border-[var(--border)] bg-[var(--surface)]">
							<CardContent className="p-4">
								<p className="metadata-label">Top protocols</p>
								<p className="mt-2 text-xs text-[var(--muted)]">
									{Object.entries(protocolCounts)
										.map(([protocol, count]) => `${protocol} ${count}`)
										.join(" / ") || "None"}
								</p>
								<p className="metadata-label mt-4">Most active flows</p>
								<div className="mt-2 space-y-1 text-xs text-[var(--muted)]">
									{analysis.flows.slice(0, 3).map((flow) => (
										<p key={flow.flow_id} className="truncate font-mono">
											{endpointLabel(flow.src_ip, flow.src_port)} to{" "}
											{endpointLabel(flow.dst_ip, flow.dst_port)}
										</p>
									))}
									{analysis.flows.length === 0 ? <p>None</p> : null}
								</div>
							</CardContent>
						</Card>
					</div>
					<div>
						<p className="metadata-label mb-2">Important findings</p>
						<FindingsPanel findings={analysis.findings.slice(0, 3)} />
					</div>
				</div>
			) : null}
			{activeTab === "flows" ? <FlowPanel flows={analysis.flows} /> : null}
			{activeTab === "events" ? <EventPanel events={analysis.events} /> : null}
			{activeTab === "findings" ? (
				<FindingsPanel findings={analysis.findings} />
			) : null}
			{activeTab === "hosts" ? (
				<div className="space-y-4">
					<HostsPanel packets={analysis.packets} />
					<ProtocolPanel events={analysis.events} />
				</div>
			) : null}
			{activeTab === "technical" ? (
				<Card className="border-[var(--border)] bg-[var(--surface)]">
					<CardContent className="p-4">
						<button
							type="button"
							className="text-xs font-semibold text-[var(--accent-strong)]"
							onClick={() => setShowTechnical((shown) => !shown)}>
							{showTechnical
								? "Hide technical details"
								: "Show technical details"}
						</button>
						{showTechnical ? (
							<pre className="mt-3 max-h-[32rem] overflow-auto border border-[var(--border)] bg-[var(--surface-strong)] p-3 font-mono text-[11px] leading-5 text-[var(--muted)]">
								{JSON.stringify(analysis, null, 2)}
							</pre>
						) : null}
					</CardContent>
				</Card>
			) : null}
		</div>
	);
}
