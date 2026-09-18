import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ExternalLink } from "lucide-react";

export function AppHeader() {
	return (
		<header className="border-b border-[var(--border)] pb-5">
			<div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2">
						<img src="/block.svg" alt="" className="h-7 w-7" />
						<div className="text-2xl font-black uppercase tracking-[0.18em] text-[var(--text)]">
							STRATUM
						</div>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<nav className="flex items-center gap-3 text-xs text-[var(--muted)] sm:gap-5 sm:text-sm">
						<a
							href="#samples"
							className="transition-colors hover:text-[var(--text)]">
							Samples
						</a>
						<a
							href="https://github.com/wal-z1/Stratum"
							target="_blank"
							rel="noopener noreferrer"
							className="transition-colors hover:text-[var(--accent)]">
							GitHub <ExternalLink className="ml-1 inline h-3 w-3" />
						</a>
					</nav>
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
