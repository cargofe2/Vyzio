import Link from "next/link";

const WORLDS = [
  { n:1,  emoji:"🌍", name:"Bienvenido al Futuro",    lessons:15, locked:false },
  { n:2,  emoji:"📜", name:"Historia de la IA",       lessons:15, locked:false },
  { n:3,  emoji:"🤖", name:"IA en tu Vida",           lessons:15, locked:false },
  { n:4,  emoji:"🎮", name:"IA en Videojuegos",       lessons:15, locked:false },
  { n:5,  emoji:"🎨", name:"IA y Creatividad",        lessons:15, locked:false },
  { n:6,  emoji:"🎵", name:"IA en Música",            lessons:15, locked:false },
  { n:7,  emoji:"💊", name:"IA en Salud",             lessons:15, locked:false },
  { n:8,  emoji:"🚗", name:"IA y Transporte",         lessons:15, locked:false },
  { n:9,  emoji:"🌍", name:"IA y Sostenibilidad",     lessons:15, locked:false },
  { n:10, emoji:"⚖️", name:"Ética de la IA",         lessons:15, locked:false },
];

export default function WorldsPage() {
  return (
    <div className="min-h-screen pb-24" style={{ background:"#F7F7F5" }}>
      <div className="px-4 py-4" style={{ background:"#111" }}>
        <h1 className="font-display font-black text-xl text-white">Nivel 1 — AI Explorer</h1>
        <p className="text-xs mt-1" style={{ color:"rgba(255,255,255,0.4)" }}>150 lecciones · 10 mundos · Gratis</p>
        <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.1)" }}>
          <div className="h-full rounded-full" style={{ width:"0%", background:"#FFFC00" }} />
        </div>
        <p className="text-[10px] mt-1" style={{ color:"rgba(255,255,255,0.25)" }}>0/150 lecciones completadas</p>
      </div>

      <div className="px-4 py-4 grid grid-cols-2 gap-2">
        {WORLDS.map(({ n, emoji, name, lessons, locked }) => (
          <Link key={n} href="/lesson" className="block rounded-2xl p-3" style={{ background:"#fff", border:`0.5px solid rgba(0,0,0,0.08)`, opacity:locked?0.4:1 }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{emoji}</span>
              {n === 1 && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background:"rgba(255,252,0,0.15)", color:"#6B5900" }}>ACTIVO</span>}
              {locked && <span className="text-base">🔒</span>}
            </div>
            <p className="font-display font-bold text-xs text-black leading-tight mb-2">{name}</p>
            <div className="h-1 rounded-full mb-1" style={{ background:"rgba(0,0,0,0.06)" }}>
              <div className="h-full rounded-full" style={{ width:"0%", background:"#6C63FF" }} />
            </div>
            <p className="text-[9px]" style={{ color:"rgba(0,0,0,0.3)" }}>{lessons} lecciones</p>
          </Link>
        ))}
      </div>

      <nav className="fixed bottom-0 inset-x-0 border-t flex" style={{ background:"#fff", borderColor:"rgba(0,0,0,0.08)" }}>
        {[{href:"/dashboard",icon:"🏠",l:"Inicio"},{href:"/worlds",icon:"🌍",l:"Mundos",a:true},{href:"/vy",icon:"🤖",l:"VY"},{href:"/community",icon:"👥",l:"Comunidad"},{href:"/profile",icon:"👤",l:"Perfil"}].map(({ href, icon, l, a }) => (
          <Link key={href} href={href} className="flex-1 flex flex-col items-center py-2.5 gap-0.5">
            <span className="text-lg leading-none">{icon}</span>
            <span className="text-[9px] font-medium" style={{ color:a?"#6C63FF":"rgba(0,0,0,0.3)" }}>{l}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
