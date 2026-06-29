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
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    }
    if (isLoaded && user) load();
  }, [isLoaded, user]);

  if (!isLoaded) return (
    <div style={{ minHeight: "100vh", background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontSize: "32px" }}>⚡</span>
    </div>
  );

  const rank = gamification?.rank ?? "NOVICE";
  const xp = gamification?.xpTotal ?? 0;

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "80px", background: "#F7F7F5" }}>
      {/* Header */}
      <div style={{ background: "#111", padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", marginBottom: "16px" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", background: "rgba(255,252,0,0.1)", border: "3px solid #FFFC00", flexShrink: 0 }}>
            🧑‍💻
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontWeight: 900, fontSize: "18px", color: "#fff", marginBottom: "2px" }}>{user?.fullName ?? "Estudiante"}</h1>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "6px" }}>
              @{user?.username ?? user?.firstName?.toLowerCase() ?? "usuario"}
            </p>
            <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "8px", fontWeight: 700, background: "rgba(108,99,255,0.2)", color: "#6C63FF" }}>
              {rank} · Lv.{gamification?.rankLevel ?? 1}
            </span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderRadius: "12px", overflow: "hidden", background: "rgba(255,255,255,0.05)" }}>
          {[
            [String(gamification?.lessonsCompleted ?? 0), "Lecciones"],
            [String(xp.toLocaleString()), "XP Total"],
            [`🔥 ${gamification?.streakDays ?? 0}`, "Racha"],
          ].map(([v, l]) => (
            <div key={l} style={{ padding: "12px", textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontWeight: 900, fontSize: "16px", color: "#fff" }}>{v}</div>
              <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>

        {/* Certificado */}
        <div style={{ borderRadius: "16px", padding: "14px", display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,252,0,0.08)", border: "1px solid rgba(255,252,0,0.2)" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", background: "rgba(255,252,0,0.15)" }}>🎓</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: "13px", color: "#111" }}>Certificado AI Explorer</p>
            <p style={{ fontSize: "11px", color: "rgba(0,0,0,0.4)" }}>Completa el Nivel 1 para obtenerlo</p>
          </div>
          <Link href="/worlds" style={{ padding: "6px 12px", background: "#111", color: "#FFFC00", borderRadius: "10px", fontSize: "11px", fontWeight: 700, textDecoration: "none" }}>
            Ir →
          </Link>
        </div>

        {/* Gemas */}
        <div style={{ borderRadius: "16px", padding: "14px", display: "flex", alignItems: "center", gap: "12px", background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: "28px" }}>💎</div>
          <div>
            <p style={{ fontWeight: 700, fontSize: "13px", color: "#111" }}>{gamification?.gems ?? 0} Gemas</p>
            <p style={{ fontSize: "11px", color: "rgba(0,0,0,0.4)" }}>Ganas gemas al completar quizzes perfectos</p>
          </div>
        </div>

        {/* Achievements */}
        <section>
          <h2 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "rgba(0,0,0,0.35)", marginBottom: "10px" }}>
            Logros
          </h2>
          {loading ? (
            <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.3)", textAlign: "center" }}>Cargando logros...</p>
          ) : achievements.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {achievements.map((a, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: "14px", padding: "12px", border: "0.5px solid rgba(0,0,0,0.08)" }}>
                  <div style={{ fontSize: "24px", marginBottom: "6px" }}>{a.achievement.emoji}</div>
                  <p style={{ fontWeight: 700, fontSize: "12px", color: "#111", marginBottom: "2px" }}>{a.achievement.name}</p>
                  <p style={{ fontSize: "10px", color: "rgba(0,0,0,0.4)" }}>{a.achievement.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", textAlign: "center", border: "0.5px solid rgba(0,0,0,0.08)" }}>
              <p style={{ fontSize: "32px", marginBottom: "8px" }}>🏆</p>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#111", marginBottom: "4px" }}>Sin logros aún</p>
              <p style={{ fontSize: "11px", color: "rgba(0,0,0,0.4)" }}>Completa lecciones para desbloquear logros</p>
            </div>
          )}
        </section>

      </div>

      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "0.5px solid rgba(0,0,0,0.08)", display: "flex" }}>
        {[
          { href: "/dashboard", icon: "🏠", label: "Inicio" },
          { href: "/worlds", icon: "🌍", label: "Mundos" },
          { href: "/vy", icon: "🤖", label: "VY" },
          { href: "/community", icon: "👥", label: "Comunidad" },
          { href: "/profile", icon: "👤", label: "Perfil", active: true },
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
