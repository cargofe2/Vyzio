"use client";
import { useEffect, useState, ReactElement } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

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
};
function renderWorldIcon(emoji: string, size = 20) {
  const icon = WORLD_ICONS[emoji];
  if (icon) return icon;
  return <span style={{ fontSize: `${size}px` }}>{emoji}</span>;
}

function NavBar({ active }: { active: string }) {
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
  const [worlds, setWorlds] = useState<World[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;
    async function loadData() {
      try {
        await fetch("/api/user");
        const [gamRes, worldRes] = await Promise.all([
          fetch("/api/gamification"),
          fetch("/api/lessons?levelId=level-1"),
        ]);
        if (gamRes.ok) {
          const { gamification: g, missions: m } = await gamRes.json();
          setGamification(g);
          setMissions(m ?? []);
        }
        if (worldRes.ok) {
          const { worlds: w } = await worldRes.json();
          setWorlds(w ?? []);
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
          <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg,#7B61FF,#468BFF)", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#fff", fontSize: "15px" }}>Z</span>
          </div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#F8FAFF", fontSize: "15px", letterSpacing: "0.5px" }}>BYZAI</span>
          <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "10px", fontWeight: 700, background: `${rankColor}22`, color: rankColor, fontFamily: "'DM Sans',sans-serif" }}>
            {rank}
          </span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Hero */}
      <div style={{ padding: "16px" }}>
        <p style={{ color: "#7E8798", fontSize: "12px", marginBottom: "4px", fontFamily: "'DM Sans',sans-serif" }}>
          Hola, {user?.firstName ?? "Estudiante"} 👋
        </p>
        <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#F8FAFF", fontSize: "20px", marginBottom: "16px" }}>
          ¿Qué aprendemos hoy?
        </p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "6px", marginBottom: "14px" }}>
          {[
            { v: xp.toLocaleString(), l: "XP", c: "#F2C04D" },
            { v: `💎 ${gamification?.gems ?? 0}`, l: "Gemas", c: "#7B61FF" },
            { v: `${gamification?.lessonsCompleted ?? 0}`, l: "Lecciones", c: "#26C6DA" },
            { v: `🔥 ${gamification?.streakDays ?? 0}`, l: "Racha", c: "#F472B6" },
          ].map(({ v, l, c }) => (
            <div key={l} style={{ background: "#1E2533", border: "1px solid #324055", borderRadius: "14px", padding: "10px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "15px", color: c }}>{v}</div>
              <div style={{ fontSize: "9px", color: "#7E8798", marginTop: "2px", fontFamily: "'DM Sans',sans-serif" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* XP Bar */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontSize: "10px", color: "#7E8798", fontFamily: "'DM Sans',sans-serif" }}>{rank}</span>
            <span style={{ fontSize: "10px", color: rankColor, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
              {xp.toLocaleString()} / {nextXP.toLocaleString()} XP
            </span>
          </div>
          <div style={{ height: "5px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(rankProgress, 100)}%`, background: `linear-gradient(90deg,${rankColor},#468BFF)`, borderRadius: "3px", transition: "width 0.5s ease" }} />
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Continuar */}
        {worlds.length > 0 && (
          <Link href={`/worlds`} style={{ textDecoration: "none" }}>
            <div style={{ background: "#1E2533", border: "1px solid #324055", borderRadius: "18px", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ fontSize: "26px" }}>{renderWorldIcon(worlds[0]?.emoji ?? "🌍", 26)}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: "#F8FAFF", fontSize: "14px", marginBottom: "2px", fontFamily: "'DM Sans',sans-serif" }}>
                  {worlds[0]?.name ?? "Bienvenido al Futuro"}
                </p>
                <p style={{ fontSize: "11px", color: "#7E8798", fontFamily: "'DM Sans',sans-serif" }}>
                  {worlds[0]?.lessonCount ?? 15} lecciones · Nivel 1
                </p>
              </div>
              <div style={{ padding: "8px 16px", background: "linear-gradient(135deg,#7B61FF,#468BFF)", borderRadius: "12px", fontWeight: 800, fontSize: "13px", color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>
                Ir →
              </div>
            </div>
          </Link>
        )}

        {/* Mundos */}
        <section>
          <h2 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#7E8798", marginBottom: "10px", fontFamily: "'DM Sans',sans-serif" }}>
            Nivel 1 — AI Explorer
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {(worlds.length > 0 ? worlds : [
              { id: "w1", name: "Bienvenido al Futuro", emoji: "🌍", lessonCount: 15, pctComplete: 0, order: 1 },
              { id: "w2", name: "Historia de la IA", emoji: "📜", lessonCount: 15, pctComplete: 0, order: 2 },
              { id: "w3", name: "IA en tu Vida", emoji: "🤖", lessonCount: 15, pctComplete: 0, order: 3 },
              { id: "w4", name: "Prompt Engineering", emoji: "⚡", lessonCount: 15, pctComplete: 0, order: 4 },
            ]).map(w => (
              <Link key={w.id} href={`/worlds?id=${w.id}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "#1E2533", borderRadius: "16px", padding: "12px", border: "1px solid #324055" }}>
                  <div style={{ fontSize: "20px", marginBottom: "6px", display: "flex" }}>{renderWorldIcon(w.emoji, 20)}</div>
                  <p style={{ fontWeight: 700, fontSize: "12px", color: "#F8FAFF", marginBottom: "6px", lineHeight: 1.3, fontFamily: "'DM Sans',sans-serif" }}>{w.name}</p>
                  <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", marginBottom: "4px" }}>
                    <div style={{ height: "100%", width: `${(w.pctComplete ?? 0) * 100}%`, background: "#7B61FF", borderRadius: "2px" }} />
                  </div>
                  <p style={{ fontSize: "9px", color: "#7E8798", fontFamily: "'DM Sans',sans-serif" }}>{w.lessonCount} lecciones</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Misiones */}
        {missions.length > 0 && (
          <section>
            <h2 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#7E8798", marginBottom: "10px", fontFamily: "'DM Sans',sans-serif" }}>
              Misiones activas
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {missions.map(m => (
                <div key={m.id} style={{ background: "#1E2533", borderRadius: "14px", padding: "12px", border: "1px solid #324055" }}>
                  <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "6px", background: m.type === "DAILY" ? "rgba(52,211,153,0.12)" : "rgba(123,97,255,0.12)", color: m.type === "DAILY" ? "#36D399" : "#7B61FF", fontFamily: "'DM Sans',sans-serif" }}>
                    {m.type === "DAILY" ? "Diaria" : "Semanal"}
                  </span>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "#F8FAFF", margin: "8px 0 6px", lineHeight: 1.3, fontFamily: "'DM Sans',sans-serif" }}>{m.name}</p>
                  <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", marginBottom: "4px" }}>
                    <div style={{ height: "100%", width: `${Math.min((m.progress.current / m.targetValue) * 100, 100)}%`, background: "#7B61FF", borderRadius: "2px" }} />
                  </div>
                  <p style={{ fontSize: "9px", color: "#7E8798", fontFamily: "'DM Sans',sans-serif" }}>{m.progress.current}/{m.targetValue} · +{m.xpReward} XP</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ZAI */}
        <div style={{ background: "#1E2533", border: "1px solid #324055", borderRadius: "18px", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", background: "rgba(123,97,255,0.15)", border: "2px solid #7B61FF", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "16px", color: "#7B61FF", flexShrink: 0 }}>Z</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, color: "#F8FAFF", fontSize: "13px", fontFamily: "'DM Sans',sans-serif" }}>ZAI — Tu tutor de IA</p>
            <p style={{ fontSize: "11px", color: "#7E8798", fontFamily: "'DM Sans',sans-serif" }}>Pregúntame cualquier cosa sobre IA</p>
          </div>
          <Link href="/vy" style={{ padding: "8px 14px", background: "linear-gradient(135deg,#7B61FF,#468BFF)", color: "#fff", borderRadius: "10px", fontSize: "12px", fontWeight: 700, textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>
            Hablar
          </Link>
        </div>

      </div>

      <NavBar active="/dashboard" />
    </div>
  );
}

