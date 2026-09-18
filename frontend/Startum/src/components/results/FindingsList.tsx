import { EmptyFindings } from "@/components/results/EmptyFindings";
import { FindingCard } from "@/components/results/FindingCard";
import type { Finding } from "@/types/analysis";

interface FindingsListProps {
	findings: Finding[];
}

export function FindingsList({ findings }: FindingsListProps) {
	if (findings.length === 0) {
		return <EmptyFindings />;
	}

	return (
		<div className="space-y-4">
			{findings.map((finding) => (
				<FindingCard key={finding.id} finding={finding} />
			))}
		</div>
	);
}
