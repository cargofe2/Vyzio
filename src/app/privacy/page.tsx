"use client";
import { useState } from "react";

const sections_es = [
  { id: "1", title: "Datos que Recopilamos", content: "Nombre, correo, edad, idioma, progreso académico, interacciones con ZAI, datos de facturación (procesados por nuestro proveedor de pagos), y datos técnicos básicos." },
  { id: "2", title: "Uso de Inteligencia Artificial", content: "Usamos modelos de IA de terceros (incluyendo Anthropic) para operar ZAI y evaluar proyectos. Tus datos NO se utilizan para entrenar modelos de IA externos — exclusión (opt-out) por defecto." },
  { id: "3", title: "Consentimiento de Menores", content: "Para usuarios de 16-17 años, al registrarse se solicita el correo del padre, madre o tutor legal, quien debe confirmar el consentimiento mediante un enlace de verificación enviado por correo." },
  { id: "4", title: "Con Quién Compartimos Datos", content: "Proveedores de infraestructura: Vercel, Supabase, Clerk, Anthropic. No vendemos datos personales a terceros con fines publicitarios." },
  { id: "5", title: "Transferencias Internacionales", content: "Nuestros proveedores pueden procesar datos fuera de tu país de residencia. Al registrarte, otorgas consentimiento expreso para estas transferencias, necesarias para operar el Servicio." },
  { id: "6", title: "Certificados Públicos", content: "Los certificados verificables pueden exhibir tu nombre y nivel certificado, visibles públicamente mediante código único." },
  { id: "7", title: "Tus Derechos", content: "Puedes solicitar acceso, corrección, eliminación o portabilidad de tus datos escribiendo a info@bymyzai.com." },
  { id: "8", title: "Padres y Tutores", content: "Pueden solicitar acceso, corrección o eliminación de los datos de su hijo/a contactando a info@bymyzai.com." },
  { id: "9", title: "Contacto", content: "info@bymyzai.com — BYMYZAI LLC, 405 King George Road 221, Basking Ridge, NJ 07920." },
];

const sections_en = [
  { id: "1", title: "Data We Collect", content: "Name, email, age, language, academic progress, ZAI interactions, billing data (processed by our payment provider), and basic technical data." },
  { id: "2", title: "Use of Artificial Intelligence", content: "We use third-party AI models (including Anthropic) to operate ZAI and evaluate projects. Your data is NOT used to train external AI models — opt-out by default." },
  { id: "3", title: "Minor Consent", content: "For users aged 16-17, upon registration we request the email of a parent or legal guardian, who must confirm consent via a verification link sent by email." },
  { id: "4", title: "Who We Share Data With", content: "Infrastructure providers: Vercel, Supabase, Clerk, Anthropic. We do not sell personal data to third parties for advertising purposes." },
  { id: "5", title: "International Transfers", content: "Our providers may process data outside your country of residence. By registering, you give explicit consent for these transfers, necessary to operate the Service." },
  { id: "6", title: "Public Certificates", content: "Verifiable certificates may display your name and certified level, publicly visible via unique code." },
  { id: "7", title: "Your Rights", content: "You may request access, correction, deletion or portability of your data by writing to info@bymyzai.com." },
  { id: "8", title: "Parents and Guardians", content: "They may request access, correction or deletion of their child's data by contacting info@bymyzai.com." },
  { id: "9", title: "Contact", content: "info@bymyzai.com — BYMYZAI LLC, 405 King George Road 221, Basking Ridge, NJ 07920." },
];

export default function PrivacyPage() {
  const [lang, setLang] = useState<"es" | "en">("es");
  const [open, setOpen] = useState<string | null>(null);
  const sections = lang === "es" ? sections_es : sections_en;

  return (
    <div style={{ minHeight: "100vh", background: "#0F1420", padding: "40px 20px", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "12px", color: "#7B61FF", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>BYMYZAI LLC</p>
              <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#F8FAFF", fontSize: "28px", margin: 0 }}>
                {lang === "es" ? "Política de Privacidad" : "Privacy Policy"}
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

        <div style={{ background: "#1E2533", border: "1px solid #324055", borderLeft: "3px solid #26C6DA", borderRadius: "10px", padding: "16px 20px", marginBottom: "32px", fontSize: "14px", color: "#B3BDD1" }}>
          {lang === "es"
            ? "Esta Política describe cómo BYMYZAI LLC (Entity ID 0451511216), registrada en New Jersey, EE.UU., recopila, usa y protege tus datos personales."
            : "This Policy describes how BYMYZAI LLC (Entity ID 0451511216), registered in New Jersey, USA, collects, uses, and protects your personal data."}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {sections.map((s) => (
            <div key={s.id} style={{ background: "#161C27", border: "1px solid #324055", borderRadius: "10px", overflow: "hidden" }}>
              <button
                onClick={() => setOpen(open === s.id ? null : s.id)}
                style={{ width: "100%", background: "none", border: "none", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left" }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ background: "#242E40", color: "#26C6DA", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "11px", borderRadius: "6px", padding: "2px 8px", minWidth: "28px", textAlign: "center" }}>{s.id}</span>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "15px" }}>{s.title}</span>
                </span>
                <span style={{ color: "#26C6DA", fontSize: "18px", fontWeight: 700, transform: open === s.id ? "rotate(45deg)" : "rotate(0deg)", display: "inline-block" }}>+</span>
              </button>
              {open === s.id && (
                <div style={{ padding: "0 20px 20px 20px", color: "#B3BDD1", fontSize: "14px", lineHeight: 1.7, borderTop: "1px solid #242E40" }}>
                  <p style={{ marginTop: "16px", marginBottom: 0 }}>{s.content}</p>
                  {(s.id === "7" || s.id === "8" || s.id === "9") && (
                    <a href="mailto:info@bymyzai.com" style={{ color: "#7B61FF", display: "inline-block", marginTop: "8px", fontWeight: 600 }}>info@bymyzai.com</a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: "40px", padding: "20px", background: "#161C27", border: "1px solid #324055", borderRadius: "10px", textAlign: "center" }}>
          <p style={{ color: "#7E8798", fontSize: "12px", margin: 0 }}>
            BYMYZAI LLC · Entity ID 0451511216 · 405 King George Road 221, Basking Ridge, NJ 07920
          </p>
          <a href="mailto:info@bymyzai.com" style={{ color: "#7B61FF", fontSize: "13px", fontWeight: 600, display: "block", marginTop: "6px" }}>info@bymyzai.com</a>
        </div>

      </div>
    </div>
  );
}