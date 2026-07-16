"use client";
import { useEffect, useState, ReactElement } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const LEVEL_ICON: Record<string, string> = {
  "level-1": "🌱", "level-new-1": "🧭", "level-new-2": "🧠", "level-new-3": "🎨",
  "level-new-4": "🛠️", "level-new-5": "🏗️", "level-new-6": "🚀", "level-new-7": "🔬", "level-new-8": "🎓",
};

interface Gamification {
  xpTotal: number; xpWeekly: number; gems: number; vyCoins: number;
  rank: string; rankLevel: number; streakDays: number;
  lessonsCompleted: number;
}
interface Mission {
  id: string; name: string; type: string; xpReward: number;
  targetValue: number;
  progress: { current: number; completed: boolean };
}
interface World {
  id: string; name: string; emoji: string; lessonCount: number;
  pctComplete: number; order: number;
}

const RANK_COLORS: Record<string, string> = {
  NOVICE: "#7E8798", EXPLORER: "#7B61FF", CREATOR: "#26C6DA",
  BUILDER: "#36D399", INNOVATOR: "#F2C04D", VISIONARY: "#F472B6",
  PIONEER: "#FB923C", MASTER: "#A78BFA", LEGEND: "#FF6B6B", AI_TITAN: "#F2C04D",
};

const RANK_LABELS: Record<string, string> = {
  NOVICE: "Novato", EXPLORER: "Explorer", CREATOR: "Creator", BUILDER: "Builder",
  INNOVATOR: "Innovator", VISIONARY: "Visionary", PIONEER: "Pioneer", MASTER: "Master",
  LEGEND: "Legend", AI_TITAN: "AI Titan",
};

const RANK_NEXT_XP: Record<string, number> = {
  NOVICE: 500, EXPLORER: 2000, CREATOR: 6000, BUILDER: 15000,
  INNOVATOR: 30000, VISIONARY: 55000, PIONEER: 90000, MASTER: 140000,
  LEGEND: 200000, AI_TITAN: 999999,
};

