"use client";
import { useState } from "react";

const sections_es = [
  { id: "1", title: "Aceptacion", content: "Al registrarte y usar la Plataforma, aceptas estos Terminos en su totalidad. Si no estas de acuerdo, no debes usar la Plataforma. BYMYZAI LLC se reserva el derecho de modificar estos Terminos en cualquier momento con notificacion previa de 30 dias." },
  { id: "2", title: "Elegibilidad y Edad Minima", content: "La Plataforma esta disponible unicamente para personas de 16 anos o mas. Si tienes entre 16 y 17 anos, declaras contar con el consentimiento de tu padre, madre o tutor legal. BYMYZAI LLC puede suspender cuentas que no cumplan este requisito sin previo aviso." },
  { id: "3", title: "Descripcion del Servicio", content: "Bymyzai es una plataforma educativa de inteligencia artificial con contenido gamificado, mentor de IA (ZAI), progresion por niveles y certificacion de competencias. El servicio se presta tal cual y puede modificarse sin previo aviso." },
  { id: "4", title: "Planes y Pagos", content: "Ofrecemos un plan gratuito (STARTER) y planes de pago (PRO Mensual $5/mes, PRO Anual $49/ano). Las suscripciones se renuevan automaticamente. Puedes cancelar en cualquier momento. Reembolso completo disponible dentro de los 14 dias siguientes a la primera suscripcion." },
  { id: "5", title: "Propiedad Intelectual", content: "Todo el contenido educativo, marca, software, curriculum, metodologia y diseno de la Plataforma son propiedad exclusiva de BYMYZAI LLC. Queda prohibida su reproduccion, distribucion o uso comercial sin autorizacion escrita. El contenido que envies conserva tu titularidad; nos otorgas licencia para almacenarlo, mostrarlo y evaluarlo." },
  { id: "6", title: "Uso del Mentor ZAI", content: "ZAI es un sistema de inteligencia artificial que puede generar respuestas incorrectas o incompletas. No sustituye la supervision de un docente, tutor legal o profesional cualificado. BYMYZAI LLC no asume responsabilidad por decisiones tomadas basandose en respuestas de ZAI." },
  { id: "7", title: "Certificaciones", content: "Los certificados de Bymyzai son verificables publicamente mediante codigo unico. No son credenciales academicas oficiales, titulos universitarios ni certificaciones emitidas por el gobierno. Representan competencias demostradas dentro del curriculum de Bymyzai. No garantizamos reconocimiento oficial ante instituciones o empleadores." },
  { id: "8", title: "Conducta del Usuario", content: "Queda prohibido: usar la plataforma para fines ilegales, compartir credenciales de acceso, intentar acceder a sistemas no autorizados, publicar contenido ofensivo o discriminatorio, o intentar manipular el sistema de puntuacion o certificaciones." },
  { id: "9", title: "Suspension y Terminacion", content: "BYMYZAI LLC puede suspender o terminar tu cuenta en cualquier momento por violacion de estos Terminos. En caso de terminacion injustificada de una cuenta de pago, se reembolsara el periodo no utilizado de forma proporcional." },
  { id: "10", title: "Limitacion de Responsabilidad", content: "La Plataforma se ofrece tal cual. BYMYZAI LLC no sera responsable por danos indirectos, incidentales, especiales o consecuentes derivados del uso de la Plataforma. La responsabilidad maxima de BYMYZAI LLC no excedera el monto pagado por el usuario en los ultimos 12 meses." },
  { id: "11", title: "Indemnizacion", content: "Aceptas indemnizar y eximir de responsabilidad a BYMYZAI LLC, sus directivos y empleados frente a cualquier reclamacion, dano o gasto derivado de tu uso de la Plataforma o violacion de estos Terminos." },
  { id: "12", title: "Resolucion de Disputas", content: "Cualquier disputa se resolv era mediante arbitraje vinculante en el Estado de New Jersey, EE.UU., bajo las reglas de la American Arbitration Association. Renuncias a participar en demandas colectivas contra BYMYZAI LLC." },
  { id: "13", title: "Ley Aplicable", content: "Estos Terminos se rigen por las leyes del Estado de New Jersey, Estados Unidos, sin perjuicio de sus normas sobre conflicto de leyes." },
  { id: "14", title: "Contacto Legal", content: "Para consultas legales: legal@bymyzai.com. Para soporte: support@bymyzai.com. Para informacion general: info@bymyzai.com. BYMYZAI LLC, 405 King George Road 221, Basking Ridge, NJ 07920." },
];

