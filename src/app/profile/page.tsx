"use client";
import { useEffect, useState, ReactElement } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import AvatarIcon, { FREE_AVATAR_IDS, PREMIUM_AVATAR_IDS } from "@/components/AvatarIcon";
import { isSoundEnabled, setSoundEnabled, playClick } from "@/lib/sounds";

const LEVEL_ICON: Record<string, string> = {
  "level-1": "🌱", "level-new-1": "🧭", "level-new-2": "🧠", "level-new-3": "🎨",
  "level-new-4": "🛠️", "level-new-5": "🏗️", "level-new-6": "🚀", "level-new-7": "🔬", "level-new-8": "🎓",
};

const WORLD_ICONS: Record<string, ReactElement> = {
  "🌱": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21V11"/><path d="M12 12c0-3.5-2.5-6-7-6.5C5.3 10 7.5 12.3 12 12Z"/><path d="M12 9c0-2.8 2-4.8 5.5-5.2C17.8 7.3 16 9.3 12 9Z"/></svg>,
  "🧭": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M15.2 8.8l-1.7 5.1-5.1 1.7 1.7-5.1 5.1-1.7Z"/></svg>,
  "🧠": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 4.5c-2 0-3.5 1.5-3.5 3.5-1.3.4-2 1.6-2 3s.7 2.7 2 3.1c0 2.1 1.5 3.9 3.5 3.9M8.5 4.5c1.3 0 2.4.7 3 1.7M8.5 4.5v13.5M15.5 4.5c2 0 3.5 1.5 3.5 3.5 1.3.4 2 1.6 2 3s-.7 2.7-2 3.1c0 2.1-1.5 3.9-3.5 3.9M15.5 4.5c-1.3 0-2.4.7-3 1.7M15.5 4.5v13.5"/><circle cx="12" cy="12" r="0.6" fill="currentColor" stroke="none"/></svg>,
  "🎨": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3.5C7.3 3.5 3.5 7.3 3.5 12c0 4.4 3.6 8.5 8.5 8.5.9 0 1.3-.5 1.3-1.1 0-.4-.1-.7-.4-.9-.2-.3-.4-.6-.4-.9 0-.6.5-1.1 1.1-1.1h1.4c3 0 5.5-2.5 5.5-5.5 0-4.1-3.6-7.5-8.5-7.5Z"/><circle cx="8" cy="10.5" r="1" fill="currentColor" stroke="none"/><circle cx="10.5" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="7.5" r="1" fill="currentColor" stroke="none"/></svg>,
  "🛠️": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 6.2a3.5 3.5 0 0 0-4.6 4.3L4.5 15.9v3.6h3.6l5.4-5.4a3.5 3.5 0 0 0 4.3-4.6L15.5 12l-3.5-3.5 2.5-2.3Z"/></svg>,
  "🏗️": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V10l5-2.5V20M9 20V4.5L14 2v18M14 20V9l5-1.5V20"/><path d="M3 20h18"/></svg>,
  "🚀": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.5c2.8 1.6 4.5 4.9 4.5 8.3 0 1.9-.6 3.6-1.6 5L12 19l-2.9-3.2c-1-1.4-1.6-3.1-1.6-5 0-3.4 1.7-6.7 4.5-8.3Z"/><circle cx="12" cy="10.5" r="1.5"/><path d="M8.8 16.2L6.5 20.5l3-1.3M15.2 16.2l2.3 4.3-3-1.3"/></svg>,
  "🔬": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3.5v6L6.3 16.8A2.3 2.3 0 0 0 8.3 20.2h7.4a2.3 2.3 0 0 0 2-3.4L14 9.5v-6"/><path d="M8.7 3.5h6.6M7.5 15h9"/><circle cx="12" cy="17.3" r="0.6" fill="currentColor" stroke="none"/></svg>,
  "🎓": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 9L12 4.5 21.5 9 12 13.5 2.5 9Z"/><path d="M6.5 11v5c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-5"/><path d="M21.5 9v6"/></svg>,
  "🏆": <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4.5h10v4.5a5 5 0 0 1-10 0V4.5Z"/><path d="M7 6H4.8A1.3 1.3 0 0 0 3.5 7.3v.4a3.2 3.2 0 0 0 3.2 3.2H7M17 6h2.2a1.3 1.3 0 0 1 1.3 1.3v.4a3.2 3.2 0 0 1-3.2 3.2H17"/><path d="M12 13.5v3M9.2 19.5h5.6c-.1-1.5-.5-2.3-1-2.7h-3.6c-.5.4-.9 1.2-1 2.7Z"/></svg>,
};
function renderWorldIcon(emoji: string, size = 20) {
  const icon = WORLD_ICONS[emoji];
  if (icon) return icon;
  return <span style={{ fontSize: `${size}px` }}>{emoji}</span>;
}

