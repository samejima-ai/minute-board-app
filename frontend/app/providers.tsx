"use client";

import React, { useState, useEffect } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getAppTheme } from "../theme";

// Context for theme switching
export const ThemeContext = React.createContext({
  toggleTheme: () => {},
  toggleFontMode: () => {},
  mode: "dark" as "light" | "dark",
  fontMode: "handwriting" as "handwriting" | "digital",
});

export function Providers({ children }: { children: React.ReactNode }) {
  // Always default to dark for consistency with server-side initially, then hydrate
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const [fontMode, setFontMode] = useState<"handwriting" | "digital">(
    "handwriting",
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Optional: Load preference from local storage here
  }, []);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const toggleFontMode = () => {
    setFontMode((prev) => (prev === "handwriting" ? "digital" : "handwriting"));
  };

  // Generate dynamic theme
  const theme = React.useMemo(() => {
    return getAppTheme(mode, fontMode);
  }, [mode, fontMode]);

  return (
    <AppRouterCacheProvider>
      <ThemeContext.Provider
        value={{ toggleTheme, toggleFontMode, mode, fontMode }}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ThemeContext.Provider>
    </AppRouterCacheProvider>
  );
}
