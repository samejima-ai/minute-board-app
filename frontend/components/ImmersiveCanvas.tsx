"use client";

import { useEffect, useRef, useState, forwardRef } from "react";
import * as d3 from "d3-force";
import { motion } from "framer-motion";
import { SpeechCardProps, SpeechCard } from "./SpeechCard";
import { useSettings } from "@/hooks/useSettings";
import { Box, useTheme, styled } from "@mui/material";

// Extended Card Type for D3
interface SimulationNode extends d3.SimulationNodeDatum, SpeechCardProps {
  x?: number;
  y?: number;
}

// Link between related cards
interface SimulationLink extends d3.SimulationLinkDatum<SimulationNode> {
  source: SimulationNode | string;
  target: SimulationNode | string;
  strength: number; // 0-1: higher = more related = closer
}

interface ImmersiveCanvasProps {
  cards: SpeechCardProps[];
}

// Calculate similarity between two cards based on keywords
function calculateSimilarity(
  card1: SpeechCardProps,
  card2: SpeechCardProps,
): number {
  const keywords1 = new Set(card1.keywords || []);
  const keywords2 = new Set(card2.keywords || []);

  if (keywords1.size === 0 || keywords2.size === 0) return 0;

  // Count common keywords
  let commonCount = 0;
  keywords1.forEach((kw) => {
    if (keywords2.has(kw)) commonCount++;
  });

  // Jaccard similarity: intersection / union
  const union = new Set([...keywords1, ...keywords2]).size;
  const similarity = union > 0 ? commonCount / union : 0;

  // Bonus for same type
  const typeBonus = card1.type === card2.type ? 0.2 : 0;

  return Math.min(1, similarity + typeBonus);
}

// Generate links between related cards
function generateLinks(nodes: SimulationNode[]): SimulationLink[] {
  const links: SimulationLink[] = [];
  const threshold = 0.1; // Minimum similarity to create link

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const similarity = calculateSimilarity(nodes[i], nodes[j]);
      if (similarity >= threshold) {
        links.push({
          source: nodes[i].id,
          target: nodes[j].id,
          strength: similarity,
        });
      }
    }
  }

  return links;
}

// Styled SVGs for lines using MUI styled
const StyledSvg = styled("svg")({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: 0,
});

