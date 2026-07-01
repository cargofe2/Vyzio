"use client";
import { useEffect, useState } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

interface Gamification { xpTotal: number; rank: string; rankLevel: number; streakDays: number; lessonsCompleted: number; gems: number; }
interface Achievement { achievement: { emoji: string; name: string; description: string; rarity: string }; earnedAt: string; }

const RANK_CONFIG: Record<string, { color: string; label: string }> = {
  NOVICE: { color: "#94A3B8", label: "Novato" }, EXPLORER: { color: "#818CF8", label: "Explorer" },
  CREATOR: { color: "#34D399", label: "Creator" }, BUILDER: { color: "#38BDF8", label: "Builder" },
  INNOVATOR: { color: "#FBBF24", label: "Innovator" }, VISIONARY: { color: "#F472B6", label: "Visionary" },
  PIONEER: { color: "#FB923C", label: "Pioneer" }, MASTER: { color: "#C084FC", label: "Master" },
  LEGEND: { color: "#F87171", label: "Legend" }, AI_TITAN: { color: "#FBBF24", label: "AI Titan" },
};

function NavBar() {
  const items = [
    { href: "/dashboard", label: "Inicio", color: "#7B61FF", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3L21 10.5V20C21 20.6 20.6 21 20 21H15V15H9V21H4C3.4 21 3 20.6 3 20V10.5Z" stroke="#7B61FF" strokeWidth="1.8" strokeLinejoin="round" strokeOpacity="0.5"/><path d="M13 9L11 12H13L10.5 15.5" stroke="#F5FF4D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4"/></svg> },
    { href: "/worlds", label: "Mundos", color: "#00D4FF", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="#00D4FF" strokeWidth="1.8" strokeOpacity="0.5"/><ellipse cx="12" cy="12" rx="3.5" ry="8.5" stroke="#00D4FF" strokeWidth="1.5" strokeOpacity="0.4"/><path d="M4 9.5H20M4 14.5H20" stroke="#00D4FF" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.3"/></svg> },
    { href: "/vy", label: "ZAI", color: "#00FFB3", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" stroke="#00FFB3" strokeWidth="1.8" strokeOpacity="0.5"/><path d="M8 8L12 16L16 8" stroke="#00FFB3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5"/></svg> },
    { href: "/community", label: "Liga", color: "#FBBF24", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="9" y="10" width="6" height="12" rx="1" stroke="#FBBF24" strokeWidth="1.8" strokeOpacity="0.5"/><rect x="2" y="14" width="6" height="8" rx="1" stroke="#FBBF24" strokeWidth="1.5" strokeOpacity="0.3"/><rect x="16" y="16" width="6" height="6" rx="1" stroke="#FBBF24" strokeWidth="1.5" strokeOpacity="0.3"/><path d="M12 2L13.1 5.3H16.6L13.7 7.4L14.8 10.7L12 8.5L9.2 10.7L10.3 7.4L7.4 5.3H10.9L12 2Z" stroke="#FBBF24" strokeWidth="1.3" strokeLinejoin="round" strokeOpacity="0.5"/></svg> },
    { href: "/profile", label: "Perfil", color: "#F472B6", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L20.5 7V17L12 22L3.5 17V7L12 2Z" stroke="#F472B6" strokeWidth="1.8" strokeLinejoin="round" strokeOpacity="0.5"/><circle cx="12" cy="9.5" r="2.5" stroke="#F472B6" strokeWidth="1.5" strokeOpacity="0.5"/><path d="M7.5 17C7.5 14.5 9.5 12.5 12 12.5C14.5 12.5 16.5 14.5 16.5 17" stroke="#F472B6" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5"/></svg> },
  ];
  return (
    <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(8,11,20,0.96)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid rgba(99,102,241,0.1)", display: "flex", padding: "6px 0" }}>
      {items.map(({ href, label, color, icon }) => {
        const isActive = href === "/profile";
        return (
          <Link key={href} href={href} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", textDecoration: "none", padding: "4px 0" }}>
            <div style={{ width: "40px", height: "40px", background: isActive ? `${color}20` : `${color}10`, border: `1px solid ${color}${isActive ? "40" : "20"}`, borderRadius: "13px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: isActive ? `0 0 12px ${color}40` : "none" }}>{icon}</div>
            <span style={{ fontSize: "8px", fontFamily: isActive ? "'Syne',sans-serif" : "'DM Sans',sans-serif", fontWeight: isActive ? 800 : 500, color: isActive ? color : "rgba(255,255,255,0.2)", letterSpacing: isActive ? "0.5px" : "0" }}>{isActive ? label.toUpperCase() : label}</span>
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

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/gamification");
        if (res.ok) { const d = await res.json(); setGamification(d.gamification); setAchievements(d.achievements ?? []); }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    if (isLoaded && user) load();
  }, [isLoaded, user]);

  if (!isLoaded) return <div style={{ minHeight: "100vh", background: "#0D111A", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: "28px" }}>⚡</span></div>;

  const rank = gamification?.rank ?? "NOVICE";
  const rankCfg = RANK_CONFIG[rank] ?? RANK_CONFIG.NOVICE;
  const xp = gamification?.xpTotal ?? 0;

  return (
    <div style={{ minHeight: "100vh", background: "#0D111A", paddingBottom: "88px" }}>

      {/* Header */}
      <div style={{ background: "rgba(8,11,20,0.93)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(99,102,241,0.1)", padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", background: "rgba(99,102,241,0.12)", border: `2px solid ${rankCfg.color}`, flexShrink: 0 }}>🧑‍💻</div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "17px", color: "#fff", marginBottom: "2px" }}>{user?.fullName ?? "Estudiante"}</h1>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "6px", fontFamily: "'DM Sans',sans-serif" }}>@{user?.username ?? user?.firstName?.toLowerCase() ?? "usuario"}</p>
            <span style={{ fontSize: "9px", padding: "2px 8px", borderRadius: "8px", fontWeight: 700, background: `${rankCfg.color}18`, color: rankCfg.color, border: `1px solid ${rankCfg.color}33`, fontFamily: "'DM Sans',sans-serif" }}>{rankCfg.label} · Lv.{gamification?.rankLevel ?? 1}</span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.1)", borderRadius: "14px", overflow: "hidden" }}>
          {[[String(gamification?.lessonsCompleted ?? 0), "Lecciones"], [xp.toLocaleString(), "XP Total"], [`🔥 ${gamification?.streakDays ?? 0}`, "Racha"]].map(([v, l], i) => (
            <div key={l} style={{ padding: "12px", textAlign: "center", borderLeft: i > 0 ? "1px solid rgba(99,102,241,0.1)" : "none" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "15px", color: "#fff" }}>{v}</div>
              <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)", marginTop: "2px", fontFamily: "'DM Sans',sans-serif" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>

        {/* Certificado */}
        <div style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "16px", padding: "14px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🎓</div>
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

        {/* Logros */}
        <section>
          <h2 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.25)", marginBottom: "10px", fontFamily: "'DM Sans',sans-serif" }}>Logros</h2>
          {loading ? (
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", textAlign: "center", fontFamily: "'DM Sans',sans-serif" }}>Cargando...</p>
          ) : achievements.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {achievements.map((a, i) => (
                <div key={i} style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.1)", borderRadius: "14px", padding: "12px" }}>
                  <div style={{ fontSize: "24px", marginBottom: "6px" }}>{a.achievement.emoji}</div>
                  <p style={{ fontWeight: 700, fontSize: "11px", color: "#fff", marginBottom: "2px", fontFamily: "'DM Sans',sans-serif" }}>{a.achievement.name}</p>
                  <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>{a.achievement.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.1)", borderRadius: "16px", padding: "24px", textAlign: "center" }}>
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
