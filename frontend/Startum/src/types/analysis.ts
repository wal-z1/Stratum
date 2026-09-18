export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type Status = "fail" | "warn" | "pass" | "info";
export type Confidence = "low" | "medium" | "high";

export interface Finding {
	id: string;
	title: string;
	category: string;
	severity: Severity;
	status: Status;
	confidence: Confidence;
	detail: string;
	evidence: string[];
}

export interface AnalysisSummary {
	packets: number;
	flows: number;
	events: number;
}

export interface AnalysisResponse {
	summary: AnalysisSummary;
	count: number;
	findings: Finding[];
}