export function ImmersiveCanvas({ cards }: ImmersiveCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const { settings } = useSettings();
  const theme = useTheme();

  // Data States (used for initial rendering and structure)
  const [nodes, setNodes] = useState<SimulationNode[]>([]);
  const [links, setLinks] = useState<SimulationLink[]>([]);

  // DOM Refs (used for direct manipulation)
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);

  // D3 Simulation Ref
  const simulationRef = useRef<d3.Simulation<
    SimulationNode,
    SimulationLink
  > | null>(null);

  // Dimensions State
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Resize Observer to track container size
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    // Initial measure
    updateDimensions();

    const observer = new ResizeObserver(() => {
      updateDimensions();
    });
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Initialize/Update Nodes with RANDOM positions
  useEffect(() => {
    // Wait for dimensions to be measured
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const { width, height } = dimensions;

    // Define safe area (with margins for card size)
    const cardHalfW = 150;
    const cardHalfH = 100;
    const marginTop = 50 + cardHalfH;
    const marginBottom = 80 + cardHalfH; // Footer space
    const marginLR = 30 + cardHalfW;

    const safeMinX = marginLR;
    const safeMaxX = width - marginLR;
    const safeMinY = marginTop;
    const safeMaxY = height - marginBottom;

    setNodes((prevNodes) => {
      const existingMap = new Map(prevNodes.map((n) => [n.id, n]));

      const newNodes = cards.map((card) => {
        const existing = existingMap.get(card.id);
        if (existing) {
          return { ...existing, ...card };
        }
        // New node: RANDOM position
        return {
          ...card,
          x: safeMinX + Math.random() * (safeMaxX - safeMinX),
          y: safeMinY + Math.random() * (safeMaxY - safeMinY),
        };
      });

      // Generate links
      setTimeout(() => {
        setLinks(generateLinks(newNodes));
      }, 0);

      return newNodes;
    });
  }, [cards, dimensions]); // Re-run when cards OR dimensions change

  // Run Simulation
  useEffect(() => {
    if (!containerRef.current || nodes.length === 0 || dimensions.width === 0)
      return;

    const { width, height } = dimensions;

    // Safe area logic...
    const cardHalfW = 150;
    const cardHalfH = 100;
    const marginTop = 50 + cardHalfH;
    const marginBottom = 80 + cardHalfH;
    const marginLR = 30 + cardHalfW;

    const safeMinX = marginLR;
    const safeMaxX = Math.max(marginLR + 100, width - marginLR);
    const safeMinY = marginTop;
    const safeMaxY = Math.max(marginTop + 100, height - marginBottom);

    const safeCenterX = (safeMinX + safeMaxX) / 2;
    const safeCenterY = (safeMinY + safeMaxY) / 2;

    // 1. Initialize Simulation (if needed)
    if (!simulationRef.current) {
      simulationRef.current = d3
        .forceSimulation<SimulationNode, SimulationLink>()
        .alphaDecay(0.02)
        .velocityDecay(0.3)
        .on("tick", () => {
          // Tick Logic
          nodes.forEach((node) => {
            if (node.x !== undefined) {
              if (node.x < safeMinX) node.vx = (node.vx || 0) + 2;
              if (node.x > safeMaxX) node.vx = (node.vx || 0) - 2;
              node.x = Math.max(safeMinX, Math.min(safeMaxX, node.x));
            }
            if (node.y !== undefined) {
              if (node.y < safeMinY) node.vy = (node.vy || 0) + 2;
              if (node.y > safeMaxY) node.vy = (node.vy || 0) - 2;
              node.y = Math.max(safeMinY, Math.min(safeMaxY, node.y));
            }
          });

          // DOM Updates
          nodes.forEach((node) => {
            const el = nodeRefs.current.get(node.id);
            if (el && node.x !== undefined && node.y !== undefined) {
              const tx = node.x - 280 / 2;
              const ty = node.y - 180 / 2;
              el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
            }
          });

          links.forEach((link, i) => {
            const line = lineRefs.current[i];
            if (line) {
              const source = link.source as SimulationNode;
              const target = link.target as SimulationNode;
              if (
                source.x !== undefined &&
                source.y !== undefined &&
                target.x !== undefined &&
                target.y !== undefined
              ) {
                line.setAttribute("x1", source.x.toString());
                line.setAttribute("y1", source.y.toString());
                line.setAttribute("x2", target.x.toString());
                line.setAttribute("y2", target.y.toString());
              }
            }
          });
        });
    }

    // 2. Define Forces
    const linkForce = d3
      .forceLink<SimulationNode, SimulationLink>(links)
      .id((d) => d.id)
      .distance((link) => {
        const baseDist = 250;
        return baseDist / (1 + link.strength * 2);
      })
      .strength((link) => link.strength * 0.8 * settings.layoutStrength);

    const centerForce = d3
      .forceCenter(safeCenterX, safeCenterY)
      .strength(0.03 * settings.layoutStrength);

    const collisionForce = d3
      .forceCollide<SimulationNode>()
      .radius(() => 120)
      .strength(0.7)
      .iterations(2);

    const chargeForce = d3
      .forceManyBody<SimulationNode>()
      .strength(-150 * settings.layoutStrength)
      .distanceMax(400);

    // 3. Apply Forces & Data
    simulationRef.current
      .nodes(nodes)
      .force("link", linkForce)
      .force("center", centerForce)
      .force("charge", chargeForce)
      .force("collide", collisionForce);

    // 4. Restart gently
    // If it's a huge change (init), maybe 1.0, but updates usually 0.3
    simulationRef.current.alpha(0.3).restart();

    // Cleanup not needed for singleton unless component unmounts
    return () => {
      // We keep the instance alive ideally, but if we want to stop on unmount:
      // simulationRef.current?.stop();
    };
  }, [nodes, links, settings.layoutStrength, dimensions]);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* SVG for drawing links */}
      <StyledSvg ref={svgRef}>
        {links.map((link, i) => {
          // We render lines initially, updates happen via Ref
          return (
            <line
              key={`link-${i}`}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              stroke={theme.palette.primary.main}
              strokeOpacity={0.3}
              strokeWidth={1 + link.strength * 2}
              strokeDasharray={link.strength > 0.3 ? "none" : "4 4"}
            />
          );
        })}
      </StyledSvg>

      {/* Render Cards */}
      {nodes.map((node) => (
        <FloatingCard
          key={node.id}
          node={node}
          ref={(el) => {
            if (el) nodeRefs.current.set(node.id, el as HTMLDivElement);
            else nodeRefs.current.delete(node.id);
          }}
          style={{ fontSize: `${settings.fontSizeScale}em` }}
        />
      ))}
    </Box>
  );
}

interface FloatingCardProps {
  node: SimulationNode;
  style?: React.CSSProperties; // Allow style injection
}

const FloatingCard = forwardRef<HTMLDivElement, FloatingCardProps>(
  ({ node, style }: FloatingCardProps, ref) => {
    const cardWidth = 280;

    return (
      <motion.div
        ref={ref}
        className="floating-card" // Using a class for identifying if needed, but styling is inline/sx
        style={{
          position: "absolute",
          pointerEvents: "auto",
          cursor: "grab",
          width: cardWidth,
          maxWidth: cardWidth,
          left: 0,
          top: 0,
          ...style, // Allow overriding styles (transform via ref)
        }}
        whileHover={{ zIndex: 50 }}
        whileTap={{ cursor: "grabbing" }}
        initial={{
          scale: 0.8,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
        }}
        drag
        dragMomentum={false}
        onDrag={(_, info) => {
          // Update node position during drag
          node.x = (node.x ?? 0) + info.delta.x;
          node.y = (node.y ?? 0) + info.delta.y;
        }}
        onDragEnd={() => {
          node.fx = undefined;
          node.fy = undefined;
        }}
      >
        <SpeechCard
          id={node.id}
          type={node.type}
          summary={node.summary}
          detail={node.detail}
          importance={node.importance}
          keywords={node.keywords}
          // Remove className="shadow-lg" as MUI Card handles elevation
        />
      </motion.div>
    );
  },
);

FloatingCard.displayName = "FloatingCard";
