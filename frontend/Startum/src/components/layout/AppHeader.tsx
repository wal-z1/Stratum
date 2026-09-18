export function AppHeader() {
	return (
		<header className="flex items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
			<div className="text-2xl font-black uppercase tracking-[0.18em] text-slate-50">
				STRATA
			</div>
			<nav className="flex items-center gap-4 text-sm text-slate-300">
				<a href="#overview" className="transition-colors hover:text-slate-50">
					Overview
				</a>
				<a
					href="https://github.com/wal-z1/LODE"
					target="_blank"
					rel="noreferrer"
					className="transition-colors hover:text-slate-50">
					GitHub
				</a>
			</nav>
		</header>
	);
}
