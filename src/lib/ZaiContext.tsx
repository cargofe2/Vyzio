"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";

export type ZaiMood = "idle" | "correct" | "incorrect" | "celebrate" | "thinking" | "sleeping";

interface ZaiContextValue {
  mood: ZaiMood;
  triggerMood: (mood: ZaiMood, durationMs?: number) => void;
}

const ZaiContext = createContext<ZaiContextValue | null>(null);

const SLEEP_AFTER_MS = 25000; // dormir tras 25s sin actividad ni reacciones

export function ZaiProvider({ children }: { children: ReactNode }) {
  const [mood, setMood] = useState<ZaiMood>("idle");
  const reactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sleepTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moodRef = useRef<ZaiMood>("idle");
  moodRef.current = mood;

  const scheduleSleep = useCallback(() => {
    if (sleepTimer.current) clearTimeout(sleepTimer.current);
    sleepTimer.current = setTimeout(() => {
      if (moodRef.current === "idle" || moodRef.current === "thinking") setMood("sleeping");
    }, SLEEP_AFTER_MS);
  }, []);

  const triggerMood = useCallback((next: ZaiMood, durationMs = 1400) => {
    if (reactionTimer.current) clearTimeout(reactionTimer.current);
    setMood(next);
    if (next !== "idle" && next !== "sleeping") {
      reactionTimer.current = setTimeout(() => setMood("idle"), durationMs);
    }
    scheduleSleep();
  }, [scheduleSleep]);

  // Despierta con cualquier actividad del usuario en la página
  useEffect(() => {
    scheduleSleep();
    function wake() {
      if (moodRef.current === "sleeping") setMood("idle");
      scheduleSleep();
    }
    const events: (keyof WindowEventMap)[] = ["click", "keydown", "touchstart", "scroll"];
    events.forEach(ev => window.addEventListener(ev, wake, { passive: true }));
    return () => events.forEach(ev => window.removeEventListener(ev, wake));
  }, [scheduleSleep]);

  return <ZaiContext.Provider value={{ mood, triggerMood }}>{children}</ZaiContext.Provider>;
}

export function useZai() {
  const ctx = useContext(ZaiContext);
  if (!ctx) return { mood: "idle" as ZaiMood, triggerMood: () => {} };
  return ctx;
}
