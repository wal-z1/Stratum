export function EmptyFindings() {
	return (
		<div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/5 p-6">
			<h3 className="text-xl font-semibold text-slate-50">Clean result</h3>
			<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">
				No current detector fired on this capture. The analysis completed
				successfully and no suspicious activities were identified.
			</p>
		</div>
	);
}
