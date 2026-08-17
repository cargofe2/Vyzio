"use client";
import { useState } from "react";

const sections_es = [
  { id: "1", title: "Datos que Recopilamos", content: "Nombre, correo, edad, idioma, progreso academico, interacciones con ZAI, datos de facturacion (procesados por Stripe), datos tecnicos basicos (IP, navegador, dispositivo) y cookies esenciales de sesion." },
  { id: "2", title: "Como Usamos tus Datos", content: "Para operar el Servicio, personalizar tu experiencia de aprendizaje, procesar pagos, enviarte comunicaciones del Servicio, mejorar la plataforma, cumplir obligaciones legales y prevenir fraude." },
  { id: "3", title: "Uso de Inteligencia Artificial", content: "Usamos modelos de IA de terceros (incluyendo Anthropic Claude) para operar ZAI y evaluar proyectos. Tus datos NO se utilizan para entrenar modelos de IA externos. Tus interacciones con ZAI pueden ser procesadas por Anthropic sujeto a su politica de privacidad." },
  { id: "4", title: "Consentimiento de Menores", content: "Para usuarios de 16-17 anos, solicitamos el correo del padre, madre o tutor legal, quien debe confirmar el consentimiento. Los padres pueden solicitar acceso, correccion o eliminacion de los datos de su hijo en legal@bymyzai.com." },
  { id: "5", title: "Con Quien Compartimos Datos", content: "Proveedores de infraestructura: Vercel (hosting), Supabase (base de datos), Clerk (autenticacion), Anthropic (IA), Stripe (pagos). No vendemos datos personales a terceros con fines publicitarios bajo ninguna circunstancia." },
  { id: "6", title: "Transferencias Internacionales", content: "Nuestros proveedores pueden procesar datos en EE.UU. u otros paises. Al registrarte, otorgas consentimiento expreso para estas transferencias. Aplicamos salvaguardias apropiadas conforme al GDPR cuando aplica." },
  { id: "7", title: "Tus Derechos", content: "Tienes derecho a: acceder a tus datos, corregirlos, eliminarlos, restringir su procesamiento, portabilidad de datos y retirar tu consentimiento en cualquier momento. Escribe a legal@bymyzai.com. Respondemos en 30 dias." },
  { id: "8", title: "Retencion de Datos", content: "Conservamos tus datos mientras tu cuenta este activa. Al eliminar tu cuenta, tus datos personales se eliminan en un plazo de 30 dias, salvo obligacion legal de conservacion." },
  { id: "9", title: "Seguridad", content: "Implementamos medidas tecnicas y organizativas para proteger tus datos: cifrado en transito (HTTPS/TLS), acceso restringido, autenticacion segura via Clerk y proveedores certificados SOC 2." },
  { id: "10", title: "Cookies", content: "Usamos unicamente cookies esenciales para autenticacion y funcionamiento de la Plataforma. No usamos cookies publicitarias ni de seguimiento de terceros." },
  { id: "11", title: "Contacto y GDPR", content: "Para cualquier consulta sobre privacidad o ejercicio de derechos GDPR: legal@bymyzai.com. Los usuarios del EEE pueden presentar reclamaciones ante su autoridad de control local." },
];

const sections_en = [
  { id: "1", title: "Data We Collect", content: "Name, email, age, language, academic progress, ZAI interactions, billing data (processed by Stripe), basic technical data (IP, browser, device) and essential session cookies." },
  { id: "2", title: "How We Use Your Data", content: "To operate the Service, personalize your learning experience, process payments, send you Service communications, improve the platform, comply with legal obligations and prevent fraud." },
  { id: "3", title: "Use of Artificial Intelligence", content: "We use third-party AI models (including Anthropic Claude) to operate ZAI and evaluate projects. Your data is NOT used to train external AI models. Your interactions with ZAI may be processed by Anthropic subject to their privacy policy." },
  { id: "4", title: "Minor Consent", content: "For users aged 16-17, we request the email of a parent or legal guardian, who must confirm consent. Parents may request access, correction or deletion of their child's data at legal@bymyzai.com." },
  { id: "5", title: "Who We Share Data With", content: "Infrastructure providers: Vercel (hosting), Supabase (database), Clerk (authentication), Anthropic (AI), Stripe (payments). We do not sell personal data to third parties for advertising purposes under any circumstances." },
  { id: "6", title: "International Transfers", content: "Our providers may process data in the USA or other countries. By registering, you give explicit consent for these transfers. We apply appropriate safeguards in accordance with GDPR where applicable." },
  { id: "7", title: "Your Rights", content: "You have the right to: access your data, correct it, delete it, restrict its processing, data portability and withdraw your consent at any time. Write to legal@bymyzai.com. We respond within 30 days." },
  { id: "8", title: "Data Retention", content: "We retain your data while your account is active. Upon account deletion, your personal data is deleted within 30 days, except where legal retention obligations apply." },
  { id: "9", title: "Security", content: "We implement technical and organizational measures to protect your data: encryption in transit (HTTPS/TLS), restricted access, secure authentication via Clerk and SOC 2 certified providers." },
  { id: "10", title: "Cookies", content: "We use only essential cookies for authentication and Platform operation. We do not use advertising or third-party tracking cookies." },
  { id: "11", title: "Contact and GDPR", content: "For any privacy inquiries or exercise of GDPR rights: legal@bymyzai.com. EEA users may also lodge complaints with their local supervisory authority." },
];

