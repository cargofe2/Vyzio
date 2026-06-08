import Link from "next/link";

const PLANS = [
  { id:"STARTER", name:"Starter", price:"Gratis", tag:null, color:"#999", features:["Nivel 1 completo (150 lecciones)","VY tutor: 10 msg/día","Rankings semanales","Misiones diarias"], cta:"Tu plan actual" },
  { id:"PRO", name:"Pro", price:"$9.99/mes", tag:"Más popular", color:"#FFFC00", features:["Niveles 1, 2 y 3 (525 lecciones)","VY tutor ilimitado","Certificados verificables","Portafolio de proyectos","Torneos globales","7 días de prueba gratis"], cta:"Empezar Pro" },
  { id:"PREMIUM", name:"Premium", price:"$14.99/mes", tag:null, color:"#6C63FF", features:["Todo lo de Pro","Nivel 4 AI Entrepreneur","Bootcamps live","Mentoría grupal"], cta:"Empezar Premium" },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen pb-8" style={{ background:"#F7F7F5" }}>
      <div className="px-4 py-5 text-center" style={{ background:"#111" }}>
        <Link href="/dashboard" className="absolute left-4 top-5 text-xl" style={{ color:"rgba(255,255,255,0.4)" }}>←</Link>
        <h1 className="font-display font-black text-xl text-white">Elige tu plan</h1>
        <p className="text-xs mt-1" style={{ color:"rgba(255,255,255,0.4)" }}>7 días gratis en Pro y Premium</p>
      </div>

      <div className="px-4 py-4 space-y-3" style={{ position:"relative" }}>
        {PLANS.map(({ id, name, price, tag, color, features, cta }) => (
          <div key={id} className="rounded-2xl p-4 relative" style={{ background:"#fff", border:`2px solid ${id==="PRO"?color:"rgba(0,0,0,0.06)"}` }}>
            {tag && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black px-3 py-0.5 rounded-full" style={{ background:color, color:"#111" }}>
                {tag}
              </span>
            )}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="font-display font-black text-base text-black">{name}</h2>
              </div>
              <p className="font-display font-black text-lg text-black">{price}</p>
            </div>
            <ul className="space-y-1.5 mb-4">
              {features.map(f => (
                <li key={f} className="flex items-center gap-2 text-xs" style={{ color:"rgba(0,0,0,0.6)" }}>
                  <span style={{ color:"#2E7D32" }}>✓</span> {f}
                </li>
              ))}
            </ul>
            {id === "STARTER"
              ? <div className="w-full py-2.5 rounded-xl text-center text-xs font-bold" style={{ background:"rgba(0,0,0,0.04)", color:"rgba(0,0,0,0.3)" }}>{cta}</div>
              : <button className="w-full py-3 rounded-xl text-center font-display font-black text-sm" style={{ background: id==="PRO" ? "#111" : "#6C63FF", color: id==="PRO" ? "#FFFC00" : "#fff" }}>{cta}</button>
            }
          </div>
        ))}
      </div>
    </div>
  );
}
