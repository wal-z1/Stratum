import type { AnalysisResponse } from "@/types/analysis";

const DEFAULT_API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function analyzeCapture(
	file: File,
	apiBase = DEFAULT_API,
): Promise<AnalysisResponse> {
	const formData = new FormData();
	formData.append("file", file, file.name);

	const response = await fetch(`${apiBase}/analyze`, {
		method: "POST",
		body: formData,
	});

	const data = await response.json().catch(() => null);
	if (!response.ok) {
		const message =
			data && typeof data === "object" && "detail" in data
				? String(data.detail)
				: "Analysis failed";
		throw new Error(message);
	}

	return data as AnalysisResponse;
}
