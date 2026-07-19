"use client";
import { useState } from "react";

export default function DisclaimerClient() {
  const [lang, setLang] = useState<"en" | "es">("es");
  const s = {
    page: { minHeight: "100vh", background: "#0F1420", padding: "40px 20px", fontFamily: "'DM Sans',sans-serif" },
    wrap: { maxWidth: "700px", margin: "0 auto", color: "#B3BDD1", lineHeight: 1.7 },
    h1: { fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#F8FAFF", fontSize: "26px", marginBottom: "8px" },
    date: { fontSize: "12px", color: "#7E8798", marginBottom: "24px" },
    h2: { fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "18px", margin: "24px 0 10px" },
    p: { marginBottom: "16px" },
    a: { color: "#7B61FF" },
    callout: { background: "#1E2533", border: "1px solid #324055", borderLeft: "3px solid #F2C04D", borderRadius: "8px", padding: "12px 16px", marginTop: "12px", marginBottom: "16px", fontSize: "14px" },
    toggle: { display: "flex", gap: "4px", background: "#1E2533", border: "1px solid #324055", borderRadius: "8px", padding: "4px", marginBottom: "32px", width: "fit-content" },
    btnActive: { background: "#7B61FF", color: "#fff", border: "none", borderRadius: "5px", padding: "4px 16px", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "13px", cursor: "pointer" },
    btnInactive: { background: "none", color: "#7E8798", border: "none", borderRadius: "5px", padding: "4px 16px", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "13px", cursor: "pointer" },
    ul: { paddingLeft: "20px", marginBottom: "16px" },
    li: { marginBottom: "6px" },
  } as const;

  const en = (
    <>
      <h1 style={s.h1}>Disclaimer — Bymyzai</h1>
      <p style={s.date}>Last updated: July 2025</p>
      <p style={s.p}>Please read this disclaimer carefully before using Bymyzai.</p>

      <h2 style={s.h2}>1. Educational Content</h2>
      <p style={s.p}>Bymyzai provides AI literacy and skills education for informational and developmental purposes only. All content — including lessons, projects, assessments, and AI mentor interactions — does not constitute professional, academic, legal, financial, or career advice.</p>
      <p style={s.p}>Completion of any Bymyzai level, certificate, or program does not guarantee employment, admission to any institution, or professional certification. Results depend on each learner's individual effort and circumstances.</p>
      <div style={s.callout}><strong style={{ color: "#F2C04D" }}>Note:</strong> Bymyzai certificates represent demonstrated learning milestones within the platform. They are not accredited academic credentials under U.S. or international law.</div>

      <h2 style={s.h2}>2. Use of Artificial Intelligence</h2>
      <p style={s.p}>Bymyzai uses third-party AI models (including Anthropic's Claude) to power interactive lessons, the ZAI mentor, and personalized features. By using the platform, you acknowledge:</p>
      <ul style={s.ul}>
        <li style={s.li}>AI-generated responses may contain errors or outdated information.</li>
        <li style={s.li}>AI output is not a substitute for qualified human professional advice.</li>
        <li style={s.li}>The ZAI mentor has no real emotions, no persistent memory, and no independent judgment.</li>
        <li style={s.li}>Your interactions may be processed by third-party AI providers subject to their own policies.</li>
        <li style={s.li}>Bymyzai does not use your personal learning data to train external AI models without explicit opt-in consent.</li>
      </ul>

      <h2 style={s.h2}>3. Users Under 18</h2>
      <p style={s.p}>Bymyzai serves learners aged 13 and older. Users between 13 and 17 must have verifiable parental or guardian consent before creating an account.</p>
      <ul style={s.ul}>
        <li style={s.li}>Users under 13 are strictly prohibited from using the platform (COPPA compliance).</li>
        <li style={s.li}>Parents may request access, correction, or deletion of their child's data at <a href="mailto:privacy@bymyzai.com" style={s.a}>privacy@bymyzai.com</a>.</li>
        <li style={s.li}>Parental consent for users aged 16-17 is obtained via email confirmation prior to account activation.</li>
      </ul>
      <div style={s.callout}><strong style={{ color: "#F2C04D" }}>Parents:</strong> If your child under 13 has registered on Bymyzai, contact <a href="mailto:privacy@bymyzai.com" style={s.a}>privacy@bymyzai.com</a> and we will delete the account within 5 business days.</div>

      <h2 style={s.h2}>4. International Users & GDPR</h2>
      <p style={s.p}>Bymyzai is operated by Carlos Eduardo Gonzalez Fernandez, an individual based in New Jersey, United States, governed by the laws of New Jersey and applicable U.S. federal law.</p>
      <p style={s.p}>If you are located in the EEA, United Kingdom, or Switzerland, you have additional rights under the GDPR, including: access, rectification, erasure, restriction, portability, and withdrawal of consent at any time.</p>
      <p style={s.p}>By using Bymyzai from outside the United States, you consent to the transfer and processing of your data in the United States. We apply appropriate safeguards consistent with GDPR requirements.</p>
      <div style={s.callout}><strong style={{ color: "#F2C04D" }}>Legal basis (GDPR Art. 6):</strong> Contract performance, legitimate interest in platform operation, and explicit consent where required.</div>

      <h2 style={s.h2}>5. Contact</h2>
      <p style={{ ...s.p, marginBottom: "40px" }}>For questions regarding this disclaimer or your data rights: <a href="mailto:privacy@bymyzai.com" style={s.a}>privacy@bymyzai.com</a>. We respond within 30 days. EEA users may also lodge a complaint with their local supervisory authority.</p>
    </>
  );

  const es = (
    <>
      <h1 style={s.h1}>Aviso Legal — Bymyzai</h1>
      <p style={s.date}>Ultima actualizacion: julio 2025</p>
      <p style={s.p}>Lee este aviso detenidamente antes de usar Bymyzai.</p>

      <h2 style={s.h2}>1. Contenido Educativo</h2>
      <p style={s.p}>Bymyzai proporciona educacion en inteligencia artificial con fines informativos y de desarrollo unicamente. Todo el contenido — incluyendo lecciones, proyectos, evaluaciones e interacciones con ZAI — no constituye asesoramiento profesional, academico, legal, financiero ni laboral.</p>
      <p style={s.p}>Completar cualquier nivel, certificado o programa de Bymyzai no garantiza empleo, admision a ninguna institucion ni certificacion profesional. Los resultados dependen del esfuerzo y circunstancias individuales de cada estudiante.</p>
      <div style={s.callout}><strong style={{ color: "#F2C04D" }}>Nota:</strong> Los certificados de Bymyzai representan hitos de aprendizaje dentro de la plataforma. No son credenciales academicas acreditadas bajo la ley estadounidense ni internacional.</div>

      <h2 style={s.h2}>2. Uso de Inteligencia Artificial</h2>
      <p style={s.p}>Bymyzai utiliza modelos de IA de terceros (incluyendo Claude de Anthropic) para las lecciones, el mentor ZAI y las funciones personalizadas. Al usar la plataforma, reconoces que:</p>
      <ul style={s.ul}>
        <li style={s.li}>Las respuestas generadas por IA pueden contener errores o informacion desactualizada.</li>
        <li style={s.li}>El resultado de la IA no sustituye el consejo profesional humano calificado.</li>
        <li style={s.li}>ZAI no tiene emociones reales, memoria persistente ni juicio independiente.</li>
        <li style={s.li}>Tus interacciones pueden ser procesadas por proveedores de IA de terceros sujetos a sus propias politicas.</li>
        <li style={s.li}>Bymyzai no utiliza tus datos para entrenar modelos de IA externos sin consentimiento explicito.</li>
      </ul>

      <h2 style={s.h2}>3. Usuarios Menores de 18 Anos</h2>
      <p style={s.p}>Bymyzai atiende a estudiantes de 13 anos en adelante. Los usuarios de 13 a 17 anos deben contar con el consentimiento verificable de sus padres o tutores antes de crear una cuenta.</p>
      <ul style={s.ul}>
        <li style={s.li}>Los usuarios menores de 13 anos tienen prohibido el uso de la plataforma (cumplimiento COPPA).</li>
        <li style={s.li}>Los padres pueden solicitar acceso, correccion o eliminacion de los datos de su hijo en <a href="mailto:privacy@bymyzai.com" style={s.a}>privacy@bymyzai.com</a>.</li>
        <li style={s.li}>El consentimiento parental para usuarios de 16 a 17 anos se obtiene por confirmacion por correo previo a la activacion de la cuenta.</li>
      </ul>
      <div style={s.callout}><strong style={{ color: "#F2C04D" }}>Padres:</strong> Si su hijo menor de 13 anos se ha registrado en Bymyzai, contactenos en <a href="mailto:privacy@bymyzai.com" style={s.a}>privacy@bymyzai.com</a> y eliminaremos la cuenta en 5 dias habiles.</div>

      <h2 style={s.h2}>4. Usuarios Internacionales y RGPD</h2>
      <p style={s.p}>Bymyzai es operado por Carlos Eduardo Gonzalez Fernandez, individuo con domicilio en Nueva Jersey, Estados Unidos, regido por las leyes del Estado de Nueva Jersey y la legislacion federal aplicable.</p>
      <p style={s.p}>Si te encuentras en el EEE, el Reino Unido o Suiza, cuentas con derechos adicionales bajo el RGPD: acceso, rectificacion, supresion, limitacion, portabilidad y retirada del consentimiento en cualquier momento.</p>
      <p style={s.p}>Al usar Bymyzai desde fuera de Estados Unidos, consientes la transferencia y el tratamiento de tus datos en Estados Unidos. Aplicamos salvaguardias apropiadas conforme al RGPD.</p>
      <div style={s.callout}><strong style={{ color: "#F2C04D" }}>Base juridica (Art. 6 RGPD):</strong> Ejecucion de contrato, interes legitimo en la operacion de la plataforma y consentimiento explicito donde sea requerido.</div>

      <h2 style={s.h2}>5. Contacto</h2>
      <p style={{ ...s.p, marginBottom: "40px" }}>Para consultas sobre este aviso o tus derechos: <a href="mailto:privacy@bymyzai.com" style={s.a}>privacy@bymyzai.com</a>. Respondemos en 30 dias. Los usuarios del EEE pueden tambien presentar una reclamacion ante su autoridad de control local.</p>
    </>
  );

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <div style={s.toggle}>
          <button style={lang === "es" ? s.btnActive : s.btnInactive} onClick={() => setLang("es")}>ES</button>
          <button style={lang === "en" ? s.btnActive : s.btnInactive} onClick={() => setLang("en")}>EN</button>
        </div>
        {lang === "en" ? en : es}
      </div>
    </div>
  );
}
