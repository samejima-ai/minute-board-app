import { useState, useEffect, useRef, useCallback } from "react";
import { useSettings } from "./useSettings";

interface UseSpeechToTextReturn {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  start: () => void;
  stop: () => void;
}

interface UseSpeechToTextProps {
  onFlush: (text: string) => void;
}

export function useSpeechToText({
  onFlush,
}: UseSpeechToTextProps): UseSpeechToTextReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const bufferRef = useRef<string>(""); // Accumulate final results here
  const isExplicitStopRef = useRef(false);
  const lastInputTimeRef = useRef<number>(Date.now());
  const flushTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { settings } = useSettings();

  // Buffer Flush Logic
  const flushBuffer = useCallback(() => {
    if (bufferRef.current.trim().length > 0) {
      onFlush(bufferRef.current.trim());
      bufferRef.current = "";
      setTranscript(""); // Clear interim transcript from UI if needed, or keep interim
    }
  }, [onFlush]);

  // Check debounce and max length
  const checkBufferConditions = useCallback(() => {
    const now = Date.now();
    const timeSinceLastInput = now - lastInputTimeRef.current;

    // Condition 1: Debounce (1.5s silence) is handled by setTimeout in onresult
    // Condition 2: Max Length (> 100 chars -> settings.autoSubmitThreshold)
    if (bufferRef.current.length > settings.autoSubmitThreshold) {
      flushBuffer();
    }
  }, [flushBuffer, settings.autoSubmitThreshold]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setIsSupported(false);
        return;
      }

      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = settings.language;

      recognition.onstart = () => {
        setIsListening(true);
        isExplicitStopRef.current = false;
      };

      recognition.onend = () => {
        setIsListening(false);
        // Auto-reconnect loop
        if (!isExplicitStopRef.current) {
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.warn("Reconnection failed:", e);
            }
          }, 100);
        }
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        lastInputTimeRef.current = Date.now();
        let interim = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            bufferRef.current += result[0].transcript;
            checkBufferConditions();
          } else {
            interim += result[0].transcript;
          }
        }
        setTranscript(interim);

        // Reset Debounce Timer (P2: Extended to 3 seconds for natural speech pauses)
        if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
        flushTimerRef.current = setTimeout(() => {
          flushBuffer();
        }, settings.silenceDuration);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "network") {
          // Retry logic is handled by onend auto-reconnect, but we can add specific delay
          isExplicitStopRef.current = false;
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      isExplicitStopRef.current = true; // Prevent auto-restart on unmount
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [
    checkBufferConditions,
    flushBuffer,
    settings.language,
    settings.silenceDuration,
  ]);

  const start = useCallback(() => {
    if (recognitionRef.current) {
      try {
        isExplicitStopRef.current = false;
        recognitionRef.current.start();
      } catch (e) {
        console.warn("Already started or error:", e);
      }
    }
  }, []);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      isExplicitStopRef.current = true;
      recognitionRef.current.stop();
    }
  }, []);

  return { isListening, transcript, isSupported, start, stop };
}
