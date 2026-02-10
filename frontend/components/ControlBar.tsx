"use client";

import { useState, useContext } from "react";
import Image from "next/image";
import { Mic, MicOff, Sun, Moon, Settings } from "lucide-react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Badge,
  Box,
  Typography,
  useTheme,
  Fade,
} from "@mui/material";
import { ThemeContext } from "@/app/providers";

interface ControlBarProps {
  isListening: boolean;
  onToggleMic: () => void;
  onOpenSettings: () => void;
  cardCount: number;
}

export function ControlBar({
  isListening,
  onToggleMic,
  onOpenSettings,
  cardCount,
}: ControlBarProps) {
  const muiTheme = useTheme();
  const { mode, toggleTheme } = useContext(ThemeContext);
  const [micImageError, setMicImageError] = useState(false);
  const [themeImageError, setThemeImageError] = useState(false);

  const isDark = mode === "dark";
  const filterClass = isDark ? "invert" : "";

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        top: "auto",
        bottom: 0,
        background: "transparent",
        pointerEvents: "none", // Allow clicks pass through transparent areas
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "center",
          pointerEvents: "auto", // Re-enable clicks for toolbar content
          pb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            px: 4,
            py: 1.5,
            borderRadius: 4,
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(30, 30, 30, 0.98)"
                : "rgba(255, 255, 255, 0.98)",
            borderTop: 2,
            borderColor: (theme) =>
              theme.palette.mode === "dark" ? "grey.800" : "grey.300",
            boxShadow: 4,
            position: "relative",
          }}
        >
          {/* Card Count Badge */}
          <Badge
            badgeContent={`${cardCount} Cards`}
            color="secondary"
            sx={{
              position: "absolute",
              top: -8,
              right: -8,
              "& .MuiBadge-badge": {
                bgcolor: "#fef3c7", // yellow-100
                color: "#000",
                border: "1px solid #000",
                transform: "rotate(6deg)",
                fontFamily: "var(--font-handwriting), cursive",
                fontWeight: "bold",
                height: "auto",
                px: 1,
                borderRadius: "4px 8px 4px 6px",
              },
            }}
          >
            {/* Invisible anchor for badge */}
            <Box />
          </Badge>

          {/* Mic Control */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={0.5}
          >
            <Tooltip
              title={isListening ? "Stop Recording" : "Start Recording"}
              arrow
            >
              <IconButton
                onClick={onToggleMic}
                sx={{
                  width: 64,
                  height: 64,
                  transition: "transform 0.2s",
                  "&:active": { transform: "scale(0.95)" },
                }}
              >
                {!micImageError ? (
                  <Box
                    position="relative"
                    width="100%"
                    height="100%"
                    className={`${filterClass} transition-all duration-300 ${
                      isListening ? "animate-pulse scale-110" : ""
                    }`}
                  >
                    <Image
                      src="/assets/icons/handdrawn_mic.png"
                      alt="Mic"
                      fill
                      className="object-contain drop-shadow-md"
                      onError={() => setMicImageError(true)}
                      unoptimized
                    />
                  </Box>
                ) : (
                  <Box
                    color={
                      isListening ? muiTheme.palette.error.main : "inherit"
                    }
                  >
                    {isListening ? (
                      <Mic size={36} strokeWidth={2.5} />
                    ) : (
                      <MicOff size={36} strokeWidth={2.5} />
                    )}
                  </Box>
                )}
              </IconButton>
            </Tooltip>
            <Typography
              variant="caption"
              sx={{
                fontFamily: "var(--font-handwriting), cursive",
                fontWeight: "bold",
                color: "text.primary",
                lineHeight: 1,
              }}
            >
              Mic
            </Typography>
          </Box>

          {/* Divider */}
          <Box
            sx={{
              width: 2,
              height: 40,
              bgcolor: "text.primary",
              opacity: 0.2,
              transform: "rotate(3deg)",
            }}
          />

          {/* Theme Toggle */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={0.5}
          >
            <Tooltip
              title={isDark ? "ホワイトボードに切替" : "黒板に切替"}
              arrow
            >
              <IconButton
                onClick={toggleTheme}
                sx={{
                  width: 48,
                  height: 48,
                  transition: "transform 0.2s",
                  "&:hover": { transform: "rotate(12deg)" },
                  "&:active": { transform: "scale(0.95) rotate(12deg)" },
                }}
              >
                {!themeImageError ? (
                  <Box
                    position="relative"
                    width="100%"
                    height="100%"
                    className={filterClass}
                  >
                    <Image
                      src={
                        isDark
                          ? "/assets/icons/handdrawn_moon.png"
                          : "/assets/icons/handdrawn_sun.png"
                      }
                      alt="Theme"
                      fill
                      className="object-contain"
                      onError={() => setThemeImageError(true)}
                      unoptimized
                    />
                  </Box>
                ) : (
                  <Box color="inherit">
                    {isDark ? <Moon size={28} /> : <Sun size={28} />}
                  </Box>
                )}
              </IconButton>
            </Tooltip>
            <Typography
              variant="caption"
              sx={{
                fontFamily: "var(--font-handwriting), cursive",
                color: "text.primary",
                lineHeight: 1,
              }}
            >
              Theme
            </Typography>
          </Box>

          {/* Divider */}
          <Box
            sx={{
              width: 2,
              height: 40,
              bgcolor: "text.primary",
              opacity: 0.2,
              transform: "rotate(3deg)",
            }}
          />

          {/* Settings Button */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={0.5}
          >
            <Tooltip title="Settings" arrow>
              <IconButton
                onClick={onOpenSettings}
                sx={{
                  width: 48,
                  height: 48,
                  transition: "transform 0.2s",
                  "&:hover": { transform: "rotate(-12deg)" },
                  "&:active": { transform: "scale(0.95) rotate(-12deg)" },
                }}
              >
                <Box color="inherit">
                  <Settings size={28} />
                </Box>
              </IconButton>
            </Tooltip>
            <Typography
              variant="caption"
              sx={{
                fontFamily: "var(--font-handwriting), cursive",
                color: "text.primary",
                lineHeight: 1,
              }}
            >
              Settings
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
