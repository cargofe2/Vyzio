import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#0F1420" }}>
      {/* Hero */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", textAlign: "center" }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "36px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", position: "relative", flexShrink: 0 }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "conic-gradient(from 0deg, #A78BFA, #7B61FF, #4C3AA8, #7B61FF, #A78BFA)", opacity: 0.9, animation: "spin 4s linear infinite" }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.5), transparent 45%)" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 256 256"><g transform="rotate(-12 128 128)"><path d="M78 88H178L82 168H178" stroke="#FFFFFF" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" fill="none"/></g></svg>
            </div>
          </div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "28px", letterSpacing: "5px", color: "#F8FAFF" }}>Bymyzai</span>
        </div>

        <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "36px", color: "#fff", lineHeight: 1.1, marginBottom: "16px", maxWidth: "320px" }}>
          Aprende IA.<br/>
          <span style={{ background: "linear-gradient(135deg,#818CF8,#00D4FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Construye el futuro.</span>
        </h1>

        <p style={{ fontSize: "13px", maxWidth: "300px", lineHeight: 1.7, marginBottom: "32px", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif" }}>
          112+ lecciones · Tutor IA personal · Gamificación real · Certificados verificables.
          La plataforma donde aprendes IA de verdad.
        </p>

        {/* Stats */}
        <div style={{ display: "flex", gap: "28px", marginBottom: "32px" }}>
          {[["112+","Lecciones"],["10","Mundos"],["100%","Gratis al inicio"]].map(([n,l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "22px", background: "linear-gradient(135deg,#C7D2FE,#818CF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{n}</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif", marginTop: "2px" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "300px" }}>
          <Link href="/sign-up" style={{ display: "block", width: "100%", padding: "16px", borderRadius: "16px", textAlign: "center", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "14px", textDecoration: "none", background: "linear-gradient(135deg,#7B61FF,#8B5CF6)", color: "#fff", boxShadow: "0 0 14px rgba(123,97,255,0.25)" }}>
            Empezar gratis →
          </Link>
          <Link href="/sign-in" style={{ display: "block", width: "100%", padding: "14px", borderRadius: "16px", textAlign: "center", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "13px", textDecoration: "none", border: "1px solid rgba(123,97,255,0.2)", color: "rgba(255,255,255,0.5)" }}>
            Ya tengo cuenta
          </Link>
        </div>

        {/* Features */}
        <div style={{ display: "flex", gap: "18px", marginTop: "32px", fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans',sans-serif" }}>
          <span>🎮 Gamificación</span>
          <span>🤖 Tutor IA</span>
          <span>🎓 Certificados</span>
        </div>
      </div>

      {/* Mundos preview */}
      <div style={{ padding: "0 24px 48px" }}>
        <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", textAlign: "center", marginBottom: "16px", color: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans',sans-serif" }}>
          10 mundos de aprendizaje
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", maxWidth: "320px", margin: "0 auto" }}>
          {[
            { name: "Fundamentos de IA", color: "#818CF8", bg: "rgba(123,97,255,0.08)", border: "rgba(123,97,255,0.18)",
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3C8.7 3 6 5.7 6 9V10H5C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14H6C6 16.2 7.4 18 9.3 18.8V20C9.3 20.6 9.7 21 10.3 21H13.7C14.3 21 14.7 20.6 14.7 20V18.8C16.6 18 18 16.2 18 14H19C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10H18V9C18 5.7 15.3 3 12 3Z" stroke="#818CF8" strokeWidth="1.8"/></svg> },
            { name: "Historia de la IA", color: "#FB923C", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.18)",
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#FB923C" strokeWidth="1.8"/><path d="M12 7V12L15 15" stroke="#FB923C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
            { name: "IA en tu Vida", color: "#00D4FF", bg: "rgba(0,212,255,0.08)", border: "rgba(0,212,255,0.18)",
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.7 2 6 4.7 6 8C6 10.4 7.4 12.5 9.5 13.5V16H14.5V13.5C16.6 12.5 18 10.4 18 8C18 4.7 15.3 2 12 2Z" stroke="#00D4FF" strokeWidth="1.8" strokeLinejoin="round"/></svg> },
            { name: "Ética de la IA", color: "#FB923C", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.18)",
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3L4 7V12C4 16.4 7.6 20.5 12 21C16.4 20.5 20 16.4 20 12V7L12 3Z" stroke="#FB923C" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 12L11 14L15 10" stroke="#FB923C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
          ].map(({ name, color, bg, border, icon }) => (
            <div key={name} style={{ borderRadius: "16px", padding: "12px", background: bg, border: `1px solid ${border}` }}>
              <div style={{ width: "32px", height: "32px", background: bg, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>{icon}</div>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "11px", color, lineHeight: 1.3 }}>{name}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
