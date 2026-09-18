export function AppFooter() {
	return (
		<footer className="mt-20 border-t border-[var(--border)] py-8 text-sm text-[var(--muted)] sm:mt-24">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<p>
					Stratum is open source. Capture samples are provided by Wireshark.
				</p>
				<a
					href="https://github.com/wal-z1/Stratum"
					target="_blank"
					rel="noopener noreferrer"
					className="font-semibold text-[var(--text)] hover:text-[var(--accent)]">
					View Stratum on GitHub
				</a>
			</div>
		</footer>
	);
}