const sections_en = [
  { id: "1", title: "Acceptance", content: "By registering and using the Platform, you accept these Terms in full. If you disagree, you must not use the Platform. BYMYZAI LLC reserves the right to modify these Terms at any time with 30 days prior notice." },
  { id: "2", title: "Eligibility and Minimum Age", content: "The Platform is available exclusively to users aged 16 or older. If you are between 16 and 17 years old, you declare that you have parental or guardian consent. BYMYZAI LLC may suspend accounts that do not meet this requirement without prior notice." },
  { id: "3", title: "Service Description", content: "Bymyzai is an AI education platform with gamified content, an AI mentor (ZAI), level-based progression, and competency certification. The service is provided as-is and may be modified without prior notice." },
  { id: "4", title: "Plans and Payments", content: "We offer a free plan (STARTER) and paid plans (PRO Monthly $5/mo, PRO Annual $49/yr). Subscriptions renew automatically. You may cancel at any time. Full refund available within 14 days of first subscription." },
  { id: "5", title: "Intellectual Property", content: "All educational content, brand, software, curriculum, methodology and design of the Platform are the exclusive property of BYMYZAI LLC. Reproduction, distribution or commercial use without written authorization is prohibited. Content you submit remains yours; you grant us a license to store, display and evaluate it." },
  { id: "6", title: "Use of ZAI Mentor", content: "ZAI is an AI system that may generate incorrect or incomplete responses. It does not replace the supervision of a teacher, legal guardian or qualified professional. BYMYZAI LLC assumes no responsibility for decisions made based on ZAI responses." },
  { id: "7", title: "Certifications", content: "Bymyzai certificates are publicly verifiable via unique code. They are not official academic credentials, university degrees or government-issued certifications. They represent demonstrated competencies within the Bymyzai curriculum. We do not guarantee official recognition by institutions or employers." },
  { id: "8", title: "User Conduct", content: "Prohibited: using the platform for illegal purposes, sharing login credentials, attempting to access unauthorized systems, posting offensive or discriminatory content, or attempting to manipulate the scoring or certification system." },
  { id: "9", title: "Suspension and Termination", content: "BYMYZAI LLC may suspend or terminate your account at any time for violation of these Terms. In case of unjustified termination of a paid account, the unused period will be refunded on a pro-rata basis." },
  { id: "10", title: "Limitation of Liability", content: "The Platform is provided as-is. BYMYZAI LLC will not be liable for indirect, incidental, special or consequential damages arising from use of the Platform. BYMYZAI LLC maximum liability shall not exceed the amount paid by the user in the last 12 months." },
  { id: "11", title: "Indemnification", content: "You agree to indemnify and hold harmless BYMYZAI LLC, its officers and employees from any claims, damages or expenses arising from your use of the Platform or violation of these Terms." },
  { id: "12", title: "Dispute Resolution", content: "Any dispute shall be resolved through binding arbitration in the State of New Jersey, USA, under the rules of the American Arbitration Association. You waive the right to participate in class action lawsuits against BYMYZAI LLC." },
  { id: "13", title: "Governing Law", content: "These Terms are governed by the laws of the State of New Jersey, United States, without regard to its conflict of law provisions." },
  { id: "14", title: "Legal Contact", content: "For legal inquiries: legal@bymyzai.com. For support: support@bymyzai.com. For general information: info@bymyzai.com. BYMYZAI LLC, 405 King George Road 221, Basking Ridge, NJ 07920." },
];

