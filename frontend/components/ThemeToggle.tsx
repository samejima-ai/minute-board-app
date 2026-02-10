"use client";

import { useTheme } from "@mui/material/styles";
import { IconButton, Tooltip } from "@mui/material";
import { Sun, Moon } from "lucide-react";
import React, { useContext } from "react";
import { ThemeContext } from "@/app/providers";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const theme = useTheme();
  const { toggleTheme } = useContext(ThemeContext);
  const isDark = theme.palette.mode === "dark";

  return (
    <Tooltip title={isDark ? "ホワイトボードに切替" : "黒板に切替"} arrow>
      <IconButton
        onClick={toggleTheme}
        color={isDark ? "warning" : "primary"}
        sx={{
          bgcolor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
          "&:hover": {
            bgcolor: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
            transform: "scale(1.1)",
          },
          transition: "all 0.3s ease",
          width: 40,
          height: 40,
          borderRadius: 3,
        }}
        className={className}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun size={20} className="drop-shadow-lg" />
        ) : (
          <Moon size={20} className="drop-shadow-lg" />
        )}
      </IconButton>
    </Tooltip>
  );
}
