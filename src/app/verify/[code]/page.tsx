import { prisma } from "@/lib/prisma";

export default async function VerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const cert = await prisma.levelCertificate.findUnique({ where: { verificationCode: code } });

  return (
    <main style={{ minHeight: "100vh", background: "#0F1420", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ maxWidth: "400px", width: "100%", background: "#1E2533", border: "1px solid #324055", borderRadius: "24px", padding: "32px", textAlign: "center" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "50%", margin: "0 auto 16px", position: "relative" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "conic-gradient(from 0deg, #A78BFA, #7B61FF, #4C3AA8, #7B61FF, #A78BFA)", opacity: 0.9 }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.5), transparent 45%)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="22" height="22" viewBox="0 0 256 256"><g transform="rotate(-12 128 128)"><path d="M78 88H178L82 168H178" stroke="#FFFFFF" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" fill="none"/></g></svg>
          </div>
        </div>

        {cert ? (
          <>
            <div style={{ width: "56px", height: "56px", background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", margin: "0 auto 16px" }}>✓</div>
            <p style={{ fontSize: "11px", color: "#34D399", fontWeight: 700, letterSpacing: "1px", marginBottom: "8px", fontFamily: "'DM Sans',sans-serif" }}>CERTIFICADO VÁLIDO</p>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "20px", color: "#F8FAFF", marginBottom: "4px" }}>{cert.studentName}</h1>
            <p style={{ fontSize: "13px", color: "#B3BDD1", marginBottom: "20px", fontFamily: "'DM Sans',sans-serif" }}>completó exitosamente</p>
            <div style={{ background: "rgba(123,97,255,0.08)", border: "1px solid rgba(123,97,255,0.25)", borderRadius: "14px", padding: "16px", marginBottom: "20px" }}>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "16px", color: "#C7D2FE" }}>{cert.levelName}</p>
              <p style={{ fontSize: "11px", color: "#7E8798", marginTop: "4px", fontFamily: "'DM Sans',sans-serif" }}>en BYZAI</p>
            </div>
            <p style={{ fontSize: "11px", color: "#7E8798", fontFamily: "'DM Sans',sans-serif" }}>
              Emitido el {new Date(cert.issuedAt).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            <p style={{ fontSize: "9px", color: "#4A5568", marginTop: "16px", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.5 }}>
              Este certificado reconoce la finalización de un programa de estudio en BYZAI, una plataforma educativa privada. No constituye un título, grado o acreditación académica formal, ni implica reconocimiento por instituciones educativas o gubernamentales.
            </p>
            <p style={{ fontSize: "10px", color: "#4A5568", marginTop: "12px", fontFamily: "'DM Sans',sans-serif", wordBreak: "break-all" }}>
              Código de verificación: {cert.verificationCode}
            </p>
          </>
        ) : (
          <>
            <div style={{ width: "56px", height: "56px", background: "rgba(255,107,107,0.12)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", margin: "0 auto 16px" }}>✕</div>
            <p style={{ fontSize: "11px", color: "#FF6B6B", fontWeight: 700, letterSpacing: "1px", marginBottom: "8px", fontFamily: "'DM Sans',sans-serif" }}>CÓDIGO NO ENCONTRADO</p>
            <p style={{ fontSize: "13px", color: "#B3BDD1", fontFamily: "'DM Sans',sans-serif" }}>Este código de verificación no corresponde a ningún certificado emitido por BYZAI.</p>
          </>
        )}
      </div>
    </main>
  );
}
