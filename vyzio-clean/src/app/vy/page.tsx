"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function VYPage() {
  const { user } = useUser();
  const [messages, setMessages] = useState([
    { role: "assistant", content: "¡Hola! Soy VY, tu tutor de IA. ¿En qué puedo ayudarte hoy? 🤖" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/vy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Error al conectar con VY. Intenta de nuevo." }]);
    }
    setLoading(false);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#F7F7F5", display: "flex", flexDirection: "column", maxWidth: "480px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ background: "#111", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
        <Link href="/dashboard" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "20px" }}>←</Link>
        <div style={{ width: "36px", height: "36px", background: "rgba(108,99,255,0.2)", border: "2px solid #6C63FF", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>🤖</div>
        <div>
          <p style={{ color: "#fff", fontWeight: "700", fontSize: "14px" }}>VY</p>
          <p style={{ color: "#00FFB3", fontSize: "10px" }}>● en línea</p>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "85%", padding: "10px 14px", borderRadius: "16px", fontSize: "13px", lineHeight: "1.55",
              background: m.role === "user" ? "#111" : "#fff",
              color: m.role === "user" ? "#fff" : "#111",
              border: m.role === "assistant" ? "0.5px solid rgba(0,0,0,0.08)" : "none",
              borderBottomRightRadius: m.role === "user" ? "4px" : "16px",
              borderBottomLeftRadius: m.role === "assistant" ? "4px" : "16px",
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)", borderRadius: "16px", borderBottomLeftRadius: "4px", padding: "10px 16px", fontSize: "18px" }}>
              ···
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: "12px 16px", background: "#fff", borderTop: "0.5px solid rgba(0,0,0,0.08)", display: "flex", gap: "8px" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Pregúntale algo a VY..."
          style={{ flex: 1, height: "40px", background: "#F7F7F5", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "12px", padding: "0 14px", fontSize: "13px", outline: "none" }}
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          style={{ width: "40px", height: "40px", background: "#6C63FF", border: "none", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: !input.trim() || loading ? 0.5 : 1 }}
        >
          <span style={{ color: "#fff", fontSize: "16px" }}>↑</span>
        </button>
      </div>
    </main>
  );
}
