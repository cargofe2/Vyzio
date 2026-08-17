"use client";
import { useState } from "react";

const sections_es = [
  { id: "1", title: "Contenido Educativo", content: "Bymyzai proporciona educacion en inteligencia artificial con fines informativos y de desarrollo unicamente. Todo el contenido no constituye asesoramiento profesional, academico, legal, financiero ni laboral. Completar cualquier nivel o certificado no garantiza empleo, admision a instituciones ni certificacion profesional.", callout: "Los certificados de Bymyzai representan hitos de aprendizaje dentro de la plataforma. No son credenciales academicas acreditadas bajo ninguna ley." },
  { id: "2", title: "Uso de Inteligencia Artificial", content: "Bymyzai utiliza modelos de IA de terceros (incluyendo Claude de Anthropic) para las lecciones, el mentor ZAI y las funciones personalizadas. Las respuestas de IA pueden contener errores. ZAI no tiene emociones reales, memoria persistente ni juicio independiente. No sustituye consejo profesional humano.", callout: null },
  { id: "3", title: "Edad Minima Requerida", content: "Bymyzai esta disponible exclusivamente para usuarios de 16 anos o mas. Los usuarios de 16-17 anos deben contar con consentimiento verificable de sus padres o tutores. Los menores de 16 anos tienen prohibido registrarse.", callout: "Padres: Si su hijo menor de 16 anos se ha registrado, contactenos en legal@bymyzai.com y eliminaremos la cuenta en 5 dias habiles." },
  { id: "4", title: "Beta Publica", content: "Bymyzai esta disponible como Beta Publica. La plataforma se encuentra en proceso activo de prueba y refinamiento. Durante este periodo, las funciones, el contenido, los precios y las funcionalidades pueden cambiar sin previo aviso. Algunas areas pueden estar en desarrollo.", callout: null },
  { id: "5", title: "Usuarios Internacionales y GDPR", content: "Bymyzai es operado por BYMYZAI LLC (Entity ID 0451511216), registrada en New Jersey, EE.UU. Los usuarios del EEE, Reino Unido o Suiza tienen derechos adicionales bajo el GDPR: acceso, rectificacion, supresion, limitacion, portabilidad y retirada del consentimiento.", callout: "Base juridica (Art. 6 GDPR): Ejecucion de contrato, interes legitimo y consentimiento explicito donde sea requerido." },
  { id: "6", title: "Limitacion de Responsabilidad", content: "BYMYZAI LLC no sera responsable por danos directos, indirectos, incidentales o consecuentes derivados del uso de la Plataforma o del contenido generado por IA. El uso de la Plataforma es bajo el propio riesgo del usuario.", callout: null },
  { id: "7", title: "Contacto", content: "Para consultas legales: legal@bymyzai.com. Para soporte: support@bymyzai.com. Para informacion general: info@bymyzai.com. BYMYZAI LLC, 405 King George Road 221, Basking Ridge, NJ 07920. Respondemos en 30 dias.", callout: null },
];

const sections_en = [
  { id: "1", title: "Educational Content", content: "Bymyzai provides AI literacy education for informational and developmental purposes only. All content does not constitute professional, academic, legal, financial or career advice. Completing any level or certificate does not guarantee employment, admission to institutions or professional certification.", callout: "Bymyzai certificates represent learning milestones within the platform. They are not accredited academic credentials under any law." },
  { id: "2", title: "Use of Artificial Intelligence", content: "Bymyzai uses third-party AI models (including Anthropic Claude) for lessons, the ZAI mentor and personalized features. AI responses may contain errors. ZAI has no real emotions, persistent memory or independent judgment. It does not substitute qualified human professional advice.", callout: null },
  { id: "3", title: "Minimum Age Requirement", content: "Bymyzai is available exclusively to users aged 16 and older. Users aged 16-17 must have verifiable parental or guardian consent. Users under 16 are strictly prohibited from registering.", callout: "Parents: If your child under 16 has registered, contact us at legal@bymyzai.com and we will delete the account within 5 business days." },
  { id: "4", title: "Public Beta", content: "Bymyzai is currently available as a Public Beta. The platform is actively being tested and refined. During this period, features, content, pricing and functionality may change without prior notice. Some areas may still be under development.", callout: null },
  { id: "5", title: "International Users and GDPR", content: "Bymyzai is operated by BYMYZAI LLC (Entity ID 0451511216), registered in New Jersey, USA. EEA, UK or Switzerland users have additional rights under GDPR: access, rectification, erasure, restriction, portability and withdrawal of consent.", callout: "Legal basis (GDPR Art. 6): Contract performance, legitimate interest and explicit consent where required." },
  { id: "6", title: "Limitation of Liability", content: "BYMYZAI LLC will not be liable for direct, indirect, incidental or consequential damages arising from use of the Platform or AI-generated content. Use of the Platform is at the user's own risk.", callout: null },
  { id: "7", title: "Contact", content: "For legal inquiries: legal@bymyzai.com. For support: support@bymyzai.com. For general information: info@bymyzai.com. BYMYZAI LLC, 405 King George Road 221, Basking Ridge, NJ 07920. We respond within 30 days.", callout: null },
];

