import { useMemo, useRef, useState } from "react";

import { analyzeCapture } from "@/lib/api";
import {
	formatCaptureSize,
	getCaptureExtension,
	validateCapture,
} from "@/lib/capture";
import type { AnalysisResponse } from "@/types/analysis";
import type { SampleCapture } from "@/types/samples";

export function useCaptureAnalysis() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);

	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const fileInfo = useMemo(() => {
		if (!selectedFile) {
			return null;
		}

		const extension = getCaptureExtension(selectedFile.name);

		return {
			name: selectedFile.name,
			size: formatCaptureSize(selectedFile.size),
			type: extension ? extension.replace(".", "").toUpperCase() : "CAPTURE",
		};
	}, [selectedFile]);

	const validateFile = (file?: File | null) => {
		if (!file) {
			return null;
		}

		const validationError = validateCapture(file);

		if (validationError) {
			setError(validationError);
			setSelectedFile(null);
			setAnalysis(null);
			return null;
		}

		setError(null);
		setSelectedFile(file);
		setAnalysis(null);

		return file;
	};

	const runAnalysis = async (file: File) => {
		const validationError = validateCapture(file);

		if (validationError) {
			setError(validationError);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const result = await analyzeCapture(file);
			setAnalysis(result);
		} catch (err) {
			setAnalysis(null);

			setError(
				err instanceof Error
					? err.message
					: "The capture could not be analyzed.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const analyzeSelected = async () => {
		if (!selectedFile) {
			return;
		}

		await runAnalysis(selectedFile);
	};

	const analyzeSample = async (sample: SampleCapture) => {
		if (sample.fetchMode !== "direct") {
			setError(
				"This external source is configured for manual download. Download the capture and drop it into Stratum.",
			);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(sample.downloadUrl, {
				mode: "cors",
			});

			if (!response.ok) {
				throw new Error(
					`Could not download ${sample.name} from the external source.`,
				);
			}

			const blob = await response.blob();

			const file = new File([blob], sample.name, {
				type: blob.type || "application/octet-stream",
			});

			const validationError = validateCapture(file);

			if (validationError) {
				throw new Error(validationError);
			}

			setSelectedFile(file);

			const result = await analyzeCapture(file);
			setAnalysis(result);
		} catch (err) {
			setAnalysis(null);

			setError(
				err instanceof Error
					? err.message
					: "The external sample could not be analyzed.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const clearSelection = () => {
		setSelectedFile(null);
		setAnalysis(null);
		setError(null);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const findings = analysis?.findings ?? [];

	const sortedFindings = [...findings].sort((a, b) => {
		const priorities = {
			critical: 0,
			high: 1,
			medium: 2,
			low: 3,
			info: 4,
		} as const;

		return priorities[a.severity] - priorities[b.severity];
	});

	return {
		selectedFile,
		analysis,
		isLoading,
		error,
		isDragging,
		fileInputRef,
		fileInfo,
		findings,
		sortedFindings,

		setIsDragging,
		validateFile,
		analyzeSelected,
		analyzeSample,
		clearSelection,
	};
}
