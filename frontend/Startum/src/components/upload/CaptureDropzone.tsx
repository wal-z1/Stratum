import type { ChangeEvent, DragEvent, RefObject } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CaptureDropzoneProps {
	selectedFile: File | null;
	fileInfo: { name: string; size: string } | null;
	isDragging: boolean;
	isLoading: boolean;
	onDragOver: (event: DragEvent<HTMLDivElement>) => void;
	onDragLeave: () => void;
	onDrop: (event: DragEvent<HTMLDivElement>) => void;
	onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
	onAnalyze: () => void;
	onSample: () => void;
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
	onSample,
	onClear,
	fileInputRef,
}: CaptureDropzoneProps) {
	return (
		<div className="space-y-5 rounded-[20px] border border-slate-700/80 bg-slate-950/50 p-5 shadow-[0_12px_32px_rgba(2,8,23,0.35)]">
			<div
				className={cn(
					"rounded-2xl border border-dashed border-sky-400/50 bg-slate-900/60 p-6 transition-colors",
					isDragging && "border-sky-300 bg-sky-500/5",
				)}
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				onDrop={onDrop}
			>
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
							<p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-sky-300">
								Selected capture
							</p>
							<p className="text-lg font-semibold text-slate-50">
								{selectedFile.name}
							</p>
						</div>
						<div>
							<p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
								Size
							</p>
							<p className="text-lg font-semibold text-slate-100">
								{fileInfo?.size ?? "0.00"} MB
							</p>
						</div>
					</div>
				) : (
					<div className="grid min-h-32 place-items-center text-center">
						<div>
							<p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-sky-300">
								Upload Capture
							</p>
							<p className="text-sm text-slate-300">
								Drag and drop a .pcap, .pcapng, or .cap file.
							</p>
						</div>
					</div>
				)}
			</div>

			<div className="flex flex-wrap gap-3">
				<Button
					type="button"
					onClick={onAnalyze}
					disabled={!selectedFile || isLoading}
				>
					{isLoading ? "Analyzing capture..." : "Analyze capture"}
				</Button>
				<Button type="button" variant="secondary" onClick={onSample} disabled={isLoading}>
					Try Sample Capture
				</Button>
				{selectedFile ? (
					<Button type="button" variant="ghost" onClick={onClear}>
						Remove
					</Button>
				) : null}
			</div>
		</div>
	);
}
