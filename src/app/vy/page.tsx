"use client";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const CHIPS = ["¿Qué debo estudiar hoy?","Explícame los transformers","Dame un quiz de IA","¿Qué es un LLM?","Recomiéndame un proyecto"];
interface Msg { role: "user" | "assistant"; content: string }

function renderMsg(content: string) {
  return content
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/`(.*?)`/g, "<code style='background:rgba(123,97,255,0.15);padding:1px 5px;border-radius:4px;font-size:11px;color:#A78BFA'>$1</code>");
}

function ZaiOrb({ size = 36 }: { size?: number }) {
  return (
    <div style={{ position: "relative", width: `${size}px`, height: `${size}px`, flexShrink: 0 }}>
      <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "conic-gradient(from 0deg, #A78BFA, #7B61FF, #4C3AA8, #7B61FF, #A78BFA)", opacity: 0.9, animation: "spin 4s linear infinite" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.5), transparent 45%)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 256 256"><g transform="rotate(-12 128 128)"><path d="M78 88H178L82 168H178" stroke="#FFFFFF" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" fill="none"/></g></svg>
      </div>
    </div>
  );
}

export default function VYPage() {
  const { user } = useUser();
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: "¡Hola! Soy **ZAI**, tu tutor de IA en BYZAI. Estoy aquí para ayudarte a aprender IA de forma práctica. ¿Qué quieres saber hoy? 🤖" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [used, setUsed] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  async function send(text: string) {
    if (!text.trim() || loading || used >= 10) return;
    setInput(""); setMsgs(p => [...p, { role: "user", content: text }]);
    setLoading(true); setUsed(p => p + 1);
    try {
      const res = await fetch("/api/vy", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text }) });
      const data = await res.json();
      setMsgs(p => [...p, { role: "assistant", content: data.message ?? "Error. Intenta de nuevo." }]);
    } catch { setMsgs(p => [...p, { role: "assistant", content: "Error de conexión." }]); }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0F1420", display: "flex", flexDirection: "column" }}>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0);opacity:0.4}50%{transform:translateY(-4px);opacity:1}} @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(15,20,32,0.93)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(123,97,255,0.1)", padding: "11px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
        <Link href="/dashboard" style={{ color: "rgba(255,255,255,0.4)", fontSize: "18px", textDecoration: "none" }}>←</Link>
        <ZaiOrb size={36} />
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#fff", fontSize: "14px" }}>ZAI</p>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34D399" }} />
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>en línea</p>
          </div>
        </div>
        <span style={{ fontSize: "10px", color: used >= 10 ? "#F87171" : "rgba(255,255,255,0.2)", fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{used}/10 hoy</span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: "14px 16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: "8px" }}>
            {m.role === "assistant" && (
              <ZaiOrb size={26} />
            )}
            <div style={{ maxWidth: "82%", padding: "10px 14px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: m.role === "user" ? "linear-gradient(135deg,#7B61FF,#8B5CF6)" : "rgba(123,97,255,0.08)", border: m.role === "assistant" ? "1px solid rgba(123,97,255,0.12)" : "none", fontSize: "13px", color: "#fff", lineHeight: 1.6, fontFamily: "'DM Sans',sans-serif" }}
              dangerouslySetInnerHTML={{ __html: renderMsg(m.content) }} />
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
            <ZaiOrb size={26} />
            <div style={{ padding: "10px 16px", borderRadius: "18px 18px 18px 4px", background: "rgba(123,97,255,0.08)", border: "1px solid rgba(123,97,255,0.12)", display: "flex", gap: "4px" }}>
              {[0,1,2].map(i => <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#818CF8", animation: `bounce 1s ${i*0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        {used >= 10 && (
          <div style={{ textAlign: "center", padding: "12px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "14px" }}>
            <p style={{ fontSize: "12px", color: "#F87171", fontFamily: "'DM Sans',sans-serif", marginBottom: "6px" }}>Límite diario alcanzado.</p>
            <Link href="/pricing" style={{ fontSize: "11px", color: "#818CF8", fontWeight: 700, textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>Actualiza a Pro →</Link>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Chips */}
      <div style={{ padding: "0 16px 8px", display: "flex", gap: "6px", overflowX: "auto" }}>
        {CHIPS.map(c => (
          <button key={c} onClick={() => send(c)} style={{ flexShrink: 0, padding: "9px 16px", borderRadius: "20px", background: "rgba(123,97,255,0.1)", border: "1px solid rgba(123,97,255,0.25)", color: "#F8FAFF", fontSize: "13px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'DM Sans',sans-serif" }}>{c}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: "10px 16px 14px", background: "rgba(15,20,32,0.95)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid rgba(123,97,255,0.1)", display: "flex", gap: "8px" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send(input))}
          placeholder="Pregúntale algo a ZAI..." disabled={used >= 10}
          style={{ flex: 1, height: "42px", padding: "0 14px", borderRadius: "14px", background: "rgba(123,97,255,0.06)", border: "1px solid rgba(123,97,255,0.12)", color: "#fff", fontSize: "13px", outline: "none", fontFamily: "'DM Sans',sans-serif" }} />
        <button onClick={() => send(input)} disabled={!input.trim() || loading || used >= 10}
          style={{ width: "42px", height: "42px", borderRadius: "14px", background: !input.trim() || loading || used >= 10 ? "rgba(123,97,255,0.2)" : "linear-gradient(135deg,#7B61FF,#8B5CF6)", border: "none", color: "#fff", fontSize: "16px", cursor: !input.trim() || loading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "none" }}>↑</button>
      </div>
    </div>
  );
}
