import { useMemo, useRef, useState } from "react";

import { analyzeCapture, sampleCaptureUrl } from "@/lib/api";
import type { AnalysisResponse } from "@/types/analysis";

const supportedExtensions = [".pcap", ".pcapng", ".cap"] as const;

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

		return {
			name: selectedFile.name,
			size: (selectedFile.size / (1024 * 1024)).toFixed(2),
		};
	}, [selectedFile]);

	const validateFile = (file?: File | null) => {
		if (!file) {
			setSelectedFile(null);
			return null;
		}

		const lowerName = file.name.toLowerCase();
		if (!supportedExtensions.some((extension) => lowerName.endsWith(extension))) {
			setError("Unsupported file type. Use a .pcap, .pcapng, or .cap capture.");
			setSelectedFile(null);
			return null;
		}

		setError(null);
		setSelectedFile(file);
		return file;
	};

	const runAnalysis = async (file: File) => {
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

	const handleSample = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = await fetch(sampleCaptureUrl);
			if (!response.ok) {
				throw new Error("Sample capture download failed.");
			}

			const blob = await response.blob();
			const file = new File([blob], "http.pcap", {
				type: "application/octet-stream",
			});
			setSelectedFile(file);
			const result = await analyzeCapture(file);
			setAnalysis(result);
		} catch (err) {
			setAnalysis(null);
			setError(
				err instanceof Error
					? err.message
					: "The sample capture could not be analyzed.",
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
		handleSample,
		clearSelection,
	};
}
