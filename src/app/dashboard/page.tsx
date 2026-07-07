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

const RANK_COLORS: Record<string, string> = {
  NOVICE: "#999", EXPLORER: "#6C63FF", CREATOR: "#00D4FF",
  BUILDER: "#00FFB3", INNOVATOR: "#FFFC00", VISIONARY: "#FF5EA8",
  PIONEER: "#FF8C00", MASTER: "#9B59B6", LEGEND: "#E74C3C", AI_TITAN: "#FFFC00",
};

const RANK_NEXT_XP: Record<string, number> = {
  NOVICE: 500, EXPLORER: 2000, CREATOR: 6000, BUILDER: 15000,
  INNOVATOR: 30000, VISIONARY: 55000, PIONEER: 90000, MASTER: 140000,
  LEGEND: 200000, AI_TITAN: 999999,
};

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
        // Init user in DB
        await fetch("/api/user");

        // Load gamification data
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
      <div style={{ minHeight: "100vh", background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>⚡</div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>Cargando VYZIO...</p>
        </div>
      </div>
    );
  }

  const rank = gamification?.rank ?? "NOVICE";
  const xp = gamification?.xpTotal ?? 0;
  const nextXP = RANK_NEXT_XP[rank] ?? 500;
  const prevXP = Object.values(RANK_NEXT_XP).filter(v => v <= xp).pop() ?? 0;
  const rankProgress = nextXP > prevXP ? ((xp - prevXP) / (nextXP - prevXP)) * 100 : 100;
  const rankColor = RANK_COLORS[rank] ?? "#6C63FF";

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", paddingBottom: "80px" }}>

      {/* TopBar */}
      <div style={{ position: "sticky", top: 0, zIndex: 40, background: "#111", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", background: "#FFFC00", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M4 16L10 4L16 16" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.5 11H13.5" stroke="#111" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: "sans-serif", fontWeight: 900, color: "#fff", fontSize: "14px", letterSpacing: "2px" }}>VYZIO</span>
          <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "10px", fontWeight: 700, background: `${rankColor}22`, color: rankColor }}>
            {rank}
          </span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Hero */}
      <div style={{ background: "#111", padding: "16px" }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginBottom: "4px" }}>
          Hola, {user?.firstName ?? "Estudiante"} 👋
        </p>
        <p style={{ fontWeight: 900, color: "#fff", fontSize: "20px", marginBottom: "16px" }}>
          ¿Qué aprendemos hoy?
        </p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "6px", marginBottom: "14px" }}>
          {[
            { v: xp.toLocaleString(), l: "XP", c: "#FFFC00" },
            { v: `💎 ${gamification?.gems ?? 0}`, l: "Gemas", c: "#6C63FF" },
            { v: `${gamification?.lessonsCompleted ?? 0}`, l: "Lecciones", c: "#00D4FF" },
            { v: `🔥 ${gamification?.streakDays ?? 0}`, l: "Racha", c: "#FF5EA8" },
          ].map(({ v, l, c }) => (
            <div key={l} style={{ background: "rgba(255,255,255,0.06)", borderRadius: "12px", padding: "10px", textAlign: "center" }}>
              <div style={{ fontWeight: 900, fontSize: "15px", color: c }}>{v}</div>
              <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* XP Bar */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{rank}</span>
            <span style={{ fontSize: "10px", color: rankColor, fontWeight: 700 }}>
              {xp.toLocaleString()} / {nextXP.toLocaleString()} XP
            </span>
          </div>
          <div style={{ height: "5px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(rankProgress, 100)}%`, background: rankColor, borderRadius: "3px", transition: "width 0.5s ease" }} />
          </div>
        </div>
      </div>

      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Continuar */}
        {worlds.length > 0 && (
          <Link href={`/worlds`} style={{ textDecoration: "none" }}>
            <div style={{ background: "#111", borderRadius: "20px", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ fontSize: "28px" }}>{worlds[0]?.emoji ?? "🌍"}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: "#fff", fontSize: "14px", marginBottom: "2px" }}>
                  {worlds[0]?.name ?? "Bienvenido al Futuro"}
                </p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
                  {worlds[0]?.lessonCount ?? 15} lecciones · Nivel 1
                </p>
              </div>
              <div style={{ padding: "8px 16px", background: "#FFFC00", borderRadius: "12px", fontWeight: 800, fontSize: "13px", color: "#111" }}>
                Ir →
              </div>
            </div>
          </Link>
        )}

        {/* Mundos */}
        <section>
          <h2 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "rgba(0,0,0,0.35)", marginBottom: "10px" }}>
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
                <div style={{ background: "#fff", borderRadius: "16px", padding: "12px", border: "0.5px solid rgba(0,0,0,0.08)" }}>
                  <div style={{ fontSize: "22px", marginBottom: "6px" }}>{w.emoji}</div>
                  <p style={{ fontWeight: 700, fontSize: "12px", color: "#111", marginBottom: "6px", lineHeight: 1.3 }}>{w.name}</p>
                  <div style={{ height: "3px", background: "rgba(0,0,0,0.06)", borderRadius: "2px", marginBottom: "4px" }}>
                    <div style={{ height: "100%", width: `${(w.pctComplete ?? 0) * 100}%`, background: "#6C63FF", borderRadius: "2px" }} />
                  </div>
                  <p style={{ fontSize: "9px", color: "rgba(0,0,0,0.3)" }}>{w.lessonCount} lecciones</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Misiones */}
        {missions.length > 0 && (
          <section>
            <h2 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "rgba(0,0,0,0.35)", marginBottom: "10px" }}>
              Misiones activas
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {missions.map(m => (
                <div key={m.id} style={{ background: "#fff", borderRadius: "14px", padding: "12px", border: "0.5px solid rgba(0,0,0,0.08)" }}>
                  <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "6px", background: m.type === "DAILY" ? "#E8F5E9" : "#EDE7F6", color: m.type === "DAILY" ? "#2E7D32" : "#4527A0" }}>
                    {m.type === "DAILY" ? "Diaria" : "Semanal"}
                  </span>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "#111", margin: "8px 0 6px", lineHeight: 1.3 }}>{m.name}</p>
                  <div style={{ height: "3px", background: "rgba(0,0,0,0.06)", borderRadius: "2px", marginBottom: "4px" }}>
                    <div style={{ height: "100%", width: `${Math.min((m.progress.current / m.targetValue) * 100, 100)}%`, background: "#6C63FF", borderRadius: "2px" }} />
                  </div>
                  <p style={{ fontSize: "9px", color: "rgba(0,0,0,0.3)" }}>{m.progress.current}/{m.targetValue} · +{m.xpReward} XP</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* VY */}
        <div style={{ background: "#111", borderRadius: "20px", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", background: "rgba(108,99,255,0.15)", border: "2px solid #6C63FF", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>🤖</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, color: "#fff", fontSize: "13px" }}>VY — Tu tutor de IA</p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>Pregúntame cualquier cosa sobre IA</p>
          </div>
          <Link href="/vy" style={{ padding: "8px 14px", background: "#6C63FF", color: "#fff", borderRadius: "10px", fontSize: "12px", fontWeight: 700, textDecoration: "none" }}>
            Hablar
          </Link>
        </div>

      </div>

      {/* NavBar */}
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "0.5px solid rgba(0,0,0,0.08)", display: "flex" }}>
        {[
          { href: "/dashboard", icon: "🏠", label: "Inicio", active: true },
          { href: "/worlds", icon: "🌍", label: "Mundos", active: false },
          { href: "/vy", icon: "🤖", label: "VY", active: false },
          { href: "/community", icon: "👥", label: "Comunidad", active: false },
          { href: "/profile", icon: "👤", label: "Perfil", active: false },
        ].map(({ href, icon, label, active }) => (
          <Link key={href} href={href} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0 6px", gap: "2px", textDecoration: "none" }}>
            <span style={{ fontSize: "18px", lineHeight: 1 }}>{icon}</span>
            <span style={{ fontSize: "9px", fontWeight: 500, color: active ? "#6C63FF" : "rgba(0,0,0,0.3)" }}>{label}</span>
          </Link>
        ))}
      </nav>

    </div>
  );
}
