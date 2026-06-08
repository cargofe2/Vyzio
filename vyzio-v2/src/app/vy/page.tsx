"use client";
import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const CHIPS = ["¿Qué debo estudiar hoy?","Explícame los transformers","Dame un quiz de IA","¿Qué es un LLM?","Recomiéndame un proyecto"];

interface Msg { role:"user"|"assistant"; content:string }

export default function VYPage() {
  const { user } = useUser();
  const [msgs, setMsgs] = useState<Msg[]>([
    { role:"assistant", content:"¡Hola! Soy **VY**, tu tutor de IA en VYZIO. Estoy aquí para ayudarte a aprender IA de forma práctica. ¿Qué quieres saber hoy? 🤖" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [used, setUsed] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  async function send(text: string) {
    if (!text.trim() || loading || used >= 10) return;
    setInput("");
    setMsgs(p => [...p, { role:"user", content:text }]);
    setLoading(true);
    setUsed(p => p + 1);
    try {
      const res = await fetch("/api/vy", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMsgs(p => [...p, { role:"assistant", content: data.message ?? "Error. Intenta de nuevo." }]);
    } catch {
      setMsgs(p => [...p, { role:"assistant", content:"Error de conexión. Revisa tu internet." }]);
    }
    setLoading(false);
  }

  function renderMsg(content: string) {
    return content.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/`(.*?)`/g, "<code style='background:rgba(0,0,0,0.08);padding:1px 4px;border-radius:4px;font-size:11px'>$1</code>");
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background:"#F7F7F5" }}>

      {/* Header */}
      <div className="sticky top-0 z-40 px-4 py-3 flex items-center gap-3" style={{ background:"#111" }}>
        <Link href="/dashboard" className="text-xl" style={{ color:"rgba(255,255,255,0.4)" }}>←</Link>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background:"rgba(108,99,255,0.2)", border:"2px solid #6C63FF" }}>🤖</div>
        <div className="flex-1">
          <p className="font-display font-black text-sm text-white tracking-wider">VY</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background:"#00FFB3" }} />
            <p className="text-[10px]" style={{ color:"rgba(255,255,255,0.35)" }}>en línea</p>
          </div>
        </div>
        <span className="text-[10px]" style={{ color:"rgba(255,255,255,0.2)" }}>{used}/10 hoy</span>
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
            <div
              className="max-w-[85%] text-sm leading-relaxed"
              style={{
                padding:"10px 14px",
                borderRadius: m.role==="user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: m.role==="user" ? "#111" : "#fff",
                color: m.role==="user" ? "#fff" : "#111",
                border: m.role==="assistant" ? "0.5px solid rgba(0,0,0,0.08)" : "none",
              }}
              dangerouslySetInnerHTML={{ __html: renderMsg(m.content) }}
            />
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1" style={{ background:"#fff", border:"0.5px solid rgba(0,0,0,0.08)" }}>
              {[0,1,2].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background:"rgba(0,0,0,0.25)", animation:`bounce 1s ${i*0.15}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        {used >= 10 && (
          <div className="text-center py-4">
            <p className="text-xs" style={{ color:"rgba(0,0,0,0.4)" }}>Límite diario alcanzado. Vuelve mañana.</p>
            <Link href="/pricing" className="text-xs font-bold" style={{ color:"#6C63FF" }}>Actualiza a Pro para mensajes ilimitados →</Link>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Chips */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto" style={{ scrollbarWidth:"none" }}>
        {CHIPS.map(c => (
          <button key={c} onClick={() => send(c)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={{ background:"#fff", border:"0.5px solid rgba(0,0,0,0.1)", color:"rgba(0,0,0,0.5)", whiteSpace:"nowrap" }}>
            {c}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-4 flex gap-2" style={{ background:"#fff", borderTop:"0.5px solid rgba(0,0,0,0.06)", paddingTop:"12px" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==="Enter" && !e.shiftKey && (e.preventDefault(), send(input))}
          placeholder="Pregúntale algo a VY..."
          disabled={used >= 10}
          className="flex-1 text-sm rounded-xl px-3.5 outline-none"
          style={{ height:"40px", background:"#F7F7F5", border:"0.5px solid rgba(0,0,0,0.1)", color:"#111" }}
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || loading || used >= 10}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
          style={{ background:"#6C63FF", opacity: !input.trim() || loading || used >= 10 ? 0.4 : 1 }}>
          ↑
        </button>
      </div>

    </div>
  );
}
