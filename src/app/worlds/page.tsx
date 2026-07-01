"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface World { id: string; name: string; emoji: string; description: string; lessonCount: number; pctComplete: number; order: number; slug: string; }
interface Lesson { id: string; number: number; title: string; type: string; durationMin: number; xpReward: number; order: number; progress: { completed: boolean; score: number | null } | null; }

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  VIDEO: { label: "Video", color: "#F87171", bg: "rgba(248,113,113,0.1)", icon: "▶" },
  READING: { label: "Lectura", color: "#7DD3FC", bg: "rgba(125,211,252,0.1)", icon: "📖" },
  QUIZ: { label: "Quiz", color: "#FBBF24", bg: "rgba(251,191,36,0.1)", icon: "🎯" },
  PROJECT: { label: "Proyecto", color: "#A78BFA", bg: "rgba(167,139,250,0.1)", icon: "🚀" },
  EVALUATION: { label: "Eval", color: "#F472B6", bg: "rgba(244,114,182,0.1)", icon: "📊" },
  PRACTICE: { label: "Práctica", color: "#34D399", bg: "rgba(52,211,153,0.1)", icon: "💪" },
};

const WV: Record<number, { color: string; bg: string; border: string; grad: string; path: string }> = {
  0: { color: "#F5FF4D", bg: "rgba(245,255,77,0.1)", border: "rgba(245,255,77,0.2)", grad: "linear-gradient(90deg,#F5FF4D,#FBBF24)", path: "M12 2L13.8 8.2H20L14.8 11.8L16.6 18L12 14.4L7.4 18L9.2 11.8L4 8.2H10.2L12 2Z" },
  1: { color: "#818CF8", bg: "rgba(123,97,255,0.1)", border: "rgba(123,97,255,0.18)", grad: "linear-gradient(90deg,#7B61FF,#8B5CF6)", path: "" },
  2: { color: "#FBBF24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.18)", grad: "linear-gradient(90deg,#FBBF24,#F59E0B)", path: "" },
  3: { color: "#00D4FF", bg: "rgba(0,212,255,0.1)", border: "rgba(0,212,255,0.18)", grad: "linear-gradient(90deg,#00D4FF,#0EA5E9)", path: "" },
  4: { color: "#A78BFA", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.18)", grad: "linear-gradient(90deg,#A78BFA,#7C3AED)", path: "" },
  5: { color: "#F472B6", bg: "rgba(244,114,182,0.1)", border: "rgba(244,114,182,0.18)", grad: "linear-gradient(90deg,#F472B6,#EC4899)", path: "" },
  6: { color: "#34D399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.18)", grad: "linear-gradient(90deg,#34D399,#10B981)", path: "" },
  7: { color: "#F87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.18)", grad: "linear-gradient(90deg,#F87171,#EF4444)", path: "" },
  8: { color: "#38BDF8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.18)", grad: "linear-gradient(90deg,#38BDF8,#0284C7)", path: "" },
  9: { color: "#4ADE80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.18)", grad: "linear-gradient(90deg,#4ADE80,#16A34A)", path: "" },
  10: { color: "#FB923C", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.18)", grad: "linear-gradient(90deg,#FB923C,#EA580C)", path: "" },
};
function getV(order: number) { return WV[order] ?? WV[1]; }

function NavBar({ active }: { active: string }) {
  const items = [
    { href: "/dashboard", label: "Inicio", color: "#7B61FF", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3L21 10.5V20C21 20.6 20.6 21 20 21H15V15H9V21H4C3.4 21 3 20.6 3 20V10.5Z" stroke="#7B61FF" strokeWidth="1.8" strokeLinejoin="round" strokeOpacity="0.5"/><path d="M13 9L11 12H13L10.5 15.5" stroke="#F5FF4D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4"/></svg> },
    { href: "/worlds", label: "Mundos", color: "#00D4FF", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="#00D4FF" strokeWidth="1.8" strokeOpacity="0.5"/><ellipse cx="12" cy="12" rx="3.5" ry="8.5" stroke="#00D4FF" strokeWidth="1.5" strokeOpacity="0.4"/><path d="M4 9.5H20M4 14.5H20" stroke="#00D4FF" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.3"/></svg> },
    { href: "/vy", label: "VY", color: "#00FFB3", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" stroke="#00FFB3" strokeWidth="1.8" strokeOpacity="0.5"/><path d="M8 8L12 16L16 8" stroke="#00FFB3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5"/></svg> },
    { href: "/community", label: "Liga", color: "#FBBF24", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="9" y="10" width="6" height="12" rx="1" stroke="#FBBF24" strokeWidth="1.8" strokeOpacity="0.5"/><rect x="2" y="14" width="6" height="8" rx="1" stroke="#FBBF24" strokeWidth="1.5" strokeOpacity="0.3"/><rect x="16" y="16" width="6" height="6" rx="1" stroke="#FBBF24" strokeWidth="1.5" strokeOpacity="0.3"/><path d="M12 2L13.1 5.3H16.6L13.7 7.4L14.8 10.7L12 8.5L9.2 10.7L10.3 7.4L7.4 5.3H10.9L12 2Z" stroke="#FBBF24" strokeWidth="1.3" strokeLinejoin="round" strokeOpacity="0.5"/></svg> },
    { href: "/profile", label: "Perfil", color: "#F472B6", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L20.5 7V17L12 22L3.5 17V7L12 2Z" stroke="#F472B6" strokeWidth="1.8" strokeLinejoin="round" strokeOpacity="0.5"/><circle cx="12" cy="9.5" r="2.5" stroke="#F472B6" strokeWidth="1.5" strokeOpacity="0.5"/><path d="M7.5 17C7.5 14.5 9.5 12.5 12 12.5C14.5 12.5 16.5 14.5 16.5 17" stroke="#F472B6" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5"/></svg> },
  ];
  return (
    <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(13,17,26,0.96)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid rgba(123,97,255,0.1)", display: "flex", padding: "6px 0" }}>
      {items.map(({ href, label, color, icon }) => {
        const isActive = href === active;
        return (
          <Link key={href} href={href} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", textDecoration: "none", padding: "4px 0" }}>
            <div style={{ width: "40px", height: "40px", background: isActive ? `${color}20` : `${color}10`, border: `1px solid ${color}${isActive ? "40" : "20"}`, borderRadius: "13px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: isActive ? `0 0 12px ${color}40` : "none" }}>{icon}</div>
            <span style={{ fontSize: "8px", fontFamily: isActive ? "'Syne',sans-serif" : "'DM Sans',sans-serif", fontWeight: isActive ? 800 : 500, color: isActive ? color : "rgba(255,255,255,0.2)", letterSpacing: isActive ? "0.5px" : "0" }}>{isActive ? label.toUpperCase() : label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function WorldsContent() {
  const searchParams = useSearchParams();
  const worldId = searchParams.get("id");
  const levelId = searchParams.get("levelId") || "level-1";
  const [worlds, setWorlds] = useState<World[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (worldId) {
          const [worldsRes, lessonsRes] = await Promise.all([
            fetch(`/api/lessons?levelId=${levelId}`),
            fetch(`/api/lessons?worldId=${worldId}`),
          ]);
          if (worldsRes.ok) {
            const d = await worldsRes.json();
            setWorlds(d.worlds ?? []);
            setSelectedWorld(d.worlds?.find((w: World) => w.id === worldId) ?? null);
          }
          if (lessonsRes.ok) { const d = await lessonsRes.json(); setLessons(d.lessons ?? []); }
        } else {
          const res = await fetch(`/api/lessons?levelId=${levelId}`);
          if (res.ok) { const d = await res.json(); setWorlds(d.worlds ?? []); }
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [worldId, levelId]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0D111A", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", fontFamily: "'DM Sans',sans-serif" }}>Cargando...</p>
    </div>
  );

  // Vista de lecciones
  if (worldId && lessons.length > 0) {
    const completed = lessons.filter(l => l.progress?.completed).length;
    const pct = lessons.length > 0 ? (completed / lessons.length) * 100 : 0;
    const v = selectedWorld ? getV(selectedWorld.order) : getV(1);

    return (
      <div style={{ minHeight: "100vh", background: "#0D111A", paddingBottom: "88px" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(13,17,26,0.93)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(123,97,255,0.1)", padding: "11px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <Link href="/worlds" style={{ color: "rgba(255,255,255,0.4)", fontSize: "18px", textDecoration: "none" }}>←</Link>
            <span style={{ fontSize: "24px" }}>{selectedWorld?.emoji ?? "🌍"}</span>
            <div>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: v.color, fontSize: "16px" }}>{selectedWorld?.name ?? "Mundo"}</p>
              <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans',sans-serif" }}>{lessons.length} lecciones · {Math.round(pct)}% completado</p>
            </div>
          </div>
          <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: v.grad, borderRadius: "2px", transition: "width 0.8s ease" }} />
          </div>
        </div>

        {worlds.length > 0 && (
          <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(123,97,255,0.08)", overflowX: "auto", display: "flex", gap: "6px" }}>
            {worlds.map(w => {
              const isActive = w.id === worldId;
              const wv = getV(w.order);
              return (
                <Link key={w.id} href={`/worlds?id=${w.id}`} style={{ textDecoration: "none", flexShrink: 0 }}>
                  <div style={{ padding: "5px 12px", borderRadius: "20px", border: isActive ? `1px solid ${wv.color}50` : "1px solid rgba(123,97,255,0.1)", background: isActive ? wv.bg : "rgba(123,97,255,0.04)", color: isActive ? wv.color : "rgba(255,255,255,0.25)", fontSize: "11px", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span>{w.emoji}</span><span>{w.name}</span>
                    {Math.round((w.pctComplete ?? 0) * 100) >= 100 && <span style={{ color: "#34D399" }}>✓</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "7px" }}>
          {lessons.map((lesson, i) => {
            const done = lesson.progress?.completed ?? false;
            const isNext = !done && lessons.slice(0, i).every(l => l.progress?.completed);
            const typeCfg = TYPE_CONFIG[lesson.type] ?? TYPE_CONFIG.READING;
            return (
              <Link key={lesson.id} href={`/lesson/${lesson.id}`} style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "16px", background: done ? "rgba(52,211,153,0.05)" : isNext ? v.bg : "rgba(123,97,255,0.04)", border: done ? "1px solid rgba(52,211,153,0.18)" : isNext ? `1px solid ${v.border}` : "1px solid rgba(123,97,255,0.08)" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "11px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: done ? "rgba(52,211,153,0.12)" : typeCfg.bg, border: `1px solid ${done ? "rgba(52,211,153,0.2)" : typeCfg.color + "30"}`, fontFamily: "'Syne',sans-serif", fontSize: done ? "14px" : "16px", fontWeight: 800, color: done ? "#34D399" : typeCfg.color }}>
                    {done ? "✓" : typeCfg.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: done ? "#34D399" : "#fff", marginBottom: "3px", fontFamily: "'DM Sans',sans-serif" }}>{lesson.title}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "6px", background: typeCfg.bg, color: typeCfg.color, fontFamily: "'DM Sans',sans-serif" }}>{typeCfg.label}</span>
                      <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans',sans-serif" }}>{lesson.durationMin} min</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontSize: "11px", fontWeight: 800, color: done ? "rgba(255,255,255,0.2)" : "#FBBF24", fontFamily: "'Syne',sans-serif" }}>{done ? "✓" : `+${lesson.xpReward}`}</p>
                    <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans',sans-serif" }}>{done ? "listo" : isNext ? "▶ Siguiente" : "XP"}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <NavBar active="/worlds" />
      </div>
    );
  }

  // Vista de mundos con iconos coloridos
  return (
    <div style={{ minHeight: "100vh", background: "#0D111A", paddingBottom: "88px" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(13,17,26,0.93)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(123,97,255,0.1)", padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link href="/dashboard" style={{ color: "rgba(255,255,255,0.4)", fontSize: "18px", textDecoration: "none" }}>←</Link>
          <div>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#fff", fontSize: "18px" }}>Nivel 0 — AI Foundations</h1>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans',sans-serif" }}>{worlds.length} mundos · Gratis</p>
          </div>
        </div>
      </div>

      <div style={{ padding: "14px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {(worlds.length > 0 ? worlds : [{ id: "w0", name: "Tu aventura comienza", emoji: "🚀", description: "", lessonCount: 1, pctComplete: 0, order: 0, slug: "" }]).map(w => {
          const pctW = Math.round((w.pctComplete ?? 0) * 100);
          const done = pctW >= 100;
          const v = getV(w.order);
          return (
            <Link key={w.id} href={`/worlds?id=${w.id}`} style={{ textDecoration: "none" }}>
              <div style={{ background: v.bg, border: `1px solid ${v.border}`, borderRadius: "18px", padding: "14px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: done ? "100%" : `${pctW}%`, height: "3px", background: v.grad, opacity: pctW > 0 ? 1 : 0 }} />
                {done && <div style={{ position: "absolute", top: "8px", right: "8px", width: "20px", height: "20px", background: "rgba(52,211,153,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#34D399" }}>✓</div>}
                <div style={{ fontSize: "30px", marginBottom: "8px" }}>{w.emoji}</div>
                <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "13px", color: done ? "#34D399" : v.color, marginBottom: "8px", lineHeight: 1.3 }}>{w.name}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>{w.lessonCount} lecciones</p>
                  {pctW > 0 && <span style={{ fontSize: "10px", color: done ? "#34D399" : v.color, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", background: done ? "rgba(52,211,153,0.15)" : v.bg, padding: "1px 7px", borderRadius: "20px" }}>{pctW}%</span>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <NavBar active="/worlds" />
    </div>
  );
}

export default function WorldsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0D111A", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif", fontSize: "12px" }}>Cargando...</p></div>}>
      <WorldsContent />
    </Suspense>
  );
}
