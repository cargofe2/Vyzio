import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#111", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ textAlign: "center", maxWidth: "400px" }}>
        <div style={{ width: "56px", height: "56px", background: "#FFFC00", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
            <path d="M4 16L10 4L16 16" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.5 11H13.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 style={{ fontFamily: "sans-serif", fontSize: "36px", fontWeight: "900", color: "#fff", letterSpacing: "4px", marginBottom: "8px" }}>VYZIO</h1>
        <p style={{ color: "#FFFC00", fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>Aprende IA. Construye el futuro.</p>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "40px", lineHeight: "1.6" }}>
          La plataforma donde la nueva generación domina la Inteligencia Artificial.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link href="/sign-up" style={{ display: "block", padding: "16px", background: "#FFFC00", color: "#111", borderRadius: "14px", fontWeight: "800", fontSize: "15px", textDecoration: "none" }}>
            Empezar gratis →
          </Link>
          <Link href="/sign-in" style={{ display: "block", padding: "14px", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", borderRadius: "14px", fontWeight: "700", fontSize: "14px", textDecoration: "none" }}>
            Ya tengo cuenta
          </Link>
        </div>
        <p style={{ marginTop: "32px", color: "rgba(255,255,255,0.15)", fontSize: "11px" }}>
          🎮 Gamificación · 🤖 Tutor IA · 🎓 Certificados
        </p>
      </div>
    </main>
  );
}
