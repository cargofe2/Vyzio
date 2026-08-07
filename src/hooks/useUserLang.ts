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
      const createdAt = data.user?.createdAt as string | undefined;
      const isNewUser = createdAt && (Date.now() - new Date(createdAt).getTime()) < 60000;
      if (stored === "en") {
        setLangState("en");
      } else if (isNewUser) {
        const browserLang = (navigator.language ?? "es").toLowerCase();
        const detected: "es" | "en" = browserLang.startsWith("en") ? "en" : "es";
        setLangState(detected);
        if (detected === "en") {
          await saveLang(detected);
        }
      } else {
        setLangState("es");
      }
      setInitialized(true);
    }
    init();
  }, [isLoaded, user, initialized]);

  async function saveLang(newLang: "es" | "en") {
    setSaving(true);
    try {
      await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: newLang }),
      });
    } finally {
      setSaving(false);
    }
  }

  async function updateLang(newLang: "es" | "en") {
    setLangState(newLang);
    await saveLang(newLang);
  }

  return { lang, setLang: updateLang, saving };
}