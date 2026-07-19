import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Politica de Privacidad â€” Bymyzai",
  description: "Politica de privacidad de Bymyzai. Como recopilamos, usamos y protegemos tus datos personales.",
  alternates: { canonical: "https://www.bymyzai.com/privacy" },
};
export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0F1420", padding: "40px 20px", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", color: "#B3BDD1", lineHeight: 1.7 }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#F8FAFF", fontSize: "26px", marginBottom: "8px" }}>Política de Privacidad — Bymyzai</h1>
        <p style={{ fontSize: "12px", color: "#7E8798", marginBottom: "24px" }}>Última actualización: [FECHA]</p>

        <p style={{ marginBottom: "20px" }}>Esta Política describe cómo Carlos Eduardo Gonzalez Fernandez, individuo, residente en New Jersey, EE.UU. ("Bymyzai", "nosotros") recopila, usa y protege tus datos personales.</p>

        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "18px", margin: "24px 0 10px" }}>1. Datos que Recopilamos</h2>
        <p style={{ marginBottom: "16px" }}>Nombre, correo, edad, idioma, progreso académico, interacciones con ZAI, datos de facturación (procesados por nuestro proveedor de pagos), y datos técnicos básicos.</p>

        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "18px", margin: "24px 0 10px" }}>2. Uso de Inteligencia Artificial</h2>
        <p style={{ marginBottom: "16px" }}>Usamos modelos de IA de terceros (incluyendo Anthropic) para operar ZAI y evaluar proyectos. Tus datos NO se utilizan para entrenar o mejorar modelos de IA de terceros — exclusión (opt-out) por defecto.</p>

        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "18px", margin: "24px 0 10px" }}>3. Consentimiento de Menores</h2>
        <p style={{ marginBottom: "16px" }}>Para usuarios de 16-17 años, al registrarse se solicita el correo del padre, madre o tutor legal, quien debe confirmar el consentimiento mediante un enlace de verificación enviado por correo.</p>

        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "18px", margin: "24px 0 10px" }}>4. Con Quién Compartimos Datos</h2>
        <p style={{ marginBottom: "16px" }}>Proveedores de infraestructura: Vercel, Supabase, Clerk, Anthropic. No vendemos datos personales a terceros con fines publicitarios.</p>

        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "18px", margin: "24px 0 10px" }}>5. Transferencias Internacionales</h2>
        <p style={{ marginBottom: "16px" }}>Nuestros proveedores pueden procesar datos fuera de tu país de residencia. Al registrarte, otorgas consentimiento expreso para estas transferencias, necesarias para operar el Servicio.</p>

        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "18px", margin: "24px 0 10px" }}>6. Certificados Públicos</h2>
        <p style={{ marginBottom: "16px" }}>Los certificados verificables pueden exhibir tu nombre y nivel certificado, visibles públicamente mediante código único.</p>

        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "18px", margin: "24px 0 10px" }}>7. Tus Derechos</h2>
        <p style={{ marginBottom: "16px" }}>Puedes solicitar acceso, corrección, eliminación o portabilidad de tus datos escribiendo a <a href="mailto:cgonzalez@bymyzai.com" style={{ color: "#7B61FF" }}>cgonzalez@bymyzai.com</a>.</p>

        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "18px", margin: "24px 0 10px" }}>8. Padres y Tutores</h2>
        <p style={{ marginBottom: "16px" }}>Pueden solicitar acceso, corrección o eliminación de los datos de su hijo/a contactando a <a href="mailto:cgonzalez@bymyzai.com" style={{ color: "#7B61FF" }}>cgonzalez@bymyzai.com</a>.</p>

        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "18px", margin: "24px 0 10px" }}>9. Contacto</h2>
        <p style={{ marginBottom: "40px" }}><a href="mailto:cgonzalez@bymyzai.com" style={{ color: "#7B61FF" }}>cgonzalez@bymyzai.com</a></p>
      </div>
    </div>
  );
}
