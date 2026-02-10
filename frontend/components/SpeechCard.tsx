import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Avatar,
  useTheme,
} from "@mui/material";
import { Lightbulb, AlertTriangle, Gavel, Info } from "lucide-react";

export type CardType = "PROPOSAL" | "ISSUE" | "DECISION" | "INFO";

export interface SpeechCardProps {
  id: string;
  type: CardType;
  summary: string;
  detail: string;
  importance?: number;
  keywords?: string[];
  themeId?: string;
  className?: string;
  style?: React.CSSProperties;
}

const typeConfig: Record<
  CardType,
  {
    label: string;
    icon: React.ElementType;
    color: "primary" | "secondary" | "error" | "info" | "warning" | "success";
    borderColor: string;
  }
> = {
  PROPOSAL: {
    label: "提案",
    icon: Lightbulb,
    color: "primary",
    borderColor: "#3B82F6",
  },
  ISSUE: {
    label: "課題",
    icon: AlertTriangle,
    color: "warning",
    borderColor: "#F59E0B",
  },
  DECISION: {
    label: "決定",
    icon: Gavel,
    color: "error",
    borderColor: "#EF4444",
  },
  INFO: {
    label: "情報",
    icon: Info,
    color: "info",
    borderColor: "#6B7280",
  },
};

export function SpeechCard({
  id,
  type,
  summary,
  detail,
  importance,
  keywords,
  className,
  style,
}: SpeechCardProps) {
  const theme = useTheme();
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Card
      elevation={3}
      sx={{
        width: "fit-content",
        minWidth: "240px",
        maxWidth: "320px",
        position: "absolute", // For d3-force positioning
        borderLeft: `4px solid ${config.borderColor}`,
        ...style, // Apply d3-force style (transform, top, left)
      }}
      className={className}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        {/* Header */}
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Avatar
            variant="rounded"
            role="img"
            aria-label={config.label}
            sx={{
              bgcolor: `${config.color}.main`,
              width: 32,
              height: 32,
            }}
          >
            <Icon size={18} strokeWidth={2} color="white" />
          </Avatar>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            color="text.secondary"
            sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
          >
            {config.label}
          </Typography>
        </Box>

        {/* Summary */}
        <Typography
          variant="h6"
          component="div"
          gutterBottom
          sx={{
            fontSize: "1rem",
            fontWeight: 700,
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {summary}
        </Typography>

        {/* Detail */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            whiteSpace: "pre-wrap",
          }}
        >
          {detail}
        </Typography>

        {/* Keywords */}
        {keywords && keywords.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={0.5}>
            {keywords.map((tag) => (
              <Chip
                key={tag}
                label={`#${tag}`}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: "0.7rem",
                  height: 20,
                  opacity: 0.8,
                }}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
