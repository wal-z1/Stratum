export type SampleFetchMode = "direct" | "manual";

export interface SampleCapture {
	name: string;
	category: string;
	description: string;
	sourceName: string;
	sourcePage: string;
	downloadUrl: string;
	fetchMode: SampleFetchMode;
}
