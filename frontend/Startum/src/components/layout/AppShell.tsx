import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";

interface AppShellProps {
	children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
	return (
		<div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
			<div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-5 sm:px-8 sm:pb-14 sm:pt-7 lg:px-12">
				<AppHeader />
				<main className="pt-10 sm:pt-14">{children}</main>
				<AppFooter />
			</div>
		</div>
	);
}