const legal_es = `AVISO LEGAL Y DESCARGO DE RESPONSABILIDAD — BYMYZAI LLC
Ultima actualizacion: agosto 2026
Entity ID: 0451511216 | Estado: New Jersey, EE.UU.

AVISO IMPORTANTE: Por favor lee este Aviso Legal detenidamente antes de usar la Plataforma Bymyzai. Al acceder o usar la Plataforma, aceptas los terminos de este Aviso Legal.

1. IDENTIFICACION DEL OPERADOR
Bymyzai es operada por BYMYZAI LLC, una compania de responsabilidad limitada registrada en el Estado de New Jersey, Estados Unidos, con Entity ID 0451511216, con domicilio en 405 King George Road 221, Basking Ridge, New Jersey 07920, EE.UU.
Contacto: legal@bymyzai.com

2. NATURALEZA DEL SERVICIO
2.1 Bymyzai es una plataforma educativa privada de alfabetizacion en inteligencia artificial.
2.2 Bymyzai NO es una institucion educativa acreditada, universidad, escuela vocacional certificada ni entidad educativa reconocida por ninguna autoridad gubernamental de EE.UU. o internacional.
2.3 Bymyzai NO otorga titulos academicos, diplomas universitarios ni certificaciones profesionales reconocidas oficialmente.
2.4 Los certificados emitidos por BYMYZAI LLC son certificados de completacion propios que acreditan el dominio del curriculum interno de Bymyzai.

3. DESCARGO DE RESPONSABILIDAD SOBRE CONTENIDO EDUCATIVO
3.1 Todo el contenido de la Plataforma — incluyendo lecciones, proyectos, evaluaciones, Boss Battles e interacciones con ZAI — se proporciona con fines educativos e informativos unicamente.
3.2 El contenido de la Plataforma no constituye asesoramiento profesional, academico, legal, financiero, medico, de carrera ni de ninguna otra indole.
3.3 La completacion de cualquier nivel, certificado o programa de Bymyzai no garantiza: (a) empleo en ninguna empresa o sector; (b) admision a instituciones educativas; (c) reconocimiento de competencias por empleadores u organizaciones; (d) equivalencia academica con programas universitarios o vocacionales.
3.4 Los resultados obtenidos dependen exclusivamente del esfuerzo, capacidad y circunstancias individuales de cada estudiante.

4. DESCARGO DE RESPONSABILIDAD SOBRE INTELIGENCIA ARTIFICIAL
4.1 BYMYZAI LLC utiliza modelos de inteligencia artificial generativa de terceros, incluyendo los modelos Claude de Anthropic, PBC, para operar el mentor ZAI y las funciones de evaluacion de la Plataforma.
4.2 Las respuestas generadas por ZAI y otros sistemas de IA de la Plataforma: (a) pueden contener errores, imprecisiones o informacion desactualizada; (b) no reflejan necesariamente la posicion oficial de BYMYZAI LLC; (c) no constituyen asesoramiento profesional de ningun tipo; (d) estan sujetas a las limitaciones inherentes de los modelos de lenguaje de gran tamano.
4.3 ZAI es un sistema de IA y NO posee: emociones reales, conciencia, memoria persistente entre sesiones, ni capacidad de juicio independiente.
4.4 BYMYZAI LLC no asume responsabilidad alguna por decisiones, acciones u omisiones del usuario basadas en las respuestas generadas por sistemas de IA de la Plataforma.
4.5 BYMYZAI LLC no utiliza los datos personales de los usuarios para entrenar, ajustar o mejorar modelos de IA de terceros sin consentimiento explicito.

5. REQUISITO DE EDAD MINIMA
5.1 La Plataforma esta disponible exclusivamente para usuarios de 16 anos de edad o mas.
5.2 Los usuarios de entre 16 y 17 anos deben contar con el consentimiento verificable de su padre, madre o tutor legal antes de crear una cuenta.
5.3 Los usuarios menores de 16 anos tienen estrictamente prohibido registrarse o usar la Plataforma.
5.4 El consentimiento parental para usuarios de 16-17 anos se obtiene mediante confirmacion por correo electronico previa a la activacion de la cuenta.
5.5 Los padres o tutores pueden solicitar la eliminacion de los datos de un menor de 16 anos escribiendo a legal@bymyzai.com. BYMYZAI LLC eliminara la cuenta y sus datos en un plazo de 5 dias habiles.

6. ESTADO DE BETA PUBLICA
6.1 Bymyzai se encuentra actualmente en fase de Beta Publica.
6.2 Durante esta fase: (a) la Plataforma esta siendo activamente probada y refinada; (b) las funciones, el contenido, los precios y la disponibilidad pueden cambiar sin previo aviso; (c) algunas areas pueden estar incompletas o sujetas a mejoras; (d) pueden producirse interrupciones del servicio.
6.3 El uso de la Plataforma durante la Beta Publica implica la aceptacion de estas condiciones.

7. LIMITACION DE RESPONSABILIDAD
7.1 BYMYZAI LLC no sera responsable por danos directos, indirectos, incidentales, especiales, ejemplares o consecuentes derivados de: (a) el uso o la imposibilidad de uso de la Plataforma; (b) errores en el contenido generado por IA; (c) interrupciones del Servicio; (d) acceso no autorizado a los datos del usuario; (e) cualquier otra causa relacionada con la Plataforma.
7.2 La responsabilidad maxima de BYMYZAI LLC no excedera el monto pagado por el usuario en los ultimos 12 meses o $100 USD, lo que sea mayor.
7.3 Algunas jurisdicciones no permiten la exclusion de ciertas garantias o la limitacion de responsabilidad, por lo que las limitaciones anteriores pueden no aplicarse en su totalidad.

8. DERECHOS DE USUARIOS INTERNACIONALES
8.1 USUARIOS DEL EEE, REINO UNIDO Y SUIZA (GDPR):
Los usuarios ubicados en el Espacio Economico Europeo, el Reino Unido o Suiza tienen derechos adicionales bajo el Reglamento General de Proteccion de Datos (GDPR), incluyendo: acceso, rectificacion, supresion, limitacion del tratamiento, portabilidad y retirada del consentimiento.
Base juridica del tratamiento (Art. 6 GDPR): ejecucion de contrato (Art. 6.1.b), interes legitimo (Art. 6.1.f) y consentimiento explicito donde sea requerido (Art. 6.1.a).
Para ejercer estos derechos: legal@bymyzai.com.
Los usuarios del EEE pueden presentar reclamaciones ante su autoridad nacional de proteccion de datos.

8.2 USUARIOS DE CALIFORNIA (CCPA):
Los residentes de California tienen derechos adicionales bajo la California Consumer Privacy Act (CCPA), incluyendo: conocer los datos recopilados, solicitar su eliminacion y optar por no participar en la venta de datos personales (BYMYZAI LLC no vende datos personales).

8.3 USUARIOS LATINOAMERICANOS:
El servicio se presta desde EE.UU. Las leyes de proteccion de datos de EE.UU. son aplicables. BYMYZAI LLC aplica practicas de proteccion de datos compatibles con estandares internacionales.

9. PROPIEDAD INTELECTUAL
Todo el contenido de la Plataforma — incluyendo curriculum, metodologia, marca, software, diseno y sistemas — es propiedad exclusiva de BYMYZAI LLC y esta protegido por las leyes de propiedad intelectual aplicables. Queda prohibida su reproduccion o uso sin autorizacion escrita previa.

10. MODIFICACIONES AL AVISO LEGAL
BYMYZAI LLC puede actualizar este Aviso Legal en cualquier momento. Los cambios materiales seran notificados con al menos 30 dias de anticipacion. El uso continuado de la Plataforma constituye aceptacion del Aviso Legal actualizado.

11. LEY APLICABLE
Este Aviso Legal se rige por las leyes del Estado de New Jersey, Estados Unidos.

12. CONTACTO
Para consultas legales: legal@bymyzai.com
Para soporte tecnico: support@bymyzai.com
Para informacion general: info@bymyzai.com
BYMYZAI LLC
405 King George Road 221
Basking Ridge, New Jersey 07920
Estados Unidos`;

