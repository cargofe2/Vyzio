"use client";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const ACHIEVEMENTS = [
  { emoji:"⚡", name:"Primera lección", earned:false },
  { emoji:"🔥", name:"Racha 3 días",    earned:false },
  { emoji:"🎯", name:"Quiz perfecto",   earned:false },
  { emoji:"🚀", name:"Primer proyecto", earned:false },
  { emoji:"💯", name:"10 lecciones",    earned:false },
  { emoji:"🏆", name:"Torneo ganado",   earned:false },
  { emoji:"👑", name:"Racha 30 días",   earned:false },
  { emoji:"💎", name:"10K XP",          earned:false },
];

export default function ProfilePage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center" style={{ background:"#111" }}><div style={{ color:"#FFFC00" }}>⚡</div></div>;

  return (
    <div className="min-h-screen pb-24" style={{ background:"#F7F7F5" }}>
      {/* Header */}
      <div className="px-4 py-5" style={{ background:"#111" }}>
        <div className="flex items-end gap-3 mb-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl flex-shrink-0" style={{ background:"rgba(255,252,0,0.1)", border:"3px solid #FFFC00" }}>
            🧑‍💻
          </div>
          <div className="flex-1">
            <h1 className="font-display font-black text-xl text-white">{user?.fullName ?? "Estudiante"}</h1>
            <p className="text-xs mb-2" style={{ color:"rgba(255,255,255,0.35)" }}>@{user?.username ?? user?.firstName?.toLowerCase() ?? "usuario"}</p>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold" style={{ background:"rgba(108,99,255,0.2)", color:"#6C63FF" }}>NOVICE · Lv.1</span>
          </div>
        </div>
        <div className="grid grid-cols-3 rounded-xl overflow-hidden" style={{ background:"rgba(255,255,255,0.05)" }}>
          {[["0","Lecciones"],["0","Proyectos"],["0","Racha"]].map(([v,l]) => (
            <div key={l} className="py-3 text-center" style={{ borderRight:"1px solid rgba(255,255,255,0.06)" }}>
              <div className="font-display font-black text-lg text-white">{v}</div>
              <div className="text-[9px]" style={{ color:"rgba(255,255,255,0.3)" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Certificado */}
        <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background:"rgba(255,252,0,0.08)", border:"1px solid rgba(255,252,0,0.2)" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background:"rgba(255,252,0,0.15)" }}>🎓</div>
          <div className="flex-1">
            <p className="font-bold text-sm text-black">Certificado AI Explorer</p>
            <p className="text-xs" style={{ color:"rgba(0,0,0,0.4)" }}>Completa 150 lecciones + proyecto final</p>
          </div>
          <span className="text-[10px]" style={{ color:"rgba(0,0,0,0.3)" }}>0/150</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { v:"0",    l:"XP total",      c:"#FFFC00", bg:"#111" },
            { v:"0",    l:"Gemas",          c:"#6C63FF", bg:"#EDE7F6" },
            { v:"0",    l:"Racha máxima",   c:"#FF5EA8", bg:"#FCE4EC" },
            { v:"0",    l:"Quiz perfectos", c:"#00D4FF", bg:"#E3F2FD" },
          ].map(({ v, l, c, bg }) => (
            <div key={l} className="rounded-xl p-3 text-center" style={{ background:bg }}>
              <div className="font-display font-black text-xl" style={{ color:c }}>{v}</div>
              <div className="text-[10px] mt-0.5" style={{ color: bg==="#111" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color:"rgba(0,0,0,0.35)" }}>Insignias</h2>
          <div className="grid grid-cols-4 gap-3">
            {ACHIEVEMENTS.map(({ emoji, name, earned }) => (
              <div key={name} className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background:earned?"#F7F7F5":"rgba(0,0,0,0.04)", border:`1px solid ${earned?"rgba(0,0,0,0.1)":"rgba(0,0,0,0.06)"}`, opacity:earned?1:0.35, filter:earned?"none":"grayscale(1)" }}>
                  {emoji}
                </div>
                <p className="text-[9px] text-center leading-tight" style={{ color:"rgba(0,0,0,0.4)", maxWidth:"52px" }}>{name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Settings */}
        <div className="rounded-2xl overflow-hidden" style={{ background:"#fff", border:"0.5px solid rgba(0,0,0,0.08)" }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom:"0.5px solid rgba(0,0,0,0.05)" }}>
            <span className="text-sm text-black">Gestionar cuenta</span>
            <UserButton />
          </div>
          <Link href="/pricing" className="px-4 py-3 flex items-center justify-between block">
            <span className="text-sm text-black">Actualizar a Pro</span>
            <span className="text-xs font-bold" style={{ color:"#6C63FF" }}>$9.99/mes →</span>
          </Link>
        </div>
      </div>

      {/* NavBar */}
      <nav className="fixed bottom-0 inset-x-0 border-t flex" style={{ background:"#fff", borderColor:"rgba(0,0,0,0.08)" }}>
        {[
          { href:"/dashboard", icon:"🏠", label:"Inicio",    active:false },
          { href:"/worlds",    icon:"🌍", label:"Mundos",    active:false },
          { href:"/vy",        icon:"🤖", label:"VY",        active:false },
          { href:"/community", icon:"👥", label:"Comunidad", active:false },
          { href:"/profile",   icon:"👤", label:"Perfil",    active:true  },
        ].map(({ href, icon, label, active }) => (
          <Link key={href} href={href} className="flex-1 flex flex-col items-center py-2.5 gap-0.5">
            <span className="text-lg leading-none">{icon}</span>
            <span className="text-[9px] font-medium" style={{ color:active?"#6C63FF":"rgba(0,0,0,0.3)" }}>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
