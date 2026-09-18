import { useState } from "react";
import {
	ChevronDown,
	Download,
	ExternalLink,
	FlaskConical,
	Play,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { sampleCaptures } from "@/data/sampleCaptures";
import type { SampleCapture } from "@/types/samples";

interface SampleBrowserProps {
	onAnalyze: (sample: SampleCapture) => void;
	isLoading: boolean;
}

export function SampleBrowser({ onAnalyze, isLoading }: SampleBrowserProps) {
	const [showAll, setShowAll] = useState(false);

	const visibleSamples = showAll
		? sampleCaptures
		: sampleCaptures.slice(0, 6);

	return (
		<section
			id="samples"
			className="space-y-4"
			aria-labelledby="samples-title"
		>
			<div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
				<div>
					<p className="eyebrow">External sample library</p>

					<h2 id="samples-title" className="section-title">
						Sample captures
					</h2>
				</div>

				<p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
					Public sample captures from the Wireshark project.
				</p>
			</div>

			<div className="sample-grid">
				{visibleSamples.map((sample) => (
					<Card
						key={sample.name}
						className="border-[var(--border)] bg-[var(--surface)]"
					>
						<CardContent className="flex h-full min-h-40 flex-col gap-2 p-3">
							<div className="flex items-start justify-between gap-3">
								<div className="min-w-0">
									<p className="break-all font-mono text-sm font-semibold text-[var(--text)]">
										{sample.name}
									</p>

									<p className="mt-1 text-xs text-[var(--muted)]">
										{sample.sourceName}
									</p>
								</div>

								<Badge>{sample.category}</Badge>
							</div>

							<p className="flex-1 text-xs leading-5 text-[var(--muted)]">
								{sample.description}
							</p>

							<div className="flex flex-wrap items-center gap-2">
								{sample.fetchMode === "direct" ? (
									<Button
										type="button"
										size="sm"
										onClick={() => onAnalyze(sample)}
										disabled={isLoading}
									>
										<Play className="h-3.5 w-3.5" />
										Analyze
									</Button>
								) : (
									<Button
										asChild
										type="button"
										size="sm"
										variant="secondary"
									>
										<a
											href={sample.downloadUrl}
											target="_blank"
											rel="noopener noreferrer"
										>
											<Download className="h-3.5 w-3.5" />
											Download
										</a>
									</Button>
								)}

								<Button
									asChild
									type="button"
									size="sm"
									variant="ghost"
								>
									<a
										href={sample.sourcePage}
										target="_blank"
										rel="noopener noreferrer"
									>
										<ExternalLink className="h-3.5 w-3.5" />
										Source
									</a>
								</Button>
							</div>

							{sample.fetchMode === "direct" ? (
								<p className="flex items-center gap-1 text-[11px] text-[var(--muted)]">
									<FlaskConical className="h-3 w-3" />
									Direct fetch from Wireshark
								</p>
							) : null}
						</CardContent>
					</Card>
				))}
			</div>

			{sampleCaptures.length > 6 ? (
				<button
					type="button"
					onClick={() => setShowAll((shown) => !shown)}
					aria-expanded={showAll}
					className="sample-toggle"
				>
					<span>
						{showAll
							? "Show fewer"
							: `Show all ${sampleCaptures.length}`}
					</span>

					<ChevronDown
						className={`sample-toggle-icon ${
							showAll ? "sample-toggle-icon-open" : ""
						}`}
					/>
				</button>
			) : null}
		</section>
	);
}