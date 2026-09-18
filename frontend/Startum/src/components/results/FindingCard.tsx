import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Finding } from "@/types/analysis";

interface FindingCardProps {
	finding: Finding;
}

const severityStyles: Record<Finding["severity"], string> = {
	critical: "border-rose-400/40",
	high: "border-orange-400/40",
	medium: "border-amber-400/40",
	low: "border-sky-400/40",
	info: "border-emerald-400/40",
};

export function FindingCard({ finding }: FindingCardProps) {
	return (
		<Card
			className={cn(
				"border bg-slate-950/60",
				severityStyles[finding.severity],
			)}>
			<CardContent className="space-y-4 p-4">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<div className="flex flex-wrap items-center gap-2">
						<Badge variant={finding.severity}>{finding.severity}</Badge>
						<Badge variant="default">{finding.category}</Badge>
					</div>
					<p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300">
						{finding.confidence}
					</p>
				</div>

				<div>
					<h3 className="text-xl font-semibold text-slate-50">
						{finding.title}
					</h3>
					<p className="mt-2 text-sm leading-6 text-slate-200">
						{finding.detail}
					</p>
				</div>

				{finding.evidence.length > 0 ? (
					<ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
						{finding.evidence.map((item) => (
							<li key={`${finding.id}-${item}`}>{item}</li>
						))}
					</ul>
				) : null}
			</CardContent>
		</Card>
	);
}
