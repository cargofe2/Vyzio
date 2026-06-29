"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface Message { role: "user" | "assistant"; content: string; }

const DS = {
  bg: "#080B14",
  card: "rgba(99,102,241,0.05)",
  cardBorder: "rgba(99,102,241,0.1)",
  accent: "#6366F1",
  accentLight: "#818CF8",
  text: "#fff",
  textSub: "rgba(255,255,255,0.4)",
  textMuted: "rgba(255,255,255,0.2)",
};

function formatMsg(content: string) {
  return content
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/`(.*?)`/g, `<code style='background:rgba(99,102,241,0.15);padding:1px 5px;border-radius:4px;font-size:11px;color:#A78BFA'>$1</code>`);
}

export default function VYPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const [limit] = useState(10);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading || msgCount >= limit) return;
    setInput("");
    setMsgCount(c => c + 1);
    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("/api/vy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: messages }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages([...newMessages, { role: "assistant", content: data.message }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Hubo un error. Intenta de nuevo." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: DS.bg, display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(8,11,20,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${DS.cardBorder}`,
        padding: "11px 16px",
        display: "flex", alignItems: "center", gap: "10px",
      }}>
        <Link href="/dashboard" style={{ color: DS.textSub, fontSize: "18px", textDecoration: "none" }}>←</Link>
        <div style={{
          width: "36px", height: "36px",
          background: "rgba(99,102,241,0.12)",
          border: `1px solid rgba(99,102,241,0.25)`,
          borderRadius: "11px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px", flexShrink: 0,
        }}>🤖</div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: DS.text, fontSize: "14px" }}>VY</p>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34D399" }} />
            <p style={{ fontSize: "10px", color: DS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>en línea</p>
          </div>
        </div>
        <span style={{
          fontSize: "10px", color: msgCount >= limit ? "#F87171" : DS.textMuted,
          fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
        }}>
          {msgCount}/{limit} hoy
        </span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>

        {/* Welcome */}
        {messages.length === 0 && (
          <div style={{
            background: "rgba(99,102,241,0.08)",
            border: `1px solid ${DS.cardBorder}`,
            borderRadius: "18px", padding: "16px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span style={{ fontSize: "20px" }}>🤖</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: DS.accentLight, fontSize: "13px" }}>VY</span>
            </div>
            <p style={{ fontSize: "13px", color: DS.text, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>
              ¡Hola! Soy VY, tu tutor personal de IA. Puedo ayudarte a entender cualquier concepto de inteligencia artificial, resolver dudas sobre las lecciones o explorar temas que te interesen. ¿Por dónde empezamos?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {[
                "¿Qué es el machine learning?",
                "¿Cómo funciona ChatGPT?",
                "¿Para qué sirve el prompt engineering?",
              ].map(q => (
                <button key={q} onClick={() => { setInput(q); }}
                  style={{
                    padding: "8px 12px", borderRadius: "10px",
                    background: "rgba(99,102,241,0.08)",
                    border: `1px solid ${DS.cardBorder}`,
                    color: DS.accentLight, fontSize: "11px", fontWeight: 600,
                    textAlign: "left", cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                  }}>{q}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "assistant" && (
              <div style={{
                width: "28px", height: "28px", borderRadius: "9px",
                background: "rgba(99,102,241,0.12)",
                border: `1px solid rgba(99,102,241,0.2)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", flexShrink: 0, marginRight: "8px", marginTop: "2px",
              }}>🤖</div>
            )}
            <div style={{
              maxWidth: "80%",
              padding: "10px 14px",
              borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: m.role === "user"
                ? `linear-gradient(135deg, ${DS.accent}, #8B5CF6)`
                : "rgba(99,102,241,0.08)",
              border: m.role === "user" ? "none" : `1px solid ${DS.cardBorder}`,
              fontSize: "13px",
              color: DS.text,
              lineHeight: 1.6,
              fontFamily: "'DM Sans', sans-serif",
            }}
              dangerouslySetInnerHTML={{ __html: formatMsg(m.content) }}
            />
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "9px",
              background: "rgba(99,102,241,0.12)",
              border: `1px solid rgba(99,102,241,0.2)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", flexShrink: 0,
            }}>🤖</div>
            <div style={{
              padding: "10px 16px",
              borderRadius: "18px 18px 18px 4px",
              background: "rgba(99,102,241,0.08)",
              border: `1px solid ${DS.cardBorder}`,
            }}>
              <div style={{ display: "flex", gap: "4px" }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: DS.accentLight,
                    opacity: 0.4,
                    animation: `bounce 1s ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "12px 16px",
        background: "rgba(8,11,20,0.95)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: `1px solid ${DS.cardBorder}`,
      }}>
        <style>{`@keyframes bounce { 0%,100%{transform:translateY(0);opacity:0.4} 50%{transform:translateY(-4px);opacity:1} }`}</style>
        {msgCount >= limit ? (
          <div style={{
            textAlign: "center", padding: "12px",
            background: "rgba(248,113,113,0.08)",
            border: "1px solid rgba(248,113,113,0.2)",
            borderRadius: "14px",
          }}>
            <p style={{ fontSize: "12px", color: "#F87171", fontFamily: "'DM Sans', sans-serif" }}>
              Límite diario alcanzado. Vuelve mañana o actualiza tu plan.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Pregunta sobre IA..."
              rows={1}
              style={{
                flex: 1, padding: "11px 14px",
                background: "rgba(99,102,241,0.06)",
                border: `1px solid ${DS.cardBorder}`,
                borderRadius: "14px",
                color: DS.text, fontSize: "13px",
                resize: "none", outline: "none",
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: 1.5,
              }}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()}
              style={{
                width: "42px", height: "42px",
                background: loading || !input.trim() ? "rgba(99,102,241,0.2)" : DS.accent,
                border: "none", borderRadius: "13px",
                color: "#fff", fontSize: "16px",
                cursor: loading || !input.trim() ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.2s",
              }}>→</button>
          </div>
        )}
      </div>
    </div>
  );
}