const legal_es = `POLITICA DE PRIVACIDAD — BYMYZAI LLC
Ultima actualizacion: agosto 2026
Entity ID: 0451511216 | Estado: New Jersey, EE.UU.

1. RESPONSABLE DEL TRATAMIENTO
BYMYZAI LLC, compania de responsabilidad limitada registrada en el Estado de New Jersey, Estados Unidos, Entity ID 0451511216, con domicilio en 405 King George Road 221, Basking Ridge, New Jersey 07920, es la responsable del tratamiento de los datos personales de los usuarios de la Plataforma Bymyzai.
Contacto: legal@bymyzai.com

2. DATOS PERSONALES QUE RECOPILAMOS
2.1 Datos de registro: nombre completo, direccion de correo electronico, edad declarada, idioma de preferencia.
2.2 Datos de uso: progreso academico, lecciones completadas, puntuacion XP, rachas, logros, interacciones con ZAI (mentor de IA), proyectos enviados.
2.3 Datos de facturacion: plan de suscripcion activo, historial de pagos. Los datos de tarjeta de credito son procesados exclusivamente por Stripe Inc. y nunca son almacenados por BYMYZAI LLC.
2.4 Datos tecnicos: direccion IP, tipo de navegador, dispositivo, sistema operativo, paginas visitadas y tiempo de sesion.
2.5 Cookies: unicamente cookies esenciales de sesion y autenticacion.

3. FINALIDADES Y BASE LEGAL DEL TRATAMIENTO
3.1 Prestacion del Servicio (Art. 6.1.b GDPR — ejecucion de contrato): operar la Plataforma, personalizar la experiencia de aprendizaje, procesar pagos y emitir certificados.
3.2 Mejora del Servicio (Art. 6.1.f GDPR — interes legitimo): analizar el uso de la Plataforma para mejorar el contenido y la experiencia.
3.3 Comunicaciones del Servicio (Art. 6.1.b GDPR): enviar notificaciones sobre el estado de la cuenta, cambios en los Terminos y actualizaciones del Servicio.
3.4 Cumplimiento legal (Art. 6.1.c GDPR): conservar registros de transacciones para cumplir con obligaciones fiscales y contables.
3.5 Consentimiento (Art. 6.1.a GDPR): para comunicaciones de marketing opcionales, unicamente con consentimiento expreso previo.

4. USO DE INTELIGENCIA ARTIFICIAL
4.1 Bymyzai utiliza modelos de IA generativa de Anthropic (Claude) para operar el mentor ZAI y evaluar proyectos.
4.2 Las interacciones con ZAI son procesadas por Anthropic, Inc. sujeto a su Politica de Privacidad (anthropic.com/privacy).
4.3 BYMYZAI LLC no utiliza los datos personales de los usuarios para entrenar, ajustar o mejorar modelos de IA de terceros.
4.4 Las respuestas de ZAI son generadas por IA y pueden contener errores. No constituyen asesoramiento profesional de ningun tipo.

5. MENORES DE EDAD
5.1 La Plataforma esta disponible exclusivamente para usuarios de 16 anos o mas.
5.2 Para usuarios de 16 a 17 anos, BYMYZAI LLC solicita el consentimiento verificable del padre, madre o tutor legal mediante confirmacion por correo electronico antes de la activacion de la cuenta.
5.3 Si tienes conocimiento de que un menor de 16 anos ha creado una cuenta, contactanos en legal@bymyzai.com y eliminaremos la cuenta y sus datos en un plazo de 5 dias habiles.
5.4 Los padres o tutores pueden solicitar acceso, correccion, restriccion o eliminacion de los datos de su hijo escribiendo a legal@bymyzai.com.

6. DESTINATARIOS Y TRANSFERENCIAS DE DATOS
6.1 Compartimos datos con los siguientes proveedores de servicios en calidad de encargados del tratamiento:
- Vercel Inc. (hosting y despliegue — EE.UU.)
- Supabase Inc. (base de datos — EE.UU.)
- Clerk Inc. (autenticacion — EE.UU.)
- Anthropic, PBC (procesamiento de IA — EE.UU.)
- Stripe Inc. (procesamiento de pagos — EE.UU.)
6.2 No vendemos, alquilamos ni cedemos datos personales a terceros con fines publicitarios o comerciales.
6.3 Podemos divulgar datos personales cuando sea requerido por ley, orden judicial o autoridad competente.

7. TRANSFERENCIAS INTERNACIONALES
7.1 Nuestros proveedores procesan datos en los Estados Unidos.
7.2 Para usuarios del Espacio Economico Europeo (EEE), el Reino Unido o Suiza, las transferencias de datos a EE.UU. se realizan bajo las salvaguardias apropiadas disponibles, incluyendo clausulas contractuales tipo (CCT) cuando aplica.
7.3 Al registrarte en la Plataforma, otorgas consentimiento expreso para la transferencia y procesamiento de tus datos en EE.UU.

8. DERECHOS DE LOS USUARIOS (GDPR Y CCPA)
Los usuarios tienen derecho a:
8.1 Acceso: obtener confirmacion de si procesamos tus datos y una copia de los mismos.
8.2 Rectificacion: corregir datos inexactos o incompletos.
8.3 Supresion ("derecho al olvido"): solicitar la eliminacion de tus datos cuando ya no sean necesarios para los fines para los que fueron recopilados.
8.4 Limitacion del tratamiento: solicitar la restriccion del procesamiento en determinadas circunstancias.
8.5 Portabilidad: recibir tus datos en formato estructurado y legible por maquina.
8.6 Oposicion: oponerte al tratamiento basado en interes legitimo.
8.7 Retirada del consentimiento: retirar el consentimiento en cualquier momento sin que ello afecte la licitud del tratamiento previo.
Para ejercer cualquiera de estos derechos, escribe a legal@bymyzai.com. Respondemos en un plazo maximo de 30 dias.

9. RETENCION DE DATOS
9.1 Conservamos los datos personales mientras la cuenta del usuario este activa.
9.2 Al eliminar la cuenta, los datos personales identificables se eliminan en un plazo de 30 dias.
9.3 Conservamos registros de transacciones y facturacion durante 7 anos para cumplir con obligaciones fiscales y contables.
9.4 Datos anonimizados o agregados pueden conservarse indefinidamente para fines estadisticos.

10. SEGURIDAD DE LOS DATOS
10.1 Implementamos medidas tecnicas y organizativas apropiadas para proteger los datos personales contra acceso no autorizado, perdida, destruccion o divulgacion.
10.2 Medidas implementadas: cifrado en transito (HTTPS/TLS 1.2+), autenticacion segura mediante Clerk, acceso restringido por roles, proveedores certificados SOC 2 Type II.
10.3 En caso de violacion de seguridad que afecte los datos personales, notificaremos a los usuarios afectados y a las autoridades competentes en los plazos requeridos por la normativa aplicable.

11. COOKIES
11.1 Utilizamos exclusivamente cookies esenciales necesarias para el funcionamiento de la Plataforma.
11.2 Cookies utilizadas: cookies de sesion de autenticacion (Clerk), cookies de preferencia de idioma.
11.3 No utilizamos cookies publicitarias, de seguimiento o de terceros para fines de marketing.
11.4 Las cookies esenciales no requieren consentimiento previo al ser necesarias para el funcionamiento del Servicio.

12. MODIFICACIONES A ESTA POLITICA
12.1 BYMYZAI LLC puede actualizar esta Politica de Privacidad en cualquier momento.
12.2 Los cambios materiales seran notificados con al menos 30 dias de anticipacion por correo electronico o aviso en la Plataforma.
12.3 El uso continuado de la Plataforma tras la notificacion constituye aceptacion de la Politica actualizada.

13. AUTORIDAD DE CONTROL
Los usuarios del EEE tienen derecho a presentar una reclamacion ante la autoridad de proteccion de datos de su pais de residencia si consideran que el tratamiento de sus datos no cumple con el GDPR.

14. CONTACTO
Para consultas sobre privacidad, ejercicio de derechos o reclamaciones:
legal@bymyzai.com
BYMYZAI LLC
405 King George Road 221
Basking Ridge, New Jersey 07920
Estados Unidos`;

