import Link from "next/link";

export default function CommunityPage() {
  const items = [
    { href: "/dashboard", label: "Inicio", color: "#7B61FF" },
    { href: "/worlds", label: "Mundos", color: "#00D4FF" },
    { href: "/vy", label: "ZAI", color: "#00FFB3" },
    { href: "/community", label: "Liga", color: "#FBBF24" },
    { href: "/profile", label: "Perfil", color: "#F472B6" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0D111A", paddingBottom: "88px" }}>

      {/* Header */}
      <div style={{ background: "rgba(8,11,20,0.93)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(99,102,241,0.1)", padding: "14px 16px" }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#fff", fontSize: "18px", marginBottom: "2px" }}>Liga VYZIO 🏆</h1>
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>Ranking · Proyectos · Equipos</p>
      </div>

      {/* Coming soon */}
      <div style={{ padding: "48px 24px", textAlign: "center" }}>
        <div style={{ width: "72px", height: "72px", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 16px" }}>🏆</div>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#fff", fontSize: "18px", marginBottom: "8px" }}>Próximamente</h2>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.6, maxWidth: "280px", margin: "0 auto 24px" }}>
          La comunidad se activa cuando publiques tu primer proyecto. Completa lecciones para desbloquearla.
        </p>
        <Link href="/worlds" style={{ display: "inline-block", padding: "12px 24px", background: "linear-gradient(135deg,#7B61FF,#8B5CF6)", color: "#fff", borderRadius: "14px", fontWeight: 700, fontSize: "13px", textDecoration: "none", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 0 16px rgba(99,102,241,0.4)" }}>
          Ir a aprender →
        </Link>
      </div>

      {/* Navbar */}
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(8,11,20,0.96)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid rgba(99,102,241,0.1)", display: "flex", padding: "6px 0" }}>
        {items.map(({ href, label, color }) => {
          const isActive = href === "/community";
          return (
            <Link key={href} href={href} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", textDecoration: "none", padding: "4px 0" }}>
              <div style={{ width: "40px", height: "40px", background: isActive ? `${color}20` : `${color}10`, border: `1px solid ${color}${isActive ? "40" : "20"}`, borderRadius: "13px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", boxShadow: isActive ? `0 0 12px ${color}40` : "none" }}>
                {href === "/dashboard" ? "🏠" : href === "/worlds" ? "🌍" : href === "/vy" ? "🤖" : href === "/community" ? "🏆" : "👤"}
              </div>
              <span style={{ fontSize: "8px", fontFamily: isActive ? "'Syne',sans-serif" : "'DM Sans',sans-serif", fontWeight: isActive ? 800 : 500, color: isActive ? color : "rgba(255,255,255,0.2)", letterSpacing: isActive ? "0.5px" : "0" }}>{isActive ? label.toUpperCase() : label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