const WORLD_ICONS: Record<string, ReactElement> = {
  "🎯": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.5" fill="currentColor"/><circle cx="20" cy="4" r="1.3" fill="currentColor" stroke="none"/></svg>,
  "🌍": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2.3 2.2 3.7 5 3.7 8s-1.4 5.8-3.7 8c-2.3-2.2-3.7-5-3.7-8s1.4-5.8 3.7-8Z"/></svg>,
  "📜": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h9a2.5 2.5 0 0 1 2.5 2.5V19a1.5 1.5 0 0 1-1.5 1.5H8A2.5 2.5 0 0 1 5.5 18V5.5A1.5 1.5 0 0 1 7 4"/><circle cx="6.2" cy="4.2" r="1.4"/><circle cx="6.2" cy="19.8" r="1.4"/><path d="M9 9h6M9 12.5h6M9 16h3.5"/></svg>,
  "🤖": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="9" width="14" height="10" rx="3"/><path d="M12 9V5.5"/><circle cx="12" cy="4" r="1.2" fill="currentColor" stroke="none"/><circle cx="9" cy="14" r="1.1" fill="currentColor" stroke="none"/><circle cx="15" cy="14" r="1.1" fill="currentColor" stroke="none"/><path d="M9 17.5h6M2.5 12.5v3M21.5 12.5v3"/></svg>,
  "⚡": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 3L5.5 13H10l-1 8L18 11h-4.5l-.5-8Z"/></svg>,
  "💊": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4.5" y="9" width="15" height="6" rx="3" transform="rotate(-45 12 12)"/><path d="M9.5 9.5L14.5 14.5"/></svg>,
  "🚗": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 15.5V12l1.8-4.2A2 2 0 0 1 8.1 6.5h7.8a2 2 0 0 1 1.8 1.3L19.5 12v3.5"/><path d="M4.5 15.5h15v2a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-1h-9v1a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1v-2Z"/><circle cx="8" cy="15.5" r="1.3"/><circle cx="16" cy="15.5" r="1.3"/><path d="M6.5 11h11"/></svg>,
  "🌱": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21V11"/><path d="M12 12c0-3.5-2.5-6-7-6.5C5.3 10 7.5 12.3 12 12Z"/><path d="M12 9c0-2.8 2-4.8 5.5-5.2C17.8 7.3 16 9.3 12 9Z"/></svg>,
  "⚖️": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v17M8.3 20h7.4"/><circle cx="12" cy="4.5" r="1.3" fill="currentColor" stroke="none"/><path d="M12 6.5L5.5 9l3.3 5.8L12 6.5ZM12 6.5l6.5 2.5-3.3 5.8L12 6.5Z"/></svg>,
  "🧭": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M15.2 8.8l-1.7 5.1-5.1 1.7 1.7-5.1 5.1-1.7Z"/></svg>,
  "🧠": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 4.5c-2 0-3.5 1.5-3.5 3.5-1.3.4-2 1.6-2 3s.7 2.7 2 3.1c0 2.1 1.5 3.9 3.5 3.9M8.5 4.5c1.3 0 2.4.7 3 1.7M8.5 4.5v13.5M15.5 4.5c2 0 3.5 1.5 3.5 3.5 1.3.4 2 1.6 2 3s-.7 2.7-2 3.1c0 2.1-1.5 3.9-3.5 3.9M15.5 4.5c-1.3 0-2.4.7-3 1.7M15.5 4.5v13.5"/></svg>,
  "🎨": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3.5C7.3 3.5 3.5 7.3 3.5 12c0 4.4 3.6 8.5 8.5 8.5.9 0 1.3-.5 1.3-1.1 0-.4-.1-.7-.4-.9-.2-.3-.4-.6-.4-.9 0-.6.5-1.1 1.1-1.1h1.4c3 0 5.5-2.5 5.5-5.5 0-4.1-3.6-7.5-8.5-7.5Z"/></svg>,
  "🛠️": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="15" rx="2"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  "🏗️": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V10l5-2.5V20M9 20V4.5L14 2v18M14 20V9l5-1.5V20"/><path d="M3 20h18"/></svg>,
  "🚀": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.5c2.8 1.6 4.5 4.9 4.5 8.3 0 1.9-.6 3.6-1.6 5L12 19l-2.9-3.2c-1-1.4-1.6-3.1-1.6-5 0-3.4 1.7-6.7 4.5-8.3Z"/><circle cx="12" cy="10.5" r="1.5"/></svg>,
  "🔬": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3.5v6L6.3 16.8A2.3 2.3 0 0 0 8.3 20.2h7.4a2.3 2.3 0 0 0 2-3.4L14 9.5v-6"/><path d="M8.7 3.5h6.6M7.5 15h9"/></svg>,
  "🎓": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 9L12 4.5 21.5 9 12 13.5 2.5 9Z"/><path d="M6.5 11v5c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-5"/><path d="M21.5 9v6"/></svg>,
};
function renderWorldIcon(emoji: string, size = 20) {
  const icon = WORLD_ICONS[emoji];
  if (icon) return icon;
  return <span style={{ fontSize: `${size}px` }}>{emoji}</span>;
}

