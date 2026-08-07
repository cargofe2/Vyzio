"use client";
import { useUserLang } from "@/hooks/useUserLang";

export default function LangToggle() {
  const { lang, setLang, saving } = useUserLang();
  return (
    <button
      onClick={() => !saving && setLang(lang === "es" ? "en" : "es")}
      style={{ height: "32px", padding: "0 10px", borderRadius: "10px", border: "1px solid rgba(123,97,255,0.3)", background: lang === "en" ? "rgba(123,97,255,0.2)" : "#1E2533", color: "#F8FAFF", fontSize: "11px", fontWeight: 700, cursor: saving ? "wait" : "pointer", fontFamily: "DM Sans,sans-serif", letterSpacing: "0.5px" }}
    >
      {lang === "es" ? "ES" : "EN"}
    </button>
  );
}