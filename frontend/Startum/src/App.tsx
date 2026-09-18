import type { ChangeEvent, DragEvent } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { AnalysisSummary } from "@/components/results/AnalysisSummary";
import { FindingsList } from "@/components/results/FindingsList";
import { CaptureDropzone } from "@/components/upload/CaptureDropzone";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCaptureAnalysis } from "@/hooks/useCaptureAnalysis";

function App() {
	const {
		selectedFile,
		analysis,
		isLoading,
		error,
		isDragging,
		fileInputRef,
		fileInfo,
		sortedFindings,
		setIsDragging,
		validateFile,
		analyzeSelected,
		handleSample,
		clearSelection,
	} = useCaptureAnalysis();

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		validateFile(event.target.files?.[0]);
	};

	const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragging(true);
	};

	const handleDrop = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragging(false);
		validateFile(event.dataTransfer.files?.[0]);
	};

	const loadingSteps = [
		"Reading packets",
		"Building flows",
		"Extracting protocol events",
		"Running detectors",
	];

	return (
		<AppShell>
			<section id="overview" className="space-y-7">
				<div className="space-y-4">
					<p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-300">
						PCAP ANALYZER
					</p>
					<h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-slate-50 sm:text-5xl lg:text-6xl">
						Network capture analysis for suspicious traffic
					</h1>
					<p className="max-w-2xl text-base leading-7 text-slate-300">
						Upload a packet capture and inspect the real parser, sessions,
						events, and detector findings.
					</p>
				</div>

				<Card className="border-slate-700/80 bg-slate-950/60">
					<CardContent className="p-5">
						<CaptureDropzone
							selectedFile={selectedFile}
							fileInfo={fileInfo}
							isDragging={isDragging}
							isLoading={isLoading}
							onDragOver={handleDragOver}
							onDragLeave={() => setIsDragging(false)}
							onDrop={handleDrop}
							onFileChange={handleFileChange}
							onAnalyze={analyzeSelected}
							onSample={handleSample}
							onClear={clearSelection}
							fileInputRef={fileInputRef}
						/>
						{error ? <Alert className="mt-5">{error}</Alert> : null}
					</CardContent>
				</Card>

				{isLoading ? (
					<Card className="border-slate-700/80 bg-slate-950/60">
						<CardHeader>
							<CardTitle>Analyzing capture...</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="list-disc space-y-2 pl-5 text-slate-200">
								{loadingSteps.map((step) => (
									<li key={step}>{step}</li>
								))}
							</ul>
						</CardContent>
					</Card>
				) : null}

				{analysis ? (
					<Card className="border-slate-700/80 bg-slate-950/60">
						<CardHeader>
							<CardTitle>Analysis results</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<AnalysisSummary analysis={analysis} />
							<Separator className="bg-slate-700/80" />
							<FindingsList findings={sortedFindings} />
						</CardContent>
					</Card>
				) : null}
			</section>
		</AppShell>
	);
}

export default App;
