"use client";
import { useEffect, useState } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

interface Gamification {
  xpTotal: number; gems: number; rank: string; rankLevel: number;
  streakDays: number; lessonsCompleted: number;
}
interface Mission {
  id: string; name: string; type: string; xpReward: number;
  targetValue: number; progress: { current: number; completed: boolean };
}
interface World {
  id: string; name: string; emoji: string; lessonCount: number;
  pctComplete: number; order: number;
}

const RANK_CONFIG: Record<string, { color: string; label: string }> = {
  NOVICE:    { color: "#94A3B8", label: "Novato"    },
  EXPLORER:  { color: "#818CF8", label: "Explorer"  },
  CREATOR:   { color: "#34D399", label: "Creator"   },
  BUILDER:   { color: "#38BDF8", label: "Builder"   },
  INNOVATOR: { color: "#FBBF24", label: "Innovator" },
  VISIONARY: { color: "#F472B6", label: "Visionary" },
  PIONEER:   { color: "#FB923C", label: "Pioneer"   },
  MASTER:    { color: "#C084FC", label: "Master"    },
  LEGEND:    { color: "#F87171", label: "Legend"    },
  AI_TITAN:  { color: "#FBBF24", label: "AI Titan"  },
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
const RANK_KEYS = Object.keys(RANK_NEXT_XP);

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
          setGamification(g); setMissions(m ?? []);
        }
        if (worldRes.ok) {
          const { worlds: w } = await worldRes.json();
          setWorlds(w ?? []);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    loadData();
  }, [isLoaded, user]);

  const rank = gamification?.rank ?? "NOVICE";
  const rankCfg = RANK_CONFIG[rank] ?? RANK_CONFIG.NOVICE;
  const xp = gamification?.xpTotal ?? 0;
  const nextXP = RANK_NEXT_XP[rank] ?? 500;
  const prevXP = RANK_PREV_XP[rank] ?? 0;
  const pct = nextXP > prevXP ? Math.min(((xp - prevXP) / (nextXP - prevXP)) * 100, 100) : 100;
  const nextRankLabel = RANK_CONFIG[RANK_KEYS[RANK_KEYS.indexOf(rank) + 1]]?.label ?? "AI Titan";

  if (!isLoaded || loading) return (
    <div style={{ minHeight: "100vh", background: "#080B14", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", borderRadius: "12px", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M4 16L10 4L16 16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.5 11H13.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", fontFamily: "'DM Sans',sans-serif" }}>Cargando VYZIO...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#080B14", paddingBottom: "88px" }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.wcard:active{transform:scale(0.97)}`}</style>

      {/* HEADER */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(8,11,20,0.93)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(99,102,241,0.1)", padding: "11px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px rgba(99,102,241,0.4)" }}>
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
              <path d="M4 16L10 4L16 16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.5 11H13.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          {/* CAMBIO ①: Logo con gradiente Syne */}
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "14px", letterSpacing: "3px", background: "linear-gradient(135deg,#fff,#C7D2FE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>VYZIO</span>
          <div style={{ padding: "2px 8px", borderRadius: "20px", background: `${rankCfg.color}18`, border: `1px solid ${rankCfg.color}33`, fontSize: "9px", fontWeight: 700, color: rankCfg.color, fontFamily: "'DM Sans',sans-serif" }}>{rankCfg.label}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {(gamification?.streakDays ?? 0) > 0 && <span style={{ fontSize: "11px", color: "#FB923C", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>🔥 {gamification?.streakDays}</span>}
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {/* HERO */}
      <div style={{ padding: "18px 16px 0", animation: "fadeUp 0.4s ease" }}>
        {/* CAMBIO ①: Saludo pequeño + nombre GRANDE 32px */}
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", marginBottom: "2px", fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}>Buenos días,</p>
        <div style={{ marginBottom: "16px" }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "32px", background: "linear-gradient(135deg,#fff,#C7D2FE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.05, letterSpacing: "-0.5px" }}>
            {user?.firstName ?? "Estudiante"}
          </span>
          <span style={{ fontSize: "24px", marginLeft: "8px" }}>👋</span>
        </div>

        {/* CAMBIO ③: XP Hero con contexto de progreso */}
        <div style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.04))", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "16px", padding: "12px 14px", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)", margin: "0 0 2px", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Total XP</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "26px", background: "linear-gradient(135deg,#C7D2FE,#818CF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>
                {xp >= 1000 ? `${(xp/1000).toFixed(1)}k` : xp}
              </span>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans',sans-serif" }}>XP ⚡</span>
            </div>
            {/* CAMBIO ③: Contexto de progreso */}
            <p style={{ fontSize: "10px", color: rankCfg.color, margin: "4px 0 0", fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{Math.round(pct)}% hacia {nextRankLabel}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "9px", color: rankCfg.color, margin: "0 0 4px", fontFamily: "'Syne',sans-serif", fontWeight: 800, letterSpacing: "0.5px" }}>{rankCfg.label.toUpperCase()}</p>
            <div style={{ width: "72px", height: "5px", background: "rgba(255,255,255,0.06)", borderRadius: "3px" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${rankCfg.color},#A78BFA)`, borderRadius: "3px", transition: "width 1s ease" }} />
            </div>
          </div>
        </div>

        {/* Stats 3col */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px", marginBottom: "18px" }}>
          {[
            { v: gamification?.gems ?? 0, l: "Gemas", c: "#C4B5FD", bg: "rgba(196,181,253,0.08)", border: "rgba(196,181,253,0.15)", e: "💎" },
            { v: gamification?.lessonsCompleted ?? 0, l: "Clases", c: "#7DD3FC", bg: "rgba(125,211,252,0.08)", border: "rgba(125,211,252,0.15)", e: "📚" },
            { v: `${gamification?.streakDays ?? 0}d`, l: "Racha", c: "#FB923C", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.15)", e: "🔥" },
          ].map(({ v, l, c, bg, border, e }) => (
            <div key={l} style={{ background: bg, border: `1px solid ${border}`, borderRadius: "14px", padding: "10px 6px", textAlign: "center" }}>
              <div style={{ fontSize: "16px", marginBottom: "2px" }}>{e}</div>
              {/* CAMBIO ①: Números más grandes en stats */}
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "16px", color: c, lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", marginTop: "2px", fontFamily: "'DM Sans',sans-serif" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* CAMBIO ④: CTA con subtítulo prominente */}
        {worlds.length > 0 && (
          <Link href={`/worlds?id=${worlds[0]?.id}`} style={{ textDecoration: "none" }}>
            <div className="wcard" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)", borderRadius: "18px", padding: "14px", display: "flex", alignItems: "center", gap: "12px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "70px", height: "70px", background: "radial-gradient(circle,rgba(99,102,241,0.2),transparent 70%)", borderRadius: "50%" }} />
              {/* CAMBIO ⑥: Emoji más grande en CTA */}
              <div style={{ width: "48px", height: "48px", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", flexShrink: 0 }}>
                {worlds[0]?.emoji}
              </div>
              <div style={{ flex: 1 }}>
                {/* CAMBIO ④: "Continuar donde lo dejaste" como subtítulo */}
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif", margin: "0 0 2px" }}>Continuar donde lo dejaste</p>
                {/* CAMBIO ②: Título del mundo 14px → 15px Syne 800 */}
                <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#fff", fontSize: "15px", marginBottom: "2px" }}>
                  {worlds[0]?.name}
                </p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif" }}>
                  {worlds[0]?.lessonCount} lecciones · Nivel 0
                </p>
                {(worlds[0]?.pctComplete ?? 0) > 0 && (
                  <div style={{ marginTop: "6px", height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
                    <div style={{ height: "100%", width: `${worlds[0].pctComplete * 100}%`, background: "#6366F1", borderRadius: "2px" }} />
                  </div>
                )}
              </div>
              <div style={{ width: "34px", height: "34px", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "16px", flexShrink: 0, boxShadow: "0 0 10px rgba(99,102,241,0.4)" }}>→</div>
            </div>
          </Link>
        )}

        {/* MUNDOS */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h2 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans',sans-serif" }}>Nivel 0 — AI Foundations</h2>
            <Link href="/worlds" style={{ fontSize: "11px", color: "#818CF8", fontWeight: 600, textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>Ver todos →</Link>
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
                  <div className="wcard" style={{ background: done ? "rgba(52,211,153,0.06)" : "rgba(99,102,241,0.05)", border: done ? "1px solid rgba(52,211,153,0.18)" : "1px solid rgba(99,102,241,0.1)", borderRadius: "16px", padding: "14px", position: "relative", overflow: "hidden", transition: "all 0.2s" }}>
                    {/* CAMBIO ⑤: Progress bar 3px en lugar de 2px */}
                    {pctW > 0 && !done && <div style={{ position: "absolute", top: 0, left: 0, width: `${pctW}%`, height: "3px", background: "linear-gradient(90deg,#6366F1,#A78BFA)" }} />}
                    {done && <div style={{ position: "absolute", top: "8px", right: "8px", width: "20px", height: "20px", background: "rgba(52,211,153,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#34D399" }}>✓</div>}
                    {/* CAMBIO ⑥: Emoji 22px → 28px */}
                    <div style={{ fontSize: "28px", marginBottom: "8px" }}>{w.emoji}</div>
                    {/* CAMBIO ②: Título card 12px → 14px Syne 800 */}
                    <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "14px", color: done ? "#34D399" : "#fff", marginBottom: "6px", lineHeight: 1.2 }}>{w.name}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans',sans-serif" }}>{w.lessonCount} lecciones</p>
                      {pctW > 0 && (
                        <span style={{ fontSize: "10px", color: done ? "#34D399" : "#818CF8", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", background: done ? "rgba(52,211,153,0.12)" : "rgba(99,102,241,0.12)", padding: "1px 7px", borderRadius: "20px" }}>{pctW}%</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* MISIONES */}
        {missions.length > 0 && (
          <section>
            <h2 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.25)", marginBottom: "10px", fontFamily: "'DM Sans',sans-serif" }}>Misiones activas</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              {missions.slice(0, 3).map(m => {
                const prog = Math.min((m.progress.current / m.targetValue) * 100, 100);
                const isD = m.type === "DAILY";
                return (
                  <div key={m.id} style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.1)", borderRadius: "14px", padding: "10px 12px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "34px", height: "34px", flexShrink: 0, background: isD ? "rgba(251,191,36,0.1)" : "rgba(99,102,241,0.1)", border: `1px solid ${isD ? "rgba(251,191,36,0.2)" : "rgba(99,102,241,0.2)"}`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>{isD ? "⚡" : "🎯"}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <p style={{ fontSize: "12px", fontWeight: 600, color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>{m.name}</p>
                        <span style={{ fontSize: "10px", fontWeight: 700, color: isD ? "#FBBF24" : "#818CF8", fontFamily: "'DM Sans',sans-serif" }}>+{m.xpReward} XP</span>
                      </div>
                      <div style={{ height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }}>
                        <div style={{ height: "100%", width: `${prog}%`, background: isD ? "linear-gradient(90deg,#FBBF24,#34D399)" : "linear-gradient(90deg,#6366F1,#A78BFA)", borderRadius: "2px" }} />
                      </div>
                      <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.2)", marginTop: "3px", fontFamily: "'DM Sans',sans-serif" }}>{m.progress.current}/{m.targetValue}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* VY */}
        <div style={{ background: "linear-gradient(135deg,rgba(0,255,179,0.08),rgba(0,200,150,0.04))", border: "1px solid rgba(0,255,179,0.15)", borderRadius: "18px", padding: "14px", display: "flex", alignItems: "center", gap: "12px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", bottom: "-10px", right: "-10px", width: "60px", height: "60px", background: "radial-gradient(circle,rgba(0,255,179,0.15),transparent 70%)", borderRadius: "50%" }} />
          <div style={{ width: "44px", height: "44px", flexShrink: 0, background: "rgba(0,255,179,0.1)", border: "1px solid rgba(0,255,179,0.2)", borderRadius: "13px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="4" fill="rgba(0,255,179,0.1)" stroke="#00FFB3" strokeWidth="1.8"/>
              <path d="M8 8L12 16L16 8" stroke="#00FFB3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#fff", fontSize: "14px", marginBottom: "2px" }}>VY — Tu tutor de IA</p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif" }}>Pregúntame cualquier cosa sobre IA</p>
          </div>
          <Link href="/vy" style={{ padding: "8px 14px", background: "linear-gradient(135deg,#00C896,#00A878)", color: "#fff", borderRadius: "11px", fontSize: "12px", fontWeight: 700, textDecoration: "none", flexShrink: 0, fontFamily: "'DM Sans',sans-serif", boxShadow: "0 0 12px rgba(0,255,179,0.3)" }}>Hablar</Link>
        </div>

      </div>

      {/* NAVBAR */}
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(8,11,20,0.96)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid rgba(99,102,241,0.1)", display: "flex", padding: "6px 0" }}>

        <Link href="/dashboard" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", textDecoration: "none", padding: "4px 0" }}>
          <div style={{ width: "42px", height: "42px", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 16px rgba(99,102,241,0.5)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 10.5L12 3L21 10.5V20C21 20.6 20.6 21 20 21H15V15H9V21H4C3.4 21 3 20.6 3 20V10.5Z" fill="rgba(255,255,255,0.2)" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M13 9L11 12H13L10.5 15.5" stroke="#F5FF4D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: "8px", fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#818CF8", letterSpacing: "0.5px" }}>INICIO</span>
        </Link>

        <Link href="/worlds" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", textDecoration: "none", padding: "4px 0" }}>
          <div style={{ width: "42px", height: "42px", background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8.5" stroke="#00D4FF" strokeWidth="1.8" strokeOpacity="0.5"/>
              <ellipse cx="12" cy="12" rx="3.5" ry="8.5" stroke="#00D4FF" strokeWidth="1.5" strokeOpacity="0.4"/>
              <path d="M4 9.5H20M4 14.5H20" stroke="#00D4FF" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.3"/>
            </svg>
          </div>
          <span style={{ fontSize: "8px", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, color: "rgba(255,255,255,0.25)" }}>Mundos</span>
        </Link>

        <Link href="/vy" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", textDecoration: "none", padding: "4px 0" }}>
          <div style={{ width: "42px", height: "42px", background: "rgba(0,255,179,0.1)", border: "1px solid rgba(0,255,179,0.2)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="#00FFB3" strokeWidth="1.8" strokeOpacity="0.5"/>
              <path d="M8 8L12 16L16 8" stroke="#00FFB3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5"/>
            </svg>
          </div>
          <span style={{ fontSize: "8px", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, color: "rgba(255,255,255,0.25)" }}>VY</span>
        </Link>

        <Link href="/community" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", textDecoration: "none", padding: "4px 0" }}>
          <div style={{ width: "42px", height: "42px", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="10" width="6" height="12" rx="1" stroke="#FBBF24" strokeWidth="1.8" strokeOpacity="0.5"/>
              <rect x="2" y="14" width="6" height="8" rx="1" stroke="#FBBF24" strokeWidth="1.5" strokeOpacity="0.3"/>
              <rect x="16" y="16" width="6" height="6" rx="1" stroke="#FBBF24" strokeWidth="1.5" strokeOpacity="0.3"/>
              <path d="M12 2L13.1 5.3H16.6L13.7 7.4L14.8 10.7L12 8.5L9.2 10.7L10.3 7.4L7.4 5.3H10.9L12 2Z" stroke="#FBBF24" strokeWidth="1.3" strokeLinejoin="round" strokeOpacity="0.5"/>
            </svg>
          </div>
          <span style={{ fontSize: "8px", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, color: "rgba(255,255,255,0.25)" }}>Liga</span>
        </Link>

        <Link href="/profile" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", textDecoration: "none", padding: "4px 0" }}>
          <div style={{ width: "42px", height: "42px", background: "rgba(244,114,182,0.1)", border: "1px solid rgba(244,114,182,0.2)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L20.5 7V17L12 22L3.5 17V7L12 2Z" stroke="#F472B6" strokeWidth="1.8" strokeLinejoin="round" strokeOpacity="0.5"/>
              <circle cx="12" cy="9.5" r="2.5" stroke="#F472B6" strokeWidth="1.5" strokeOpacity="0.5"/>
              <path d="M7.5 17C7.5 14.5 9.5 12.5 12 12.5C14.5 12.5 16.5 14.5 16.5 17" stroke="#F472B6" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5"/>
            </svg>
          </div>
          <span style={{ fontSize: "8px", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, color: "rgba(255,255,255,0.25)" }}>Perfil</span>
        </Link>

      </nav>
    </div>
  );
}