const legal_es = `TERMINOS DE SERVICIO — BYMYZAI LLC
Ultima actualizacion: agosto 2026
Entity ID: 0451511216 | Estado: New Jersey, EE.UU.

ACUERDO VINCULANTE
Al acceder, registrarse o utilizar la plataforma Bymyzai (en adelante "la Plataforma" o "el Servicio"), operada por BYMYZAI LLC, una compania de responsabilidad limitada registrada en el Estado de New Jersey, Estados Unidos, con Entity ID 0451511216 (en adelante "BYMYZAI", "nosotros" o "la Empresa"), usted (en adelante "el Usuario" o "usted") acepta quedar vinculado por los presentes Terminos de Servicio ("Terminos"). Si no esta de acuerdo con alguno de estos Terminos, no debe acceder ni utilizar la Plataforma.

1. ELEGIBILIDAD
1.1 La Plataforma esta disponible exclusivamente para personas de 16 anos de edad o mas. 
1.2 Usuarios entre 16 y 17 anos deben contar con consentimiento verificable de padre, madre o tutor legal antes de crear una cuenta.
1.3 Al registrarse, el Usuario declara y garantiza que cumple con el requisito de edad minima.
1.4 BYMYZAI LLC se reserva el derecho de solicitar verificacion de edad y suspender cuentas que no cumplan este requisito.

2. DESCRIPCION DEL SERVICIO
2.1 Bymyzai es una plataforma educativa de inteligencia artificial que proporciona curriculum gamificado, mentor de IA (ZAI), progresion por niveles, evaluacion de competencias y certificacion de habilidades.
2.2 El Servicio se presta "tal cual" (as-is) y puede ser modificado, interrumpido o descontinuado en cualquier momento con notificacion previa cuando sea practico.
2.3 BYMYZAI LLC no garantiza disponibilidad ininterrumpida del Servicio.

3. REGISTRO Y CUENTA
3.1 El Usuario es responsable de mantener la confidencialidad de sus credenciales de acceso.
3.2 El Usuario es responsable de todas las actividades realizadas bajo su cuenta.
3.3 El Usuario debe notificar inmediatamente a BYMYZAI LLC sobre cualquier uso no autorizado de su cuenta a traves de support@bymyzai.com.
3.4 Queda prohibida la creacion de multiples cuentas por el mismo usuario.

4. PLANES Y PAGOS
4.1 BYMYZAI LLC ofrece los siguientes planes: STARTER (gratuito), PRO Mensual ($5.00 USD/mes) y PRO Anual ($49.00 USD/ano).
4.2 Las suscripciones de pago se renuevan automaticamente al final de cada periodo salvo cancelacion previa.
4.3 El Usuario puede cancelar su suscripcion en cualquier momento desde su perfil.
4.4 POLITICA DE REEMBOLSO: Se otorgara reembolso completo si se solicita dentro de los 14 dias calendario siguientes a la primera suscripcion. No se otorgaran reembolsos despues de este periodo salvo error de facturacion comprobable.
4.5 Los precios pueden modificarse con notificacion previa de 30 dias.
4.6 Los pagos son procesados por Stripe Inc. BYMYZAI LLC no almacena datos de tarjetas de credito.

5. PROPIEDAD INTELECTUAL
5.1 Todo el contenido educativo, marca Bymyzai, marca ZAI, software, codigo fuente, curriculum, metodologia pedagogica, diseno y sistemas de la Plataforma son propiedad exclusiva de BYMYZAI LLC.
5.2 Queda estrictamente prohibida la reproduccion, distribucion, modificacion, ingenieria inversa o uso comercial de cualquier elemento de la Plataforma sin autorizacion escrita previa de BYMYZAI LLC.
5.3 El contenido generado por el Usuario (proyectos, trabajos, codigo) conserva la titularidad del Usuario. El Usuario otorga a BYMYZAI LLC una licencia no exclusiva, mundial y libre de regalias para almacenar, mostrar, evaluar y utilizar dicho contenido exclusivamente dentro del Servicio.

6. USO DEL MENTOR DE IA (ZAI)
6.1 ZAI es un sistema de inteligencia artificial generativa y sus respuestas pueden contener errores, imprecisiones o informacion desactualizada.
6.2 ZAI no sustituye el asesoramiento profesional, academico, legal, financiero, medico ni de ninguna otra indole.
6.3 BYMYZAI LLC no asume ninguna responsabilidad por decisiones, acciones u omisiones del Usuario basadas en las respuestas generadas por ZAI.
6.4 Las interacciones con ZAI pueden ser procesadas por proveedores de IA de terceros (incluyendo Anthropic) sujetos a sus propias politicas de privacidad.

7. CERTIFICACIONES
7.1 Los certificados emitidos por BYMYZAI LLC son verificables publicamente mediante codigo unico en bymyzai.com/verify.
7.2 Los certificados de Bymyzai NO son: credenciales academicas acreditadas, titulos universitarios, certificaciones profesionales oficiales ni documentos reconocidos por ninguna entidad gubernamental.
7.3 Los certificados de Bymyzai representan la demostracion de competencias dentro del curriculum propio de la Plataforma.
7.4 BYMYZAI LLC no garantiza que los certificados sean reconocidos por empleadores, instituciones educativas u otras organizaciones.

8. CONDUCTA PROHIBIDA
8.1 El Usuario se compromete a no: (a) usar la Plataforma para fines ilegales; (b) compartir credenciales de acceso; (c) intentar acceder a sistemas o datos no autorizados; (d) publicar contenido ofensivo, discriminatorio o ilegal; (e) manipular el sistema de puntuacion, XP, certificaciones o cualquier mecanismo de evaluacion; (f) realizar ingenieria inversa del software; (g) usar bots o sistemas automatizados para interactuar con la Plataforma.

9. SUSPENSION Y TERMINACION
9.1 BYMYZAI LLC puede suspender o terminar el acceso del Usuario en cualquier momento por violacion de estos Terminos.
9.2 En caso de terminacion injustificada de una cuenta de pago activa, BYMYZAI LLC reembolsara el periodo no utilizado de forma proporcional.
9.3 El Usuario puede eliminar su cuenta en cualquier momento. La eliminacion es permanente e irreversible.

10. LIMITACION DE RESPONSABILIDAD
10.1 La Plataforma se proporciona "tal cual" y "segun disponibilidad" sin garantias de ningun tipo, expresas o implicitas.
10.2 BYMYZAI LLC no sera responsable por danos indirectos, incidentales, especiales, ejemplares o consecuentes, incluyendo perdida de datos, perdida de ingresos o interrupcion del negocio.
10.3 La responsabilidad total maxima de BYMYZAI LLC hacia el Usuario no excedera el monto total pagado por el Usuario a BYMYZAI LLC durante los 12 meses anteriores al evento que dio origen a la reclamacion, o $100 USD, lo que sea mayor.

11. INDEMNIZACION
El Usuario acepta defender, indemnizar y mantener indemne a BYMYZAI LLC, sus miembros, directivos, empleados y agentes frente a cualquier reclamacion, responsabilidad, dano, perdida y gasto (incluyendo honorarios legales razonables) que surjan de: (a) el uso del Servicio por parte del Usuario; (b) la violacion de estos Terminos; (c) la violacion de derechos de terceros.

12. MODIFICACIONES A LOS TERMINOS
12.1 BYMYZAI LLC puede modificar estos Terminos en cualquier momento.
12.2 Los cambios materiales seran notificados con al menos 30 dias de anticipacion por correo electronico o aviso en la Plataforma.
12.3 El uso continuado de la Plataforma despues de la fecha de vigencia de los cambios constituye aceptacion de los nuevos Terminos.

13. RESOLUCION DE DISPUTAS
13.1 Cualquier disputa, controversia o reclamacion derivada de o relacionada con estos Terminos o el Servicio se resolvera mediante arbitraje vinculante administrado por la American Arbitration Association (AAA) bajo sus reglas de arbitraje comercial vigentes.
13.2 El arbitraje se llevara a cabo en el Estado de New Jersey, EE.UU.
13.3 El idioma del arbitraje sera el ingles.
13.4 EL USUARIO RENUNCIA EXPRESAMENTE A PARTICIPAR EN DEMANDAS COLECTIVAS (CLASS ACTIONS) CONTRA BYMYZAI LLC.
13.5 Nada en esta clausula impide a cualquiera de las partes solicitar medidas cautelares urgentes ante un tribunal competente.

14. LEY APLICABLE Y JURISDICCION
14.1 Estos Terminos se rigen e interpretan de conformidad con las leyes del Estado de New Jersey, Estados Unidos, sin perjuicio de sus disposiciones sobre conflicto de leyes.
14.2 Para cualquier reclamacion que no sea sometida a arbitraje, las partes se someten a la jurisdiccion exclusiva de los tribunales competentes del Estado de New Jersey.

15. DISPOSICIONES GENERALES
15.1 Si alguna disposicion de estos Terminos fuera declarada invalida o inaplicable, las demas disposiciones continuaran en plena vigencia.
15.2 La falta de ejercicio de cualquier derecho por parte de BYMYZAI LLC no constituira renuncia a dicho derecho.
15.3 Estos Terminos constituyen el acuerdo completo entre el Usuario y BYMYZAI LLC con respecto al Servicio.

16. CONTACTO
Para consultas legales: legal@bymyzai.com
Para soporte tecnico: support@bymyzai.com
Para informacion general: info@bymyzai.com
BYMYZAI LLC
405 King George Road 221
Basking Ridge, New Jersey 07920
Estados Unidos`;

