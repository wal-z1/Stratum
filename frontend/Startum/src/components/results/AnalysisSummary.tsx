import { SummaryCard } from "@/components/results/SummaryCard";
import type { AnalysisResponse } from "@/types/analysis";

interface AnalysisSummaryProps {
	analysis: AnalysisResponse;
}

export function AnalysisSummary({ analysis }: AnalysisSummaryProps) {
	return (
		<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			<SummaryCard label="Packets" value={analysis.summary.packets} />
			<SummaryCard label="Flows" value={analysis.summary.flows} />
			<SummaryCard label="Events" value={analysis.summary.events} />
			<SummaryCard label="Findings" value={analysis.count} />
		</div>
	);
}
