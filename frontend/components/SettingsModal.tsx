"use client";

import { useSettings, AppSettings } from "@/hooks/useSettings";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Slider,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Box,
  Divider,
  Paper,
} from "@mui/material";
import {
  Close as CloseIcon,
  RestartAlt as RotateCcw,
  VolumeUp as Volume2,
  Layers,
  Dashboard as LayoutIcon,
  Monitor,
} from "@mui/icons-material";
import { Type } from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "@/app/providers";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdate: (updates: Partial<AppSettings>) => void;
  onReset: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdate,
  onReset,
}: SettingsModalProps) {
  const { toggleFontMode, fontMode, mode } = useContext(ThemeContext);
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          backdropFilter: "blur(16px)",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(30, 30, 30, 0.8)"
              : "rgba(255, 255, 255, 0.8)",
          backgroundImage: "none",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 8px 32px rgba(0, 0, 0, 0.4)"
              : "0 4px 16px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Monitor />
          <Typography variant="h6" fontWeight="bold">
            環境設定
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderBottom: "none" }}>
        <Stack spacing={4}>
          {/* Section 1: Voice Input */}
          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              fontWeight="bold"
              sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
                letterSpacing: "0.05em",
              }}
            >
              <Volume2 fontSize="small" />
              音声入力設定
            </Typography>

            <Paper
              variant="outlined"
              sx={{ p: 2, borderRadius: 2, bgcolor: "background.default" }}
            >
              <Stack spacing={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>認識言語</InputLabel>
                  <Select
                    value={settings.language}
                    label="認識言語"
                    onChange={(e) =>
                      onUpdate({ language: e.target.value as any })
                    }
                  >
                    <MenuItem value="ja-JP">日本語 (ja-JP)</MenuItem>
                    <MenuItem value="en-US">English (en-US)</MenuItem>
                  </Select>
                </FormControl>

                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="caption">無言判定時間</Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontFamily: "monospace" }}
                    >
                      {settings.silenceDuration}ms
                    </Typography>
                  </Box>
                  <Slider
                    value={settings.silenceDuration}
                    min={1000}
                    max={5000}
                    step={100}
                    onChange={(_, val) =>
                      onUpdate({ silenceDuration: val as number })
                    }
                  />
                  <Typography variant="caption" color="text.secondary">
                    発話を終了とみなすまでの無音時間です。
                  </Typography>
                </Box>

                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="caption">自動送信文字数</Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontFamily: "monospace" }}
                    >
                      {settings.autoSubmitThreshold}文字
                    </Typography>
                  </Box>
                  <Slider
                    value={settings.autoSubmitThreshold}
                    min={50}
                    max={300}
                    step={10}
                    onChange={(_, val) =>
                      onUpdate({ autoSubmitThreshold: val as number })
                    }
                  />
                </Box>
              </Stack>
            </Paper>
          </Box>

          {/* Section 2: Card Management */}
          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              fontWeight="bold"
              sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
                letterSpacing: "0.05em",
              }}
            >
              <Layers fontSize="small" />
              カード管理
            </Typography>

            <Paper
              variant="outlined"
              sx={{ p: 2, borderRadius: 2, bgcolor: "background.default" }}
            >
              <Stack spacing={3}>
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="caption">最大表示枚数</Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontFamily: "monospace" }}
                    >
                      {settings.maxCardCount}枚
                    </Typography>
                  </Box>
                  <Slider
                    value={settings.maxCardCount}
                    min={10}
                    max={100}
                    step={5}
                    onChange={(_, val) =>
                      onUpdate({ maxCardCount: val as number })
                    }
                  />
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="body2">重複排除</Typography>
                    <Typography variant="caption" color="text.secondary">
                      同じ内容のカードを追加しない
                    </Typography>
                  </Box>
                  <Switch
                    checked={settings.enableDeduplication}
                    onChange={(e) =>
                      onUpdate({ enableDeduplication: e.target.checked })
                    }
                  />
                </Box>
              </Stack>
            </Paper>
          </Box>

          {/* Section 3: Layout & Display */}
          <Box>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              fontWeight="bold"
              sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
                letterSpacing: "0.05em",
              }}
            >
              <LayoutIcon fontSize="small" />
              表示・レイアウト
            </Typography>

            <Paper
              variant="outlined"
              sx={{ p: 2, borderRadius: 2, bgcolor: "background.default" }}
            >
              <Stack spacing={3}>
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="caption">物理演算強度</Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontFamily: "monospace" }}
                    >
                      {settings.layoutStrength.toFixed(1)}
                    </Typography>
                  </Box>
                  <Slider
                    value={settings.layoutStrength}
                    min={0.1}
                    max={2.0}
                    step={0.1}
                    onChange={(_, val) =>
                      onUpdate({ layoutStrength: val as number })
                    }
                  />
                </Box>

                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="caption">文字サイズ倍率</Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontFamily: "monospace" }}
                    >
                      x{settings.fontSizeScale.toFixed(1)}
                    </Typography>
                  </Box>
                  <Slider
                    value={settings.fontSizeScale}
                    min={0.8}
                    max={1.5}
                    step={0.1}
                    onChange={(_, val) =>
                      onUpdate({ fontSizeScale: val as number })
                    }
                  />
                </Box>

                <Divider />

                {/* Font Style */}
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Type size={20} />
                      <Typography variant="body2">フォントスタイル</Typography>
                    </Box>
                    <Switch
                      checked={fontMode === "handwriting"}
                      onChange={toggleFontMode}
                      inputProps={{ "aria-label": "toggle font mode" }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {fontMode === "handwriting"
                        ? "手書き風"
                        : "デジタル (標準)"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {mode === "dark" ? "チョーク風" : "マーカー風"}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Paper>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button onClick={onReset} color="error" startIcon={<RotateCcw />}>
          初期設定に戻す
        </Button>
        <Button onClick={onClose} variant="contained" disableElevation>
          完了
        </Button>
      </DialogActions>
    </Dialog>
  );
}
