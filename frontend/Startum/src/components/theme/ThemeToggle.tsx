import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/useTheme";

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();
	const isLight = theme === "light";

	return (
		<Button
			type="button"
			variant="secondary"
			size="icon"
			onClick={toggleTheme}
			aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
			className="h-9 w-9 border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]">
			{isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
		</Button>
	);
}
