"use client";
import { createTheme, ThemeOptions } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

// Font configurations
const FONT_DIGITAL = '"Inter", "Noto Sans JP", "Roboto", sans-serif';
const FONT_HANDWRITING_CHALK = '"var(--font-yomogi)", "Yomogi", cursive';
const FONT_HANDWRITING_MARKER =
  '"var(--font-zen-kurenaido)", "Zen Kurenaido", cursive';

// Common adjustments
const components: ThemeOptions["components"] = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "none",
        borderRadius: "8px",
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: "none",
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: "16px",
        backgroundImage: "none",
        backdropFilter: "blur(16px)",
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: "16px",
        backdropFilter: "blur(12px)",
        backgroundImage: "none",
      },
    },
  },
};

export type FontMode = "handwriting" | "digital";

export const getAppTheme = (mode: PaletteMode, fontMode: FontMode) => {
  // Determine Font Family
  let fontFamily = FONT_DIGITAL;
  if (fontMode === "handwriting") {
    fontFamily =
      mode === "dark" ? FONT_HANDWRITING_CHALK : FONT_HANDWRITING_MARKER;
  }

  // Base Palette
  const palette: ThemeOptions["palette"] =
    mode === "dark"
      ? {
          mode: "dark",
          primary: {
            main: "#4ade80", // Tailwind green-400
            light: "#86efac",
            dark: "#22c55e",
            contrastText: "#000",
          },
          secondary: {
            main: "#fbbf24", // Tailwind amber-400
          },
          background: {
            default: "#1a2e1a", // Deep Green
            paper: "rgba(255, 255, 255, 0.05)",
          },
          text: {
            primary: "#e8f5e8", // Chalk white
            secondary: "#a8c8a8",
          },
        }
      : {
          mode: "light",
          primary: {
            main: "#3b82f6", // Tailwind blue-500
            light: "#60a5fa", // Tailwind blue-400
            dark: "#2563eb", // Tailwind blue-600
            contrastText: "#fff",
          },
          secondary: {
            main: "#f59e0b", // Tailwind amber-500
          },
          background: {
            default: "#fdfbf7", // Paper-like off-white
            paper: "rgba(255, 255, 255, 0.8)",
          },
          text: {
            primary: "#1f2937", // Marker black
            secondary: "#6b7280",
          },
        };

  return createTheme({
    palette,
    typography: {
      fontFamily,
      h1: { fontSize: "2.5rem", fontWeight: 700, fontFamily },
      h2: { fontSize: "2rem", fontWeight: 700, fontFamily },
      h3: { fontSize: "1.75rem", fontWeight: 600, fontFamily },
      h4: { fontSize: "1.5rem", fontWeight: 600, fontFamily },
      h5: { fontSize: "1.25rem", fontWeight: 600, fontFamily },
      h6: { fontSize: "1rem", fontWeight: 600, fontFamily },
      body1: { fontFamily },
      body2: { fontFamily },
      button: { fontFamily },
    },
    components: {
      ...components,
      MuiCssBaseline: {
        styleOverrides: `
          body {
            scrollbar-color: #6b6b6b #2b2b2b;
            background-color: ${palette.background?.default};
            transition: background-color 0.3s ease, color 0.3s ease;
          }
          ::-webkit-scrollbar {
            width: 8px;
            background-color: #2b2b2b;
          }
          ::-webkit-scrollbar-thumb {
            border-radius: 8px;
            background-color: #6b6b6b;
            border: 2px solid #2b2b2b;
          }
        `,
      },
    },
  });
};
