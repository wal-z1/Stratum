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
			<section id="overview" className="space-y-8 sm:space-y-10">
				<div className="hero-grid">
					<div className="hero-copy">
						<p className="eyebrow">Network capture analysis</p>

						<h1 className="hero-title">
							PCAP analysis,
							<br />
							without the noise.
						</h1>

						<p className="hero-description">
							Inspect flows, protocol activity, hosts, and security findings
							from a single capture.
						</p>
					</div>

					<div className="hero-art" aria-hidden="true">
						<img
							src="/blocks_transparent.png"
							alt=""
							className="hero-art-image"
						/>
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