const legal_en = `LEGAL DISCLAIMER — BYMYZAI LLC
Last updated: August 2026
Entity ID: 0451511216 | State: New Jersey, USA

IMPORTANT NOTICE: Please read this Legal Disclaimer carefully before using the Bymyzai Platform. By accessing or using the Platform, you accept the terms of this Legal Disclaimer.

1. OPERATOR IDENTIFICATION
Bymyzai is operated by BYMYZAI LLC, a limited liability company registered in the State of New Jersey, United States, with Entity ID 0451511216, with address at 405 King George Road 221, Basking Ridge, New Jersey 07920, USA.
Contact: legal@bymyzai.com

2. NATURE OF THE SERVICE
2.1 Bymyzai is a private AI literacy education platform.
2.2 Bymyzai is NOT an accredited educational institution, university, certified vocational school or educational entity recognized by any U.S. or international government authority.
2.3 Bymyzai does NOT grant academic degrees, university diplomas or officially recognized professional certifications.
2.4 Certificates issued by BYMYZAI LLC are proprietary completion certificates that attest to mastery of Bymyzai's internal curriculum.

3. DISCLAIMER REGARDING EDUCATIONAL CONTENT
3.1 All Platform content — including lessons, projects, assessments, Boss Battles and ZAI interactions — is provided for educational and informational purposes only.
3.2 Platform content does not constitute professional, academic, legal, financial, medical, career or any other type of advice.
3.3 Completion of any Bymyzai level, certificate or program does not guarantee: (a) employment at any company or in any sector; (b) admission to educational institutions; (c) recognition of competencies by employers or organizations; (d) academic equivalence with university or vocational programs.
3.4 Results obtained depend exclusively on each student's individual effort, ability and circumstances.

4. DISCLAIMER REGARDING ARTIFICIAL INTELLIGENCE
4.1 BYMYZAI LLC uses third-party generative artificial intelligence models, including Anthropic's Claude models, to operate the ZAI mentor and evaluation features of the Platform.
4.2 Responses generated by ZAI and other AI systems on the Platform: (a) may contain errors, inaccuracies or outdated information; (b) do not necessarily reflect the official position of BYMYZAI LLC; (c) do not constitute professional advice of any kind; (d) are subject to the inherent limitations of large language models.
4.3 ZAI is an AI system and does NOT possess: real emotions, consciousness, persistent memory between sessions, or independent judgment capability.
4.4 BYMYZAI LLC assumes no responsibility for decisions, actions or omissions by the user based on responses generated by AI systems on the Platform.
4.5 BYMYZAI LLC does not use users' personal data to train, fine-tune or improve third-party AI models without explicit consent.

5. MINIMUM AGE REQUIREMENT
5.1 The Platform is available exclusively to users aged 16 years or older.
5.2 Users between 16 and 17 years of age must have verifiable parental or guardian consent before creating an account.
5.3 Users under 16 are strictly prohibited from registering or using the Platform.
5.4 Parental consent for users aged 16-17 is obtained via email confirmation prior to account activation.
5.5 Parents or guardians may request deletion of a child under 16's data by writing to legal@bymyzai.com. BYMYZAI LLC will delete the account and its data within 5 business days.

6. PUBLIC BETA STATUS
6.1 Bymyzai is currently in Public Beta phase.
6.2 During this phase: (a) the Platform is being actively tested and refined; (b) features, content, pricing and availability may change without prior notice; (c) some areas may be incomplete or subject to improvement; (d) service interruptions may occur.
6.3 Use of the Platform during the Public Beta implies acceptance of these conditions.

7. LIMITATION OF LIABILITY
7.1 BYMYZAI LLC will not be liable for direct, indirect, incidental, special, exemplary or consequential damages arising from: (a) use of or inability to use the Platform; (b) errors in AI-generated content; (c) service interruptions; (d) unauthorized access to user data; (e) any other cause related to the Platform.
7.2 BYMYZAI LLC maximum liability shall not exceed the amount paid by the user in the last 12 months or $100 USD, whichever is greater.
7.3 Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability, so the above limitations may not fully apply.

8. INTERNATIONAL USER RIGHTS
8.1 EEA, UK AND SWITZERLAND USERS (GDPR):
Users located in the European Economic Area, United Kingdom or Switzerland have additional rights under the General Data Protection Regulation (GDPR), including: access, rectification, erasure, restriction of processing, portability and withdrawal of consent.
Legal basis for processing (GDPR Art. 6): contract performance (Art. 6.1.b), legitimate interest (Art. 6.1.f) and explicit consent where required (Art. 6.1.a).
To exercise these rights: legal@bymyzai.com.
EEA users may lodge complaints with their national data protection authority.

8.2 CALIFORNIA USERS (CCPA):
California residents have additional rights under the California Consumer Privacy Act (CCPA), including: knowing what data is collected, requesting its deletion and opting out of the sale of personal data (BYMYZAI LLC does not sell personal data).

8.3 LATIN AMERICAN USERS:
The service is provided from the USA. U.S. data protection laws apply. BYMYZAI LLC applies data protection practices compatible with international standards.

9. INTELLECTUAL PROPERTY
All Platform content — including curriculum, methodology, brand, software, design and systems — is the exclusive property of BYMYZAI LLC and is protected by applicable intellectual property laws. Reproduction or use without prior written authorization is prohibited.

10. MODIFICATIONS TO THIS DISCLAIMER
BYMYZAI LLC may update this Legal Disclaimer at any time. Material changes will be notified at least 30 days in advance. Continued use of the Platform constitutes acceptance of the updated Disclaimer.

11. GOVERNING LAW
This Legal Disclaimer is governed by the laws of the State of New Jersey, United States.

12. CONTACT
For legal inquiries: legal@bymyzai.com
For technical support: support@bymyzai.com
For general information: info@bymyzai.com
BYMYZAI LLC
405 King George Road 221
Basking Ridge, New Jersey 07920
United States`;

