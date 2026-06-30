"use client";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const CHIPS = ["¿Qué debo estudiar hoy?","Explícame los transformers","Dame un quiz de IA","¿Qué es un LLM?","Recomiéndame un proyecto"];
interface Msg { role: "user" | "assistant"; content: string }

function renderMsg(content: string) {
  return content
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/`(.*?)`/g, "<code style='background:rgba(99,102,241,0.15);padding:1px 5px;border-radius:4px;font-size:11px;color:#A78BFA'>$1</code>");
}

export default function VYPage() {
  const { user } = useUser();
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: "¡Hola! Soy **ZAI**, tu tutor de IA en VYZIO. Estoy aquí para ayudarte a aprender IA de forma práctica. ¿Qué quieres saber hoy? 🤖" }]);
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
    <div style={{ minHeight: "100vh", background: "#080B14", display: "flex", flexDirection: "column" }}>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0);opacity:0.4}50%{transform:translateY(-4px);opacity:1}}`}</style>

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(8,11,20,0.93)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(99,102,241,0.1)", padding: "11px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
        <Link href="/dashboard" style={{ color: "rgba(255,255,255,0.4)", fontSize: "18px", textDecoration: "none" }}>←</Link>
        <div style={{ width: "36px", height: "36px", background: "rgba(0,255,179,0.1)", border: "1px solid rgba(0,255,179,0.25)", borderRadius: "11px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="4" fill="rgba(0,255,179,0.1)" stroke="#00FFB3" strokeWidth="1.8"/>
            <path d="M8 8L12 16L16 8" stroke="#00FFB3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
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
              <div style={{ width: "26px", height: "26px", borderRadius: "8px", background: "rgba(0,255,179,0.1)", border: "1px solid rgba(0,255,179,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" stroke="#00FFB3" strokeWidth="2"/><path d="M8 8L12 16L16 8" stroke="#00FFB3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
            <div style={{ maxWidth: "82%", padding: "10px 14px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: m.role === "user" ? "linear-gradient(135deg,#6366F1,#8B5CF6)" : "rgba(99,102,241,0.08)", border: m.role === "assistant" ? "1px solid rgba(99,102,241,0.12)" : "none", fontSize: "13px", color: "#fff", lineHeight: 1.6, fontFamily: "'DM Sans',sans-serif" }}
              dangerouslySetInnerHTML={{ __html: renderMsg(m.content) }} />
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "8px", background: "rgba(0,255,179,0.1)", border: "1px solid rgba(0,255,179,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" stroke="#00FFB3" strokeWidth="2"/><path d="M8 8L12 16L16 8" stroke="#00FFB3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ padding: "10px 16px", borderRadius: "18px 18px 18px 4px", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.12)", display: "flex", gap: "4px" }}>
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
          <button key={c} onClick={() => send(c)} style={{ flexShrink: 0, padding: "6px 12px", borderRadius: "20px", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", color: "rgba(255,255,255,0.5)", fontSize: "11px", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'DM Sans',sans-serif" }}>{c}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: "10px 16px 14px", background: "rgba(8,11,20,0.95)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid rgba(99,102,241,0.1)", display: "flex", gap: "8px" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send(input))}
          placeholder="Pregúntale algo a ZAI..." disabled={used >= 10}
          style={{ flex: 1, height: "42px", padding: "0 14px", borderRadius: "14px", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)", color: "#fff", fontSize: "13px", outline: "none", fontFamily: "'DM Sans',sans-serif" }} />
        <button onClick={() => send(input)} disabled={!input.trim() || loading || used >= 10}
          style={{ width: "42px", height: "42px", borderRadius: "14px", background: !input.trim() || loading || used >= 10 ? "rgba(99,102,241,0.2)" : "linear-gradient(135deg,#6366F1,#8B5CF6)", border: "none", color: "#fff", fontSize: "16px", cursor: !input.trim() || loading ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: input.trim() ? "0 0 12px rgba(99,102,241,0.4)" : "none" }}>↑</button>
      </div>
    </div>
  );
}
