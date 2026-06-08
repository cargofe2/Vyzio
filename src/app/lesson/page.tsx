// src/app/lesson/page.tsx
import Link from "next/link";

export default function LessonPage() {
  return (
    <div className="min-h-screen pb-8" style={{ background:"#F7F7F5" }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3" style={{ background:"#111" }}>
        <Link href="/dashboard" className="text-xl" style={{ color:"rgba(255,255,255,0.5)" }}>←</Link>
        <div className="flex-1">
          <p className="text-xs" style={{ color:"rgba(255,255,255,0.4)" }}>Mundo 1 · Lección 1</p>
          <div className="h-1 rounded-full mt-2" style={{ background:"rgba(255,255,255,0.1)" }}>
            <div className="h-full rounded-full" style={{ width:"30%", background:"#FFFC00" }} />
          </div>
        </div>
        <span className="text-xs font-bold" style={{ color:"#FFFC00" }}>+60 XP</span>
      </div>

      <div className="px-4 py-5">
        <p className="text-xs font-bold mb-1" style={{ color:"#6C63FF" }}>MUNDO 1 · LECCIÓN 1</p>
        <h1 className="font-display font-black text-2xl text-black leading-tight mb-5">¿Qué es la Inteligencia Artificial?</h1>

        {/* Video placeholder */}
        <div className="rounded-2xl aspect-video flex items-center justify-center mb-5 cursor-pointer" style={{ background:"#111" }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background:"#FFFC00" }}>
            <span className="text-2xl ml-1">▶</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 mb-6">
          <p className="text-sm leading-relaxed" style={{ color:"rgba(0,0,0,0.7)" }}>
            La <strong>Inteligencia Artificial (IA)</strong> es la capacidad de una máquina para realizar tareas que normalmente requieren inteligencia humana: reconocer tu cara, entender lo que dices, traducir idiomas, o recomendar la próxima canción perfecta en Spotify.
          </p>
          <div className="rounded-xl p-3.5" style={{ background:"rgba(108,99,255,0.08)", border:"1px solid rgba(108,99,255,0.15)" }}>
            <p className="text-xs font-bold mb-1" style={{ color:"#6C63FF" }}>IMPORTANTE</p>
            <p className="text-sm leading-relaxed" style={{ color:"rgba(0,0,0,0.7)" }}>
              La IA no es un robot del futuro. Es el algoritmo que decide qué videos te muestra TikTok ahora mismo.
            </p>
          </div>
          <p className="text-sm leading-relaxed" style={{ color:"rgba(0,0,0,0.7)" }}>
            Existen dos tipos: la <strong>IA estrecha</strong> (experta en una sola tarea) y la <strong>IA general</strong> (que aún no existe). El 100% de la IA que usas hoy es IA estrecha.
          </p>
        </div>

        <Link href="/dashboard" className="block w-full py-4 rounded-2xl text-center font-display font-black text-sm" style={{ background:"#111", color:"#FFFC00" }}>
          Ir al quiz →
        </Link>
      </div>
    </div>
  );
}
