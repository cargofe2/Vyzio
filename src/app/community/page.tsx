import Link from "next/link";

function NavBar() {
  const ACCENT = "#7B61FF";
  const items = [
    { href: "/dashboard", label: "Inicio", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 10.5L12 3L21 10.5V20C21 20.6 20.6 21 20 21H15V15H9V21H4C3.4 21 3 20.6 3 20V10.5Z" strokeWidth="1.8" strokeLinejoin="round"/></svg> },
    { href: "/worlds", label: "Mundos", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="8.5" strokeWidth="1.8"/><ellipse cx="12" cy="12" rx="3.5" ry="8.5" strokeWidth="1.5"/><path d="M4 9.5H20M4 14.5H20" strokeWidth="1.3" strokeLinecap="round"/></svg> },
    { href: "/vy", label: "ZAI", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="4" strokeWidth="1.8"/><path d="M8 8L12 16L16 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { href: "/community", label: "Liga", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4.5h10v4.5a5 5 0 0 1-10 0V4.5Z"/><path d="M7 6H4.8A1.3 1.3 0 0 0 3.5 7.3v.4a3.2 3.2 0 0 0 3.2 3.2H7M17 6h2.2a1.3 1.3 0 0 1 1.3 1.3v.4a3.2 3.2 0 0 1-3.2 3.2H17"/><path d="M12 13.5v3M9.2 19.5h5.6c-.1-1.5-.5-2.3-1-2.7h-3.6c-.5.4-.9 1.2-1 2.7Z"/></svg> },
    { href: "/profile", label: "Perfil", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2L20.5 7V17L12 22L3.5 17V7L12 2Z" strokeWidth="1.8" strokeLinejoin="round"/><circle cx="12" cy="9.5" r="2.5" strokeWidth="1.5"/></svg> },
  ];
  return (
    <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(15,20,32,0.96)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid #2A3445", display: "flex", padding: "6px 0" }}>
      {items.map(({ href, label, icon }) => {
        const isActive = href === "/community";
        return (
          <Link key={href} href={href} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", textDecoration: "none", padding: "4px 0" }}>
            <div style={{ width: "40px", height: "40px", background: isActive ? `${ACCENT}20` : "transparent", border: isActive ? `1px solid ${ACCENT}40` : "1px solid transparent", borderRadius: "13px", display: "flex", alignItems: "center", justifyContent: "center", color: isActive ? ACCENT : "#7E8798" }}>{icon}</div>
            <span style={{ fontSize: "8px", fontFamily: isActive ? "'Syne',sans-serif" : "'DM Sans',sans-serif", fontWeight: isActive ? 800 : 500, color: isActive ? ACCENT : "#7E8798", letterSpacing: isActive ? "0.5px" : "0" }}>{isActive ? label.toUpperCase() : label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function CommunityPage() {

  return (
    <div style={{ minHeight: "100vh", background: "#0F1420", paddingBottom: "88px" }}>

      {/* Header */}
      <div style={{ background: "rgba(15,20,32,0.93)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(123,97,255,0.1)", padding: "14px 16px" }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#F8FAFF", fontSize: "18px", marginBottom: "2px" }}>Liga BYZAI 🏆</h1>
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>Ranking · Proyectos · Equipos</p>
      </div>

      {/* Coming soon */}
      <div style={{ padding: "48px 24px", textAlign: "center" }}>
        <div style={{ width: "72px", height: "72px", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 16px" }}>🏆</div>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#fff", fontSize: "18px", marginBottom: "8px" }}>Próximamente</h2>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.6, maxWidth: "280px", margin: "0 auto 24px" }}>
          La comunidad se activa cuando publiques tu primer proyecto. Completa lecciones para desbloquearla.
        </p>
        <Link href="/worlds" style={{ display: "inline-block", padding: "12px 24px", background: "linear-gradient(135deg,#7B61FF,#8B5CF6)", color: "#fff", borderRadius: "14px", fontWeight: 700, fontSize: "13px", textDecoration: "none", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 0 16px rgba(123,97,255,0.4)" }}>
          Ir a aprender →
        </Link>
      </div>

      {/* Navbar */}
      <NavBar />
    </div>
  );
}
