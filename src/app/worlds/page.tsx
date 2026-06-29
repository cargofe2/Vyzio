"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Lesson {
  id: string; number: number; title: string; type: string;
  durationMin: number; xpReward: number;
  progress: { completed: boolean } | null;
}
interface World {
  id: string; number: number; name: string; emoji: string;
  description: string; lessonCount: number; order: number;
  lessons: Lesson[];
  progress: { pctComplete: number; completed: boolean } | null;
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
  successBg: "rgba(52,211,153,0.08)",
  successBorder: "rgba(52,211,153,0.18)",
};

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  VIDEO:      { label: "Video",    color: "#F87171", bg: "rgba(248,113,113,0.1)" },
  READING:    { label: "Lectura",  color: "#7DD3FC", bg: "rgba(125,211,252,0.1)" },
  QUIZ:       { label: "Quiz",     color: "#FBBF24", bg: "rgba(251,191,36,0.1)"  },
  PROJECT:    { label: "Proyecto", color: "#A78BFA", bg: "rgba(167,139,250,0.1)" },
  EVALUATION: { label: "Eval",     color: "#F472B6", bg: "rgba(244,114,182,0.1)" },
  PRACTICE:   { label: "Práctica", color: "#34D399", bg: "rgba(52,211,153,0.1)"  },
};

export default function WorldsPage() {
  const searchParams = useSearchParams();
  const worldId = searchParams.get("id");
  const [worlds, setWorlds] = useState<World[]>([]);
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/lessons?levelId=level-1");
        if (res.ok) {
          const { worlds: w } = await res.json();
          setWorlds(w ?? []);
          const target = worldId ? w.find((x: World) => x.id === worldId) : w[0];
          if (target) {
            setSelectedWorld(target);
            setLessons(target.lessons ?? []);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [worldId]);

  const pct = Math.round((selectedWorld?.progress?.pctComplete ?? 0) * 100);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: DS.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "28px", marginBottom: "8px" }}>🌍</div>
        <p style={{ color: DS.textMuted, fontSize: "12px", fontFamily: "'DM Sans', sans-serif" }}>Cargando mundos...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: DS.bg, paddingBottom: "80px" }}>

      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(8,11,20,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${DS.cardBorder}`,
        padding: "11px 16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link href="/dashboard" style={{ color: DS.textSub, fontSize: "18px", textDecoration: "none" }}>←</Link>
          <div>
            <p style={{ fontWeight: 800, color: DS.text, fontSize: "15px", fontFamily: "'Syne', sans-serif" }}>
              {selectedWorld?.emoji} {selectedWorld?.name ?? "Mundos"}
            </p>
            <p style={{ fontSize: "10px", color: DS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
              {lessons.length} lecciones · {pct}% completado
            </p>
          </div>
        </div>
        {pct > 0 && (
          <div style={{ marginTop: "8px", height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${DS.accent}, #A78BFA)`, borderRadius: "2px", transition: "width 0.8s ease" }} />
          </div>
        )}
      </div>

      {/* World selector */}
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${DS.cardBorder}` }}>
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
          {worlds.map(w => {
            const isActive = w.id === selectedWorld?.id;
            const wPct = Math.round((w.progress?.pctComplete ?? 0) * 100);
            return (
              <button key={w.id} onClick={() => { setSelectedWorld(w); setLessons(w.lessons ?? []); }}
                style={{
                  flexShrink: 0,
                  padding: "6px 12px",
                  borderRadius: "20px",
                  border: isActive ? `1px solid ${DS.accent}` : `1px solid ${DS.cardBorder}`,
                  background: isActive ? `rgba(99,102,241,0.15)` : DS.card,
                  color: isActive ? DS.accentLight : DS.textSub,
                  fontSize: "11px", fontWeight: 700, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  display: "flex", alignItems: "center", gap: "5px",
                }}>
                <span>{w.emoji}</span>
                <span>{w.name}</span>
                {wPct >= 100 && <span style={{ color: DS.success }}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lessons list */}
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {lessons.map((lesson, i) => {
          const done = lesson.progress?.completed ?? false;
          const typeCfg = TYPE_CONFIG[lesson.type] ?? TYPE_CONFIG.READING;
          return (
            <Link key={lesson.id} href={`/lesson/${lesson.id}`} style={{ textDecoration: "none" }}>
              <div style={{
                background: done ? DS.successBg : DS.card,
                border: done ? `1px solid ${DS.successBorder}` : `1px solid ${DS.cardBorder}`,
                borderRadius: "16px",
                padding: "12px 14px",
                display: "flex", alignItems: "center", gap: "12px",
                transition: "all 0.2s",
              }}>
                {/* Number */}
                <div style={{
                  width: "32px", height: "32px", flexShrink: 0,
                  background: done ? "rgba(52,211,153,0.15)" : "rgba(99,102,241,0.1)",
                  border: `1px solid ${done ? "rgba(52,211,153,0.25)" : "rgba(99,102,241,0.15)"}`,
                  borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Syne', sans-serif",
                  fontSize: done ? "14px" : "12px",
                  fontWeight: 800,
                  color: done ? DS.success : DS.accentLight,
                }}>
                  {done ? "✓" : lesson.number}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: done ? DS.success : DS.text, fontSize: "13px", marginBottom: "3px", fontFamily: "'DM Sans', sans-serif" }}>
                    {lesson.title}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{
                      fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "6px",
                      background: typeCfg.bg, color: typeCfg.color,
                      fontFamily: "'DM Sans', sans-serif",
                    }}>{typeCfg.label}</span>
                    <span style={{ fontSize: "9px", color: DS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{lesson.durationMin} min</span>
                  </div>
                </div>

                {/* XP */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: "11px", fontWeight: 800, color: done ? DS.textMuted : "#FBBF24", fontFamily: "'Syne', sans-serif" }}>
                    {done ? "✓" : `+${lesson.xpReward}`}
                  </p>
                  <p style={{ fontSize: "8px", color: DS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
                    {done ? "completado" : "XP"}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}

        {lessons.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontSize: "32px", marginBottom: "8px" }}>🔒</p>
            <p style={{ fontSize: "13px", color: DS.textSub, fontFamily: "'DM Sans', sans-serif" }}>Contenido próximamente</p>
          </div>
        )}
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
          { href: "/dashboard", icon: "🏠", label: "Inicio", active: false },
          { href: "/worlds",    icon: "🌍", label: "Mundos", active: true  },
          { href: "/vy",        icon: "🤖", label: "VY",     active: false },
          { href: "/community", icon: "👥", label: "Liga",   active: false },
          { href: "/profile",   icon: "👤", label: "Perfil", active: false },
        ].map(({ href, icon, label, active }) => (
          <Link key={href} href={href} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0 8px", gap: "3px", textDecoration: "none", position: "relative" }}>
            {active && <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "16px", height: "2px", background: DS.accent, borderRadius: "0 0 3px 3px" }} />}
            <span style={{ fontSize: "19px", lineHeight: 1 }}>{icon}</span>
            <span style={{ fontSize: "9px", fontWeight: active ? 700 : 500, color: active ? DS.accentLight : DS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
