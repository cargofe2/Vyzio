"use client";
import { useEffect, useState } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

interface Gamification {
  xpTotal: number; xpWeekly: number; gems: number;
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

const RANK_CONFIG: Record<string, { color: string; label: string; bg: string }> = {
  NOVICE:    { color: "#94A3B8", label: "Novato",    bg: "rgba(148,163,184,0.1)" },
  EXPLORER:  { color: "#818CF8", label: "Explorer",  bg: "rgba(129,140,248,0.1)" },
  CREATOR:   { color: "#34D399", label: "Creator",   bg: "rgba(52,211,153,0.1)"  },
  BUILDER:   { color: "#38BDF8", label: "Builder",   bg: "rgba(56,189,248,0.1)"  },
  INNOVATOR: { color: "#FBBF24", label: "Innovator", bg: "rgba(251,191,36,0.1)"  },
  VISIONARY: { color: "#F472B6", label: "Visionary", bg: "rgba(244,114,182,0.1)" },
  PIONEER:   { color: "#FB923C", label: "Pioneer",   bg: "rgba(251,146,60,0.1)"  },
  MASTER:    { color: "#C084FC", label: "Master",    bg: "rgba(192,132,252,0.1)" },
  LEGEND:    { color: "#F87171", label: "Legend",    bg: "rgba(248,113,113,0.1)" },
  AI_TITAN:  { color: "#FBBF24", label: "AI Titan",  bg: "rgba(251,191,36,0.1)"  },
};

const RANK_NEXT_XP: Record<string, number> = {
  NOVICE: 500, EXPLORER: 2000, CREATOR: 6000, BUILDER: 15000,
  INNOVATOR: 30000, VISIONARY: 55000, PIONEER: 90000,
  MASTER: 140000, LEGEND: 200000, AI_TITAN: 999999,
};
const RANK_PREV_XP: Record<string, number> = {
  NOVICE: 0, EXPLORER: 500, CREATOR: 2000, BUILDER: 6000,
  INNOVATOR: 15000, VISIONARY: 30000, PIONEER: 55000,
  MASTER: 90000, LEGEND: 140000, AI_TITAN: 200000,
};

function Skeleton({ w = "100%", h = "16px", r = "8px" }: { w?: string; h?: string; r?: string }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: "rgba(99,102,241,0.08)",
      animation: "shimmer 1.5s infinite",
      backgroundSize: "200% 100%",
    }} />
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
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isLoaded, user]);

  const rank = gamification?.rank ?? "NOVICE";
  const rankCfg = RANK_CONFIG[rank] ?? RANK_CONFIG.NOVICE;
  const xp = gamification?.xpTotal ?? 0;
  const nextXP = RANK_NEXT_XP[rank] ?? 500;
  const prevXP = RANK_PREV_XP[rank] ?? 0;
  const pct = nextXP > prevXP ? Math.min(((xp - prevXP) / (nextXP - prevXP)) * 100, 100) : 100;
  const RANKS = Object.keys(RANK_NEXT_XP);
  const nextRankLabel = RANK_CONFIG[RANKS[RANKS.indexOf(rank) + 1]]?.label ?? "AI Titan";

  if (!isLoaded || loading) return (
    <div style={{ minHeight: "100vh", background: "#080B14", paddingBottom: "80px" }}>
      <style>{`@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }`}</style>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(99,102,241,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Skeleton w="28px" h="28px" r="8px" />
          <Skeleton w="60px" h="12px" />
        </div>
        <Skeleton w="28px" h="28px" r="50%" />
      </div>
      <div style={{ padding: "16px" }}>
        <Skeleton w="100px" h="10px" r="5px" />
        <div style={{ marginTop: "8px", marginBottom: "16px" }}><Skeleton w="180px" h="20px" r="6px" /></div>
        <Skeleton h="64px" r="14px" />
        <div style={{ marginTop: "10px" }}><Skeleton h="40px" r="12px" /></div>
        <div style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {[1,2,3,4].map(i => <Skeleton key={i} h="90px" r="16px" />)}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#080B14", paddingBottom: "80px" }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .card:active { transform: scale(0.98); transition: transform 0.1s; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(8,11,20,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(99,102,241,0.1)",
        padding: "11px 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "28px", height: "28px",
            background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
              <path d="M4 16L10 4L16 16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.5 11H13.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, color: "#fff", fontSize: "14px", letterSpacing: "2.5px" }}>VYZIO</span>
          <div style={{
            padding: "2px 8px", borderRadius: "20px",
            background: rankCfg.bg,
            border: `1px solid ${rankCfg.color}33`,
            fontSize: "9px", fontWeight: 700, color: rankCfg.color,
          }}>{rankCfg.label}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {(gamification?.streakDays ?? 0) > 0 && (
            <div style={{
              padding: "3px 9px", borderRadius: "20px",
              background: "rgba(251,146,60,0.1)",
              border: "1px solid rgba(251,146,60,0.2)",
              fontSize: "10px", fontWeight: 700, color: "#FB923C",
              display: "flex", alignItems: "center", gap: "3px",
            }}>
              🔥 {gamification?.streakDays}
            </div>
          )}
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {/* ── HERO ── */}
      <div style={{ padding: "18px 16px 0", animation: "fadeUp 0.4s ease" }}>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", marginBottom: "3px", fontFamily: "'DM Sans', sans-serif" }}>
          Hola, {user?.firstName ?? "Estudiante"} 👋
        </p>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800, color: "#fff", fontSize: "20px",
          marginBottom: "16px", lineHeight: 1.2,
        }}>
          ¿Qué aprendemos hoy?
        </h1>

        {/* Stats */}
        <div style={{
          background: "rgba(99,102,241,0.06)",
          border: "1px solid rgba(99,102,241,0.12)",
          borderRadius: "16px",
          padding: "12px",
          marginBottom: "12px",
          display: "grid", gridTemplateColumns: "repeat(4,1fr)",
        }}>
          {[
            { v: xp >= 1000 ? `${(xp/1000).toFixed(1)}k` : xp, l: "XP", c: "#C7D2FE", e: "⚡" },
            { v: gamification?.gems ?? 0, l: "Gemas", c: "#C4B5FD", e: "💎" },
            { v: gamification?.lessonsCompleted ?? 0, l: "Clases", c: "#7DD3FC", e: "📚" },
            { v: `${gamification?.streakDays ?? 0}d`, l: "Racha", c: "#FCA5A5", e: "🔥" },
          ].map(({ v, l, c, e }, i) => (
            <div key={l} style={{
              textAlign: "center",
              borderLeft: i > 0 ? "1px solid rgba(99,102,241,0.12)" : "none",
              padding: "0 4px",
            }}>
              <div style={{ fontSize: "16px", marginBottom: "2px" }}>{e}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "13px", color: c }}>{v}</div>
              <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.25)", marginTop: "1px" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* XP Bar */}
        <div style={{
          background: "rgba(99,102,241,0.06)",
          border: "1px solid rgba(99,102,241,0.12)",
          borderRadius: "14px",
          padding: "10px 12px",
          marginBottom: "16px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "9px", color: rankCfg.color, fontWeight: 700, letterSpacing: "0.5px", fontFamily: "'Syne', sans-serif" }}>
              {rankCfg.label.toUpperCase()}
            </span>
            <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)" }}>
              {xp.toLocaleString()} / {nextXP.toLocaleString()} XP
            </span>
          </div>
          <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
            <div style={{
              height: "100%", width: `${pct}%`,
              background: `linear-gradient(90deg, ${rankCfg.color}, #A78BFA)`,
              borderRadius: "2px",
              transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
            }} />
          </div>
          <div style={{ marginTop: "4px", fontSize: "8px", color: "rgba(255,255,255,0.2)" }}>
            {Math.round(pct)}% hacia {nextRankLabel}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: "18px" }}>

        {/* Continue CTA */}
        {worlds.length > 0 && (
          <Link href={`/worlds?id=${worlds[0]?.id}`} style={{ textDecoration: "none" }}>
            <div className="card" style={{
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.18)",
              borderRadius: "18px",
              padding: "14px",
              display: "flex", alignItems: "center", gap: "12px",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: "-20px", right: "-20px",
                width: "70px", height: "70px",
                background: "radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)",
                borderRadius: "50%",
              }} />
              <div style={{
                width: "44px", height: "44px",
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: "14px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "22px", flexShrink: 0,
              }}>
                {worlds[0]?.emoji ?? "🌍"}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: "#fff", fontSize: "13px", marginBottom: "2px", fontFamily: "'DM Sans', sans-serif" }}>
                  {worlds[0]?.name ?? "Continuar"}
                </p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>
                  {worlds[0]?.lessonCount ?? 15} lecciones · Nivel 0
                </p>
                {(worlds[0]?.pctComplete ?? 0) > 0 && (
                  <div style={{ marginTop: "6px", height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
                    <div style={{ height: "100%", width: `${worlds[0].pctComplete * 100}%`, background: "#6366F1", borderRadius: "2px" }} />
                  </div>
                )}
              </div>
              <div style={{
                width: "30px", height: "30px",
                background: "#6366F1",
                borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: "14px", flexShrink: 0,
              }}>→</div>
            </div>
          </Link>
        )}

        {/* Worlds grid */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h2 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans', sans-serif" }}>
              Nivel 0 — AI Foundations
            </h2>
            <Link href="/worlds" style={{ fontSize: "11px", color: "#818CF8", fontWeight: 600, textDecoration: "none" }}>
              Ver todos →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {(worlds.length > 0 ? worlds : [
              { id: "w0", name: "Tu aventura comienza", emoji: "🚀", lessonCount: 1, pctComplete: 0, order: 0 },
              { id: "w1", name: "Fundamentos de IA", emoji: "🌍", lessonCount: 15, pctComplete: 0, order: 1 },
              { id: "w2", name: "Historia de la IA", emoji: "📜", lessonCount: 15, pctComplete: 0, order: 2 },
              { id: "w3", name: "IA en tu Vida", emoji: "🤖", lessonCount: 15, pctComplete: 0, order: 3 },
            ]).slice(0, 6).map(w => {
              const pctW = Math.round((w.pctComplete ?? 0) * 100);
              const done = pctW >= 100;
              return (
                <Link key={w.id} href={`/worlds?id=${w.id}`} style={{ textDecoration: "none" }}>
                  <div className="card" style={{
                    background: done ? "rgba(52,211,153,0.05)" : "rgba(99,102,241,0.05)",
                    border: done ? "1px solid rgba(52,211,153,0.18)" : "1px solid rgba(99,102,241,0.1)",
                    borderRadius: "16px",
                    padding: "13px",
                    cursor: "pointer",
                    position: "relative", overflow: "hidden",
                    transition: "all 0.2s",
                  }}>
                    {pctW > 0 && !done && (
                      <div style={{
                        position: "absolute", top: 0, left: 0,
                        width: `${pctW}%`, height: "2px",
                        background: "linear-gradient(90deg,#6366F1,#A78BFA)",
                      }} />
                    )}
                    {done && (
                      <div style={{
                        position: "absolute", top: "8px", right: "8px",
                        width: "18px", height: "18px",
                        background: "rgba(52,211,153,0.15)",
                        borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "10px", color: "#34D399",
                      }}>✓</div>
                    )}
                    <div style={{ fontSize: "22px", marginBottom: "7px" }}>{w.emoji}</div>
                    <p style={{ fontWeight: 700, fontSize: "11px", color: "#fff", marginBottom: "6px", lineHeight: 1.3, fontFamily: "'DM Sans', sans-serif" }}>
                      {w.name}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)" }}>{w.lessonCount} lecciones</p>
                      {pctW > 0 && (
                        <span style={{ fontSize: "9px", color: done ? "#34D399" : "#818CF8", fontWeight: 700 }}>
                          {pctW}%
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Missions */}
        {missions.length > 0 && (
          <section>
            <h2 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.25)", marginBottom: "10px", fontFamily: "'DM Sans', sans-serif" }}>
              Misiones activas
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              {missions.slice(0, 3).map(m => {
                const prog = Math.min((m.progress.current / m.targetValue) * 100, 100);
                const isDaily = m.type === "DAILY";
                return (
                  <div key={m.id} style={{
                    background: "rgba(99,102,241,0.05)",
                    border: "1px solid rgba(99,102,241,0.1)",
                    borderRadius: "14px",
                    padding: "10px 12px",
                    display: "flex", alignItems: "center", gap: "10px",
                  }}>
                    <div style={{
                      width: "34px", height: "34px", flexShrink: 0,
                      background: isDaily ? "rgba(251,191,36,0.1)" : "rgba(99,102,241,0.1)",
                      border: `1px solid ${isDaily ? "rgba(251,191,36,0.2)" : "rgba(99,102,241,0.2)"}`,
                      borderRadius: "10px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "15px",
                    }}>
                      {isDaily ? "⚡" : "🎯"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <p style={{ fontSize: "11px", fontWeight: 600, color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>{m.name}</p>
                        <span style={{ fontSize: "10px", fontWeight: 700, color: isDaily ? "#FBBF24" : "#818CF8" }}>
                          +{m.xpReward} XP
                        </span>
                      </div>
                      <div style={{ height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }}>
                        <div style={{
                          height: "100%", width: `${prog}%`,
                          background: isDaily ? "linear-gradient(90deg,#FBBF24,#34D399)" : "linear-gradient(90deg,#6366F1,#A78BFA)",
                          borderRadius: "2px",
                          transition: "width 0.6s ease",
                        }} />
                      </div>
                      <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.2)", marginTop: "3px" }}>
                        {m.progress.current}/{m.targetValue}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* VY Card */}
        <div style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.06))",
          border: "1px solid rgba(99,102,241,0.18)",
          borderRadius: "18px",
          padding: "14px",
          display: "flex", alignItems: "center", gap: "12px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", bottom: "-10px", right: "-10px",
            width: "60px", height: "60px",
            background: "radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)",
            borderRadius: "50%",
          }} />
          <div style={{
            width: "42px", height: "42px", flexShrink: 0,
            background: "rgba(99,102,241,0.12)",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "13px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px",
          }}>🤖</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, color: "#fff", fontSize: "13px", marginBottom: "2px", fontFamily: "'DM Sans', sans-serif" }}>
              VY — Tu tutor de IA
            </p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>
              Pregúntame cualquier cosa sobre IA
            </p>
          </div>
          <Link href="/vy" style={{
            padding: "8px 14px",
            background: "#6366F1",
            color: "#fff",
            borderRadius: "11px",
            fontSize: "12px", fontWeight: 700,
            textDecoration: "none",
            flexShrink: 0,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Hablar
          </Link>
        </div>

      </div>

      {/* ── BOTTOM NAV ── */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(8,11,20,0.95)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(99,102,241,0.1)",
        display: "flex",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        {[
          { href: "/dashboard", icon: "🏠", label: "Inicio", active: true },
          { href: "/worlds",    icon: "🌍", label: "Mundos", active: false },
          { href: "/vy",        icon: "🤖", label: "VY",     active: false },
          { href: "/community", icon: "👥", label: "Liga",   active: false },
          { href: "/profile",   icon: "👤", label: "Perfil", active: false },
        ].map(({ href, icon, label, active }) => (
          <Link key={href} href={href} style={{
            flex: 1,
            display: "flex", flexDirection: "column", alignItems: "center",
            padding: "10px 0 8px",
            gap: "3px",
            textDecoration: "none",
            position: "relative",
          }}>
            {active && (
              <div style={{
                position: "absolute", top: 0, left: "50%",
                transform: "translateX(-50%)",
                width: "16px", height: "2px",
                background: "#6366F1",
                borderRadius: "0 0 3px 3px",
              }} />
            )}
            <span style={{ fontSize: "19px", lineHeight: 1 }}>{icon}</span>
            <span style={{
              fontSize: "9px",
              fontWeight: active ? 700 : 500,
              color: active ? "#818CF8" : "rgba(255,255,255,0.2)",
              fontFamily: "'DM Sans', sans-serif",
            }}>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
