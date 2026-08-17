"use client";
import { useState } from "react";
import { useForm, ValidationError } from "@formspree/react";

export default function ContactPage() {
  const [lang, setLang] = useState<"es" | "en">("es");
  const [state, handleSubmit] = useForm("xppayovj");

  const t = {
    es: {
      badge: "BYMYZAI LLC",
      title: "Contacto",
      subtitle: "Responderemos dentro de 2 dias habiles.",
      name: "Nombre completo",
      email: "Correo electronico",
      subject: "Asunto",
      subjects: ["Soporte tecnico", "Legal y privacidad", "Facturacion", "Prensa", "Otro"],
      message: "Mensaje",
      send: "Enviar mensaje",
      sending: "Enviando...",
      ok: "Mensaje enviado. Te responderemos pronto.",
      note: "Este formulario es administrado por BYMYZAI LLC · Entity ID 0451511216 · Basking Ridge, NJ 07920",
    },
    en: {
      badge: "BYMYZAI LLC",
      title: "Contact",
      subtitle: "We will respond within 2 business days.",
      name: "Full name",
      email: "Email address",
      subject: "Subject",
      subjects: ["Technical support", "Legal & privacy", "Billing", "Press", "Other"],
      message: "Message",
      send: "Send message",
      sending: "Sending...",
      ok: "Message sent. We will get back to you soon.",
      note: "This form is managed by BYMYZAI LLC · Entity ID 0451511216 · Basking Ridge, NJ 07920",
    },
  };

  const c = t[lang];

  const inputStyle = {
    width: "100%",
    background: "#161C27",
    border: "1px solid #324055",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#F8FAFF",
    fontSize: "14px",
    fontFamily: "'DM Sans',sans-serif",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    fontSize: "13px",
    color: "#B3BDD1",
    fontWeight: 600,
    display: "block",
    marginBottom: "6px",
  };

  if (state.succeeded) {
    return (
      <div style={{ minHeight: "100vh", background: "#0F1420", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif" }}>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>✓</div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#36D399", fontSize: "24px", marginBottom: "8px" }}>{c.ok}</h2>
          <a href="/" style={{ color: "#7B61FF", fontSize: "14px", fontWeight: 600 }}>← Bymyzai</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0F1420", padding: "40px 20px", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>

        <div style={{ marginBottom: "32px" }}>
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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          <div>
            <label style={labelStyle}>{c.name} *</label>
            <input id="name" type="text" name="name" required style={inputStyle} />
            <ValidationError prefix="Name" field="name" errors={state.errors} style={{ color: "#FF6B6B", fontSize: "12px", marginTop: "4px" }} />
          </div>

          <div>
            <label style={labelStyle}>{c.email} *</label>
            <input id="email" type="email" name="email" required style={inputStyle} />
            <ValidationError prefix="Email" field="email" errors={state.errors} style={{ color: "#FF6B6B", fontSize: "12px", marginTop: "4px" }} />
          </div>

          <div>
            <label style={labelStyle}>{c.subject} *</label>
            <select id="subject" name="subject" required style={inputStyle}>
              <option value="">—</option>
              {c.subjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ValidationError prefix="Subject" field="subject" errors={state.errors} style={{ color: "#FF6B6B", fontSize: "12px", marginTop: "4px" }} />
          </div>

          <div>
            <label style={labelStyle}>{c.message} *</label>
            <textarea id="message" name="message" required rows={5} style={{ ...inputStyle, resize: "vertical" }} />
            <ValidationError prefix="Message" field="message" errors={state.errors} style={{ color: "#FF6B6B", fontSize: "12px", marginTop: "4px" }} />
          </div>

          <button
            type="submit"
            disabled={state.submitting}
            style={{ background: "#7B61FF", color: "#fff", border: "none", borderRadius: "8px", padding: "12px 24px", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "15px", cursor: state.submitting ? "wait" : "pointer", opacity: state.submitting ? 0.7 : 1 }}
          >
            {state.submitting ? c.sending : c.send}
          </button>

        </form>

        <p style={{ fontSize: "11px", color: "#7E8798", textAlign: "center", marginTop: "32px" }}>{c.note}</p>

      </div>
    </div>
  );
}