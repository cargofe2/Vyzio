"use client";
import { useState } from "react";

const sections_es = [
  { id: "1", title: "Aceptación", content: "Al registrarte y usar la Plataforma, aceptas estos Términos en su totalidad. Si no estás de acuerdo, no debes usar la Plataforma." },
  { id: "2", title: "Elegibilidad y Edad Mínima", content: "La Plataforma está disponible únicamente para personas de 16 años o más. Si tienes entre 16 y 17 años, declaras contar con el consentimiento de tu padre, madre o tutor legal." },
  { id: "3", title: "Descripción del Servicio", content: "Bymyzai es una plataforma educativa de inteligencia artificial con contenido gamificado, mentor de IA (ZAI), progresión por niveles y certificación de competencias." },
  { id: "4", title: "Planes y Pagos", content: "Ofrecemos un plan gratuito y planes de pago que desbloquean niveles adicionales. Las suscripciones se renuevan automáticamente. Puedes solicitar reembolso completo dentro de los 14 días siguientes a la suscripción." },
  { id: "5", title: "Propiedad Intelectual", content: "Todo el contenido educativo, marca, software y diseño de la Plataforma son propiedad de BYMYZAI LLC. El contenido que envíes (proyectos, código) conserva tu titularidad; nos otorgas licencia para almacenarlo, mostrarlo y evaluarlo dentro del Servicio." },
  { id: "6", title: "Uso del Mentor ZAI", content: "ZAI es un sistema de inteligencia artificial y puede generar respuestas incorrectas o incompletas. No sustituye la supervisión de un docente, tutor legal o profesional cualificado." },
  { id: "7", title: "Certificaciones", content: "Los certificados son verificables públicamente mediante código único. No son credenciales académicas oficiales, títulos universitarios ni certificaciones emitidas por el gobierno. Representan competencias demostradas dentro del currículo de Bymyzai." },
  { id: "8", title: "Limitación de Responsabilidad", content: "La Plataforma se ofrece tal cual. No seremos responsables por daños indirectos derivados del uso de la Plataforma, incluyendo errores en contenido generado por IA." },
  { id: "9", title: "Ley Aplicable", content: "Estos Términos se rigen por las leyes del Estado de New Jersey, Estados Unidos." },
  { id: "10", title: "Contacto", content: "Para consultas: cgonzalez@bymyzai.com — BYMYZAI LLC, 405 King George Road 221, Basking Ridge, NJ 07920." },
];

const sections_en = [
  { id: "1", title: "Acceptance", content: "By registering and using the Platform, you accept these Terms in full. If you disagree, you must not use the Platform." },
  { id: "2", title: "Eligibility and Minimum Age", content: "The Platform is available exclusively to users aged 16 or older. If you are between 16 and 17 years old, you declare that you have parental or guardian consent." },
  { id: "3", title: "Service Description", content: "Bymyzai is an AI education platform with gamified content, an AI mentor (ZAI), level-based progression, and competency certification." },
  { id: "4", title: "Plans and Payments", content: "We offer a free plan and paid plans that unlock additional levels. Subscriptions renew automatically. You may request a full refund within 14 days of subscribing." },
  { id: "5", title: "Intellectual Property", content: "All educational content, brand, software, and design of the Platform are the property of BYMYZAI LLC. Content you submit (projects, code) remains yours; you grant us a license to store, display, and evaluate it within the Service." },
  { id: "6", title: "Use of ZAI Mentor", content: "ZAI is an AI system and may generate incorrect or incomplete responses. It does not replace the supervision of a teacher, legal guardian, or qualified professional." },
  { id: "7", title: "Certifications", content: "Certificates are publicly verifiable via unique code. They are not official academic credentials, university degrees, or government-issued certifications. They represent demonstrated competencies within the Bymyzai curriculum." },
  { id: "8", title: "Limitation of Liability", content: "The Platform is provided as-is. We are not liable for indirect damages arising from the use of the Platform, including errors in AI-generated content." },
  { id: "9", title: "Governing Law", content: "These Terms are governed by the laws of the State of New Jersey, United States." },
  { id: "10", title: "Contact", content: "For inquiries: cgonzalez@bymyzai.com — BYMYZAI LLC, 405 King George Road 221, Basking Ridge, NJ 07920." },
];

