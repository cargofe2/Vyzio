"use client";
import { createContext, useCallback, useContext, useRef, useState, ReactNode } from "react";

export type ZaiMood = "idle" | "correct" | "incorrect" | "celebrate" | "thinking";

interface ZaiContextValue {
  mood: ZaiMood;
  triggerMood: (mood: ZaiMood, durationMs?: number) => void;
}

const ZaiContext = createContext<ZaiContextValue | null>(null);

export function ZaiProvider({ children }: { children: ReactNode }) {
  const [mood, setMood] = useState<ZaiMood>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerMood = useCallback((next: ZaiMood, durationMs = 1400) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMood(next);
    if (next !== "idle") {
      timeoutRef.current = setTimeout(() => setMood("idle"), durationMs);
    }
  }, []);

  return <ZaiContext.Provider value={{ mood, triggerMood }}>{children}</ZaiContext.Provider>;
}

export function useZai() {
  const ctx = useContext(ZaiContext);
  if (!ctx) {
    // Fallback seguro si algún componente se renderiza fuera del provider (no debería pasar)
    return { mood: "idle" as ZaiMood, triggerMood: () => {} };
  }
  return ctx;
}
