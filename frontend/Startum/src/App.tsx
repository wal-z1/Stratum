import type { ChangeEvent, DragEvent } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { InvestigationResults } from "@/components/results/InvestigationResults";
import { SampleBrowser } from "@/components/samples/SampleBrowser";
import { CaptureDropzone } from "@/components/upload/CaptureDropzone";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCaptureAnalysis } from "@/hooks/useCaptureAnalysis";
import type { SampleCapture } from "@/types/samples";

function App() {
	const capture = useCaptureAnalysis();

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		capture.validateFile(event.target.files?.[0]);
	};

	const handleDrop = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		capture.setIsDragging(false);
		capture.validateFile(event.dataTransfer.files?.[0]);
	};

	const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		capture.setIsDragging(true);
	};

	const handleSample = (sample: SampleCapture) => {
		void capture.analyzeSample(sample);
	};

	return (
		<AppShell>
			<section id="overview" className="space-y-10 sm:space-y-12">
				<div className="space-y-3">
					<p className="eyebrow">Network capture intelligence</p>
					<h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.06em] text-[var(--text)] sm:text-6xl">
						See the structure inside suspicious traffic.
					</h1>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
						<p className="max-w-2xl text-base leading-7 text-[var(--muted)]">
							Upload a packet capture to inspect flows, protocol events,
							correlations, and detector findings through the Stratum analysis
							pipeline.
						</p>
						<p className="max-w-xs border-l-2 border-[var(--accent)] pl-4 text-sm font-semibold leading-6 text-[var(--accent-strong)]">
							Trace packets. Find patterns. Make the signal visible.
						</p>
					</div>
				</div>

				<section
					id="analyzer"
					className="space-y-3"
					aria-labelledby="analyzer-title">
					<div>
						<p className="eyebrow">Capture analyzer</p>
						<h2 id="analyzer-title" className="section-title">
							Inspect a capture
						</h2>
					</div>
					<Card className="border-[var(--border)] bg-[var(--surface)]">
						<CardContent className="p-4">
							<CaptureDropzone
								selectedFile={capture.selectedFile}
								fileInfo={capture.fileInfo}
								isDragging={capture.isDragging}
								isLoading={capture.isLoading}
								onDragOver={handleDragOver}
								onDragLeave={() => capture.setIsDragging(false)}
								onDrop={handleDrop}
								onFileChange={handleFileChange}
								onAnalyze={() => void capture.analyzeSelected()}
								onClear={capture.clearSelection}
								fileInputRef={capture.fileInputRef}
							/>
							{capture.error ? (
								<Alert className="mt-5">{capture.error}</Alert>
							) : null}
						</CardContent>
					</Card>
				</section>

				{capture.isLoading ? (
					<Card className="border-[var(--border)] bg-[var(--surface)]">
						<CardHeader>
							<CardTitle>Working through the capture...</CardTitle>
						</CardHeader>
						<CardContent>
							<div
								className="loading-track"
								aria-label="Analysis in progress"
							/>
							<p className="mt-3 text-sm text-[var(--muted)]">
								Reading packets, building flows, and running detectors.
							</p>
						</CardContent>
					</Card>
				) : null}

				{capture.analysis ? (
					<section
						id="results"
						aria-labelledby="results-title"
						className="space-y-3">
						<div>
							<p className="eyebrow">Analysis results</p>
							<h2 id="results-title" className="section-title">
								Capture findings
							</h2>
						</div>
						<InvestigationResults
							analysis={capture.analysis}
							selectedFile={capture.selectedFile}
						/>
					</section>
				) : null}

				<SampleBrowser onAnalyze={handleSample} isLoading={capture.isLoading} />
			</section>
		</AppShell>
	);
}

export default App;
