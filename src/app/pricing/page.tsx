"use client";
import { useState } from "react";
import { useUserLang } from "@/hooks/useUserLang";

const PRICE_IDS = {
  monthly: "price_1U5YkQPZklOveHjjzEG8VEcq",
  annual: "price_1U5YrYPZklOveHjjzw7fcUkS",
};

export default function PricingPage() {
  const { lang } = useUserLang();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(priceId: string, key: string) {
    setLoading(key);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(lang === "es" ? "Error al procesar el pago" : "Payment error");
    } catch {
      alert(lang === "es" ? "Error al procesar el pago" : "Payment error");
    } finally {
      setLoading(null);
    }
  }

  const t = {
    badge:        { es: "BYMYZAI LLC",                              en: "BYMYZAI LLC" },
    title:        { es: "Elige tu plan",                            en: "Choose your plan" },
    subtitle:     { es: "Empieza gratis. Sube cuando estes listo.", en: "Start free. Upgrade when ready." },
    starter:      { es: "STARTER",                                  en: "STARTER" },
    starterDesc:  { es: "Para explorar Bymyzai",                    en: "To explore Bymyzai" },
    free:         { es: "Gratis",                                   en: "Free" },
    forever:      { es: "para siempre",                             en: "forever" },
    pro:          { es: "PRO",                                      en: "PRO" },
    proDesc:      { es: "Acceso completo",                          en: "Full access" },
    monthly:      { es: "Mensual",                                  en: "Monthly" },
    annual:       { es: "Anual",                                    en: "Annual" },
    save:         { es: "Ahorra 35%",                               en: "Save 35%" },
    perMonth:     { es: "/mes",                                     en: "/mo" },
    perYear:      { es: "/ano",                                     en: "/yr" },
    getStarter:   { es: "Comenzar gratis",                          en: "Start free" },
    getMonthly:   { es: "Suscribirse mensual",                      en: "Subscribe monthly" },
    getAnnual:    { es: "Suscribirse anual",                        en: "Subscribe annual" },
    processing:   { es: "Procesando...",                            en: "Processing..." },
    featStarter:  { es: ["Nivel Origins completo", "Primeras lecciones de Explorer, Thinker y Builder", "ZAI con limite diario", "Boss Battles limitados"], en: ["Full Origins level", "First lessons of Explorer, Thinker and Builder", "ZAI with daily limit", "Limited Boss Battles"] },
    featPro:      { es: ["Todos los niveles desbloqueados", "ZAI con mayor limite diario", "Boss Battles ampliados", "Certificados verificables", "Acceso anticipado a novedades"], en: ["All levels unlocked", "ZAI with higher daily limit", "More Boss Battles daily", "Verifiable certificates", "Early access to new features"] },
    legal:        { es: "Al suscribirte aceptas los Terminos de Servicio de BYMYZAI LLC. Puedes cancelar en cualquier momento. Reembolso completo dentro de los 14 dias.", en: "By subscribing you accept BYMYZAI LLC Terms of Service. Cancel anytime. Full refund within 14 days." },
    terms:        { es: "Terminos de Servicio", en: "Terms of Service" },
    privacy:      { es: "Privacidad",           en: "Privacy" },
  };

  const c = (key: keyof typeof t) => (t[key] as Record<string, string | string[]>)[lang] as string;
  const ca = (key: keyof typeof t) => (t[key] as Record<string, string[]>)[lang] as string[];

  return (
    <div style={{ minHeight: "100vh", background: "#0F1420", padding: "40px 20px", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <p style={{ fontSize: "12px", color: "#7B61FF", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>{c("badge")}</p>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#F8FAFF", fontSize: "32px", margin: "0 0 8px 0" }}>{c("title")}</h1>
          <p style={{ color: "#7E8798", fontSize: "14px" }}>{c("subtitle")}</p>
        </div>

        {/* Plans */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>

          {/* STARTER */}
          <div style={{ background: "#161C27", border: "1px solid #324055", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#F8FAFF", fontSize: "18px", margin: "0 0 4px 0" }}>{c("starter")}</p>
              <p style={{ color: "#7E8798", fontSize: "12px", margin: 0 }}>{c("starterDesc")}</p>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#F8FAFF", fontSize: "28px" }}>{c("free")}</span>
              <span style={{ color: "#7E8798", fontSize: "12px", marginLeft: "6px" }}>{c("forever")}</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
              {ca("featStarter").map((f) => (
                <li key={f} style={{ fontSize: "12px", color: "#B3BDD1", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <span style={{ color: "#36D399", flexShrink: 0 }}>+</span>{f}
                </li>
              ))}
            </ul>
            <a href="/dashboard" style={{ display: "block", textAlign: "center", padding: "10px", background: "#242E40", color: "#B3BDD1", borderRadius: "10px", fontSize: "13px", fontWeight: 700, textDecoration: "none", fontFamily: "'Syne',sans-serif" }}>{c("getStarter")}</a>
          </div>

          {/* PRO */}
          <div style={{ background: "rgba(123,97,255,0.08)", border: "2px solid #7B61FF", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", position: "relative" }}>
            <div style={{ position: "absolute", top: "-10px", right: "16px", background: "#7B61FF", color: "#fff", fontSize: "10px", fontWeight: 800, padding: "3px 10px", borderRadius: "20px", fontFamily: "'Syne',sans-serif" }}>PRO</div>
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#F8FAFF", fontSize: "18px", margin: "0 0 4px 0" }}>{c("pro")}</p>
              <p style={{ color: "#7E8798", fontSize: "12px", margin: 0 }}>{c("proDesc")}</p>
            </div>

            {/* Monthly */}
            <div style={{ background: "#1E2533", border: "1px solid #324055", borderRadius: "10px", padding: "12px", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", color: "#B3BDD1", fontWeight: 600 }}>{c("monthly")}</span>
                <div>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#F8FAFF", fontSize: "22px" }}>$5</span>
                  <span style={{ color: "#7E8798", fontSize: "11px" }}>{c("perMonth")}</span>
                </div>
              </div>
              <button
                onClick={() => handleCheckout(PRICE_IDS.monthly, "monthly")}
                disabled={loading === "monthly"}
                style={{ width: "100%", padding: "8px", background: "#7B61FF", color: "#fff", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 700, cursor: loading === "monthly" ? "wait" : "pointer", opacity: loading === "monthly" ? 0.7 : 1, fontFamily: "'Syne',sans-serif" }}
              >
                {loading === "monthly" ? c("processing") : c("getMonthly")}
              </button>
            </div>

            {/* Annual */}
            <div style={{ background: "#1E2533", border: "1px solid #7B61FF", borderRadius: "10px", padding: "12px", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#B3BDD1", fontWeight: 600 }}>{c("annual")}</span>
                  <span style={{ background: "#36D39920", color: "#36D399", fontSize: "9px", fontWeight: 700, padding: "1px 6px", borderRadius: "8px" }}>{c("save")}</span>
                </div>
                <div>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#F8FAFF", fontSize: "22px" }}>$49</span>
                  <span style={{ color: "#7E8798", fontSize: "11px" }}>{c("perYear")}</span>
                </div>
              </div>
              <p style={{ fontSize: "10px", color: "#7E8798", margin: "0 0 8px 0" }}>$4.08/mes</p>
              <button
                onClick={() => handleCheckout(PRICE_IDS.annual, "annual")}
                disabled={loading === "annual"}
                style={{ width: "100%", padding: "8px", background: "#7B61FF", color: "#fff", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 700, cursor: loading === "annual" ? "wait" : "pointer", opacity: loading === "annual" ? 0.7 : 1, fontFamily: "'Syne',sans-serif" }}
              >
                {loading === "annual" ? c("processing") : c("getAnnual")}
              </button>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
              {ca("featPro").map((f) => (
                <li key={f} style={{ fontSize: "12px", color: "#B3BDD1", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <span style={{ color: "#7B61FF", flexShrink: 0 }}>+</span>{f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal */}
        <div style={{ background: "#161C27", border: "1px solid #324055", borderRadius: "10px", padding: "16px 20px", marginBottom: "24px" }}>
          <p style={{ fontSize: "11px", color: "#7E8798", margin: "0 0 8px 0", lineHeight: 1.6 }}>{c("legal")}</p>
          <div style={{ display: "flex", gap: "16px" }}>
            <a href="/terms" style={{ fontSize: "11px", color: "#7B61FF", fontWeight: 600 }}>{c("terms")}</a>
            <a href="/privacy" style={{ fontSize: "11px", color: "#7B61FF", fontWeight: 600 }}>{c("privacy")}</a>
          </div>
        </div>

        <p style={{ fontSize: "11px", color: "#7E8798", textAlign: "center" }}>
          BYMYZAI LLC - Entity ID 0451511216 - Basking Ridge, NJ 07920
        </p>

      </div>
    </div>
  );
}