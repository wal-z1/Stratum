export const CAPTURE_EXTENSIONS = [".pcap", ".pcapng", ".cap"] as const;
export const MAX_CAPTURE_SIZE = 4.5 * 1024 * 1024;

export function getCaptureExtension(fileName: string) {
	const extension = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();

	return CAPTURE_EXTENSIONS.includes(
		extension as (typeof CAPTURE_EXTENSIONS)[number],
	)
		? extension
		: null;
}

export function validateCapture(file: File | null | undefined) {
	if (!file) {
		return "Choose a capture file to continue.";
	}

	if (!getCaptureExtension(file.name)) {
		return "Please select a .pcap, .pcapng, or .cap capture file.";
	}

	if (file.size === 0) {
		return "The capture file is empty. Choose a file containing packets.";
	}

	if (file.size > MAX_CAPTURE_SIZE) {
		return "Capture files must be 4.5 MB or smaller.";
	}

	return null;
}

export function formatCaptureSize(bytes: number) {
	return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
