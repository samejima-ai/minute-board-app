"use client";

import { Mic, MicOff, WifiOff } from "lucide-react";
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  keyframes,
} from "@mui/material";

interface LiveTickerProps {
  isListening: boolean;
  transcript: string;
  isSupported?: boolean;
  onToggle: () => void;
}

const pulseRing = keyframes`
  0% { transform: scale(1); opacity: 0.4; }
  100% { transform: scale(1.5); opacity: 0; }
`;

const statusPulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

export function LiveTicker({
  isListening,
  transcript,
  isSupported = true,
  onToggle,
}: LiveTickerProps) {
  const theme = useTheme();

  if (!isSupported) {
    return (
      <Box
        sx={{
          position: "fixed",
          bottom: 100,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
          width: "calc(100% - 48px)",
          maxWidth: 480,
          pointerEvents: "none",
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 2,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            gap: 2,
            bgcolor: "background.paper",
            backdropFilter: "blur(16px)",
            border: 1,
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 3,
              backgroundColor: "rgba(239, 68, 68, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WifiOff size={18} color={theme.palette.error.main} />
          </Box>
          <Box>
            <Typography variant="body2" fontWeight="bold" color="error">
              音声認識がサポートされていません
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Chrome推奨
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 100,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
        width: "calc(100% - 48px)",
        maxWidth: 480,
        pointerEvents: "none",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 1.5,
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          gap: 2,
          bgcolor: "background.paper",
          backdropFilter: "blur(16px)",
          border: 1,
          borderColor: "divider",
          pointerEvents: "auto",
        }}
      >
        {/* Mic Toggle Button */}
        <Tooltip title={isListening ? "停止" : "聞き取り開始"}>
          <Box position="relative">
            {isListening && (
              <>
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 3,
                    bgcolor: "error.main",
                    animation: `${pulseRing} 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 3,
                    bgcolor: "error.main",
                    animation: `${pulseRing} 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                    animationDelay: "0.5s",
                  }}
                />
              </>
            )}
            <IconButton
              onClick={onToggle}
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                bgcolor: isListening ? "error.main" : "transparent",
                "&:hover": {
                  bgcolor: isListening ? "error.dark" : "rgba(0,0,0,0.05)",
                  opacity: 0.9,
                },
                transition: "all 0.3s",
                position: "relative",
                zIndex: 1,
                boxShadow: isListening
                  ? `0 4px 12px ${theme.palette.error.main}40`
                  : "none",
              }}
            >
              {isListening ? (
                <Mic size={20} color="white" />
              ) : (
                <MicOff size={20} color={theme.palette.text.secondary} />
              )}
            </IconButton>
          </Box>
        </Tooltip>

        {/* Divider */}
        <Box
          sx={{
            width: 1,
            height: 32,
            bgcolor: "divider",
          }}
        />

        {/* Transcript Area */}
        <Box flex={1} minWidth={0}>
          {/* Status Indicator */}
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: isListening ? "error.main" : "text.disabled",
                animation: isListening
                  ? `${statusPulse} 1s ease-in-out infinite`
                  : "none",
              }}
            />
            <Typography
              variant="caption"
              fontWeight="bold"
              sx={{
                letterSpacing: "0.1em",
                color: "text.secondary",
                fontFamily: "var(--font-handwriting), cursive",
              }}
            >
              {isListening ? "ON AIR" : "STANDBY"}
            </Typography>
          </Box>

          {/* Transcript Text */}
          <Typography
            variant="body2"
            fontWeight="500"
            noWrap
            sx={{
              color: transcript ? "text.primary" : "text.disabled",
              fontStyle: !transcript ? "italic" : "normal",
            }}
          >
            {transcript || "会話を待機しています..."}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