export default function TermsPage() {
  const [lang, setLang] = useState<"es" | "en">("es");
  const [open, setOpen] = useState<string | null>(null);
  const sections = lang === "es" ? sections_es : sections_en;

  return (
    <div style={{ minHeight: "100vh", background: "#0F1420", padding: "40px 20px", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "12px", color: "#7B61FF", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>BYMYZAI LLC</p>
              <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#F8FAFF", fontSize: "28px", margin: 0 }}>
                {lang === "es" ? "Términos de Servicio" : "Terms of Service"}
              </h1>
              <p style={{ fontSize: "12px", color: "#7E8798", marginTop: "6px" }}>
                {lang === "es" ? "Última actualización: agosto 2026" : "Last updated: August 2026"}
              </p>
            </div>
            <div style={{ display: "flex", gap: "4px", background: "#1E2533", border: "1px solid #324055", borderRadius: "8px", padding: "4px" }}>
              <button onClick={() => setLang("es")} style={{ background: lang === "es" ? "#7B61FF" : "none", color: lang === "es" ? "#fff" : "#7E8798", border: "none", borderRadius: "5px", padding: "4px 16px", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>ES</button>
              <button onClick={() => setLang("en")} style={{ background: lang === "en" ? "#7B61FF" : "none", color: lang === "en" ? "#fff" : "#7E8798", border: "none", borderRadius: "5px", padding: "4px 16px", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>EN</button>
            </div>
          </div>
        </div>

        {/* Intro banner */}
        <div style={{ background: "#1E2533", border: "1px solid #324055", borderLeft: "3px solid #7B61FF", borderRadius: "10px", padding: "16px 20px", marginBottom: "32px", fontSize: "14px", color: "#B3BDD1" }}>
          {lang === "es"
            ? "Al acceder o usar Bymyzai, operada por BYMYZAI LLC (Entity ID 0451511216), registrada en New Jersey, EE.UU., aceptas estos Términos."
            : "By accessing or using Bymyzai, operated by BYMYZAI LLC (Entity ID 0451511216), registered in New Jersey, USA, you accept these Terms."}
        </div>

        {/* Accordion sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {sections.map((s) => (
            <div key={s.id} style={{ background: "#161C27", border: "1px solid #324055", borderRadius: "10px", overflow: "hidden" }}>
              <button
                onClick={() => setOpen(open === s.id ? null : s.id)}
                style={{ width: "100%", background: "none", border: "none", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left" }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ background: "#242E40", color: "#7B61FF", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "11px", borderRadius: "6px", padding: "2px 8px", minWidth: "28px", textAlign: "center" }}>{s.id}</span>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "15px" }}>{s.title}</span>
                </span>
                <span style={{ color: "#7B61FF", fontSize: "18px", fontWeight: 700, transition: "transform 0.2s", transform: open === s.id ? "rotate(45deg)" : "rotate(0deg)", display: "inline-block" }}>+</span>
              </button>
              {open === s.id && (
                <div style={{ padding: "0 20px 20px 20px", color: "#B3BDD1", fontSize: "14px", lineHeight: 1.7, borderTop: "1px solid #242E40" }}>
                  <p style={{ marginTop: "16px", marginBottom: 0 }}>{s.content}</p>
                  {s.id === "10" && (
                    <a href="mailto:cgonzalez@bymyzai.com" style={{ color: "#7B61FF", display: "inline-block", marginTop: "8px", fontWeight: 600 }}>cgonzalez@bymyzai.com</a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: "40px", padding: "20px", background: "#161C27", border: "1px solid #324055", borderRadius: "10px", textAlign: "center" }}>
          <p style={{ color: "#7E8798", fontSize: "12px", margin: 0 }}>
            BYMYZAI LLC · Entity ID 0451511216 · 405 King George Road 221, Basking Ridge, NJ 07920
          </p>
          <a href="mailto:cgonzalez@bymyzai.com" style={{ color: "#7B61FF", fontSize: "13px", fontWeight: 600, display: "block", marginTop: "6px" }}>cgonzalez@bymyzai.com</a>
        </div>

      </div>
    </div>
  );
}