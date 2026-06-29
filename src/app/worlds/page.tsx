"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface World {
  id: string; name: string; emoji: string; description: string;
  lessonCount: number; pctComplete: number; order: number; slug: string;
}
interface Lesson {
  id: string; number: number; title: string; type: string;
  durationMin: number; xpReward: number; order: number;
  progress: { completed: boolean; score: number | null } | null;
}

function WorldsContent() {
  const searchParams = useSearchParams();
  const worldId = searchParams.get("id");
  const [worlds, setWorlds] = useState<World[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (worldId) {
          const res = await fetch(`/api/lessons?worldId=${worldId}`);
          if (res.ok) {
            const data = await res.json();
            setLessons(data.lessons ?? []);
            setSelectedWorld(worlds.find(w => w.id === worldId) ?? null);
          }
        } else {
          const res = await fetch("/api/lessons?levelId=level-1");
          if (res.ok) {
            const data = await res.json();
            setWorlds(data.worlds ?? []);
          }
        }
      } catch (err) {
        console.error("Worlds load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [worldId]);

  const TYPE_ICON: Record<string, string> = {
    VIDEO: "▶", READING: "📖", QUIZ: "🎯", PROJECT: "🚀", PRACTICE: "💪", EVALUATION: "📊",
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "32px", marginBottom: "8px" }}>⚡</div>
        <p style={{ color: "rgba(0,0,0,0.3)", fontSize: "13px" }}>Cargando...</p>
      </div>
    </div>
  );

  // Show lessons of a world
  if (worldId && lessons.length > 0) {
    const completed = lessons.filter(l => l.progress?.completed).length;
    const pct = lessons.length > 0 ? (completed / lessons.length) * 100 : 0;

    return (
      <div style={{ minHeight: "100vh", background: "#F7F7F5", paddingBottom: "80px" }}>
        <div style={{ background: "#111", padding: "16px" }}>
          <Link href="/worlds" style={{ color: "rgba(255,255,255,0.4)", fontSize: "20px", textDecoration: "none" }}>←</Link>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "12px", marginBottom: "14px" }}>
            <span style={{ fontSize: "28px" }}>{selectedWorld?.emoji ?? "🌍"}</span>
            <div>
              <p style={{ fontWeight: 900, color: "#fff", fontSize: "16px" }}>{selectedWorld?.name ?? "Mundo"}</p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{lessons.length} lecciones · {Math.round(pct)}% completado</p>
            </div>
          </div>
          <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "#FFFC00", borderRadius: "2px" }} />
          </div>
        </div>

        <div style={{ padding: "12px 16px" }}>
          {lessons.map((lesson, i) => {
            const done = lesson.progress?.completed ?? false;
            const isNext = !done && !lessons.slice(0, i).some(l => !l.progress?.completed);
            return (
              <Link key={lesson.id} href={`/lesson/${lesson.id}`} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "12px", borderRadius: "14px", marginBottom: "6px",
                  background: done ? "#fff" : isNext ? "rgba(108,99,255,0.06)" : "#fff",
                  border: isNext ? "1px solid rgba(108,99,255,0.2)" : "0.5px solid rgba(0,0,0,0.07)",
                  opacity: 1,
                }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px",
                    background: done ? "#E8F5E9" : isNext ? "rgba(108,99,255,0.1)" : "rgba(0,0,0,0.04)",
                  }}>
                    {done ? "✅" : TYPE_ICON[lesson.type] ?? "📖"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#111", marginBottom: "2px" }}>{lesson.title}</p>
                    <p style={{ fontSize: "10px", color: "rgba(0,0,0,0.35)" }}>
                      {lesson.durationMin} min · +{lesson.xpReward} XP
                    </p>
                  </div>
                  {done && <span style={{ fontSize: "10px", color: "#2E7D32", fontWeight: 700 }}>✓</span>}
                  {isNext && <span style={{ fontSize: "10px", color: "#6C63FF", fontWeight: 700 }}>Siguiente</span>}
                </div>
              </Link>
            );
          })}
        </div>

        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "0.5px solid rgba(0,0,0,0.08)", display: "flex" }}>
          {[{href:"/dashboard",icon:"🏠",label:"Inicio"},{href:"/worlds",icon:"🌍",label:"Mundos",active:true},{href:"/vy",icon:"🤖",label:"VY"},{href:"/community",icon:"👥",label:"Comunidad"},{href:"/profile",icon:"👤",label:"Perfil"}].map(({href,icon,label,active}) => (
            <Link key={href} href={href} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"10px 0 6px",gap:"2px",textDecoration:"none"}}>
              <span style={{fontSize:"18px",lineHeight:1}}>{icon}</span>
              <span style={{fontSize:"9px",fontWeight:500,color:active?"#6C63FF":"rgba(0,0,0,0.3)"}}>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    );
  }

  // Show worlds list
  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", paddingBottom: "80px" }}>
      <div style={{ background: "#111", padding: "16px" }}>
        <Link href="/dashboard" style={{ color: "rgba(255,255,255,0.4)", fontSize: "20px", textDecoration: "none" }}>←</Link>
        <h1 style={{ fontWeight: 900, color: "#fff", fontSize: "20px", marginTop: "12px" }}>Nivel 1 — AI Explorer</h1>
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>150 lecciones · 10 mundos · Gratis</p>
      </div>

      <div style={{ padding: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {(worlds.length > 0 ? worlds : [
          {id:"world-1",name:"Bienvenido al Futuro",emoji:"🌍",description:"Qué es la IA",lessonCount:15,pctComplete:0,order:1,slug:"bienvenido"},
          {id:"world-2",name:"Historia de la IA",emoji:"📜",description:"De Turing a ChatGPT",lessonCount:15,pctComplete:0,order:2,slug:"historia"},
          {id:"world-3",name:"IA en tu Vida",emoji:"🤖",description:"IA cotidiana",lessonCount:15,pctComplete:0,order:3,slug:"cotidiana"},
          {id:"world-4",name:"Prompt Engineering",emoji:"⚡",description:"Habla con la IA",lessonCount:15,pctComplete:0,order:4,slug:"prompts"},
        ]).map(w => (
          <Link key={w.id} href={`/worlds?id=${w.id}`} style={{ textDecoration: "none" }}>
            <div style={{ background: "#fff", borderRadius: "16px", padding: "14px", border: "0.5px solid rgba(0,0,0,0.08)" }}>
              <div style={{ fontSize: "26px", marginBottom: "8px" }}>{w.emoji}</div>
              <p style={{ fontWeight: 700, fontSize: "12px", color: "#111", marginBottom: "8px", lineHeight: 1.3 }}>{w.name}</p>
              <div style={{ height: "3px", background: "rgba(0,0,0,0.06)", borderRadius: "2px", marginBottom: "4px" }}>
                <div style={{ height: "100%", width: `${(w.pctComplete ?? 0) * 100}%`, background: "#6C63FF", borderRadius: "2px" }} />
              </div>
              <p style={{ fontSize: "9px", color: "rgba(0,0,0,0.3)" }}>{w.lessonCount} lecciones</p>
            </div>
          </Link>
        ))}
      </div>

      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "0.5px solid rgba(0,0,0,0.08)", display: "flex" }}>
        {[{href:"/dashboard",icon:"🏠",label:"Inicio"},{href:"/worlds",icon:"🌍",label:"Mundos",active:true},{href:"/vy",icon:"🤖",label:"VY"},{href:"/community",icon:"👥",label:"Comunidad"},{href:"/profile",icon:"👤",label:"Perfil"}].map(({href,icon,label,active}) => (
          <Link key={href} href={href} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"10px 0 6px",gap:"2px",textDecoration:"none"}}>
            <span style={{fontSize:"18px",lineHeight:1}}>{icon}</span>
            <span style={{fontSize:"9px",fontWeight:500,color:active?"#6C63FF":"rgba(0,0,0,0.3)"}}>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default function WorldsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: "32px" }}>⚡</span></div>}>
      <WorldsContent />
    </Suspense>
  );
}