const legal_en = `PRIVACY POLICY — BYMYZAI LLC
Last updated: August 2026
Entity ID: 0451511216 | State: New Jersey, USA

1. DATA CONTROLLER
BYMYZAI LLC, a limited liability company registered in the State of New Jersey, United States, Entity ID 0451511216, with address at 405 King George Road 221, Basking Ridge, New Jersey 07920, is the data controller for the personal data of users of the Bymyzai Platform.
Contact: legal@bymyzai.com

2. PERSONAL DATA WE COLLECT
2.1 Registration data: full name, email address, declared age, language preference.
2.2 Usage data: academic progress, completed lessons, XP score, streaks, achievements, ZAI interactions (AI mentor), submitted projects.
2.3 Billing data: active subscription plan, payment history. Credit card data is processed exclusively by Stripe Inc. and is never stored by BYMYZAI LLC.
2.4 Technical data: IP address, browser type, device, operating system, pages visited and session time.
2.5 Cookies: only essential session and authentication cookies.

3. PURPOSES AND LEGAL BASIS FOR PROCESSING
3.1 Service provision (Art. 6.1.b GDPR — contract performance): operating the Platform, personalizing the learning experience, processing payments and issuing certificates.
3.2 Service improvement (Art. 6.1.f GDPR — legitimate interest): analyzing Platform usage to improve content and experience.
3.3 Service communications (Art. 6.1.b GDPR): sending notifications about account status, Terms changes and Service updates.
3.4 Legal compliance (Art. 6.1.c GDPR): retaining transaction records to comply with tax and accounting obligations.
3.5 Consent (Art. 6.1.a GDPR): for optional marketing communications, only with prior explicit consent.

4. USE OF ARTIFICIAL INTELLIGENCE
4.1 Bymyzai uses Anthropic's generative AI models (Claude) to operate the ZAI mentor and evaluate projects.
4.2 Interactions with ZAI are processed by Anthropic, Inc. subject to their Privacy Policy (anthropic.com/privacy).
4.3 BYMYZAI LLC does not use users' personal data to train, fine-tune or improve third-party AI models.
4.4 ZAI responses are AI-generated and may contain errors. They do not constitute professional advice of any kind.

5. MINORS
5.1 The Platform is available exclusively to users aged 16 or older.
5.2 For users aged 16 to 17, BYMYZAI LLC requests verifiable consent from a parent or legal guardian via email confirmation before account activation.
5.3 If you are aware that a child under 16 has created an account, contact us at legal@bymyzai.com and we will delete the account and its data within 5 business days.
5.4 Parents or guardians may request access, correction, restriction or deletion of their child's data by writing to legal@bymyzai.com.

6. RECIPIENTS AND DATA TRANSFERS
6.1 We share data with the following service providers as data processors:
- Vercel Inc. (hosting and deployment — USA)
- Supabase Inc. (database — USA)
- Clerk Inc. (authentication — USA)
- Anthropic, PBC (AI processing — USA)
- Stripe Inc. (payment processing — USA)
6.2 We do not sell, rent or transfer personal data to third parties for advertising or commercial purposes.
6.3 We may disclose personal data when required by law, court order or competent authority.

7. INTERNATIONAL TRANSFERS
7.1 Our providers process data in the United States.
7.2 For users in the European Economic Area (EEA), United Kingdom or Switzerland, data transfers to the USA are carried out under appropriate safeguards, including Standard Contractual Clauses (SCCs) where applicable.
7.3 By registering on the Platform, you give explicit consent for the transfer and processing of your data in the USA.

8. USER RIGHTS (GDPR AND CCPA)
Users have the right to:
8.1 Access: obtain confirmation of whether we process your data and a copy thereof.
8.2 Rectification: correct inaccurate or incomplete data.
8.3 Erasure ("right to be forgotten"): request deletion of your data when no longer necessary for the purposes for which it was collected.
8.4 Restriction of processing: request restriction of processing under certain circumstances.
8.5 Portability: receive your data in a structured, machine-readable format.
8.6 Objection: object to processing based on legitimate interest.
8.7 Withdrawal of consent: withdraw consent at any time without affecting the lawfulness of prior processing.
To exercise any of these rights, write to legal@bymyzai.com. We respond within a maximum of 30 days.

9. DATA RETENTION
9.1 We retain personal data while the user's account is active.
9.2 Upon account deletion, identifiable personal data is deleted within 30 days.
9.3 We retain transaction and billing records for 7 years to comply with tax and accounting obligations.
9.4 Anonymized or aggregated data may be retained indefinitely for statistical purposes.

10. DATA SECURITY
10.1 We implement appropriate technical and organizational measures to protect personal data against unauthorized access, loss, destruction or disclosure.
10.2 Implemented measures: encryption in transit (HTTPS/TLS 1.2+), secure authentication via Clerk, role-based restricted access, SOC 2 Type II certified providers.
10.3 In the event of a security breach affecting personal data, we will notify affected users and competent authorities within the timeframes required by applicable regulations.

11. COOKIES
11.1 We use only essential cookies necessary for the operation of the Platform.
11.2 Cookies used: authentication session cookies (Clerk), language preference cookies.
11.3 We do not use advertising, tracking or third-party cookies for marketing purposes.
11.4 Essential cookies do not require prior consent as they are necessary for the Service to function.

12. MODIFICATIONS TO THIS POLICY
12.1 BYMYZAI LLC may update this Privacy Policy at any time.
12.2 Material changes will be notified at least 30 days in advance by email or notice on the Platform.
12.3 Continued use of the Platform after notification constitutes acceptance of the updated Policy.

13. SUPERVISORY AUTHORITY
EEA users have the right to lodge a complaint with the data protection authority in their country of residence if they believe that the processing of their data does not comply with the GDPR.

14. CONTACT
For privacy inquiries, exercise of rights or complaints:
legal@bymyzai.com
BYMYZAI LLC
405 King George Road 221
Basking Ridge, New Jersey 07920
United States`;