const legal_en = `TERMS OF SERVICE — BYMYZAI LLC
Last updated: August 2026
Entity ID: 0451511216 | State: New Jersey, USA

BINDING AGREEMENT
By accessing, registering for, or using the Bymyzai platform (hereinafter "the Platform" or "the Service"), operated by BYMYZAI LLC, a limited liability company registered in the State of New Jersey, United States, with Entity ID 0451511216 (hereinafter "BYMYZAI", "we" or "the Company"), you (hereinafter "the User" or "you") agree to be bound by these Terms of Service ("Terms"). If you do not agree with any of these Terms, you must not access or use the Platform.

1. ELIGIBILITY
1.1 The Platform is available exclusively to persons aged 16 years or older.
1.2 Users between 16 and 17 years of age must have verifiable parental or guardian consent before creating an account.
1.3 By registering, the User represents and warrants that they meet the minimum age requirement.
1.4 BYMYZAI LLC reserves the right to request age verification and suspend accounts that do not meet this requirement.

2. SERVICE DESCRIPTION
2.1 Bymyzai is an artificial intelligence education platform that provides gamified curriculum, AI mentor (ZAI), level-based progression, competency assessment, and skills certification.
2.2 The Service is provided "as-is" and may be modified, interrupted or discontinued at any time with prior notice when practicable.
2.3 BYMYZAI LLC does not guarantee uninterrupted availability of the Service.

3. REGISTRATION AND ACCOUNT
3.1 The User is responsible for maintaining the confidentiality of their access credentials.
3.2 The User is responsible for all activities conducted under their account.
3.3 The User must immediately notify BYMYZAI LLC of any unauthorized use of their account at support@bymyzai.com.
3.4 Creating multiple accounts by the same user is prohibited.

4. PLANS AND PAYMENTS
4.1 BYMYZAI LLC offers the following plans: STARTER (free), PRO Monthly ($5.00 USD/month) and PRO Annual ($49.00 USD/year).
4.2 Paid subscriptions automatically renew at the end of each period unless cancelled beforehand.
4.3 The User may cancel their subscription at any time from their profile.
4.4 REFUND POLICY: A full refund will be granted if requested within 14 calendar days of the first subscription. No refunds will be granted after this period except for demonstrable billing errors.
4.5 Prices may be modified with 30 days prior notice.
4.6 Payments are processed by Stripe Inc. BYMYZAI LLC does not store credit card data.

5. INTELLECTUAL PROPERTY
5.1 All educational content, the Bymyzai brand, the ZAI brand, software, source code, curriculum, pedagogical methodology, design and systems of the Platform are the exclusive property of BYMYZAI LLC.
5.2 Reproduction, distribution, modification, reverse engineering or commercial use of any element of the Platform without prior written authorization from BYMYZAI LLC is strictly prohibited.
5.3 Content generated by the User (projects, work, code) remains the User's property. The User grants BYMYZAI LLC a non-exclusive, worldwide, royalty-free license to store, display, evaluate and use said content exclusively within the Service.

6. USE OF THE AI MENTOR (ZAI)
6.1 ZAI is a generative artificial intelligence system and its responses may contain errors, inaccuracies or outdated information.
6.2 ZAI does not substitute professional, academic, legal, financial, medical or any other type of advice.
6.3 BYMYZAI LLC assumes no responsibility for decisions, actions or omissions by the User based on responses generated by ZAI.
6.4 Interactions with ZAI may be processed by third-party AI providers (including Anthropic) subject to their own privacy policies.

7. CERTIFICATIONS
7.1 Certificates issued by BYMYZAI LLC are publicly verifiable via unique code at bymyzai.com/verify.
7.2 Bymyzai certificates are NOT: accredited academic credentials, university degrees, official professional certifications, or documents recognized by any government entity.
7.3 Bymyzai certificates represent the demonstration of competencies within the Platform's own curriculum.
7.4 BYMYZAI LLC does not guarantee that certificates will be recognized by employers, educational institutions or other organizations.

8. PROHIBITED CONDUCT
8.1 The User agrees not to: (a) use the Platform for illegal purposes; (b) share access credentials; (c) attempt to access unauthorized systems or data; (d) post offensive, discriminatory or illegal content; (e) manipulate the scoring system, XP, certifications or any evaluation mechanism; (f) reverse engineer the software; (g) use bots or automated systems to interact with the Platform.

9. SUSPENSION AND TERMINATION
9.1 BYMYZAI LLC may suspend or terminate the User's access at any time for violation of these Terms.
9.2 In case of unjustified termination of an active paid account, BYMYZAI LLC will refund the unused period on a pro-rata basis.
9.3 The User may delete their account at any time. Deletion is permanent and irreversible.

10. LIMITATION OF LIABILITY
10.1 The Platform is provided "as-is" and "as available" without warranties of any kind, express or implied.
10.2 BYMYZAI LLC will not be liable for indirect, incidental, special, exemplary or consequential damages, including loss of data, loss of revenue or business interruption.
10.3 BYMYZAI LLC total maximum liability to the User shall not exceed the total amount paid by the User to BYMYZAI LLC during the 12 months preceding the event giving rise to the claim, or $100 USD, whichever is greater.

11. INDEMNIFICATION
The User agrees to defend, indemnify and hold harmless BYMYZAI LLC, its members, officers, employees and agents from any claims, liabilities, damages, losses and expenses (including reasonable legal fees) arising from: (a) the User's use of the Service; (b) violation of these Terms; (c) violation of third-party rights.

12. MODIFICATIONS TO TERMS
12.1 BYMYZAI LLC may modify these Terms at any time.
12.2 Material changes will be notified at least 30 days in advance by email or notice on the Platform.
12.3 Continued use of the Platform after the effective date of changes constitutes acceptance of the new Terms.

13. DISPUTE RESOLUTION
13.1 Any dispute, controversy or claim arising out of or relating to these Terms or the Service shall be resolved by binding arbitration administered by the American Arbitration Association (AAA) under its then-current commercial arbitration rules.
13.2 The arbitration shall take place in the State of New Jersey, USA.
13.3 The language of arbitration shall be English.
13.4 THE USER EXPRESSLY WAIVES THE RIGHT TO PARTICIPATE IN CLASS ACTION LAWSUITS AGAINST BYMYZAI LLC.
13.5 Nothing in this clause prevents either party from seeking urgent injunctive relief from a competent court.

14. GOVERNING LAW AND JURISDICTION
14.1 These Terms are governed by and construed in accordance with the laws of the State of New Jersey, United States, without regard to its conflict of law provisions.
14.2 For any claims not submitted to arbitration, the parties submit to the exclusive jurisdiction of the competent courts of the State of New Jersey.

15. GENERAL PROVISIONS
15.1 If any provision of these Terms is found invalid or unenforceable, the remaining provisions shall continue in full force and effect.
15.2 Failure by BYMYZAI LLC to exercise any right shall not constitute a waiver of such right.
15.3 These Terms constitute the entire agreement between the User and BYMYZAI LLC with respect to the Service.

16. CONTACT
For legal inquiries: legal@bymyzai.com
For technical support: support@bymyzai.com
For general information: info@bymyzai.com
BYMYZAI LLC
405 King George Road 221
Basking Ridge, New Jersey 07920
United States`;