export default function DisclaimerClient() {
  const [lang, setLang] = useState<"es" | "en">("es");
  const [open, setOpen] = useState<string | null>(null);
  const [showFull, setShowFull] = useState(false);
  const sections = lang === "es" ? sections_es : sections_en;
  const legalText = lang === "es" ? legal_es : legal_en;

  return (
    <div style={{ minHeight: "100vh", background: "#0F1420", padding: "40px 20px", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "12px", color: "#7B61FF", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>BYMYZAI LLC</p>
              <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#F8FAFF", fontSize: "28px", margin: 0 }}>
                {lang === "es" ? "Aviso Legal" : "Legal Disclaimer"}
              </h1>
              <p style={{ fontSize: "12px", color: "#7E8798", marginTop: "6px" }}>
                {lang === "es" ? "Ultima actualizacion: agosto 2026" : "Last updated: August 2026"}
              </p>
            </div>
            <div style={{ display: "flex", gap: "4px", background: "#1E2533", border: "1px solid #324055", borderRadius: "8px", padding: "4px" }}>
              <button onClick={() => setLang("es")} style={{ background: lang === "es" ? "#7B61FF" : "none", color: lang === "es" ? "#fff" : "#7E8798", border: "none", borderRadius: "5px", padding: "4px 16px", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>ES</button>
              <button onClick={() => setLang("en")} style={{ background: lang === "en" ? "#7B61FF" : "none", color: lang === "en" ? "#fff" : "#7E8798", border: "none", borderRadius: "5px", padding: "4px 16px", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>EN</button>
            </div>
          </div>
        </div>

        <div style={{ background: "#1E2533", border: "1px solid #324055", borderLeft: "3px solid #F2C04D", borderRadius: "10px", padding: "16px 20px", marginBottom: "32px", fontSize: "14px", color: "#B3BDD1" }}>
          <strong style={{ color: "#F2C04D", display: "block", marginBottom: "6px" }}>
            {lang === "es" ? "Aviso de Beta Publica" : "Public Beta Notice"}
          </strong>
          {lang === "es"
            ? "Bymyzai esta disponible como Beta Publica. El contenido, precios y funciones pueden cambiar sin previo aviso."
            : "Bymyzai is available as a Public Beta. Content, pricing and features may change without prior notice."}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "32px" }}>
          {sections.map((s) => (
            <div key={s.id} style={{ background: "#161C27", border: "1px solid #324055", borderRadius: "10px", overflow: "hidden" }}>
              <button onClick={() => setOpen(open === s.id ? null : s.id)} style={{ width: "100%", background: "none", border: "none", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ background: "#242E40", color: "#F2C04D", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "11px", borderRadius: "6px", padding: "2px 8px", minWidth: "28px", textAlign: "center" }}>{s.id}</span>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "15px" }}>{s.title}</span>
                </span>
                <span style={{ color: "#F2C04D", fontSize: "18px", fontWeight: 700, transform: open === s.id ? "rotate(45deg)" : "rotate(0deg)", display: "inline-block" }}>+</span>
              </button>
              {open === s.id && (
                <div style={{ padding: "0 20px 20px 20px", color: "#B3BDD1", fontSize: "14px", lineHeight: 1.7, borderTop: "1px solid #242E40" }}>
                  <p style={{ marginTop: "16px", marginBottom: s.callout ? "12px" : 0 }}>{s.content}</p>
                  {s.callout && (
                    <div style={{ background: "#242E40", border: "1px solid #324055", borderLeft: "3px solid #F2C04D", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#B3BDD1" }}>
                      {s.callout}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ background: "#161C27", border: "1px solid #324055", borderRadius: "10px", overflow: "hidden", marginBottom: "32px" }}>
          <button onClick={() => setShowFull(!showFull)} style={{ width: "100%", background: "none", border: "none", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "14px" }}>
              {lang === "es" ? "Documento Legal Completo" : "Full Legal Document"}
            </span>
            <span style={{ color: "#F2C04D", fontSize: "18px", fontWeight: 700, transform: showFull ? "rotate(45deg)" : "rotate(0deg)", display: "inline-block" }}>+</span>
          </button>
          {showFull && (
            <div style={{ padding: "0 20px 20px 20px", borderTop: "1px solid #242E40" }}>
              <pre style={{ color: "#7E8798", fontSize: "11px", lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "'DM Sans',sans-serif", margin: "16px 0 0 0" }}>{legalText}</pre>
            </div>
          )}
        </div>

        <div style={{ marginTop: "40px", padding: "20px", background: "#161C27", border: "1px solid #324055", borderRadius: "10px", textAlign: "center" }}>
          <p style={{ color: "#7E8798", fontSize: "12px", margin: 0 }}>BYMYZAI LLC - Entity ID 0451511216 - 405 King George Road 221, Basking Ridge, NJ 07920</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "8px", flexWrap: "wrap" }}>
            <a href="mailto:legal@bymyzai.com" style={{ color: "#7B61FF", fontSize: "12px", fontWeight: 600 }}>legal@bymyzai.com</a>
            <a href="mailto:support@bymyzai.com" style={{ color: "#7B61FF", fontSize: "12px", fontWeight: 600 }}>support@bymyzai.com</a>
            <a href="mailto:info@bymyzai.com" style={{ color: "#7B61FF", fontSize: "12px", fontWeight: 600 }}>info@bymyzai.com</a>
          </div>
        </div>

      </div>
    </div>
  );
}