export default function PrivacyPage() {
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
                {lang === "es" ? "Politica de Privacidad" : "Privacy Policy"}
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

        <div style={{ background: "#1E2533", border: "1px solid #324055", borderLeft: "3px solid #26C6DA", borderRadius: "10px", padding: "16px 20px", marginBottom: "32px", fontSize: "14px", color: "#B3BDD1" }}>
          {lang === "es"
            ? "Esta Politica describe como BYMYZAI LLC (Entity ID 0451511216), registrada en New Jersey, EE.UU., recopila, usa y protege tus datos personales."
            : "This Policy describes how BYMYZAI LLC (Entity ID 0451511216), registered in New Jersey, USA, collects, uses and protects your personal data."}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "32px" }}>
          {sections.map((s) => (
            <div key={s.id} style={{ background: "#161C27", border: "1px solid #324055", borderRadius: "10px", overflow: "hidden" }}>
              <button onClick={() => setOpen(open === s.id ? null : s.id)} style={{ width: "100%", background: "none", border: "none", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ background: "#242E40", color: "#26C6DA", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "11px", borderRadius: "6px", padding: "2px 8px", minWidth: "28px", textAlign: "center" }}>{s.id}</span>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "15px" }}>{s.title}</span>
                </span>
                <span style={{ color: "#26C6DA", fontSize: "18px", fontWeight: 700, transform: open === s.id ? "rotate(45deg)" : "rotate(0deg)", display: "inline-block" }}>+</span>
              </button>
              {open === s.id && (
                <div style={{ padding: "0 20px 20px 20px", color: "#B3BDD1", fontSize: "14px", lineHeight: 1.7, borderTop: "1px solid #242E40" }}>
                  <p style={{ marginTop: "16px", marginBottom: 0 }}>{s.content}</p>
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
            <span style={{ color: "#26C6DA", fontSize: "18px", fontWeight: 700, transform: showFull ? "rotate(45deg)" : "rotate(0deg)", display: "inline-block" }}>+</span>
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