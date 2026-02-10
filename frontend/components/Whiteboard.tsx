"use client";

import { useRef, useEffect, useState } from "react";
import { Mic, Loader2, Settings } from "lucide-react";
import { SpeechCard, SpeechCardProps } from "./SpeechCard";
import { ThemeToggle } from "./ThemeToggle";
import { useSettings } from "@/hooks/useSettings";
import { SettingsModal } from "./SettingsModal";
import * as d3 from "d3";
import { calculateJaccardIndex } from "@/utils/similarity";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  Avatar,
  CircularProgress,
  Badge,
} from "@mui/material";

interface WhiteboardProps {
  cards: SpeechCardProps[];
}

// Extend card data with D3 node properties
interface CardNode extends d3.SimulationNodeDatum, SpeechCardProps {
  id: string; // Ensure ID is present
}

export function Whiteboard({ cards }: WhiteboardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { settings, updateSettings, resetSettings } = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const muiTheme = useTheme();

  // D3 Refs
  const simulationRef = useRef<d3.Simulation<CardNode, undefined> | null>(null);
  const nodesRef = useRef<CardNode[]>([]);
  const cardElementsRef = useRef<Map<string, HTMLDivElement>>(new Map());

  // Initialize & Update Simulation
  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Setup Simulation Instance (Singleton-ish)
    if (!simulationRef.current) {
      simulationRef.current = d3
        .forceSimulation<CardNode>()
        .force(
          "charge",
          d3.forceManyBody().strength(-500 * settings.layoutStrength),
        )
        .force("collide", d3.forceCollide().radius(180).strength(0.7))
        .force(
          "center",
          d3
            .forceCenter(
              containerRef.current.clientWidth / 2,
              containerRef.current.clientHeight / 2,
            )
            .strength(0.05),
        );

      // Tick handler
      simulationRef.current.on("tick", () => {
        const container = containerRef.current;
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;
        const padding = 20;
        const cardWidth = 280;
        const cardHeight = 200;

        nodesRef.current.forEach((node) => {
          const currentX = node.x ?? 0;
          const currentY = node.y ?? 0;

          node.x = Math.max(
            cardWidth / 2 + padding,
            Math.min(width - cardWidth / 2 - padding, currentX),
          );
          node.y = Math.max(
            cardHeight / 2 + padding,
            Math.min(height - cardHeight / 2 - padding, currentY),
          );

          const el = cardElementsRef.current.get(node.id);
          if (el) {
            el.style.transform = `translate(${node.x! - cardWidth / 2}px, ${node.y! - cardHeight / 2}px)`;
            el.style.position = "absolute";
            el.style.left = "0";
            el.style.top = "0";
          }
        });
      });
    }

    // 2. Sync Logic (Data Merge)
    const currentNodes = nodesRef.current;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Identify new/removed
    const existingIds = new Map(currentNodes.map((n) => [n.id, n]));
    const newCards = cards.filter((c) => !existingIds.has(c.id));

    // Add new nodes (with random pos near center)
    newCards.forEach((card) => {
      currentNodes.push({
        ...card,
        x: width / 2 + (Math.random() - 0.5) * 50,
        y: height / 2 + (Math.random() - 0.5) * 50,
      });
    });

    // Remove old nodes (optional, based on props)
    const activeIds = new Set(cards.map((c) => c.id));
    const nextNodes = currentNodes.filter((n) => activeIds.has(n.id));

    // Update content of existing nodes
    nodesRef.current = nextNodes.map((node) => {
      const cardData = cards.find((c) => c.id === node.id);
      return cardData ? { ...node, ...cardData } : node;
    });

    // Update Simulation Nodes
    simulationRef.current.nodes(nodesRef.current);

    // 3. Update Links
    interface SimulationLink extends d3.SimulationLinkDatum<CardNode> {
      value: number;
    }
    const links: SimulationLink[] = [];
    nodesRef.current.forEach((a, i) => {
      nodesRef.current.forEach((b, j) => {
        if (i >= j) return;
        const score = calculateJaccardIndex(a.keywords, b.keywords);
        if (score > 0.1) {
          links.push({
            source: a.id,
            target: b.id,
            value: score,
          });
        }
      });
    });

    simulationRef.current.force(
      "link",
      d3
        .forceLink<CardNode, SimulationLink>(links)
        .id((d) => d.id)
        .distance((d) => 100 * (1 - (d.value || 0)))
        .strength((d) => (d.value || 0) * settings.layoutStrength),
    );

    // 4. Restart gently (Low alpha to prevent explosion)
    // If it's the very first load (0 nodes -> N nodes), high alpha is ok.
    // But typically we want low alpha for updates.
    const isFirstLoad = currentNodes.length === 0 && cards.length > 0;
    simulationRef.current.alpha(isFirstLoad ? 1 : 0.3).restart();
  }, [cards, settings.layoutStrength]);

  // Setup D3 Drag behavior
  useEffect(() => {
    if (!simulationRef.current || !containerRef.current) return;

    const dragBehavior = d3
      .drag<HTMLDivElement, CardNode>()
      .subject((event, d) => {
        // D3 v6+ drag subject
        return { x: d.x ?? 0, y: d.y ?? 0 };
      })
      .on("start", (event, d) => {
        if (!event.active) simulationRef.current?.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulationRef.current?.alphaTarget(0);
        // Leave fx/fy set to keep it pinned!
      });

    nodesRef.current.forEach((node) => {
      const el = cardElementsRef.current.get(node.id);
      if (el) {
        // Use existing instance if possible or re-apply
        d3.select(el)
          .datum(node)
          .call(dragBehavior as any);
      }
    });
  }, [cards.length, settings.layoutStrength]); // Re-bind when cards/settings change

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        bgcolor: "background.default",
        backgroundImage: (theme) =>
          theme.palette.mode === "dark"
            ? "radial-gradient(circle at center, #2d3b2d 0%, #1a231a 100%)" // Deep Green for Blackboard
            : "radial-gradient(circle at center, #fdfbf7 0%, #f0f0f0 100%)", // Paper-like for Whiteboard
        // Add subtle texture overlay via ::before (handled by nested selector if needed, but for now simple bg)
        // For whiteboard grid:
        backgroundSize: (theme) =>
          theme.palette.mode === "light" ? "100% 100%" : "auto",
      }}
    >
      {/* App Header */}
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(255,255,255,0.05)", // glass-bg approximate
          borderBottom: 1,
          borderColor: "divider",
          zIndex: 50,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: 2 }}>
          <Box display="flex" alignItems="center" gap={3}>
            {/* App Icon */}
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 3,
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: 2,
              }}
            >
              <Mic size={16} color="white" />
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                sx={{
                  fontFamily: "var(--font-theme)",
                  color: "text.primary",
                  lineHeight: 1.2,
                }}
              >
                Voice Memo
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  display: "block",
                }}
              >
                AI Secretary
              </Typography>
            </Box>
          </Box>

          {/* Right Side Controls */}
          <Box display="flex" alignItems="center" gap={2}>
            {/* Card Counter */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.5,
                borderRadius: 99,
                bgcolor: "rgba(0,0,0,0.05)",
                border: 1,
                borderColor: "divider",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight="600"
              >
                Cards
              </Typography>
              <Typography
                variant="body2"
                fontWeight="bold"
                sx={{ fontFamily: "var(--font-theme)", color: "text.primary" }}
              >
                {cards.length}
              </Typography>
            </Box>

            {/* Settings Button */}
            <Tooltip title="設定">
              <IconButton onClick={() => setIsSettingsOpen(true)}>
                <Settings size={20} />
              </IconButton>
            </Tooltip>

            {/* Theme Toggle */}
            <ThemeToggle />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Canvas */}
      <Box
        ref={containerRef}
        component="main"
        sx={{
          flex: 1,
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          touchAction: "none",
        }}
      >
        {cards.length > 0 ? (
          <>
            {cards.map((card) => (
              <Box
                key={card.id}
                ref={(el) => {
                  if (el)
                    cardElementsRef.current.set(card.id, el as HTMLDivElement);
                  else cardElementsRef.current.delete(card.id);
                }}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  cursor: "grab",
                  willChange: "transform",
                  "&:active": { cursor: "grabbing" },
                  "&:hover": { zIndex: 50 },
                  // Initial transform
                  transform: "translate(0,0)",
                }}
              >
                <SpeechCard
                  {...card}
                  style={{ fontSize: `${settings.fontSizeScale}em` }}
                />
              </Box>
            ))}
          </>
        ) : (
          /* Empty State */
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <Box textAlign="center">
              <Box position="relative" mb={3}>
                {/* Glow Ring */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    width: 80,
                    height: 80,
                    mx: "auto",
                    borderRadius: "50%",
                    filter: "blur(20px)",
                    opacity: 0.3,
                    bgcolor: "primary.main",
                  }}
                />
                {/* Icon Container */}
                <Box
                  sx={{
                    position: "relative",
                    width: 80,
                    height: 80,
                    mx: "auto",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "background.paper",
                    backdropFilter: "blur(16px)",
                    border: 1,
                    borderColor: "divider",
                  }}
                >
                  <CircularProgress
                    size={32}
                    thickness={4}
                    sx={{ color: "text.secondary" }}
                  />
                </Box>
              </Box>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{ fontFamily: "var(--font-theme)", color: "text.primary" }}
              >
                待機中...
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 280, mx: "auto" }}
              >
                マイクをONにして会話を始めましょう。
                <br />
                AIが自動で情報を整理します。
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdate={updateSettings}
        onReset={resetSettings}
      />
    </Box>
  );
}
