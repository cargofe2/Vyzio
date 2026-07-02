"use client";
import { useEffect, useState } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

interface Gamification { xpTotal: number; rank: string; rankLevel: number; streakDays: number; lessonsCompleted: number; gems: number; }
interface Achievement { achievement: { emoji: string; name: string; description: string; rarity: string }; earnedAt: string; }

const RANK_CONFIG: Record<string, { color: string; label: string }> = {
  NOVICE: { color: "#94A3B8", label: "Novato" }, EXPLORER: { color: "#818CF8", label: "Explorer" },
  CREATOR: { color: "#34D399", label: "Creator" }, BUILDER: { color: "#38BDF8", label: "Builder" },
  INNOVATOR: { color: "#FB923C", label: "Innovator" }, VISIONARY: { color: "#F472B6", label: "Visionary" },
  PIONEER: { color: "#FB923C", label: "Pioneer" }, MASTER: { color: "#C084FC", label: "Master" },
  LEGEND: { color: "#F87171", label: "Legend" }, AI_TITAN: { color: "#FB923C", label: "AI Titan" },
};

function NavBar() {
  const ACCENT = "#7B61FF";
  const items = [
    { href: "/dashboard", label: "Inicio", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 10.5L12 3L21 10.5V20C21 20.6 20.6 21 20 21H15V15H9V21H4C3.4 21 3 20.6 3 20V10.5Z" strokeWidth="1.8" strokeLinejoin="round"/></svg> },
    { href: "/worlds", label: "Mundos", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="8.5" strokeWidth="1.8"/><ellipse cx="12" cy="12" rx="3.5" ry="8.5" strokeWidth="1.5"/><path d="M4 9.5H20M4 14.5H20" strokeWidth="1.3" strokeLinecap="round"/></svg> },
    { href: "/vy", label: "ZAI", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="4" strokeWidth="1.8"/><path d="M8 8L12 16L16 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { href: "/community", label: "Liga", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="9" y="10" width="6" height="12" rx="1" strokeWidth="1.8"/><rect x="2" y="14" width="6" height="8" rx="1" strokeWidth="1.5"/><rect x="16" y="16" width="6" height="6" rx="1" strokeWidth="1.5"/></svg> },
    { href: "/profile", label: "Perfil", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2L20.5 7V17L12 22L3.5 17V7L12 2Z" strokeWidth="1.8" strokeLinejoin="round"/><circle cx="12" cy="9.5" r="2.5" strokeWidth="1.5"/></svg> },
  ];
  return (
    <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(15,20,32,0.96)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid #2A3445", display: "flex", padding: "6px 0" }}>
      {items.map(({ href, label, icon }) => {
        const isActive = href === "/profile";
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

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [gamification, setGamification] = useState<Gamification | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [certMsg, setCertMsg] = useState<Record<string, string>>({});
  const [certLoading, setCertLoading] = useState<string | null>(null);

  const LEVELS = [
    { id: "level-1", label: "AI Foundations" },
    { id: "level-new-1", label: "AI Explorer" },
    { id: "level-new-2", label: "AI Thinker" },
    { id: "level-new-3", label: "AI Creator" },
  ];

  async function claimCertificate(levelId: string) {
    setCertLoading(levelId);
    try {
      const res = await fetch("/api/certificate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ levelId }) });
      const data = await res.json();
      if (res.ok) {
        setCertMsg(m => ({ ...m, [levelId]: `✓ Ver: /verify/${data.certificate.verificationCode}` }));
      } else {
        setCertMsg(m => ({ ...m, [levelId]: `Faltan ${data.total - data.completed} lecciones` }));
      }
    } catch { setCertMsg(m => ({ ...m, [levelId]: "Error, intenta de nuevo" })); }
    finally { setCertLoading(null); }
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/gamification");
        if (res.ok) { const d = await res.json(); setGamification(d.gamification); setAchievements(d.achievements ?? []); }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    if (isLoaded && user) load();
  }, [isLoaded, user]);

  if (!isLoaded) return <div style={{ minHeight: "100vh", background: "#0F1420", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: "28px" }}>⚡</span></div>;

  const rank = gamification?.rank ?? "NOVICE";
  const rankCfg = RANK_CONFIG[rank] ?? RANK_CONFIG.NOVICE;
  const xp = gamification?.xpTotal ?? 0;

  return (
    <div style={{ minHeight: "100vh", background: "#0F1420", paddingBottom: "88px" }}>

      {/* Header */}
      <div style={{ background: "rgba(15,20,32,0.93)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(123,97,255,0.1)", padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", background: "rgba(123,97,255,0.12)", border: `2px solid ${rankCfg.color}`, flexShrink: 0 }}>🧑‍💻</div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "17px", color: "#fff", marginBottom: "2px" }}>{user?.fullName ?? "Estudiante"}</h1>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "6px", fontFamily: "'DM Sans',sans-serif" }}>@{user?.username ?? user?.firstName?.toLowerCase() ?? "usuario"}</p>
            <span style={{ fontSize: "9px", padding: "2px 8px", borderRadius: "8px", fontWeight: 700, background: `${rankCfg.color}18`, color: rankCfg.color, border: `1px solid ${rankCfg.color}33`, fontFamily: "'DM Sans',sans-serif" }}>{rankCfg.label} · Lv.{gamification?.rankLevel ?? 1}</span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "rgba(123,97,255,0.06)", border: "1px solid rgba(123,97,255,0.1)", borderRadius: "14px", overflow: "hidden" }}>
          {[[String(gamification?.lessonsCompleted ?? 0), "Lecciones"], [xp.toLocaleString(), "XP Total"], [`🔥 ${gamification?.streakDays ?? 0}`, "Racha"]].map(([v, l], i) => (
            <div key={l} style={{ padding: "12px", textAlign: "center", borderLeft: i > 0 ? "1px solid rgba(123,97,255,0.1)" : "none" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "15px", color: "#fff" }}>{v}</div>
              <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)", marginTop: "2px", fontFamily: "'DM Sans',sans-serif" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>

        {/* Certificado */}
        <div style={{ background: "rgba(123,97,255,0.08)", border: "1px solid rgba(123,97,255,0.2)", borderRadius: "16px", padding: "14px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", background: "rgba(123,97,255,0.12)", border: "1px solid rgba(123,97,255,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🎓</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: "13px", color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>Certificado AI Explorer</p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif" }}>Completa el Nivel 1 para obtenerlo</p>
          </div>
          <Link href="/worlds" style={{ padding: "6px 12px", background: "#7B61FF", color: "#fff", borderRadius: "10px", fontSize: "11px", fontWeight: 700, textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>Ir →</Link>
        </div>

        {/* Gemas */}
        <div style={{ background: "rgba(196,181,253,0.07)", border: "1px solid rgba(196,181,253,0.15)", borderRadius: "16px", padding: "14px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", background: "rgba(196,181,253,0.1)", border: "1px solid rgba(196,181,253,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>💎</div>
          <div>
            <p style={{ fontWeight: 700, fontSize: "13px", color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>{gamification?.gems ?? 0} Gemas</p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif" }}>Ganas gemas con quizzes perfectos</p>
          </div>
        </div>

        {/* Certificados */}
        <section style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.25)", marginBottom: "10px", fontFamily: "'DM Sans',sans-serif" }}>Certificados</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {LEVELS.map(lvl => (
              <div key={lvl.id} style={{ background: "rgba(123,97,255,0.05)", border: "1px solid rgba(123,97,255,0.1)", borderRadius: "14px", padding: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>{lvl.label}</p>
                {certMsg[lvl.id] ? (
                  <p style={{ fontSize: "10px", color: certMsg[lvl.id].startsWith("✓") ? "#34D399" : "#FB923C", fontFamily: "'DM Sans',sans-serif" }}>{certMsg[lvl.id]}</p>
                ) : (
                  <button onClick={() => claimCertificate(lvl.id)} disabled={certLoading === lvl.id} style={{ padding: "6px 12px", borderRadius: "10px", background: "rgba(123,97,255,0.15)", border: "1px solid rgba(123,97,255,0.3)", color: "#C7D2FE", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                    {certLoading === lvl.id ? "..." : "Reclamar"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Logros */}
        <section>
          <h2 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.25)", marginBottom: "10px", fontFamily: "'DM Sans',sans-serif" }}>Logros</h2>
          {loading ? (
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", textAlign: "center", fontFamily: "'DM Sans',sans-serif" }}>Cargando...</p>
          ) : achievements.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {achievements.map((a, i) => (
                <div key={i} style={{ background: "rgba(123,97,255,0.05)", border: "1px solid rgba(123,97,255,0.1)", borderRadius: "14px", padding: "12px" }}>
                  <div style={{ fontSize: "24px", marginBottom: "6px" }}>{a.achievement.emoji}</div>
                  <p style={{ fontWeight: 700, fontSize: "11px", color: "#fff", marginBottom: "2px", fontFamily: "'DM Sans',sans-serif" }}>{a.achievement.name}</p>
                  <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>{a.achievement.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: "rgba(123,97,255,0.05)", border: "1px solid rgba(123,97,255,0.1)", borderRadius: "16px", padding: "24px", textAlign: "center" }}>
              <p style={{ fontSize: "28px", marginBottom: "8px" }}>🏆</p>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#fff", marginBottom: "4px", fontFamily: "'DM Sans',sans-serif" }}>Sin logros aún</p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>Completa lecciones para desbloquear logros</p>
            </div>
          )}
        </section>
      </div>
      <NavBar />
    </div>
  );
}
