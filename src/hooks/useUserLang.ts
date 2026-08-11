"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export function useUserLang() {
  const { user, isLoaded } = useUser();
  const [lang, setLangState] = useState<"es" | "en">("es");
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user || initialized) return;
    async function init() {
      const res = await fetch("/api/user");
      if (!res.ok) return;
      const data = await res.json();
      const stored = data.user?.language as string | undefined;
      if (stored === "en" || stored === "es") { setLangState(stored as "es" | "en"); setInitialized(true); return; }
      const browserLang = (navigator.language ?? "es").toLowerCase();
      const detected = browserLang.startsWith("en") ? "en" : "es";
      if (detected === "en" && stored !== "en") {
        await fetch("/api/user", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ language: "en" }) });
        window.location.reload(); return;
      }
      setLangState("es"); setInitialized(true);
    }
    init();
  }, [isLoaded, user, initialized]);

  async function updateLang(newLang: "es" | "en") {
    setSaving(true);
    try {
      await fetch("/api/user", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ language: newLang }) });
      window.location.reload();
    } finally { setSaving(false); }
  }
  return { lang, setLang: updateLang, saving };
}