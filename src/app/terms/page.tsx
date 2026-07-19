import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Terminos de Servicio â€” Bymyzai",
  description: "Terminos y condiciones de uso de la plataforma Bymyzai.",
  alternates: { canonical: "https://www.bymyzai.com/terms" },
};
export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0F1420", padding: "40px 20px", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", color: "#B3BDD1", lineHeight: 1.7 }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#F8FAFF", fontSize: "26px", marginBottom: "8px" }}>Términos de Servicio — Bymyzai</h1>
        <p style={{ fontSize: "12px", color: "#7E8798", marginBottom: "24px" }}>Última actualización: [FECHA]</p>

        <p style={{ marginBottom: "20px" }}>Al acceder o usar la plataforma Bymyzai ("la Plataforma", "el Servicio"), operada por Carlos Eduardo Gonzalez Fernandez, individuo, residente en el estado de New Jersey, EE.UU. ("Bymyzai", "nosotros"), aceptas quedar vinculado por estos Términos de Servicio ("Términos"). Si no estás de acuerdo, no debes usar la Plataforma.</p>

        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "18px", margin: "24px 0 10px" }}>1. Aceptación de los Términos</h2>
        <p style={{ marginBottom: "16px" }}>Al registrarte y usar la Plataforma, aceptas estos Términos en su totalidad.</p>

        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "18px", margin: "24px 0 10px" }}>2. Elegibilidad y Edad Mínima</h2>
        <p style={{ marginBottom: "16px" }}>La Plataforma está disponible únicamente para personas de 16 años de edad o más. Si tienes entre 16 y 17 años, declaras contar con el consentimiento de tu padre, madre o tutor legal.</p>

        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "18px", margin: "24px 0 10px" }}>3. Descripción del Servicio</h2>
        <p style={{ marginBottom: "16px" }}>Bymyzai es una plataforma educativa de alfabetización en inteligencia artificial dirigida a jóvenes, con contenido gamificado, mentor de IA (ZAI), progresión por niveles y certificación de competencias.</p>

        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "18px", margin: "24px 0 10px" }}>4. Planes y Pagos</h2>
        <p style={{ marginBottom: "16px" }}>Ofrecemos un plan gratuito y planes de pago que desbloquean niveles adicionales. Las suscripciones se renuevan automáticamente. Puedes solicitar reembolso completo dentro de los 14 días siguientes a la suscripción.</p>

        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "18px", margin: "24px 0 10px" }}>5. Propiedad Intelectual</h2>
        <p style={{ marginBottom: "16px" }}>Todo el contenido educativo, marca, software y diseño de la Plataforma son propiedad de Bymyzai. El contenido que envíes (proyectos, código) conserva tu titularidad; nos otorgas licencia para almacenarlo, mostrarlo y evaluarlo dentro del Servicio.</p>

        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "18px", margin: "24px 0 10px" }}>6. Uso del Mentor de IA (ZAI)</h2>
        <p style={{ marginBottom: "16px" }}>ZAI es un sistema de inteligencia artificial y puede generar respuestas incorrectas o incompletas. No sustituye la supervisión de un docente, tutor legal o profesional cualificado.</p>

        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "18px", margin: "24px 0 10px" }}>7. Certificaciones</h2>
        <p style={{ marginBottom: "16px" }}>Los certificados son verificables públicamente mediante código único. No garantizamos reconocimiento oficial o equivalencia académica ante instituciones o empleadores.</p>

        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "18px", margin: "24px 0 10px" }}>8. Limitación de Responsabilidad</h2>
        <p style={{ marginBottom: "16px" }}>La Plataforma se ofrece "tal cual". No seremos responsables por daños indirectos derivados del uso de la Plataforma, incluyendo errores en contenido generado por IA.</p>

        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "18px", margin: "24px 0 10px" }}>9. Ley Aplicable</h2>
        <p style={{ marginBottom: "16px" }}>Estos Términos se rigen por las leyes del Estado de New Jersey, Estados Unidos.</p>

        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "18px", margin: "24px 0 10px" }}>10. Contacto</h2>
        <p style={{ marginBottom: "40px" }}>Para consultas: <a href="mailto:cgonzalez@bymyzai.com" style={{ color: "#7B61FF" }}>cgonzalez@bymyzai.com</a></p>
      </div>
    </div>
  );
}
