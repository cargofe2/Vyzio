// src/app/community/page.tsx
import Link from "next/link";

export default function CommunityPage() {
  return (
    <div className="min-h-screen pb-24" style={{ background:"#F7F7F5" }}>
      <div className="px-4 py-4" style={{ background:"#111" }}>
        <h1 className="font-display font-black text-xl text-white">Comunidad</h1>
        <p className="text-xs mt-1" style={{ color:"rgba(255,255,255,0.4)" }}>Proyectos · Ranking · Equipos</p>
      </div>
      <div className="px-4 py-8 text-center">
        <div className="text-5xl mb-3">🚀</div>
        <p className="font-display font-bold text-base text-black mb-1">Próximamente</p>
        <p className="text-sm" style={{ color:"rgba(0,0,0,0.4)" }}>La comunidad se activa cuando publiques tu primer proyecto.</p>
        <Link href="/dashboard" className="inline-block mt-5 px-5 py-2.5 rounded-xl font-bold text-sm text-white" style={{ background:"#111" }}>
          Volver al inicio
        </Link>
      </div>
      <nav className="fixed bottom-0 inset-x-0 border-t flex" style={{ background:"#fff", borderColor:"rgba(0,0,0,0.08)" }}>
        {[{href:"/dashboard",icon:"🏠",l:"Inicio"},{href:"/worlds",icon:"🌍",l:"Mundos"},{href:"/vy",icon:"🤖",l:"VY"},{href:"/community",icon:"👥",l:"Comunidad",a:true},{href:"/profile",icon:"👤",l:"Perfil"}].map(({ href, icon, l, a }) => (
          <Link key={href} href={href} className="flex-1 flex flex-col items-center py-2.5 gap-0.5">
            <span className="text-lg leading-none">{icon}</span>
            <span className="text-[9px] font-medium" style={{ color:a?"#6C63FF":"rgba(0,0,0,0.3)" }}>{l}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
