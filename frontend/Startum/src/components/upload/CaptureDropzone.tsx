import type { ChangeEvent, DragEvent, RefObject } from "react";
import { FileUp, RefreshCw, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CaptureDropzoneProps {
	selectedFile: File | null;
	fileInfo: { name: string; size: string; type: string } | null;
	isDragging: boolean;
	isLoading: boolean;
	onDragOver: (event: DragEvent<HTMLDivElement>) => void;
	onDragLeave: () => void;
	onDrop: (event: DragEvent<HTMLDivElement>) => void;
	onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
	onAnalyze: () => void;
	onClear: () => void;
	fileInputRef: RefObject<HTMLInputElement | null>;
}

export function CaptureDropzone({
	selectedFile,
	fileInfo,
	isDragging,
	isLoading,
	onDragOver,
	onDragLeave,
	onDrop,
	onFileChange,
	onAnalyze,
	onClear,
	fileInputRef,
}: CaptureDropzoneProps) {
	return (
		<div className="space-y-3 border border-[var(--border)] bg-[var(--surface-strong)] p-4 shadow-[0_12px_32px_rgba(15,23,42,0.12)]">
			<div
				className={cn(
					"border border-dashed border-[var(--accent)]/60 bg-[var(--surface)] p-4 transition-colors",
					isDragging &&
						"border-[var(--accent-strong)] bg-[var(--surface-muted)]",
				)}
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				onDrop={onDrop}>
				<input
					type="file"
					accept=".pcap,.pcapng,.cap"
					ref={fileInputRef}
					onChange={onFileChange}
					className="hidden"
				/>

				{selectedFile ? (
					<div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
						<div>
							<p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
								Selected capture
							</p>
							<p className="break-all text-lg font-semibold text-[var(--text)]">
								{selectedFile.name}
							</p>
							<p className="mt-2 text-sm text-[var(--muted)]">
								{fileInfo?.type} capture
							</p>
							<Button
								type="button"
								size="sm"
								variant="ghost"
								className="mt-3"
								onClick={() => fileInputRef.current?.click()}>
								Change file
							</Button>
						</div>
						<div>
							<p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
								Size
							</p>
							<p className="text-lg font-semibold text-[var(--text)]">
								{fileInfo?.size ?? "0.00 MB"}
							</p>
						</div>
					</div>
				) : (
					<div className="grid min-h-24 place-items-center text-center">
						<div>
							<p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
								Upload Capture
							</p>
							<p className="flex items-center justify-center gap-2 text-sm text-[var(--muted)]">
								<FileUp className="h-4 w-4 text-[var(--accent)]" />
								Drag and drop, or choose a .pcap, .pcapng, or .cap file.
							</p>
							<p className="mt-2 text-xs text-[var(--muted)]">
								Maximum upload: 4.5 MB
							</p>
							<Button
								type="button"
								size="sm"
								variant="secondary"
								className="mt-4"
								onClick={() => fileInputRef.current?.click()}>
								Choose file
							</Button>
						</div>
					</div>
				)}
			</div>

			<div className="flex flex-wrap gap-2">
				<Button
					type="button"
					onClick={onAnalyze}
					disabled={!selectedFile || isLoading}>
					{isLoading ? (
						<>
							<RefreshCw className="h-4 w-4 animate-spin" /> Analyzing...
						</>
					) : (
						"Analyze capture"
					)}
				</Button>
				{selectedFile ? (
					<Button type="button" variant="ghost" onClick={onClear}>
						<X className="h-4 w-4" /> Clear selection
					</Button>
				) : null}
			</div>
		</div>
	);
}
