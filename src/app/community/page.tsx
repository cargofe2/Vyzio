"use client";
import Link from "next/link";

const DS = {
  bg: "#080B14",
  card: "rgba(99,102,241,0.05)",
  cardBorder: "rgba(99,102,241,0.1)",
  accent: "#6366F1",
  accentLight: "#818CF8",
  text: "#fff",
  textSub: "rgba(255,255,255,0.4)",
  textMuted: "rgba(255,255,255,0.2)",
};

export default function CommunityPage() {
  return (
    <div style={{ minHeight: "100vh", background: DS.bg, paddingBottom: "80px" }}>

      {/* Header */}
      <div style={{
        background: "rgba(8,11,20,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${DS.cardBorder}`,
        padding: "14px 16px",
      }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, color: DS.text, fontSize: "18px", marginBottom: "2px" }}>
          Liga VYZIO 🏆
        </h1>
        <p style={{ fontSize: "11px", color: DS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
          Ranking · Proyectos · Equipos
        </p>
      </div>

      {/* Coming soon */}
      <div style={{ padding: "48px 24px", textAlign: "center" }}>
        <div style={{
          width: "72px", height: "72px",
          background: "rgba(99,102,241,0.1)",
          border: `1px solid ${DS.cardBorder}`,
          borderRadius: "20px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "32px", margin: "0 auto 16px",
        }}>🏆</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: DS.text, fontSize: "18px", marginBottom: "8px" }}>
          Próximamente
        </h2>
        <p style={{ fontSize: "13px", color: DS.textSub, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, marginBottom: "24px", maxWidth: "280px", margin: "0 auto 24px" }}>
          La comunidad se activa cuando publiques tu primer proyecto. Completa lecciones para desbloquearla.
        </p>
        <Link href="/worlds" style={{
          display: "inline-block",
          padding: "12px 24px",
          background: DS.accent,
          color: "#fff",
          borderRadius: "14px",
          fontWeight: 700,
          fontSize: "13px",
          textDecoration: "none",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Ir a aprender →
        </Link>
      </div>

      {/* Bottom Nav */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(8,11,20,0.95)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: `1px solid ${DS.cardBorder}`,
        display: "flex",
      }}>
        {[
          { href: "/dashboard", icon: "🏠", label: "Inicio",  active: false },
          { href: "/worlds",    icon: "🌍", label: "Mundos",  active: false },
          { href: "/vy",        icon: "🤖", label: "VY",      active: false },
          { href: "/community", icon: "👥", label: "Liga",    active: true  },
          { href: "/profile",   icon: "👤", label: "Perfil",  active: false },
        ].map(({ href, icon, label, active }) => (
          <Link key={href} href={href} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0 8px", gap: "3px", textDecoration: "none", position: "relative" }}>
            {active && <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "16px", height: "2px", background: DS.accent, borderRadius: "0 0 3px 3px" }} />}
            <span style={{ fontSize: "19px", lineHeight: 1 }}>{icon}</span>
            <span style={{ fontSize: "9px", fontWeight: active ? 700 : 500, color: active ? "#818CF8" : "rgba(255,255,255,0.2)", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
