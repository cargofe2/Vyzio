"use client";
import { useState, useEffect } from "react";

const LEVELS = [
  { n:0, name:"Origins", color:"#26C6DA", intensity:1, worlds:11, lessons:155,
    desc:"Entiendes que es la IA, como funciona y por que esta cambiando el mundo. Cubres historia, aplicaciones reales en salud, transporte y sostenibilidad, primeros prompts con ChatGPT y Claude, y etica. No necesitas experiencia previa.",
    svg:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21V11"/><path d="M12 12c0-3.5-2.5-6-7-6.5C5.3 10 7.5 12.3 12 12Z"/><path d="M12 9c0-2.8 2-4.8 5.5-5.2C17.8 7.3 16 9.3 12 9Z"/></svg>`},
  { n:1, name:"Explorer", color:"#468BFF", intensity:2, worlds:11, lessons:165,
    desc:"Aprendes a usar IA para estudiar, escribir, investigar, crear imagenes, producir audio y automatizar flujos de trabajo. Trabajas prompt engineering avanzado y fundamentos de LLMs y agentes. El resultado depende de cuanto practiques.",
    svg:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M15.2 8.8l-1.7 5.1-5.1 1.7 1.7-5.1 5.1-1.7Z"/></svg>`},
  { n:2, name:"Thinker", color:"#A78BFA", intensity:3, worlds:10, lessons:150,
    desc:"Trabajas logica, pensamiento critico, sistemas, decisiones bajo incertidumbre, sesgos cognitivos humanos y de IA, datos, etica y argumentacion. Habilidades que no dependen de que modelo de IA exista manana.",
    svg:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 4.5c-2 0-3.5 1.5-3.5 3.5-1.3.4-2 1.6-2 3s.7 2.7 2 3.1c0 2.1 1.5 3.9 3.5 3.9M8.5 4.5c1.3 0 2.4.7 3 1.7M8.5 4.5v13.5M15.5 4.5c2 0 3.5 1.5 3.5 3.5 1.3.4 2 1.6 2 3s-.7 2.7-2 3.1c0 2.1-1.5 3.9-3.5 3.9M15.5 4.5c-1.3 0-2.4.7-3 1.7M15.5 4.5v13.5"/></svg>`},
  { n:3, name:"Creator", color:"#36D399", intensity:4, worlds:10, lessons:145,
    desc:"Aprendes design thinking, herramientas sin codigo, UX/UI, validacion con usuarios, tu primer MVP, codigo asistido por IA, storytelling y lanzamiento. No necesitas saber programar para completar este nivel.",
    svg:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3.5C7.3 3.5 3.5 7.3 3.5 12c0 4.4 3.6 8.5 8.5 8.5.9 0 1.3-.5 1.3-1.1 0-.4-.1-.7-.4-.9-.2-.3-.4-.6-.4-.9 0-.6.5-1.1 1.1-1.1h1.4c3 0 5.5-2.5 5.5-5.5 0-4.1-3.6-7.5-8.5-7.5Z"/></svg>`},
  { n:4, name:"Builder", color:"#7B61FF", intensity:6, worlds:10, lessons:150,
    desc:"Construyes aplicaciones reales con IA. Cubres arquitectura, bases de datos vectoriales, RAG en produccion, fine-tuning, testing, observabilidad, costos, seguridad y DevOps. Es el nivel mas tecnico del programa. Requiere disposicion para trabajar con codigo.",
    svg:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="15" rx="2"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M9 14l2 2 4-4"/></svg>`},
  { n:5, name:"Architect", color:"#00D4FF", intensity:7, worlds:10, lessons:146,
    desc:"Disenias sistemas a escala. Cubres sistemas distribuidos, multi-agente, APIs de IA, infraestructura cloud, escalabilidad, gobernanza de datos, integracion con sistemas existentes, seguridad y documentacion tecnica.",
    svg:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V10l5-2.5V20M9 20V4.5L14 2v18M14 20V9l5-1.5V20"/><path d="M3 20h18"/></svg>`},
  { n:6, name:"Founder", color:"#FB923C", intensity:7, worlds:10, lessons:144,
    desc:"Cubres validacion de negocio, pitch, unit economics, contratacion, estrategia de producto, go-to-market, estructura legal y metricas. Es el nivel mas cercano a lo que enfrenta alguien que quiere crear una organizacion real.",
    svg:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.5c2.8 1.6 4.5 4.9 4.5 8.3 0 1.9-.6 3.6-1.6 5L12 19l-2.9-3.2c-1-1.4-1.6-3.1-1.6-5 0-3.4 1.7-6.7 4.5-8.3Z"/><circle cx="12" cy="10.5" r="1.5"/></svg>`},
  { n:7, name:"Researcher", color:"#4ADE80", intensity:8, worlds:10, lessons:145,
    desc:"Te introduces al trabajo cientifico aplicado a la IA. Aprendes a leer papers, disenar experimentos, reproducirlos, escribir y publicar investigacion, hacer peer review y colaborar en proyectos cientificos. Para quienes quieren contribuir al campo, no solo usarlo.",
    svg:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3.5v6L6.3 16.8A2.3 2.3 0 0 0 8.3 20.2h7.4a2.3 2.3 0 0 0 2-3.4L14 9.5v-6"/><path d="M8.7 3.5h6.6M7.5 15h9"/></svg>`},
  { n:8, name:"Residency", color:"#F472B6", intensity:9, worlds:2, lessons:27,
    desc:"Aplicas todo lo acumulado en un proyecto real. Primero te preparas, luego enfrentas el Grand Challenge: identificar un problema, disenar una solucion, construirla, conseguir usuarios reales y presentar evidencia de impacto. El resultado depende de lo que pongas.",
    svg:`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 9L12 4.5 21.5 9 12 13.5 2.5 9Z"/><path d="M6.5 11v5c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-5"/><path d="M21.5 9v6"/></svg>`},
];

export default function LevelMap() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const sel = LEVELS[active];

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div style={{ marginBottom: "24px", userSelect: "none" }}>
      <style>{`
        @keyframes lm-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes lm-pulse { 0%,100%{transform:scale(1);opacity:0.5} 50%{transform:scale(1.2);opacity:0.1} }
        @keyframes lm-up { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Orbs */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", padding:"0 2px 24px", position:"relative" }}>
        <div style={{ position:"absolute", bottom:"38px", left:"16px", right:"16px", height:"1px", background:"linear-gradient(90deg,#26C6DA,#468BFF,#A78BFA,#36D399,#7B61FF,#00D4FF,#FB923C,#4ADE80,#F472B6)", opacity:0.2 }} />
        {LEVELS.map((lvl, i) => {
          const isActive = i === active;
          return (
            <button key={i} onClick={() => setActive(i)} style={{ background:"none", border:"none", cursor:"pointer", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"5px", padding:"4px 0", transform:isActive?"translateY(-8px)":"translateY(0)", transition:"transform 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
              <div style={{ width:isActive?"44px":"32px", height:isActive?"44px":"32px", borderRadius:"50%", background:isActive?`radial-gradient(circle at 35% 30%, ${lvl.color}EE, ${lvl.color}77)`:"#1E2533", border:`2px solid ${lvl.color}${isActive?"EE":"44"}`, display:"flex", alignItems:"center", justifyContent:"center", color:isActive?"#0F1420":lvl.color, transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)", boxShadow:isActive?`0 0 18px ${lvl.color}55, 0 0 36px ${lvl.color}22`:"none", animation:isActive?"lm-float 2.5s ease-in-out infinite":"none", position:"relative" }}>
                <span dangerouslySetInnerHTML={{ __html: lvl.svg }} />
                {isActive && <div style={{ position:"absolute", inset:"-7px", borderRadius:"50%", border:`1px solid ${lvl.color}33`, animation:"lm-pulse 2s ease-in-out infinite" }} />}
              </div>
              <span style={{ fontSize:isActive?"8px":"7px", fontWeight:isActive?800:500, color:isActive?lvl.color:"rgba(255,255,255,0.2)", fontFamily:"'DM Sans',sans-serif", transition:"all 0.3s", whiteSpace:"nowrap" }}>
                {isActive ? lvl.name.toUpperCase() : String(lvl.n)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Card */}
      <div style={{ background:"linear-gradient(135deg,#1A1F2E,#0F1420)", border:`1px solid ${sel.color}35`, borderRadius:"18px", padding:"20px", position:"relative", overflow:"hidden", animation:visible?"lm-up 0.25s ease-out":"none", opacity:visible?1:0 }}>
        <div style={{ position:"absolute", top:"-40px", right:"-40px", width:"140px", height:"140px", borderRadius:"50%", background:`radial-gradient(circle, ${sel.color}15, transparent 70%)`, pointerEvents:"none" }} />
        <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"12px", position:"relative" }}>
          <div style={{ width:"52px", height:"52px", borderRadius:"16px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, background:`radial-gradient(circle at 35% 30%, ${sel.color}2A, ${sel.color}0A)`, border:`1px solid ${sel.color}35`, color:sel.color, boxShadow:`0 0 14px ${sel.color}22` }}>
            <span dangerouslySetInnerHTML={{ __html: sel.svg }} />
          </div>
          <div>
            <p style={{ fontSize:"9px", fontWeight:700, color:sel.color, fontFamily:"'Syne',sans-serif", letterSpacing:"1.5px", marginBottom:"3px" }}>NIVEL {sel.n}</p>
            <p style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:"20px", color:"#F8FAFF", lineHeight:1 }}>{sel.name}</p>
          </div>
        </div>
        <p style={{ fontSize:"10px", color:"#7E8798", marginBottom:"10px", fontWeight:600, letterSpacing:"0.3px" }}>{sel.worlds} mundos · {sel.lessons} lecciones</p>
        <p style={{ fontSize:"13px", lineHeight:1.7, color:"#B3BDD1", marginBottom:"16px" }}>{sel.desc}</p>
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px" }}>
            <span style={{ fontSize:"9px", color:"#7E8798", fontWeight:600, letterSpacing:"0.5px" }}>INTENSIDAD</span>
            <span style={{ fontSize:"9px", fontWeight:700, color:sel.color }}>{sel.intensity}/9</span>
          </div>
          <div style={{ height:"4px", background:"rgba(255,255,255,0.08)", borderRadius:"4px", overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${(sel.intensity/9)*100}%`, background:`linear-gradient(90deg,${sel.color}77,${sel.color})`, borderRadius:"4px", transition:"width 0.4s cubic-bezier(0.34,1.56,0.64,1)" }} />
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:"6px", marginTop:"16px" }}>
          {LEVELS.map((_,i) => (
            <button key={i} onClick={() => setActive(i)} style={{ width:i===active?"20px":"6px", height:"6px", borderRadius:"3px", border:"none", cursor:"pointer", background:i===active?sel.color:"rgba(255,255,255,0.12)", transition:"all 0.3s", padding:0 }} />
          ))}
        </div>
      </div>
    </div>
  );
}
