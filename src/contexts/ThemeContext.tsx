import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: "system",
    toggleTheme: () => {},
    setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => {
        const stored = localStorage.getItem("navigator_theme") as Theme | null;
        if (stored === "dark" || stored === "light" || stored === "system") return stored;
        return "system"; // default to system theme
    });

    useEffect(() => {
        const root = window.document.documentElement;
        
        // Remove existing theme classes
        root.classList.remove("light", "dark");
        
        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
        
        localStorage.setItem("navigator_theme", theme);
    }, [theme]);

    // Handle system theme preference changes dynamically
    useEffect(() => {
        if (theme !== "system") return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => {
            const root = window.document.documentElement;
            root.classList.remove("light", "dark");
            const systemTheme = mediaQuery.matches ? "dark" : "light";
            root.classList.add(systemTheme);
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [theme]);

    const toggleTheme = () => {
        setThemeState((prev) => {
            if (prev === "system") {
                const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                return systemIsDark ? "light" : "dark";
            }
            return prev === "light" ? "dark" : "light";
        });
    };

    const setTheme = (t: Theme) => setThemeState(t);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