const LEVEL_1_PALETTE: { color: string; bg: string; border: string; grad: string }[] = [
  { color: "#26C6DA", bg: "rgba(38,198,218,0.1)", border: "rgba(38,198,218,0.2)", grad: "linear-gradient(90deg,#26C6DA,#FB923C)" },
  { color: "#818CF8", bg: "rgba(123,97,255,0.1)", border: "rgba(123,97,255,0.18)", grad: "linear-gradient(90deg,#7B61FF,#8B5CF6)" },
  { color: "#FB923C", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.18)", grad: "linear-gradient(90deg,#FB923C,#EA580C)" },
  { color: "#00D4FF", bg: "rgba(0,212,255,0.1)", border: "rgba(0,212,255,0.18)", grad: "linear-gradient(90deg,#00D4FF,#0EA5E9)" },
  { color: "#A78BFA", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.18)", grad: "linear-gradient(90deg,#A78BFA,#7C3AED)" },
  { color: "#F472B6", bg: "rgba(244,114,182,0.1)", border: "rgba(244,114,182,0.18)", grad: "linear-gradient(90deg,#F472B6,#EC4899)" },
  { color: "#34D399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.18)", grad: "linear-gradient(90deg,#34D399,#10B981)" },
  { color: "#F87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.18)", grad: "linear-gradient(90deg,#F87171,#EF4444)" },
  { color: "#38BDF8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.18)", grad: "linear-gradient(90deg,#38BDF8,#0284C7)" },
  { color: "#4ADE80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.18)", grad: "linear-gradient(90deg,#4ADE80,#16A34A)" },
  { color: "#FB923C", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.18)", grad: "linear-gradient(90deg,#FB923C,#EA580C)" },
];
function getV(order: number) {
  if (order === 0) return LEVEL_1_PALETTE[0];
  return LEVEL_1_PALETTE[((order - 1) % (LEVEL_1_PALETTE.length - 1)) + 1];
}

function NavBar({ active }: { active: string }) {
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
        const isActive = href === active;
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

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [gamification, setGamification] = useState<Gamification | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [plan, setPlan] = useState<string>("STARTER");
  const [currentLevel, setCurrentLevel] = useState<{ id: string; name: string } | null>(null);
  const [levelPct, setLevelPct] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;
    async function loadData() {
      try {
        const userRes = await fetch("/api/user");
        if (userRes.status === 403) {
          const d = await userRes.json().catch(() => ({}));
          window.location.href = `/excluido?razon=${encodeURIComponent(d.reason ?? "")}`;
          return;
        }
        if (userRes.ok) {
          const { user: u } = await userRes.json();
          setPlan(u?.subscription?.plan ?? "STARTER");
        }
        const gamRes = await fetch("/api/gamification");
        if (gamRes.ok) {
          const { gamification: g, missions: m, recentLessons } = await gamRes.json();
          setGamification(g);
          setMissions(m ?? []);
          const lvl = recentLessons?.[0]?.lesson?.world?.level;
          const resolvedLevel = lvl ? { id: lvl.id, name: lvl.name } : { id: "level-1", name: "Origins" };
          setCurrentLevel(resolvedLevel);

          const worldsRes = await fetch(`/api/lessons?levelId=${resolvedLevel.id}`);
          if (worldsRes.ok) {
            const { worlds: lvlWorlds } = await worldsRes.json();
            if (lvlWorlds && lvlWorlds.length > 0) {
              const avgPct = lvlWorlds.reduce((sum: number, w: { pctComplete?: number }) => sum + (w.pctComplete ?? 0), 0) / lvlWorlds.length;
              setLevelPct(Math.round(avgPct * 100));
            }
          }
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isLoaded, user]);

  if (!isLoaded || loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0F1420", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", fontFamily: "'DM Sans',sans-serif" }}>Cargando...</p>
      </div>
    );
  }

  const rank = gamification?.rank ?? "NOVICE";
  const xp = gamification?.xpTotal ?? 0;
  const nextXP = RANK_NEXT_XP[rank] ?? 500;
  const prevXP = Object.values(RANK_NEXT_XP).filter(v => v <= xp).pop() ?? 0;
  const rankProgress = nextXP > prevXP ? ((xp - prevXP) / (nextXP - prevXP)) * 100 : 100;
  const rankColor = RANK_COLORS[rank] ?? "#7B61FF";

  return (
    <div style={{ minHeight: "100vh", background: "#0F1420", paddingBottom: "88px" }}>

      {/* TopBar */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(15,20,32,0.93)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(123,97,255,0.1)", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img src="/logo.png" alt="Bymyzai" width={32} height={32} style={{ borderRadius: "50%", flexShrink: 0 }} />
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#F8FAFF", fontSize: "15px", letterSpacing: "0.5px" }}>Bymyzai</span>
          <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "10px", fontWeight: 700, background: `${rankColor}22`, color: rankColor, fontFamily: "'DM Sans',sans-serif" }}>
            {RANK_LABELS[rank] ?? rank}
          </span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Hero — saludo */}
      <div style={{ padding: "14px 16px 0" }}>
        <p style={{ color: "#8B94A8", fontSize: "12px", fontFamily: "'DM Sans',sans-serif" }}>
          Hola, {user?.firstName ?? "Estudiante"} 👋
        </p>
      </div>

      {/* Misión actual — tarjeta grande */}
      <div style={{ padding: "10px 16px 0" }}>
        {(() => {
          const activeMission = missions[0];
          const missionHref = `/worlds?levelId=${currentLevel?.id ?? "level-1"}`;
          const LEVEL_ORDER = ["level-1", "level-new-1", "level-new-2", "level-new-3", "level-new-4", "level-new-5", "level-new-6", "level-new-7", "level-new-8"];
          const levelNumber = Math.max(0, LEVEL_ORDER.indexOf(currentLevel?.id ?? "level-1"));
          const heroPct = levelPct;
          return (
            <Link href={missionHref} style={{ textDecoration: "none" }}>
              <div style={{ background: "linear-gradient(160deg, #2A1F5C, #1A1440 60%, #0F1420)", border: "1px solid rgba(123,97,255,0.35)", borderRadius: "22px", padding: "18px", position: "relative", overflow: "hidden" }}>
                <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#F8FAFF", fontSize: "22px", lineHeight: 1.15, marginTop: "4px" }}>
                  {currentLevel?.name ?? "Origins"}
                </p>
                <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "rgba(255,255,255,0.5)", fontSize: "13px", marginBottom: "14px" }}>
                  Nivel {levelNumber} {activeMission ? `· ${activeMission.name}` : ""}
                </p>

                <div style={{ position: "absolute", top: "16px", right: "16px", width: "56px", height: "56px", borderRadius: "18px", background: rankColor + "26", border: `1px solid ${rankColor}55`, display: "flex", alignItems: "center", justifyContent: "center", color: rankColor }}>
                  {renderWorldIcon(LEVEL_ICON[currentLevel?.id ?? "level-1"] ?? "🌱", 28)}
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "6px" }}>
                  <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "26px", color: "#F8FAFF" }}>{heroPct}%</span>
                </div>
                <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden", marginBottom: "16px" }}>
                  <div style={{ height: "100%", width: `${heroPct}%`, background: "linear-gradient(90deg,#8B75FF,#468BFF)", borderRadius: "4px" }} />
                </div>

                <div style={{ padding: "13px", background: "linear-gradient(135deg,#8B75FF,#468BFF)", color: "#0B0E16", borderRadius: "13px", fontSize: "14px", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <span style={{ fontSize: "11px" }}>▶</span> Continuar
                </div>
              </div>
            </Link>
          );
        })()}
      </div>

      {/* ZAI — estilo prompt */}
      <div style={{ padding: "10px 16px 0" }}>
        <Link href="/vy" style={{ textDecoration: "none" }}>
          <div style={{ background: "#1E2533", border: "1px solid #324055", borderRadius: "18px", padding: "18px", display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ position: "relative", width: "44px", height: "44px", flexShrink: 0 }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "conic-gradient(from 0deg, #A78BFA, #7B61FF, #4C3AA8, #7B61FF, #A78BFA)", opacity: 0.9, animation: "spin 4s linear infinite" }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.5), transparent 45%)" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width={44 * 0.45} height={44 * 0.45} viewBox="0 0 256 256"><g transform="rotate(-12 128 128)"><path d="M78 88H178L82 168H178" stroke="#FFFFFF" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" fill="none"/></g></svg>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "10px", color: "#7E8798", fontFamily: "'DM Sans',sans-serif", marginBottom: "3px" }}>ZAI</p>
              <p style={{ fontSize: "14px", color: "#F8FAFF", fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>¿En qué quieres trabajar hoy?</p>
            </div>
            <span style={{ flexShrink: 0, padding: "9px 15px", background: "rgba(123,97,255,0.15)", border: "1px solid rgba(123,97,255,0.3)", borderRadius: "999px", fontSize: "12px", fontWeight: 700, color: "#A78BFA", fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>
              Hablar con ZAI
            </span>
          </div>
        </Link>
      </div>

      {/* Tu progreso */}
      <div style={{ padding: "10px 16px 0" }}>
        <Link href="/profile" style={{ textDecoration: "none" }}>
        <div style={{ background: "#1E2533", border: "1px solid #324055", borderRadius: "18px", padding: "18px", boxShadow: "0 4px 14px rgba(0,0,0,0.18)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#F8FAFF", fontFamily: "'DM Sans',sans-serif" }}>Tu progreso</p>
            <span style={{ fontSize: "12px", color: "#8B75FF", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>Ver más ›</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "13px", background: rankColor + "22", border: `1px solid ${rankColor}55`, display: "flex", alignItems: "center", justifyContent: "center", color: rankColor, flexShrink: 0 }}>{renderWorldIcon(LEVEL_ICON[currentLevel?.id ?? "level-1"] ?? "🌱", 22)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "#F8FAFF", fontFamily: "'DM Sans',sans-serif" }}>{RANK_LABELS[rank] ?? rank}</p>
              <p style={{ fontSize: "11px", color: "#8B94A8", fontFamily: "'DM Sans',sans-serif" }}>{xp.toLocaleString()} XP</p>
            </div>
            <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
              <span style={{ fontSize: "11px", color: "#26C6DA", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", background: "rgba(38,198,218,0.1)", padding: "4px 9px", borderRadius: "8px" }}>{gamification?.lessonsCompleted ?? 0} lecciones</span>
              <span style={{ fontSize: "11px", color: "#F472B6", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", background: "rgba(244,114,182,0.1)", padding: "4px 9px", borderRadius: "8px" }}>🔥 {gamification?.streakDays ?? 0}</span>
            </div>
          </div>
          <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(rankProgress, 100)}%`, background: `linear-gradient(90deg,${rankColor},#468BFF)`, borderRadius: "4px", transition: "width 0.5s ease" }} />
          </div>
          <p style={{ fontSize: "10px", color: "#8B94A8", fontFamily: "'DM Sans',sans-serif", marginTop: "6px", textAlign: "right" }}>{xp.toLocaleString()} / {nextXP.toLocaleString()} XP para el siguiente nivel</p>
        </div>
        </Link>
      </div>

      {/* ----- Debajo del primer viewport: info secundaria ----- */}

      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Niveles */}
        <section>
          <h2 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#8B94A8", marginBottom: "10px", fontFamily: "'DM Sans',sans-serif" }}>
            Tu camino
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {[
              { id: "level-1", label: "Origins", icon: "🌱", free: true },
              { id: "level-new-1", label: "Explorer", icon: "🧭", free: false },
              { id: "level-new-2", label: "Thinker", icon: "🧠", free: false },
              { id: "level-new-3", label: "Creator", icon: "🎨", free: false },
              { id: "level-new-4", label: "Builder", icon: "🛠️", free: false },
              { id: "level-new-5", label: "Architect", icon: "🏗️", free: false },
              { id: "level-new-6", label: "Founder", icon: "🚀", free: false },
              { id: "level-new-7", label: "Researcher", icon: "🔬", free: false },
              { id: "level-new-8", label: "Residency", icon: "🎓", free: false },
            ].map((lvl, i) => {
              const locked = !lvl.free && plan === "STARTER";
              const active = lvl.id === currentLevel?.id;
              const lv = getV(i === 0 ? 0 : i);
              const content = (
                <div style={{ background: "#1E2533", border: locked ? "1px solid #324055" : active ? `1px solid ${lv.border}` : "1px solid #324055", borderRadius: "18px", padding: "14px", position: "relative", overflow: "hidden", boxShadow: "0 4px 14px rgba(0,0,0,0.18)", opacity: locked ? 0.65 : 1 }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "12px", background: locked ? "rgba(255,255,255,0.04)" : lv.bg, border: locked ? "1px solid rgba(255,255,255,0.08)" : `1px solid ${lv.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: locked ? "rgba(255,255,255,0.3)" : lv.color, marginBottom: "10px", fontSize: "17px" }}>
                    {locked ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/><circle cx="12" cy="15.2" r="1.3" fill="currentColor" stroke="none"/></svg> : renderWorldIcon(lvl.icon, 18)}
                  </div>
                  <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "13px", color: locked ? "rgba(255,255,255,0.4)" : "#F8FAFF", lineHeight: 1.3 }}>
                    {lvl.label}{locked && <span style={{ fontSize: "9px", fontWeight: 700, color: "#A78BFA", marginLeft: "6px" }}>Pro</span>}
                  </p>
                </div>
              );
              return locked
                ? <Link key={lvl.id} href="/pricing" style={{ textDecoration: "none" }} title="Disponible en el plan Pro">{content}</Link>
                : <Link key={lvl.id} href={`/worlds?levelId=${lvl.id}`} style={{ textDecoration: "none" }}>{content}</Link>;
            })}
          </div>
        </section>

        {/* Misiones (restantes, sin repetir la promovida arriba) */}
        {missions.length > 1 && (
          <section>
            <h2 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#8B94A8", marginBottom: "10px", fontFamily: "'DM Sans',sans-serif" }}>
              Otras misiones activas
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {missions.slice(1).map(m => (
                <div key={m.id} style={{ background: "#1E2533", borderRadius: "16px", padding: "14px", border: "1px solid #324055", boxShadow: "0 4px 14px rgba(0,0,0,0.18)" }}>
                  <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "6px", background: m.type === "DAILY" ? "rgba(52,211,153,0.12)" : "rgba(123,97,255,0.12)", color: m.type === "DAILY" ? "#36D399" : "#8B75FF", fontFamily: "'DM Sans',sans-serif" }}>
                    {m.type === "DAILY" ? "Diaria" : "Semanal"}
                  </span>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "#F8FAFF", margin: "8px 0 6px", lineHeight: 1.3, fontFamily: "'DM Sans',sans-serif" }}>{m.name}</p>
                  <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", marginBottom: "4px" }}>
                    <div style={{ height: "100%", width: `${Math.min((m.progress.current / m.targetValue) * 100, 100)}%`, background: "#8B75FF", borderRadius: "2px" }} />
                  </div>
                  <p style={{ fontSize: "9px", color: "#8B94A8", fontFamily: "'DM Sans',sans-serif" }}>{m.progress.current}/{m.targetValue} · +{m.xpReward} XP</p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      <NavBar active="/dashboard" />
    </div>
  );
}
