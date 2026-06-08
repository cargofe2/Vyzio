import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "#111" }}>
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "#FFFC00" }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path d="M4 16L10 4L16 16" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.5 11H13.5" stroke="#111" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-display text-white text-3xl font-black tracking-[4px]">VYZIO</span>
        </div>

        <h1 className="font-display text-4xl font-black text-white leading-tight mb-4 max-w-xs">
          Aprende IA.<br/>
          <span style={{ color: "#FFFC00" }}>Construye el futuro.</span>
        </h1>

        <p className="text-sm max-w-xs leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.45)" }}>
          625+ lecciones · Tutor IA · Gamificación · Certificados verificables.
          La plataforma para la nueva generación.
        </p>

        {/* Stats */}
        <div className="flex gap-6 mb-10">
          {[["625+","Lecciones"],["4","Niveles"],["100%","Gratis para empezar"]].map(([n,l]) => (
            <div key={l} className="text-center">
              <div className="font-display font-black text-xl" style={{ color: "#FFFC00" }}>{n}</div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link href="/sign-up" className="block w-full py-4 rounded-2xl text-center font-display font-black text-sm" style={{ background: "#FFFC00", color: "#111" }}>
            Empezar gratis →
          </Link>
          <Link href="/sign-in" className="block w-full py-3.5 rounded-2xl text-center font-display font-bold text-sm" style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)" }}>
            Ya tengo cuenta
          </Link>
        </div>

        {/* Features */}
        <div className="flex gap-5 mt-10 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
          <span>🎮 Gamificación</span>
          <span>🤖 Tutor IA</span>
          <span>🎓 Certificados</span>
        </div>
      </div>

      {/* Niveles */}
      <div className="px-6 pb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-center mb-4" style={{ color: "rgba(255,255,255,0.2)" }}>4 Niveles de aprendizaje</p>
        <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
          {[
            { n:1, name:"AI Explorer", color:"#6C63FF", emoji:"🌍", free:true },
            { n:2, name:"AI Creator",  color:"#00D4FF", emoji:"⚡", free:false },
            { n:3, name:"AI Builder",  color:"#FF5EA8", emoji:"🚀", free:false },
            { n:4, name:"AI Entrepreneur", color:"#00FFB3", emoji:"💎", free:false },
          ].map(({ n, name, color, emoji, free }) => (
            <div key={n} className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${color}30` }}>
              <div className="text-xl mb-1">{emoji}</div>
              <div className="text-xs font-bold text-white mb-0.5">{name}</div>
              <div className="text-[10px]" style={{ color: free ? "#00FFB3" : "rgba(255,255,255,0.25)" }}>
                {free ? "✓ Gratis" : "Pro"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
