"use client";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect } from "react";

const WORLDS = [
  { emoji:"🌍", name:"Bienvenido al Futuro", lessons:15, locked:false },
  { emoji:"📜", name:"Historia de la IA",    lessons:15, locked:false },
  { emoji:"🤖", name:"IA en tu Vida",        lessons:15, locked:false },
  { emoji:"🎮", name:"IA en Videojuegos",    lessons:15, locked:false },
  { emoji:"🎨", name:"IA y Creatividad",     lessons:15, locked:false },
];

const MISSIONS = [
  { name:"Estudia hoy",      type:"DAILY",  current:0, target:2, xp:150 },
  { name:"Quiz perfecto",    type:"DAILY",  current:0, target:1, xp:120 },
  { name:"10 lecciones",     type:"WEEKLY", current:0, target:10, xp:300 },
];

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [greeting, setGreeting] = useState("Buenos días");

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 12 && h < 19) setGreeting("Buenas tardes");
    else if (h >= 19) setGreeting("Buenas noches");
  }, []);

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:"#111" }}>
      <div className="text-center">
        <div className="text-2xl mb-2" style={{ color:"#FFFC00" }}>⚡</div>
        <p className="text-sm" style={{ color:"rgba(255,255,255,0.4)" }}>Cargando VYZIO...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-24" style={{ background:"#F7F7F5" }}>

      {/* TopBar */}
      <div className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between" style={{ background:"#111" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:"#FFFC00" }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M4 16L10 4L16 16" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.5 11H13.5" stroke="#111" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-display font-black text-white text-sm tracking-[2px]">VYZIO</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background:"rgba(108,99,255,0.2)", color:"#6C63FF" }}>NOVICE</span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Hero */}
      <div className="px-4 py-4" style={{ background:"#111" }}>
        <p className="text-xs mb-1" style={{ color:"rgba(255,255,255,0.4)" }}>{greeting}, {user?.firstName ?? "Estudiante"} 👋</p>
        <p className="font-display font-black text-white text-xl mb-4">¿Qué aprendemos hoy?</p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { v:"0",    l:"XP",      c:"#FFFC00" },
            { v:"💎 0", l:"Gemas",   c:"#6C63FF" },
            { v:"0",    l:"Lecciones",c:"#00D4FF" },
            { v:"🔥 0", l:"Racha",   c:"#FF5EA8" },
          ].map(({ v, l, c }) => (
            <div key={l} className="rounded-xl p-2.5 text-center" style={{ background:"rgba(255,255,255,0.06)" }}>
              <div className="font-display font-black text-base" style={{ color:c }}>{v}</div>
              <div className="text-[9px] mt-0.5" style={{ color:"rgba(255,255,255,0.3)" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* XP Bar */}
        <div>
          <div className="flex justify-between text-[10px] mb-1" style={{ color:"rgba(255,255,255,0.3)" }}>
            <span>Novice · Lv.1</span>
            <span style={{ color:"#FFFC00" }}>500 XP para Explorer</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.1)" }}>
            <div className="h-full rounded-full" style={{ width:"2%", background:"#FFFC00" }} />
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">

        {/* Continuar / CTA */}
        <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background:"#111" }}>
          <div className="text-3xl">🌍</div>
          <div className="flex-1">
            <p className="font-display font-bold text-white text-sm">¿Qué es la IA?</p>
            <p className="text-xs" style={{ color:"rgba(255,255,255,0.4)" }}>Mundo 1 · Lección 1 · 5 min</p>
          </div>
          <Link href="/lesson" className="px-4 py-2 rounded-xl font-bold text-sm" style={{ background:"#FFFC00", color:"#111" }}>
            Empezar
          </Link>
        </div>

        {/* Mundos */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color:"rgba(0,0,0,0.35)" }}>Nivel 1 — AI Explorer</h2>
          <div className="grid grid-cols-2 gap-2">
            {WORLDS.map(({ emoji, name, lessons, locked }, i) => (
              <div key={name} className="rounded-2xl p-3" style={{ background:"#fff", border:"0.5px solid rgba(0,0,0,0.08)", opacity: locked ? 0.4 : 1 }}>
                <div className="text-xl mb-1.5">{emoji}</div>
                <p className="font-display font-bold text-xs text-black mb-1 leading-tight">{name}</p>
                <div className="h-1 rounded-full mb-1" style={{ background:"rgba(0,0,0,0.06)" }}>
                  <div className="h-full rounded-full" style={{ width: i===0 ? "0%" : "0%", background:"#6C63FF" }} />
                </div>
                <p className="text-[9px]" style={{ color:"rgba(0,0,0,0.3)" }}>{lessons} lecciones · 0%</p>
              </div>
            ))}
          </div>
        </section>

        {/* Misiones */}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color:"rgba(0,0,0,0.35)" }}>Misiones activas</h2>
          <div className="grid grid-cols-2 gap-2">
            {MISSIONS.map(({ name, type, current, target, xp }) => (
              <div key={name} className="rounded-xl p-3" style={{ background:"#fff", border:"0.5px solid rgba(0,0,0,0.08)" }}>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: type==="DAILY" ? "#E8F5E9" : "#EDE7F6", color: type==="DAILY" ? "#2E7D32" : "#4527A0" }}>
                  {type==="DAILY" ? "Diaria" : "Semanal"}
                </span>
                <p className="text-xs font-medium text-black mt-1.5 mb-2 leading-snug">{name}</p>
                <div className="h-1 rounded-full mb-1" style={{ background:"rgba(0,0,0,0.06)" }}>
                  <div className="h-full rounded-full" style={{ width:`${(current/target)*100}%`, background:"#6C63FF" }} />
                </div>
                <p className="text-[9px]" style={{ color:"rgba(0,0,0,0.3)" }}>{current}/{target} · +{xp} XP</p>
              </div>
            ))}
          </div>
        </section>

        {/* VY */}
        <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background:"#111" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background:"rgba(108,99,255,0.2)", border:"2px solid #6C63FF" }}>🤖</div>
          <div className="flex-1">
            <p className="font-display font-bold text-white text-sm">VY — Tu tutor de IA</p>
            <p className="text-xs" style={{ color:"rgba(255,255,255,0.35)" }}>Responde en segundos · 10 msg/día</p>
          </div>
          <Link href="/vy" className="px-3 py-2 rounded-xl font-bold text-xs text-white" style={{ background:"#6C63FF" }}>
            Hablar
          </Link>
        </div>

      </div>

      {/* NavBar */}
      <nav className="fixed bottom-0 inset-x-0 border-t flex" style={{ background:"#fff", borderColor:"rgba(0,0,0,0.08)" }}>
        {[
          { href:"/dashboard", icon:"🏠", label:"Inicio",    active:true  },
          { href:"/worlds",    icon:"🌍", label:"Mundos",    active:false },
          { href:"/vy",        icon:"🤖", label:"VY",        active:false },
          { href:"/community", icon:"👥", label:"Comunidad", active:false },
          { href:"/profile",   icon:"👤", label:"Perfil",    active:false },
        ].map(({ href, icon, label, active }) => (
          <Link key={href} href={href} className="flex-1 flex flex-col items-center py-2.5 gap-0.5">
            <span className="text-lg leading-none">{icon}</span>
            <span className="text-[9px] font-medium" style={{ color: active ? "#6C63FF" : "rgba(0,0,0,0.3)" }}>{label}</span>
          </Link>
        ))}
      </nav>

    </div>
  );
}
