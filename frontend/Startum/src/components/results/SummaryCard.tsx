import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
	label: string;
	value: number;
	className?: string;
}

export function SummaryCard({ label, value, className }: SummaryCardProps) {
	return (
		<Card className={cn("border-slate-700/80 bg-slate-900/70", className)}>
			<CardContent className="p-4">
				<p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
					{label}
				</p>
				<p className="mt-3 text-3xl font-semibold text-slate-50">{value}</p>
			</CardContent>
		</Card>
	);
}
