"use client";
import { useState } from "react";

const sections_es = [
  { id: "1", title: "Contenido Educativo", content: "Bymyzai proporciona educación en inteligencia artificial con fines informativos y de desarrollo únicamente. Todo el contenido — incluyendo lecciones, proyectos, evaluaciones e interacciones con ZAI — no constituye asesoramiento profesional, académico, legal, financiero ni laboral. Completar cualquier nivel, certificado o programa de Bymyzai no garantiza empleo, admisión a ninguna institución ni certificación profesional.", callout: "Los certificados de Bymyzai representan hitos de aprendizaje dentro de la plataforma. No son credenciales académicas acreditadas bajo la ley estadounidense ni internacional." },
  { id: "2", title: "Uso de Inteligencia Artificial", content: "Bymyzai utiliza modelos de IA de terceros (incluyendo Claude de Anthropic) para las lecciones, el mentor ZAI y las funciones personalizadas. Las respuestas generadas por IA pueden contener errores o información desactualizada. ZAI no tiene emociones reales, memoria persistente ni juicio independiente. Bymyzai no utiliza tus datos para entrenar modelos de IA externos sin consentimiento explícito.", callout: null },
  { id: "3", title: "Edad Mínima Requerida", content: "Bymyzai está disponible exclusivamente para usuarios de 16 años o más. Los usuarios de entre 16 y 17 años deben contar con el consentimiento verificable de sus padres o tutores antes de crear una cuenta. Los usuarios menores de 16 años tienen prohibido registrarse o usar la plataforma.", callout: "Padres: Si su hijo menor de 16 años se ha registrado en Bymyzai, contáctenos en info@bymyzai.com y eliminaremos la cuenta en 5 días hábiles." },
  { id: "4", title: "Usuarios Internacionales y RGPD", content: "Bymyzai es operado por BYMYZAI LLC, una compañía de responsabilidad limitada registrada en New Jersey, EE.UU. (Entity ID 0451511216). Si te encuentras en el EEE, el Reino Unido o Suiza, cuentas con derechos adicionales bajo el RGPD: acceso, rectificación, supresión, limitación, portabilidad y retirada del consentimiento en cualquier momento.", callout: "Base jurídica (Art. 6 RGPD): Ejecución de contrato, interés legítimo en la operación de la plataforma y consentimiento explícito donde sea requerido." },
  { id: "5", title: "Contacto", content: "Para consultas sobre este aviso o tus derechos: info@bymyzai.com — BYMYZAI LLC, 405 King George Road 221, Basking Ridge, NJ 07920. Respondemos en 30 días. Los usuarios del EEE pueden también presentar una reclamación ante su autoridad de control local.", callout: null },
];

const sections_en = [
  { id: "1", title: "Educational Content", content: "Bymyzai provides AI literacy and skills education for informational and developmental purposes only. All content — including lessons, projects, assessments, and AI mentor interactions — does not constitute professional, academic, legal, financial, or career advice. Completion of any Bymyzai level, certificate, or program does not guarantee employment, admission to any institution, or professional certification.", callout: "Bymyzai certificates represent demonstrated learning milestones within the platform. They are not accredited academic credentials under U.S. or international law." },
  { id: "2", title: "Use of Artificial Intelligence", content: "Bymyzai uses third-party AI models (including Anthropic's Claude) to power lessons, the ZAI mentor, and personalized features. AI-generated responses may contain errors or outdated information. The ZAI mentor has no real emotions, no persistent memory, and no independent judgment. Bymyzai does not use your data to train external AI models without explicit consent.", callout: null },
  { id: "3", title: "Minimum Age Requirement", content: "Bymyzai is available exclusively to users aged 16 and older. Users between 16 and 17 years of age must have verifiable parental or guardian consent before creating an account. Users under 16 are strictly prohibited from registering or using the platform.", callout: "Parents: If your child under 16 has registered on Bymyzai, contact info@bymyzai.com and we will delete the account within 5 business days." },
  { id: "4", title: "International Users & GDPR", content: "Bymyzai is operated by BYMYZAI LLC, a New Jersey Limited Liability Company (Entity ID 0451511216). If you are located in the EEA, United Kingdom, or Switzerland, you have additional rights under the GDPR, including: access, rectification, erasure, restriction, portability, and withdrawal of consent at any time.", callout: "Legal basis (GDPR Art. 6): Contract performance, legitimate interest in platform operation, and explicit consent where required." },
  { id: "5", title: "Contact", content: "For questions regarding this disclaimer or your data rights: info@bymyzai.com — BYMYZAI LLC, 405 King George Road 221, Basking Ridge, NJ 07920. We respond within 30 days. EEA users may also lodge a complaint with their local supervisory authority.", callout: null },
];

export default function DisclaimerClient() {
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
                {lang === "es" ? "Aviso Legal" : "Disclaimer"}
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

        <div style={{ background: "#1E2533", border: "1px solid #324055", borderLeft: "3px solid #7B61FF", borderRadius: "10px", padding: "16px 20px", marginBottom: "32px", fontSize: "14px", color: "#B3BDD1" }}>
          <strong style={{ color: "#A78BFA", display: "block", marginBottom: "6px" }}>
            {lang === "es" ? "Aviso de Beta Pública" : "Public Beta Notice"}
          </strong>
          {lang === "es"
            ? "Bymyzai está disponible actualmente como Beta Pública. La plataforma se encuentra en proceso activo de prueba y refinamiento. Durante este periodo, las funciones, el contenido, los precios y las funcionalidades pueden cambiar sin previo aviso."
            : "Bymyzai is currently available as a Public Beta. The platform is actively being tested and refined. During this period, features, content, pricing, and functionality may change without prior notice."}
        </div>

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
                <span style={{ color: "#7B61FF", fontSize: "18px", fontWeight: 700, transform: open === s.id ? "rotate(45deg)" : "rotate(0deg)", display: "inline-block" }}>+</span>
              </button>
              {open === s.id && (
                <div style={{ padding: "0 20px 20px 20px", color: "#B3BDD1", fontSize: "14px", lineHeight: 1.7, borderTop: "1px solid #242E40" }}>
                  <p style={{ marginTop: "16px", marginBottom: s.callout ? "12px" : 0 }}>{s.content}</p>
                  {s.callout && (
                    <div style={{ background: "#242E40", border: "1px solid #324055", borderLeft: "3px solid #F2C04D", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#B3BDD1" }}>
                      {s.callout}
                      {s.id === "3" && (
                        <a href="mailto:info@bymyzai.com" style={{ color: "#7B61FF", display: "inline-block", marginTop: "6px", fontWeight: 600 }}>info@bymyzai.com</a>
                      )}
                    </div>
                  )}
                  {s.id === "5" && (
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