export default function TermsPage() {
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
                {lang === "es" ? "Terminos de Servicio" : "Terms of Service"}
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

        <div style={{ background: "#1E2533", border: "1px solid #324055", borderLeft: "3px solid #7B61FF", borderRadius: "10px", padding: "16px 20px", marginBottom: "32px", fontSize: "14px", color: "#B3BDD1" }}>
          {lang === "es"
            ? "Al usar Bymyzai, operada por BYMYZAI LLC (Entity ID 0451511216), registrada en New Jersey, EE.UU., aceptas estos Terminos."
            : "By using Bymyzai, operated by BYMYZAI LLC (Entity ID 0451511216), registered in New Jersey, USA, you accept these Terms."}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "32px" }}>
          {sections.map((s) => (
            <div key={s.id} style={{ background: "#161C27", border: "1px solid #324055", borderRadius: "10px", overflow: "hidden" }}>
              <button onClick={() => setOpen(open === s.id ? null : s.id)} style={{ width: "100%", background: "none", border: "none", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ background: "#242E40", color: "#7B61FF", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "11px", borderRadius: "6px", padding: "2px 8px", minWidth: "28px", textAlign: "center" }}>{s.id}</span>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "15px" }}>{s.title}</span>
                </span>
                <span style={{ color: "#7B61FF", fontSize: "18px", fontWeight: 700, transform: open === s.id ? "rotate(45deg)" : "rotate(0deg)", display: "inline-block" }}>+</span>
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
            <span style={{ color: "#7B61FF", fontSize: "18px", fontWeight: 700, transform: showFull ? "rotate(45deg)" : "rotate(0deg)", display: "inline-block" }}>+</span>
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