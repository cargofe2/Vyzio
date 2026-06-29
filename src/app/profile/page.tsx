"use client";
import { useEffect, useState } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

interface Gamification {
  xpTotal: number; rank: string; rankLevel: number;
  streakDays: number; lessonsCompleted: number; gems: number;
}
interface Achievement {
  achievement: { emoji: string; name: string; description: string; rarity: string };
  earnedAt: string;
}

const DS = {
  bg: "#080B14",
  card: "rgba(99,102,241,0.05)",
  cardBorder: "rgba(99,102,241,0.1)",
  accent: "#6366F1",
  accentLight: "#818CF8",
  text: "#fff",
  textSub: "rgba(255,255,255,0.4)",
  textMuted: "rgba(255,255,255,0.2)",
  success: "#34D399",
};

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

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [gamification, setGamification] = useState<Gamification | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/gamification");
        if (res.ok) {
          const data = await res.json();
          setGamification(data.gamification);
          setAchievements(data.achievements ?? []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (isLoaded && user) load();
  }, [isLoaded, user]);

  if (!isLoaded) return (
    <div style={{ minHeight: "100vh", background: DS.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontSize: "28px" }}>⚡</span>
    </div>
  );

  const rank = gamification?.rank ?? "NOVICE";
  const rankCfg = RANK_CONFIG[rank] ?? RANK_CONFIG.NOVICE;
  const xp = gamification?.xpTotal ?? 0;

  return (
    <div style={{ minHeight: "100vh", background: DS.bg, paddingBottom: "80px" }}>

      {/* Header */}
      <div style={{
        background: "rgba(8,11,20,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${DS.cardBorder}`,
        padding: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", marginBottom: "14px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "30px",
            background: "rgba(99,102,241,0.12)",
            border: `2px solid ${DS.accent}`,
            flexShrink: 0,
          }}>🧑‍💻</div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "17px", color: DS.text, marginBottom: "2px" }}>
              {user?.fullName ?? "Estudiante"}
            </h1>
            <p style={{ fontSize: "11px", color: DS.textMuted, marginBottom: "6px", fontFamily: "'DM Sans', sans-serif" }}>
              @{user?.username ?? user?.firstName?.toLowerCase() ?? "usuario"}
            </p>
            <span style={{
              fontSize: "9px", padding: "2px 8px", borderRadius: "8px", fontWeight: 700,
              background: `${rankCfg.color}18`, color: rankCfg.color,
              border: `1px solid ${rankCfg.color}33`,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {rankCfg.label} · Lv.{gamification?.rankLevel ?? 1}
            </span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>

        {/* Stats row */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          background: "rgba(99,102,241,0.06)",
          border: `1px solid ${DS.cardBorder}`,
          borderRadius: "14px", overflow: "hidden",
        }}>
          {[
            { v: gamification?.lessonsCompleted ?? 0, l: "Lecciones" },
            { v: xp.toLocaleString(), l: "XP Total" },
            { v: `🔥 ${gamification?.streakDays ?? 0}`, l: "Racha" },
          ].map(({ v, l }, i) => (
            <div key={l} style={{
              padding: "12px", textAlign: "center",
              borderLeft: i > 0 ? `1px solid ${DS.cardBorder}` : "none",
            }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "15px", color: DS.text }}>{v}</div>
              <div style={{ fontSize: "9px", color: DS.textMuted, marginTop: "2px", fontFamily: "'DM Sans', sans-serif" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>

        {/* Gemas */}
        <div style={{
          background: DS.card, border: `1px solid ${DS.cardBorder}`,
          borderRadius: "16px", padding: "14px",
          display: "flex", alignItems: "center", gap: "12px",
        }}>
          <div style={{
            width: "40px", height: "40px",
            background: "rgba(167,139,250,0.1)",
            border: "1px solid rgba(167,139,250,0.2)",
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px",
          }}>💎</div>
          <div>
            <p style={{ fontWeight: 700, fontSize: "13px", color: DS.text, fontFamily: "'DM Sans', sans-serif" }}>
              {gamification?.gems ?? 0} Gemas
            </p>
            <p style={{ fontSize: "11px", color: DS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
              Ganas gemas con quizzes perfectos
            </p>
          </div>
        </div>

        {/* Certificado */}
        <div style={{
          background: "rgba(99,102,241,0.08)",
          border: `1px solid rgba(99,102,241,0.2)`,
          borderRadius: "16px", padding: "14px",
          display: "flex", alignItems: "center", gap: "12px",
        }}>
          <div style={{
            width: "40px", height: "40px",
            background: "rgba(99,102,241,0.12)",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px",
          }}>🎓</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: "13px", color: DS.text, fontFamily: "'DM Sans', sans-serif" }}>
              Certificado AI Explorer
            </p>
            <p style={{ fontSize: "11px", color: DS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
              Completa el Nivel 1 para obtenerlo
            </p>
          </div>
          <Link href="/worlds" style={{
            padding: "6px 12px",
            background: DS.accent, color: "#fff",
            borderRadius: "10px", fontSize: "11px", fontWeight: 700,
            textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
          }}>Ir →</Link>
        </div>

        {/* Achievements */}
        <section>
          <h2 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: DS.textMuted, marginBottom: "10px", fontFamily: "'DM Sans', sans-serif" }}>
            Logros
          </h2>
          {loading ? (
            <p style={{ fontSize: "12px", color: DS.textMuted, textAlign: "center", fontFamily: "'DM Sans', sans-serif" }}>Cargando...</p>
          ) : achievements.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {achievements.map((a, i) => (
                <div key={i} style={{
                  background: DS.card, border: `1px solid ${DS.cardBorder}`,
                  borderRadius: "14px", padding: "12px",
                }}>
                  <div style={{ fontSize: "24px", marginBottom: "6px" }}>{a.achievement.emoji}</div>
                  <p style={{ fontWeight: 700, fontSize: "11px", color: DS.text, marginBottom: "2px", fontFamily: "'DM Sans', sans-serif" }}>
                    {a.achievement.name}
                  </p>
                  <p style={{ fontSize: "9px", color: DS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                    {a.achievement.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              background: DS.card, border: `1px solid ${DS.cardBorder}`,
              borderRadius: "16px", padding: "24px", textAlign: "center",
            }}>
              <p style={{ fontSize: "28px", marginBottom: "8px" }}>🏆</p>
              <p style={{ fontSize: "12px", fontWeight: 600, color: DS.text, marginBottom: "4px", fontFamily: "'DM Sans', sans-serif" }}>
                Sin logros aún
              </p>
              <p style={{ fontSize: "11px", color: DS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                Completa lecciones para desbloquear logros
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Bottom Nav */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(8,11,20,0.95)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: `1px solid ${DS.cardBorder}`,
        display: "flex",
      }}>
        {[
          { href: "/dashboard", icon: "🏠", label: "Inicio",  active: false },
          { href: "/worlds",    icon: "🌍", label: "Mundos",  active: false },
          { href: "/vy",        icon: "🤖", label: "VY",      active: false },
          { href: "/community", icon: "👥", label: "Liga",    active: false },
          { href: "/profile",   icon: "👤", label: "Perfil",  active: true  },
        ].map(({ href, icon, label, active }) => (
          <Link key={href} href={href} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0 8px", gap: "3px", textDecoration: "none", position: "relative" }}>
            {active && <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "16px", height: "2px", background: DS.accent, borderRadius: "0 0 3px 3px" }} />}
            <span style={{ fontSize: "19px", lineHeight: 1 }}>{icon}</span>
            <span style={{ fontSize: "9px", fontWeight: active ? 700 : 500, color: active ? "#818CF8" : "rgba(255,255,255,0.2)", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
