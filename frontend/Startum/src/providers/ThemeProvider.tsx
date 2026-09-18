import { useEffect, useMemo, useState, type ReactNode } from "react";

import { ThemeContext, type Theme } from "@/providers/ThemeContext";

const STORAGE_KEY = "stratum-theme";

function getInitialTheme(): Theme {
	const storedTheme = window.localStorage.getItem(STORAGE_KEY);

	if (storedTheme === "light" || storedTheme === "dark") {
		return storedTheme;
	}

	return window.matchMedia("(prefers-color-scheme: light)").matches
		? "light"
		: "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<Theme>(getInitialTheme);

	useEffect(() => {
		const root = document.documentElement;

		root.classList.toggle("light", theme === "light");

		root.classList.toggle("dark", theme === "dark");

		root.dataset.theme = theme;

		window.localStorage.setItem(STORAGE_KEY, theme);
	}, [theme]);

	const value = useMemo(
		() => ({
			theme,
			setTheme,
			toggleTheme: () =>
				setTheme((current) => (current === "dark" ? "light" : "dark")),
		}),
		[theme],
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}
