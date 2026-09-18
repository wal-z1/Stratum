import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/AppHeader";

interface AppShellProps {
	children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
	return (
		<div className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
			<AppHeader />
			<main className="pt-8">{children}</main>
		</div>
	);
}
