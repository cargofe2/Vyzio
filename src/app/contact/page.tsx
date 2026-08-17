"use client";
import { useState } from "react";

export default function ContactPage() {
  const [lang, setLang] = useState<"es" | "en">("es");

  const t = {
    es: {
      badge: "BYMYZAI LLC",
      title: "Contacto",
      subtitle: "Estamos aqui para ayudarte.",
      note: "BYMYZAI LLC - Entity ID 0451511216 - Basking Ridge, NJ 07920",
      channels: [
        { icon: "?", label: "Soporte Tecnico", email: "support@bymyzai.com", desc: "Problemas con tu cuenta, acceso o plataforma." },
        { icon: "?", label: "Legal y Privacidad", email: "legal@bymyzai.com", desc: "Terminos, privacidad, datos y derechos GDPR." },
        { icon: "?", label: "General e Informacion", email: "info@bymyzai.com", desc: "Prensa, alianzas, escuelas y consultas generales." },
      ],
      response: "Respondemos dentro de 2 dias habiles.",
    },
    en: {
      badge: "BYMYZAI LLC",
      title: "Contact",
      subtitle: "We are here to help you.",
      note: "BYMYZAI LLC - Entity ID 0451511216 - Basking Ridge, NJ 07920",
      channels: [
        { icon: "?", label: "Technical Support", email: "support@bymyzai.com", desc: "Issues with your account, access or platform." },
        { icon: "?", label: "Legal & Privacy", email: "legal@bymyzai.com", desc: "Terms, privacy, data rights and GDPR requests." },
        { icon: "?", label: "General & Information", email: "info@bymyzai.com", desc: "Press, partnerships, schools and general inquiries." },
      ],
      response: "We respond within 2 business days.",
    },
  };

  const c = t[lang];

  return (
    <div style={{ minHeight: "100vh", background: "#0F1420", padding: "40px 20px", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>

        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "12px", color: "#7B61FF", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>{c.badge}</p>
              <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#F8FAFF", fontSize: "28px", margin: 0 }}>{c.title}</h1>
              <p style={{ fontSize: "13px", color: "#7E8798", marginTop: "6px" }}>{c.subtitle}</p>
            </div>
            <div style={{ display: "flex", gap: "4px", background: "#1E2533", border: "1px solid #324055", borderRadius: "8px", padding: "4px" }}>
              <button onClick={() => setLang("es")} style={{ background: lang === "es" ? "#7B61FF" : "none", color: lang === "es" ? "#fff" : "#7E8798", border: "none", borderRadius: "5px", padding: "4px 16px", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>ES</button>
              <button onClick={() => setLang("en")} style={{ background: lang === "en" ? "#7B61FF" : "none", color: lang === "en" ? "#fff" : "#7E8798", border: "none", borderRadius: "5px", padding: "4px 16px", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>EN</button>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
          {c.channels.map((ch) => (
            <a key={ch.email} href={"mailto:" + ch.email} style={{ textDecoration: "none" }}>
              <div style={{ background: "#161C27", border: "1px solid #324055", borderRadius: "12px", padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: "16px", transition: "border-color 0.2s", cursor: "pointer" }}>
                <div style={{ fontSize: "24px", minWidth: "32px", textAlign: "center" }}>{ch.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "15px", margin: "0 0 4px 0" }}>{ch.label}</p>
                  <p style={{ color: "#B3BDD1", fontSize: "13px", margin: "0 0 8px 0", lineHeight: 1.5 }}>{ch.desc}</p>
                  <p style={{ color: "#7B61FF", fontSize: "13px", fontWeight: 700, margin: 0 }}>{ch.email}</p>
                </div>
                <div style={{ color: "#324055", fontSize: "18px", alignSelf: "center" }}>›</div>
              </div>
            </a>
          ))}
        </div>

        <div style={{ background: "#1E2533", border: "1px solid #324055", borderLeft: "3px solid #36D399", borderRadius: "10px", padding: "14px 20px", marginBottom: "32px" }}>
          <p style={{ color: "#B3BDD1", fontSize: "13px", margin: 0 }}>
            <strong style={{ color: "#36D399" }}>?</strong> {c.response}
          </p>
        </div>

        <p style={{ fontSize: "11px", color: "#7E8798", textAlign: "center", margin: 0 }}>{c.note}</p>

      </div>
    </div>
  );
}