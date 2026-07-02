"use client";
import type { ReactElement } from "react";
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

// Iconos SVG únicos por mundo (estilo Gizmo) - mapeados por order
const WORLD_VISUALS: Record<number, { color: string; bg: string; border: string; grad: string; Icon: () => ReactElement }> = {
  0: { color: "#F5FF4D", bg: "rgba(245,255,77,0.1)", border: "rgba(245,255,77,0.2)", grad: "linear-gradient(90deg,#F5FF4D,#FBBF24)",
    Icon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L13.8 8.2H20L14.8 11.8L16.6 18L12 14.4L7.4 18L9.2 11.8L4 8.2H10.2L12 2Z" fill="#F5FF4D" fillOpacity="0.3" stroke="#F5FF4D" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="12" cy="12" r="2" fill="#F5FF4D"/></svg> },
  1: { color: "#818CF8", bg: "rgba(123,97,255,0.1)", border: "rgba(123,97,255,0.18)", grad: "linear-gradient(90deg,#7B61FF,#8B5CF6)",
    Icon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3C8.7 3 6 5.7 6 9V10H5C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14H6C6 16.2 7.4 18 9.3 18.8V20C9.3 20.6 9.7 21 10.3 21H13.7C14.3 21 14.7 20.6 14.7 20V18.8C16.6 18 18 16.2 18 14H19C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10H18V9C18 5.7 15.3 3 12 3Z" stroke="#818CF8" strokeWidth="1.8"/><path d="M9 11V13M12 10V14M15 11V13" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  2: { color: "#FBBF24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.18)", grad: "linear-gradient(90deg,#FBBF24,#F59E0B)",
    Icon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#FBBF24" strokeWidth="1.8"/><path d="M12 7V12L15 15" stroke="#FBBF24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 3.5L5 5.5M17 3.5L19 5.5" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  3: { color: "#00D4FF", bg: "rgba(0,212,255,0.1)", border: "rgba(0,212,255,0.18)", grad: "linear-gradient(90deg,#00D4FF,#0EA5E9)",
    Icon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.7 2 6 4.7 6 8C6 10.4 7.4 12.5 9.5 13.5V16H14.5V13.5C16.6 12.5 18 10.4 18 8C18 4.7 15.3 2 12 2Z" stroke="#00D4FF" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9.5 19H14.5M10.5 22H13.5" stroke="#00D4FF" strokeWidth="1.8" strokeLinecap="round"/><path d="M10 8H14M12 6V10" stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  4: { color: "#A78BFA", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.18)", grad: "linear-gradient(90deg,#A78BFA,#7C3AED)",
    Icon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="12" rx="4" stroke="#A78BFA" strokeWidth="1.8"/><path d="M8 12H12M10 10V14" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round"/><circle cx="16" cy="11" r="1" fill="#A78BFA"/><circle cx="15" cy="13.5" r="1" fill="#A78BFA"/></svg> },
  5: { color: "#F472B6", bg: "rgba(244,114,182,0.1)", border: "rgba(244,114,182,0.18)", grad: "linear-gradient(90deg,#F472B6,#EC4899)",
    Icon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.5 2 2 6.5 2 12C2 14.4 2.9 16.6 4.4 18.3L2 22L5.7 19.6C7.4 21.1 9.6 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2Z" stroke="#F472B6" strokeWidth="1.8" strokeLinejoin="round"/><path d="M8 12C8 9.8 9.8 8 12 8C14.2 8 16 9.8 16 12" stroke="#F472B6" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="13" r="1.5" fill="#F472B6"/></svg> },
  6: { color: "#34D399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.18)", grad: "linear-gradient(90deg,#34D399,#10B981)",
    Icon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 18V5L21 3V16" stroke="#34D399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="6" cy="18" r="3" stroke="#34D399" strokeWidth="1.8"/><circle cx="18" cy="16" r="3" stroke="#34D399" strokeWidth="1.8"/></svg> },
  7: { color: "#F87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.18)", grad: "linear-gradient(90deg,#F87171,#EF4444)",
    Icon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 21C12 21 4 14.5 4 9C4 6.2 6.2 4 9 4C10.4 4 11.7 4.6 12.6 5.5C13.5 4.6 14.8 4 16 4C18.8 4 21 6.2 21 9C21 14.5 12 21 12 21Z" stroke="#F87171" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 9H15M12 6V12" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  8: { color: "#38BDF8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.18)", grad: "linear-gradient(90deg,#38BDF8,#0284C7)",
    Icon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 17H21M5 17V9L12 5L19 9V17" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><rect x="9" y="11" width="6" height="4" rx="1" stroke="#38BDF8" strokeWidth="1.5"/><circle cx="7" cy="19" r="2" stroke="#38BDF8" strokeWidth="1.5"/><circle cx="17" cy="19" r="2" stroke="#38BDF8" strokeWidth="1.5"/></svg> },
  9: { color: "#4ADE80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.18)", grad: "linear-gradient(90deg,#4ADE80,#16A34A)",
    Icon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="#4ADE80" strokeWidth="1.8"/><path d="M8 14C8 14 9 11 12 11C15 11 16 14 16 14" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round"/><path d="M12 8V11M9 9L12 8L15 9" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  10: { color: "#FB923C", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.18)", grad: "linear-gradient(90deg,#FB923C,#EA580C)",
    Icon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3L4 7V12C4 16.4 7.6 20.5 12 21C16.4 20.5 20 16.4 20 12V7L12 3Z" stroke="#FB923C" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 12L11 14L15 10" stroke="#FB923C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
};
function getWorldVisual(order: number) {
  return WORLD_VISUALS[order] ?? WORLD_VISUALS[1];
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
    <div style={{ minHeight: "100vh", background: "#0F1420", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", background: "linear-gradient(135deg,#7B61FF,#8B5CF6)", borderRadius: "12px", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M4 16L10 4L16 16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.5 11H13.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", fontFamily: "'DM Sans',sans-serif" }}>Cargando BYZAI...</p>
      </div>
    </div>
  );

  const heroWorld = worlds[0];
  const heroVisual = heroWorld ? getWorldVisual(heroWorld.order) : getWorldVisual(0);

  return (
    <div style={{ minHeight: "100vh", background: "#0F1420", paddingBottom: "88px" }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.wcard:active{transform:scale(0.97)}`}</style>

      {/* HEADER */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(15,20,32,0.93)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(123,97,255,0.1)", padding: "11px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg,#7B61FF,#8B5CF6)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px rgba(123,97,255,0.4)" }}>
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
              <path d="M4 16L10 4L16 16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.5 11H13.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "14px", letterSpacing: "3px" }}><span style={{ background: "linear-gradient(135deg,#F472B6,#818CF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>BY</span><span style={{ color: "#fff" }}>Z</span><span style={{ background: "linear-gradient(135deg,#818CF8,#00D4FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI</span></span>
          <div style={{ padding: "2px 8px", borderRadius: "20px", background: `${rankCfg.color}18`, border: `1px solid ${rankCfg.color}33`, fontSize: "9px", fontWeight: 700, color: rankCfg.color, fontFamily: "'DM Sans',sans-serif" }}>{rankCfg.label}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {(gamification?.streakDays ?? 0) > 0 && <span style={{ fontSize: "11px", color: "#FB923C", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>🔥 {gamification?.streakDays}</span>}
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {/* HERO */}
      <div style={{ padding: "18px 16px 0", animation: "fadeUp 0.4s ease" }}>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", marginBottom: "2px", fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}>Buenos días,</p>
        <div style={{ marginBottom: "16px" }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "32px", background: "linear-gradient(135deg,#fff,#C7D2FE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.05, letterSpacing: "-0.5px" }}>
            {user?.firstName ?? "Estudiante"}
          </span>
          <span style={{ fontSize: "24px", marginLeft: "8px" }}>👋</span>
        </div>

        <div style={{ background: "linear-gradient(135deg,rgba(123,97,255,0.12),rgba(139,92,246,0.04))", border: "1px solid rgba(123,97,255,0.2)", borderRadius: "16px", padding: "12px 14px", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)", margin: "0 0 2px", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Total XP</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "26px", background: "linear-gradient(135deg,#C7D2FE,#818CF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>
                {xp >= 1000 ? `${(xp/1000).toFixed(1)}k` : xp}
              </span>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans',sans-serif" }}>XP ⚡</span>
            </div>
            <p style={{ fontSize: "10px", color: rankCfg.color, margin: "4px 0 0", fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{Math.round(pct)}% hacia {nextRankLabel}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "9px", color: rankCfg.color, margin: "0 0 4px", fontFamily: "'Syne',sans-serif", fontWeight: 800, letterSpacing: "0.5px" }}>{rankCfg.label.toUpperCase()}</p>
            <div style={{ width: "72px", height: "5px", background: "rgba(255,255,255,0.06)", borderRadius: "3px" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${rankCfg.color},#A78BFA)`, borderRadius: "3px", transition: "width 1s ease" }} />
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px", marginBottom: "18px" }}>
          {[
            { v: gamification?.gems ?? 0, l: "Gemas", c: "#C4B5FD", bg: "rgba(196,181,253,0.08)", border: "rgba(196,181,253,0.15)", e: "💎" },
            { v: gamification?.lessonsCompleted ?? 0, l: "Clases", c: "#7DD3FC", bg: "rgba(125,211,252,0.08)", border: "rgba(125,211,252,0.15)", e: "📚" },
            { v: `${gamification?.streakDays ?? 0}d`, l: "Racha", c: "#FB923C", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.15)", e: "🔥" },
          ].map(({ v, l, c, bg, border, e }) => (
            <div key={l} style={{ background: bg, border: `1px solid ${border}`, borderRadius: "14px", padding: "10px 6px", textAlign: "center" }}>
              <div style={{ fontSize: "16px", marginBottom: "2px" }}>{e}</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "16px", color: c, lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", marginTop: "2px", fontFamily: "'DM Sans',sans-serif" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* CTA con icono SVG del mundo */}
        {heroWorld && (
          <Link href={`/worlds?id=${heroWorld.id}`} style={{ textDecoration: "none" }}>
            <div className="wcard" style={{ background: heroVisual.bg, border: `1px solid ${heroVisual.border}`, borderRadius: "18px", padding: "14px", display: "flex", alignItems: "center", gap: "12px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: heroVisual.grad }} />
              <div style={{ width: "48px", height: "48px", background: heroVisual.bg, border: `1px solid ${heroVisual.border}`, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <heroVisual.Icon />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif", margin: "0 0 2px" }}>Continuar donde lo dejaste</p>
                <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: heroVisual.color, fontSize: "15px", marginBottom: "2px" }}>{heroWorld.name}</p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif" }}>{heroWorld.lessonCount} lecciones · Nivel 0</p>
                {(heroWorld.pctComplete ?? 0) > 0 && (
                  <div style={{ marginTop: "6px", height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
                    <div style={{ height: "100%", width: `${heroWorld.pctComplete * 100}%`, background: heroVisual.color, borderRadius: "2px" }} />
                  </div>
                )}
              </div>
              <div style={{ width: "34px", height: "34px", background: heroVisual.grad, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#0F1420", fontSize: "16px", fontWeight: 900, flexShrink: 0 }}>→</div>
            </div>
          </Link>
        )}

        {/* SELECTOR DE NIVEL */}
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px", marginBottom: "4px" }}>
          {[
            { id: "level-1", label: "Nivel 0 · Origins", xpRequired: 0 },
            { id: "level-new-1", label: "Nivel 1 · Explorer", xpRequired: 2000 },
            { id: "level-new-2", label: "Nivel 2 · Thinker", xpRequired: 8000 },
            { id: "level-new-3", label: "Nivel 3 · Creator", xpRequired: 16000 },
          ].map(lvl => {
            const locked = xp < lvl.xpRequired;
            const content = (
              <div style={{
                flexShrink: 0, padding: "6px 12px", borderRadius: "999px",
                background: locked ? "rgba(255,255,255,0.04)" : "rgba(123,97,255,0.1)",
                border: locked ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(123,97,255,0.25)",
                color: locked ? "rgba(255,255,255,0.35)" : "#fff", fontSize: "11px", fontWeight: 600,
                fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap",
                display: "flex", alignItems: "center", gap: "4px",
              }}>{locked && "🔒"} {lvl.label}{locked && ` · ${lvl.xpRequired} XP`}</div>
            );
            return locked
              ? <div key={lvl.id} title={`Necesitas ${lvl.xpRequired} XP`}>{content}</div>
              : <Link key={lvl.id} href={`/worlds?levelId=${lvl.id}`} style={{ textDecoration: "none" }}>{content}</Link>;
          })}
        </div>

        {/* MUNDOS con iconos Gizmo */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h2 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans',sans-serif" }}>Nivel 0 — AI Foundations</h2>
            <Link href="/worlds" style={{ fontSize: "11px", color: "#818CF8", fontWeight: 600, textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>Ver todos →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {(worlds.length > 0 ? worlds : [
              { id: "w0", name: "Tu aventura comienza", emoji: "🚀", lessonCount: 1, pctComplete: 0, order: 0 },
              { id: "w1", name: "Fundamentos de IA", emoji: "🌍", lessonCount: 15, pctComplete: 0, order: 1 },
              { id: "w2", name: "Historia de la IA", emoji: "📜", lessonCount: 15, pctComplete: 0, order: 2 },
              { id: "w3", name: "IA en tu Vida", emoji: "🤖", lessonCount: 15, pctComplete: 0, order: 3 },
            ]).slice(0, 6).map(w => {
              const pctW = Math.round((w.pctComplete ?? 0) * 100);
              const done = pctW >= 100;
              const visual = getWorldVisual(w.order);
              return (
                <Link key={w.id} href={`/worlds?id=${w.id}`} style={{ textDecoration: "none" }}>
                  <div className="wcard" style={{ background: visual.bg, border: `1px solid ${visual.border}`, borderRadius: "16px", padding: "14px", position: "relative", overflow: "hidden", transition: "all 0.2s" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, width: done ? "100%" : `${pctW}%`, height: "3px", background: visual.grad, opacity: pctW > 0 ? 1 : 0 }} />
                    {done && <div style={{ position: "absolute", top: "8px", right: "8px", width: "20px", height: "20px", background: "rgba(52,211,153,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#34D399" }}>✓</div>}
                    <div style={{ width: "44px", height: "44px", background: visual.bg, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
                      <visual.Icon />
                    </div>
                    <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "14px", color: done ? "#34D399" : visual.color, marginBottom: "6px", lineHeight: 1.2 }}>{w.name}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>{w.lessonCount} lecciones</p>
                      {pctW > 0 && (
                        <span style={{ fontSize: "10px", color: done ? "#34D399" : visual.color, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", background: done ? "rgba(52,211,153,0.15)" : visual.bg, padding: "1px 7px", borderRadius: "20px" }}>{pctW}%</span>
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
                  <div key={m.id} style={{ background: "rgba(123,97,255,0.05)", border: "1px solid rgba(123,97,255,0.1)", borderRadius: "14px", padding: "10px 12px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "34px", height: "34px", flexShrink: 0, background: isD ? "rgba(251,191,36,0.1)" : "rgba(123,97,255,0.1)", border: `1px solid ${isD ? "rgba(251,191,36,0.2)" : "rgba(123,97,255,0.2)"}`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>{isD ? "⚡" : "🎯"}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <p style={{ fontSize: "12px", fontWeight: 600, color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>{m.name}</p>
                        <span style={{ fontSize: "10px", fontWeight: 700, color: isD ? "#FBBF24" : "#818CF8", fontFamily: "'DM Sans',sans-serif" }}>+{m.xpReward} XP</span>
                      </div>
                      <div style={{ height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }}>
                        <div style={{ height: "100%", width: `${prog}%`, background: isD ? "linear-gradient(90deg,#FBBF24,#34D399)" : "linear-gradient(90deg,#7B61FF,#A78BFA)", borderRadius: "2px" }} />
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
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(15,20,32,0.96)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid rgba(123,97,255,0.1)", display: "flex", padding: "6px 0" }}>
        <Link href="/dashboard" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", textDecoration: "none", padding: "4px 0" }}>
          <div style={{ width: "42px", height: "42px", background: "linear-gradient(135deg,#7B61FF,#8B5CF6)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 16px rgba(123,97,255,0.5)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3L21 10.5V20C21 20.6 20.6 21 20 21H15V15H9V21H4C3.4 21 3 20.6 3 20V10.5Z" fill="rgba(255,255,255,0.2)" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/><path d="M13 9L11 12H13L10.5 15.5" stroke="#F5FF4D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontSize: "8px", fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#818CF8", letterSpacing: "0.5px" }}>INICIO</span>
        </Link>
        <Link href="/worlds" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", textDecoration: "none", padding: "4px 0" }}>
          <div style={{ width: "42px", height: "42px", background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="#00D4FF" strokeWidth="1.8" strokeOpacity="0.5"/><ellipse cx="12" cy="12" rx="3.5" ry="8.5" stroke="#00D4FF" strokeWidth="1.5" strokeOpacity="0.4"/><path d="M4 9.5H20M4 14.5H20" stroke="#00D4FF" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.3"/></svg>
          </div>
          <span style={{ fontSize: "8px", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, color: "rgba(255,255,255,0.25)" }}>Mundos</span>
        </Link>
        <Link href="/vy" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", textDecoration: "none", padding: "4px 0" }}>
          <div style={{ width: "42px", height: "42px", background: "rgba(0,255,179,0.1)", border: "1px solid rgba(0,255,179,0.2)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" stroke="#00FFB3" strokeWidth="1.8" strokeOpacity="0.5"/><path d="M8 8L12 16L16 8" stroke="#00FFB3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5"/></svg>
          </div>
          <span style={{ fontSize: "8px", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, color: "rgba(255,255,255,0.25)" }}>VY</span>
        </Link>
        <Link href="/community" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", textDecoration: "none", padding: "4px 0" }}>
          <div style={{ width: "42px", height: "42px", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="9" y="10" width="6" height="12" rx="1" stroke="#FBBF24" strokeWidth="1.8" strokeOpacity="0.5"/><rect x="2" y="14" width="6" height="8" rx="1" stroke="#FBBF24" strokeWidth="1.5" strokeOpacity="0.3"/><rect x="16" y="16" width="6" height="6" rx="1" stroke="#FBBF24" strokeWidth="1.5" strokeOpacity="0.3"/><path d="M12 2L13.1 5.3H16.6L13.7 7.4L14.8 10.7L12 8.5L9.2 10.7L10.3 7.4L7.4 5.3H10.9L12 2Z" stroke="#FBBF24" strokeWidth="1.3" strokeLinejoin="round" strokeOpacity="0.5"/></svg>
          </div>
          <span style={{ fontSize: "8px", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, color: "rgba(255,255,255,0.25)" }}>Liga</span>
        </Link>
        <Link href="/profile" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", textDecoration: "none", padding: "4px 0" }}>
          <div style={{ width: "42px", height: "42px", background: "rgba(244,114,182,0.1)", border: "1px solid rgba(244,114,182,0.2)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L20.5 7V17L12 22L3.5 17V7L12 2Z" stroke="#F472B6" strokeWidth="1.8" strokeLinejoin="round" strokeOpacity="0.5"/><circle cx="12" cy="9.5" r="2.5" stroke="#F472B6" strokeWidth="1.5" strokeOpacity="0.5"/><path d="M7.5 17C7.5 14.5 9.5 12.5 12 12.5C14.5 12.5 16.5 14.5 16.5 17" stroke="#F472B6" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5"/></svg>
          </div>
          <span style={{ fontSize: "8px", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, color: "rgba(255,255,255,0.25)" }}>Perfil</span>
        </Link>
      </nav>
    </div>
  );
}