interface Gamification { xpTotal: number; rank: string; rankLevel: number; streakDays: number; lessonsCompleted: number; gems: number; vyCoins: number; }
interface Achievement { achievement: { emoji: string; name: string; description: string; rarity: string }; earnedAt: string; }

const RANK_CONFIG: Record<string, { color: string; label: string }> = {
  NOVICE: { color: "#7E8798", label: "Novato" }, EXPLORER: { color: "#7B61FF", label: "Explorer" },
  CREATOR: { color: "#26C6DA", label: "Creator" }, BUILDER: { color: "#36D399", label: "Builder" },
  INNOVATOR: { color: "#F2C04D", label: "Innovator" }, VISIONARY: { color: "#F472B6", label: "Visionary" },
  PIONEER: { color: "#FB923C", label: "Pioneer" }, MASTER: { color: "#A78BFA", label: "Master" },
  LEGEND: { color: "#FF6B6B", label: "Legend" }, AI_TITAN: { color: "#F2C04D", label: "AI Titan" },
};

function NavBar() {
  const ACCENT = "#7B61FF";
  const items = [
    { href: "/dashboard", label: "Inicio", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 10.5L12 3L21 10.5V20C21 20.6 20.6 21 20 21H15V15H9V21H4C3.4 21 3 20.6 3 20V10.5Z" strokeWidth="1.8" strokeLinejoin="round"/></svg> },
    { href: "/worlds", label: "Mundos", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="8.5" strokeWidth="1.8"/><ellipse cx="12" cy="12" rx="3.5" ry="8.5" strokeWidth="1.5"/><path d="M4 9.5H20M4 14.5H20" strokeWidth="1.3" strokeLinecap="round"/></svg> },
    { href: "/vy", label: "ZAI", icon: <svg width="18" height="18" viewBox="0 0 24 24"><defs><radialGradient id="zaiOrbNav" cx="35%" cy="30%" r="75%"><stop offset="0%" stopColor="#C4B5FD"/><stop offset="50%" stopColor="#7B61FF"/><stop offset="100%" stopColor="#4C3AA8"/></radialGradient></defs><circle cx="12" cy="12" r="10" fill="url(#zaiOrbNav)"/><path d="M8.5 8.2H15.5L8.5 15.8H15.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg> },
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
  const [avatarId, setAvatarId] = useState("orb-1");
  const [plan, setPlan] = useState<string>("STARTER");
  const [currentLevel, setCurrentLevel] = useState<{ id: string; name: string } | null>(null);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [unlockedAvatars, setUnlockedAvatars] = useState<string[]>([]);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [loading, setLoading] = useState(true);
  const [certMsg, setCertMsg] = useState<Record<string, string>>({});
  const [certLoading, setCertLoading] = useState<string | null>(null);

  const LEVELS = [
    { id: "level-1", label: "Nivel 0 — Origins" },
    { id: "level-new-1", label: "Nivel 1 — Explorer" },
    { id: "level-new-2", label: "Nivel 2 — Thinker" },
    { id: "level-new-3", label: "Nivel 3 — Creator" },
    { id: "level-new-4", label: "Nivel 4 — Builder" },
    { id: "level-new-5", label: "Nivel 5 — Architect" },
    { id: "level-new-6", label: "Nivel 6 — Founder" },
    { id: "level-new-7", label: "Nivel 7 — Researcher" },
    { id: "level-new-8", label: "Nivel 8 — Residency" },
  ];

  async function selectAvatar(id: string, price = 0) {
    if (price > 0 && !unlockedAvatars.includes(id)) {
      if ((gamification?.vyCoins ?? 0) < price) return;
      const res = await fetch("/api/shop/avatar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ avatar: id }) });
      if (!res.ok) return;
      const data = await res.json();
      setUnlockedAvatars(u => [...u, id]);
      setGamification(g => g ? { ...g, vyCoins: g.vyCoins - (data.spent ?? 0) } : g);
    }
    setAvatarSaving(true);
    await fetch("/api/user", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ avatarEmoji: id }) });
    setAvatarId(id);
    setAvatarSaving(false);
    setAvatarPickerOpen(false);
  }

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

  useEffect(() => { setSoundOn(isSoundEnabled()); }, []);

  useEffect(() => {
    async function load() {
      try {
        const [gamRes, userRes] = await Promise.all([fetch("/api/gamification"), fetch("/api/user")]);
        if (gamRes.ok) {
          const d = await gamRes.json();
          setGamification(d.gamification);
          setAchievements(d.achievements ?? []);
          const lvl = d.recentLessons?.[0]?.lesson?.world?.level;
          setCurrentLevel(lvl ? { id: lvl.id, name: lvl.name } : { id: "level-1", name: "Origins" });
        }
        if (userRes.ok) {
          const d = await userRes.json();
          if (d.user?.avatarEmoji) setAvatarId(d.user.avatarEmoji);
          if (d.user?.unlockedAvatars) setUnlockedAvatars(d.user.unlockedAvatars);
          setPlan(d.user?.subscription?.plan ?? "STARTER");
        }
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
          <button onClick={() => setAvatarPickerOpen(true)} style={{ width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(123,97,255,0.12)", border: `2px solid ${rankCfg.color}`, flexShrink: 0, overflow: "hidden", padding: 0, cursor: "pointer", position: "relative" }}>
            <AvatarIcon id={avatarId} size={60} />
            <span style={{ position: "absolute", bottom: "-2px", right: "-2px", width: "18px", height: "18px", borderRadius: "50%", background: "#7B61FF", border: "2px solid #0F1420", fontSize: "9px", display: "flex", alignItems: "center", justifyContent: "center" }}>✎</span>
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "17px", color: "#fff", marginBottom: "2px" }}>{user?.fullName ?? "Estudiante"}</h1>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "6px", fontFamily: "'DM Sans',sans-serif" }}>@{user?.username ?? user?.firstName?.toLowerCase() ?? "usuario"}</p>
            <span style={{ fontSize: "9px", padding: "2px 8px", borderRadius: "8px", fontWeight: 700, background: `${rankCfg.color}18`, color: rankCfg.color, border: `1px solid ${rankCfg.color}33`, fontFamily: "'DM Sans',sans-serif" }}>{rankCfg.label} · Lv.{gamification?.rankLevel ?? 1}</span>
          </div>
          <button
            onClick={() => { const next = !soundOn; setSoundOn(next); setSoundEnabled(next); if (next) playClick(); }}
            style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid #324055", background: "#1E2533", color: soundOn ? "#F8FAFF" : "#7E8798", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            aria-label={soundOn ? "Silenciar sonidos" : "Activar sonidos"}
          >
            {soundOn ? "🔊" : "🔇"}
          </button>
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

        {/* Nivel actual */}
        <Link href={`/worlds?levelId=${currentLevel?.id ?? "level-1"}`} style={{ textDecoration: "none" }}>
          <div style={{ background: "rgba(123,97,255,0.07)", border: "1px solid rgba(123,97,255,0.15)", borderRadius: "16px", padding: "14px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", background: "rgba(123,97,255,0.1)", border: "1px solid rgba(123,97,255,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>{renderWorldIcon(LEVEL_ICON[currentLevel?.id ?? "level-1"] ?? "🌱", 20)}</div>
            <div>
              <p style={{ fontWeight: 700, fontSize: "13px", color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>Nivel {currentLevel?.name ?? "Origins"}</p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif" }}>Donde vas ahora — toca para continuar</p>
            </div>
          </div>
        </Link>

        {/* Certificado */}
        <div style={{ background: "rgba(123,97,255,0.08)", border: "1px solid rgba(123,97,255,0.2)", borderRadius: "16px", padding: "14px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", background: "rgba(123,97,255,0.12)", border: "1px solid rgba(123,97,255,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🎓</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: "13px", color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>Certificados</p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif" }}>Completa un nivel para obtener tu certificado</p>
          </div>
          <Link href="/worlds" style={{ padding: "6px 12px", background: "#7B61FF", color: "#fff", borderRadius: "10px", fontSize: "11px", fontWeight: 700, textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>Ir →</Link>
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
              <div style={{ width: "44px", height: "44px", margin: "0 auto 10px", borderRadius: "14px", background: "rgba(123,97,255,0.12)", border: "1px solid rgba(123,97,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A78BFA" }}>{renderWorldIcon("🏆", 24)}</div>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#fff", marginBottom: "4px", fontFamily: "'DM Sans',sans-serif" }}>Sin logros aún</p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>Completa lecciones para desbloquear logros</p>
            </div>
          )}
      </section>

        <section>
          <div style={{ display: "flex", gap: "8px", padding: "0 4px" }}>
            <Link href="/terms" style={{ fontSize: "11px", color: "#7E8798", textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>Términos de Servicio</Link>
            <span style={{ color: "#324055" }}>·</span>
            <Link href="/privacy" style={{ fontSize: "11px", color: "#7E8798", textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>Privacidad</Link>
            <span style={{ color: "#324055" }}>·</span>
            <Link href="/disclaimer" style={{ fontSize: "11px", color: "#7E8798", textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>Disclaimer</Link>
          </div>
        </section>
      </div>

      {avatarPickerOpen && (
        <div onClick={() => setAvatarPickerOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#1E2533", border: "1px solid #324055", borderRadius: "18px 18px 0 0", padding: "20px", width: "100%", maxWidth: "480px", maxHeight: "70vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px" }}>
            <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "15px" }}>Elige tu avatar</p>
            <div>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "#7E8798", marginBottom: "8px" }}>GRATIS</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {FREE_AVATAR_IDS.map(id => (
                  <button key={id} disabled={avatarSaving} onClick={() => selectAvatar(id)} style={{ width: "48px", height: "48px", borderRadius: "12px", padding: 0, background: avatarId === id ? "rgba(123,97,255,0.25)" : "#161C27", border: avatarId === id ? "1px solid #7B61FF" : "1px solid #324055", cursor: "pointer", overflow: "hidden" }}><AvatarIcon id={id} size={48} /></button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#7E8798" }}>PREMIUM</p>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#F2C04D" }}>🪙 {gamification?.vyCoins ?? 0}</span>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {PREMIUM_AVATAR_IDS.map(([id, price]) => {
                  const owned = unlockedAvatars.includes(id);
                  return (
                    <button key={id} disabled={avatarSaving} onClick={() => selectAvatar(id, price)} style={{ position: "relative", width: "48px", height: "48px", borderRadius: "12px", padding: 0, background: avatarId === id ? "rgba(123,97,255,0.25)" : "#161C27", border: avatarId === id ? "1px solid #7B61FF" : "1px solid #324055", cursor: "pointer", opacity: owned ? 1 : 0.6, overflow: "hidden" }}>
                      <AvatarIcon id={id} size={48} />
                      {!owned && <span style={{ position: "absolute", bottom: "-4px", right: "-4px", fontSize: "8px", background: "#F2C04D", color: "#000", borderRadius: "6px", padding: "1px 4px", fontWeight: 700 }}>{price}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            <button onClick={() => setAvatarPickerOpen(false)} style={{ padding: "10px", background: "#324055", color: "#fff", border: "none", borderRadius: "10px", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Cerrar</button>
          </div>
        </div>
      )}

      <NavBar />
    </div>
  );
}
