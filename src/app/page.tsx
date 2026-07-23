import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Bymyzai – Aprende IA. Construye el futuro.",
  description: "La academia de IA para jóvenes. 630+ lecciones, 84 mundos, tutor IA personal ZAI y certificados verificables. Empieza gratis.",
  openGraph: {
    title: "Bymyzai – Aprende IA. Construye el futuro.",
    description: "La academia de IA para jóvenes. 630+ lecciones, 84 mundos, tutor IA personal ZAI y certificados verificables.",
    url: "https://www.bymyzai.com",
    siteName: "Bymyzai",
    locale: "es_ES",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Bymyzai", description: "La academia de IA para jóvenes." },
  alternates: { canonical: "https://www.bymyzai.com" },
};
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const WORLDS = [
  { name: "Fundamentos de IA", color: "#818CF8", bg: "rgba(123,97,255,0.08)", border: "rgba(123,97,255,0.18)",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3C8.7 3 6 5.7 6 9V10H5C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14H6C6 16.2 7.4 18 9.3 18.8V20C9.3 20.6 9.7 21 10.3 21H13.7C14.3 21 14.7 20.6 14.7 20V18.8C16.6 18 18 16.2 18 14H19C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10H18V9C18 5.7 15.3 3 12 3Z" stroke="#818CF8" strokeWidth="1.8"/></svg> },
  { name: "Historia de la IA", color: "#FB923C", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.18)",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#FB923C" strokeWidth="1.8"/><path d="M12 7V12L15 15" stroke="#FB923C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { name: "IA en tu Vida", color: "#00D4FF", bg: "rgba(0,212,255,0.08)", border: "rgba(0,212,255,0.18)",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.7 2 6 4.7 6 8C6 10.4 7.4 12.5 9.5 13.5V16H14.5V13.5C16.6 12.5 18 10.4 18 8C18 4.7 15.3 2 12 2Z" stroke="#00D4FF" strokeWidth="1.8" strokeLinejoin="round"/></svg> },
  { name: "Ética de la IA", color: "#36D399", bg: "rgba(54,211,153,0.08)", border: "rgba(54,211,153,0.18)",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3L4 7V12C4 16.4 7.6 20.5 12 21C16.4 20.5 20 16.4 20 12V7L12 3Z" stroke="#36D399" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 12L11 14L15 10" stroke="#36D399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { name: "Creatividad con IA", color: "#FF7DAE", bg: "rgba(255,125,174,0.08)", border: "rgba(255,125,174,0.18)",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21L12 17.77L5.82 21L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#FF7DAE" strokeWidth="1.8" strokeLinejoin="round"/></svg> },
  { name: "Programación IA", color: "#36D399", bg: "rgba(54,211,153,0.08)", border: "rgba(54,211,153,0.18)",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><polyline points="16 18 22 12 16 6" stroke="#36D399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="8 6 2 12 8 18" stroke="#36D399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
];

const LEVELS = [
  { label: "Origins", color: "#818CF8" },
  { label: "Explorer", color: "#468BFF" },
  { label: "Thinker", color: "#26C6DA" },
  { label: "Creator", color: "#FF7DAE" },
  { label: "Builder", color: "#36D399" },
  { label: "Architect", color: "#F2C04D" },
  { label: "Founder", color: "#FF9E5B" },
  { label: "Researcher", color: "#7B61FF" },
  { label: "Residency", color: "#FF6B6B" },
];

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main style={{ minHeight: "100vh", background: "#0F1420", color: "#F8FAFF", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @media (min-width: 768px) {
          .hero-layout { flex-direction: row !important; text-align: left !important; align-items: center !important; padding: 0 64px !important; min-height: 100vh; }
          .hero-text { align-items: flex-start !important; max-width: 520px !important; }
          .hero-visual { display: flex !important; }
          .hero-h1 { font-size: 56px !important; max-width: none !important; }
          .hero-sub { max-width: none !important; }
          .stats-row { justify-content: flex-start !important; }
          .cta-group { flex-direction: row !important; max-width: none !important; }
          .cta-primary { width: auto !important; padding: 16px 32px !important; }
          .cta-secondary { width: auto !important; padding: 14px 28px !important; }
          .worlds-grid { grid-template-columns: repeat(3, 1fr) !important; max-width: 820px !important; }
          .section-worlds { padding: 64px !important; }
          .levels-grid { grid-template-columns: repeat(5, 1fr) !important; }
          .features-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .footer-inner { flex-direction: row !important; justify-content: space-between !important; }
        }
        @media (min-width: 1024px) {
          .hero-h1 { font-size: 64px !important; }
          .hero-visual-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/logo.png" alt="Bymyzai" width={36} height={36} style={{ borderRadius: "50%" }} />
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "20px", letterSpacing: "3px" }}>Bymyzai</span>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Link href="/sign-in" style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", textDecoration: "none", padding: "8px 16px" }}>
            Entrar
          </Link>
          <Link href="/sign-up" style={{ fontSize: "13px", fontWeight: 700, color: "#fff", textDecoration: "none", padding: "10px 20px", borderRadius: "12px", background: "rgba(123,97,255,0.9)", border: "1px solid rgba(123,97,255,0.4)" }}>
            Empezar gratis
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-layout" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "56px 24px", gap: "48px", minHeight: "calc(100vh - 77px)", textAlign: "center" }}>

        {/* Text side */}
        <div className="hero-text" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "100px", background: "rgba(123,97,255,0.12)", border: "1px solid rgba(123,97,255,0.25)", marginBottom: "24px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#7B61FF", display: "inline-block" }}></span>
            <span style={{ fontSize: "12px", color: "#A78BFA", fontWeight: 600, letterSpacing: "0.5px" }}>La academia de IA para jóvenes</span>
          </div>

          <h1 className="hero-h1" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "38px", lineHeight: 1.05, marginBottom: "20px", maxWidth: "340px" }}>
            Aprende IA.<br />
            <span style={{ background: "linear-gradient(135deg,#818CF8,#00D4FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Construye el futuro.
            </span>
          </h1>

          <p className="hero-sub" style={{ fontSize: "15px", lineHeight: 1.7, color: "rgba(255,255,255,0.45)", marginBottom: "32px", maxWidth: "360px" }}>
            630+ lecciones · 84 mundos · Tutor IA personal · Certificados verificables.
            La plataforma donde aprendes IA de verdad.
          </p>

          {/* Stats */}
          <div className="stats-row" style={{ display: "flex", gap: "32px", marginBottom: "36px", justifyContent: "center" }}>
            {[["630+","Lecciones"],["84","Mundos"],["9","Niveles"]].map(([n,l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "26px", background: "linear-gradient(135deg,#C7D2FE,#818CF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{n}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>{l}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="cta-group" style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "320px" }}>
            <Link href="/sign-up" className="cta-primary" style={{ display: "block", width: "100%", padding: "16px 24px", borderRadius: "14px", textAlign: "center", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "15px", textDecoration: "none", background: "linear-gradient(135deg,#7B61FF,#8B5CF6)", color: "#fff" }}>
              Empezar gratis →
            </Link>
            <Link href="/sign-in" className="cta-secondary" style={{ display: "block", width: "100%", padding: "14px 24px", borderRadius: "14px", textAlign: "center", fontWeight: 700, fontSize: "13px", textDecoration: "none", border: "1px solid rgba(123,97,255,0.2)", color: "rgba(255,255,255,0.5)" }}>
              Ya tengo cuenta
            </Link>
          </div>

          <div style={{ display: "flex", gap: "20px", marginTop: "28px", fontSize: "12px", color: "rgba(255,255,255,0.25)", alignItems: "center" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="12" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M6 12H10M8 10V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="16" cy="12" r="1.2" fill="currentColor"/><circle cx="19" cy="12" r="1.2" fill="currentColor"/></svg>
              Gamificación
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="1.8"/><path d="M9 14.5C6.5 15.5 5 17.5 5 20H19C19 17.5 17.5 15.5 15 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M12 13V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              Tutor IA
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2L15 8H21L16.5 12L18 18L12 15L6 18L7.5 12L3 8H9L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
              Certificados
            </span>
          </div>
        </div>

        {/* Visual side — desktop only */}
        <div className="hero-visual" style={{ display: "none", flexDirection: "column", gap: "12px", minWidth: "360px", maxWidth: "420px" }}>
          <div className="hero-visual-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {WORLDS.slice(0, 4).map(({ name, color, bg, border, icon }) => (
              <div key={name} style={{ borderRadius: "16px", padding: "16px", background: bg, border: `1px solid ${border}` }}>
                <div style={{ width: "36px", height: "36px", background: bg, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>{icon}</div>
                <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "12px", color, lineHeight: 1.3 }}>{name}</p>
              </div>
            ))}
          </div>
          {/* ZAI preview card */}
          <div style={{ borderRadius: "16px", padding: "16px 20px", background: "rgba(123,97,255,0.06)", border: "1px solid rgba(123,97,255,0.15)", display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg,#7B61FF,#468BFF)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: "18px" }}>✦</span>
            </div>
            <div>
              <p style={{ fontSize: "11px", color: "#A78BFA", fontWeight: 700, marginBottom: "4px" }}>ZAI · Tu tutor IA</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>Hola! ¿Listo para explorar cómo funciona la IA? →</p>
            </div>
          </div>
        </div>
      </section>

      {/* WORLDS SECTION */}
      <section className="section-worlds" style={{ padding: "56px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", textAlign: "center", marginBottom: "8px", color: "rgba(255,255,255,0.2)" }}>
          9 niveles · 84 mundos de aprendizaje
        </p>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "24px", textAlign: "center", marginBottom: "32px", color: "#F8FAFF" }}>
          Un camino completo, desde cero
        </h2>
        <div className="worlds-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", maxWidth: "400px", margin: "0 auto" }}>
          {WORLDS.map(({ name, color, bg, border, icon }) => (
            <div key={name} style={{ borderRadius: "16px", padding: "14px", background: bg, border: `1px solid ${border}` }}>
              <div style={{ width: "34px", height: "34px", background: bg, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>{icon}</div>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "11px", color, lineHeight: 1.3 }}>{name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LEVELS SECTION */}
      <section style={{ padding: "56px 24px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", textAlign: "center", marginBottom: "8px", color: "rgba(255,255,255,0.2)" }}>Progresión</p>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "24px", textAlign: "center", marginBottom: "32px" }}>
          De Origins a Residency
        </h2>
        <div className="levels-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", maxWidth: "700px", margin: "0 auto" }}>
          {LEVELS.map(({ label, color }) => (
            <div key={label} style={{ borderRadius: "12px", padding: "12px 14px", background: `${color}0d`, border: `1px solid ${color}22`, textAlign: "center" }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "12px", color }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "56px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "24px", textAlign: "center", marginBottom: "32px" }}>
          Por qué Bymyzai
        </h2>
        <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px", maxWidth: "820px", margin: "0 auto" }}>
          {[
            { color: "#7B61FF", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#7B61FF" strokeWidth="1.8"/><path d="M5 20C5 17.2 8.1 15 12 15C15.9 15 19 17.2 19 20" stroke="#7B61FF" strokeWidth="1.8" strokeLinecap="round"/><path d="M17 4.5C18.2 5.1 19 6.4 19 8" stroke="#7B61FF" strokeWidth="1.8" strokeLinecap="round"/><circle cx="19" cy="3.5" r="1" fill="#7B61FF"/></svg>, title: "ZAI, tu tutor IA", desc: "Un mentor personal que recuerda tu progreso, adapta las explicaciones y te guía en cada paso." },
            { color: "#F2C04D", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="13" rx="3" stroke="#F2C04D" strokeWidth="1.8"/><path d="M6 12.5H10M8 10.5V14.5" stroke="#F2C04D" strokeWidth="1.8" strokeLinecap="round"/><circle cx="16" cy="12.5" r="1.2" fill="#F2C04D"/><circle cx="19" cy="12.5" r="1.2" fill="#F2C04D"/></svg>, title: "Gamificación real", desc: "XP, VY Coins, avatares, Boss Battles. Aprender se siente como jugar." },
            { color: "#36D399", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L15 8H21L16.5 12.5L18.5 19L12 15.5L5.5 19L7.5 12.5L3 8H9L12 2Z" stroke="#36D399" strokeWidth="1.8" strokeLinejoin="round"/></svg>, title: "Certificados verificables", desc: "Cada nivel completado genera un certificado público con código único verificable." },
            { color: "#468BFF", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#468BFF" strokeWidth="1.8"/><path d="M2 12H22" stroke="#468BFF" strokeWidth="1.8"/><path d="M12 2C9.5 5.5 8 8.5 8 12C8 15.5 9.5 18.5 12 22" stroke="#468BFF" strokeWidth="1.8"/><path d="M12 2C14.5 5.5 16 8.5 16 12C16 15.5 14.5 18.5 12 22" stroke="#468BFF" strokeWidth="1.8"/></svg>, title: "84 mundos de contenido", desc: "Desde fundamentos hasta investigación. Un recorrido completo y progresivo." },
            { color: "#FF7DAE", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3L4 7V12C4 16.4 7.6 20.5 12 21C16.4 20.5 20 16.4 20 12V7L12 3Z" stroke="#FF7DAE" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 12L11 14L15 10" stroke="#FF7DAE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Aprende creando", desc: "Proyectos reales, Boss Battles, portfolio de evidencia. No solo teoría." },
            { color: "#26C6DA", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="10" rx="2" stroke="#26C6DA" strokeWidth="1.8"/><path d="M7 11V7C7 4.8 9.2 3 12 3C14.8 3 17 4.8 17 7V11" stroke="#26C6DA" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="16" r="1.5" fill="#26C6DA"/></svg>, title: "Empieza gratis", desc: "Origins y Explorer accesibles sin tarjeta de crédito. Crece a tu ritmo." },
          ].map(({ icon, color, title, desc }) => (
            <div key={title} style={{ borderRadius: "16px", padding: "20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>{icon}</div>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "14px", marginBottom: "6px", color: "#F8FAFF" }}>{title}</p>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: "64px 24px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "28px", marginBottom: "16px" }}>
          Tu futuro empieza hoy.
        </h2>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginBottom: "32px" }}>
          Gratis. Sin tarjeta. Sin excusas.
        </p>
        <Link href="/sign-up" style={{ display: "inline-block", padding: "18px 48px", borderRadius: "16px", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "16px", textDecoration: "none", background: "linear-gradient(135deg,#7B61FF,#8B5CF6)", color: "#fff" }}>
          Empezar gratis →
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "32px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="footer-inner" style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center", maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src="/logo.png" alt="Bymyzai" width={28} height={28} style={{ borderRadius: "50%" }} />
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "16px", letterSpacing: "2px" }}>Bymyzai</span>
          </div>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
            {[["Pricing","/pricing"],["Términos","/terms"],["Privacidad","/privacy"],["Disclaimer","/disclaimer"]].map(([label, href]) => (
              <Link key={href} href={href} style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>{label}</Link>
            ))}
          </div>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.15)" }}>© 2025 Carlos Eduardo Gonzalez Fernandez · Bymyzai</p>
        </div>
      </footer>
    </main>
  );
}
