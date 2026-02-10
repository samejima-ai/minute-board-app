"use client";

import { useState, useEffect, useCallback } from "react";

export interface AppSettings {
  // Voice Recognition
  language: "ja-JP" | "en-US";
  silenceDuration: number; // ms
  autoSubmitThreshold: number; // chars

  // Card Management
  maxCardCount: number;
  enableDeduplication: boolean;

  // Layout
  layoutStrength: number; // 0.1 - 2.0
  fontSizeScale: number; // 0.8 - 1.5
}

const DEFAULT_SETTINGS: AppSettings = {
  language: "ja-JP",
  silenceDuration: 3000,
  autoSubmitThreshold: 100,
  maxCardCount: 50,
  enableDeduplication: true,
  layoutStrength: 1.0,
  fontSizeScale: 1.0,
};

const STORAGE_KEY = "app-settings";

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Merge with default to handle new keys in future
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        } catch (e) {
          console.warn("Failed to parse settings:", e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever settings change
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    updateSettings,
    resetSettings,
    isLoaded,
  };
}
