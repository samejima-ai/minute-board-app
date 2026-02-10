"use client";

import { useState, useCallback, useEffect } from "react";
// import { Whiteboard } from "@/components/Whiteboard"; // Deprecated
// import { LiveTicker } from "@/components/LiveTicker"; // Deprecated
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { SpeechCardProps } from "@/components/SpeechCard";

import { SCENARIO_01 } from "@/data/scenarios"; // Import Scenario

// Define local interface if not imported
interface OrganizeCommand {
  action: string;
  args: any;
}

import { ImmersiveCanvas } from "@/components/ImmersiveCanvas";
import { ControlBar } from "@/components/ControlBar";
import { StreamingTypography } from "@/components/StreamingTypography";
import { SettingsModal } from "@/components/SettingsModal"; // Import Modal
import { useSettings } from "@/hooks/useSettings"; // Import Hook

export default function Home() {
  const [cards, setCards] = useState<SpeechCardProps[]>([]);
  const [scenarioIndex, setScenarioIndex] = useState(0); // Scenario State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Settings Modal State
  const { settings, updateSettings, resetSettings } = useSettings(); // Get settings and updaters

  const [apiStatus, setApiStatus] = useState<
    "IDLE" | "LOADING" | "SUCCESS" | "ERROR"
  >("IDLE");
  const [rawResponse, setRawResponse] = useState<string | null>(null);

  // Handle text flush from SpeechToText hook
  const handleFlush = useCallback(
    async (text: string) => {
      console.log("Debug: handleFlush called with:", text);
      setApiStatus("LOADING");
      setRawResponse(null); // Clear previous response

      try {
        const payload = {
          text,
          current_themes: [], // TODO: Get actual themes from state
        };
        console.log("Debug: Sending payload:", payload);

        const response = await fetch("/api/organize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);
        setApiStatus("SUCCESS");

        if (data.raw_response) {
          setRawResponse(data.raw_response);
        } else if (data.error) {
          setRawResponse(`Error: ${data.error}`);
        }

        if (data.commands && Array.isArray(data.commands)) {
          data.commands.forEach((cmd: OrganizeCommand) => {
            if (cmd.action === "add_note") {
              // Map backend type to frontend type (fallback to INFO)
              const validTypes = ["PROPOSAL", "ISSUE", "DECISION", "INFO"];
              const cardType = validTypes.includes(cmd.args.type)
                ? cmd.args.type
                : "INFO";

              const newCard: SpeechCardProps = {
                id: crypto.randomUUID(),
                type: cardType as any,
                summary:
                  cmd.args.summary ||
                  cmd.args.content.slice(0, 30) +
                    (cmd.args.content.length > 30 ? "..." : ""),
                detail: cmd.args.content,
                importance: cmd.args.importance,
                keywords: cmd.args.keywords,
              };
              setCards((prev) => {
                // Deduplication check: Avoid adding exact same content
                if (settings.enableDeduplication) {
                  const exists = prev.some(
                    (c) =>
                      c.detail === newCard.detail &&
                      c.type === newCard.type &&
                      c.summary === newCard.summary,
                  );
                  if (exists) return prev;
                }

                // Card Limit
                const updated = [...prev, newCard];
                if (updated.length > settings.maxCardCount) {
                  return updated.slice(updated.length - settings.maxCardCount);
                }
                return updated;
              });
            }
            // Handle other actions (create_theme, move_note) in the future
          });
        }
      } catch (error) {
        console.error("Failed to organize text:", error);
        setApiStatus("ERROR");
      }
    },
    [settings.enableDeduplication, settings.maxCardCount],
  );

  const { isListening, transcript, isSupported, start, stop } = useSpeechToText(
    {
      onFlush: handleFlush,
    },
  );

  const toggleListening = () => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  };

  // Scenario Player Logic
  const playNextScenario = () => {
    if (scenarioIndex < SCENARIO_01.length) {
      const text = SCENARIO_01[scenarioIndex];
      handleFlush(text);
      setScenarioIndex((prev) => prev + 1);
    }
  };

  const resetScenario = () => {
    setScenarioIndex(0);
    setCards([]); // Optional: Clear cards on reset
  };

  // Debug Shortcut: Press 'D' to simulate input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "d" && e.ctrlKey) {
        console.log("Debug: Ctrl+D detected");
        // Ctrl+D to avoid accidental triggers
        handleFlush("テスト: 次の会議は来週の火曜日に設定しましょう。");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFlush]);

  return (
    <div className="relative h-screen w-full overflow-hidden app-background font-handwriting flex justify-center bg-zinc-900/5">
      {/* 
        Responsive Application Container 
        - Mobile: w-full (100%)
        - Desktop: max-w-screen-2xl, centered
        - Height: 100% of viewport
      */}
      <main className="relative w-full h-full max-w-screen-2xl mx-auto shadow-2xl overflow-hidden bg-transparent">
        {/* 1. Immersive Canvas (Background Layer within Container) */}
        <ImmersiveCanvas cards={cards} />

        {/* 2. UI Overlay Layer - Content area above footer */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-end pb-24">
          {/* Streaming Text Area */}
          <StreamingTypography text={transcript} isListening={isListening} />
        </div>

        {/* 3. Control Bar (Interactive, Absolute at bottom of Container) */}
        <ControlBar
          isListening={isListening}
          onToggleMic={toggleListening}
          onOpenSettings={() => setIsSettingsOpen(true)}
          cardCount={cards.length}
        />
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdate={updateSettings}
        onReset={resetSettings}
      />

      {/* Scenario Debug Player - Accordion Style (P3) */}
      {true && (
        <details className="fixed bottom-20 right-4 pointer-events-auto z-[900] group">
          <summary className="bg-slate-800/90 text-white px-4 py-2 rounded-lg shadow-xl border border-slate-700 cursor-pointer hover:bg-slate-700/90 transition-colors list-none flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              🎬 Scenario
            </span>
            <span className="text-[10px] text-slate-400">
              {scenarioIndex}/{SCENARIO_01.length}
            </span>
          </summary>
          <div className="bg-slate-800/90 text-white p-4 rounded-lg shadow-xl border border-slate-700 w-64 mt-1">
            <div className="w-full bg-slate-700 h-1.5 rounded-full mb-3 overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-300"
                style={{
                  width: `${(scenarioIndex / SCENARIO_01.length) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs mb-3 min-h-[3em] text-slate-300">
              {scenarioIndex < SCENARIO_01.length
                ? `Next: "${SCENARIO_01[scenarioIndex].slice(0, 40)}..."`
                : "Scenario Completed"}
            </p>
            <div className="text-xs mb-2 font-mono">
              Status:{" "}
              <span
                className={
                  apiStatus === "SUCCESS"
                    ? "text-green-400"
                    : apiStatus === "ERROR"
                      ? "text-red-400"
                      : apiStatus === "LOADING"
                        ? "text-yellow-400"
                        : "text-slate-500"
                }
              >
                {apiStatus}
              </span>
            </div>

            {rawResponse && (
              <details className="mb-2">
                <summary className="text-[10px] cursor-pointer text-slate-400 hover:text-white">
                  Run Details
                </summary>
                <div className="bg-slate-900/50 p-2 rounded mt-1 overflow-auto max-h-32">
                  <pre className="text-[8px] font-mono text-green-300 leading-tight whitespace-pre-wrap">
                    {rawResponse}
                  </pre>
                </div>
              </details>
            )}

            <div className="flex gap-2">
              <button
                onClick={playNextScenario}
                disabled={scenarioIndex >= SCENARIO_01.length}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold py-2 rounded transition-colors"
              >
                Next Step
              </button>
              <button
                onClick={resetScenario}
                className="px-3 bg-slate-600 hover:bg-slate-500 text-xs font-bold py-2 rounded transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </details>
      )}
    </div>
  );
}
