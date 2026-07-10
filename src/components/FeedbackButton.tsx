"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";

const CATEGORIES = [
  { id: "bug", label: "🐛 Bug" },
  { id: "suggestion", label: "💡 Sugerencia" },
  { id: "content", label: "📚 Contenido" },
  { id: "other", label: "💬 Otro" },
];

export default function FeedbackButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("suggestion");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit() {
    if (!message.trim()) return;
    setSending(true);
    await fetch("/api/feedback", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, rating: rating || null, message, page: pathname }),
    });
    setSending(false);
    setSent(true);
    setTimeout(() => {
      setOpen(false);
      setSent(false);
      setMessage("");
      setRating(0);
      setCategory("suggestion");
    }, 1500);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed", bottom: "76px", right: "16px", zIndex: 90,
          width: "44px", height: "44px", borderRadius: "50%",
          background: "#7B61FF", border: "none", color: "#fff",
          fontSize: "18px", cursor: "pointer",
          boxShadow: "0 4px 16px rgba(123,97,255,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        aria-label="Enviar feedback"
      >
        💬
      </button>

      {open && (
        <div
          onClick={() => !sending && setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: "#1E2533", border: "1px solid #324055", borderRadius: "18px 18px 0 0", padding: "20px", width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {sent ? (
              <p style={{ color: "#36D399", textAlign: "center", padding: "20px 0", fontFamily: "'DM Sans',sans-serif", fontWeight: 700 }}>¡Gracias por tu feedback! 🎉</p>
            ) : (
              <>
                <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "15px" }}>Cuéntanos qué piensas</p>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {CATEGORIES.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setCategory(c.id)}
                      style={{
                        padding: "6px 12px", borderRadius: "999px", fontSize: "12px", fontFamily: "'DM Sans',sans-serif",
                        border: category === c.id ? "1px solid #7B61FF" : "1px solid #324055",
                        background: category === c.id ? "rgba(123,97,255,0.15)" : "transparent",
                        color: category === c.id ? "#fff" : "#7E8798", cursor: "pointer",
                      }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "6px" }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setRating(n)}
                      style={{ fontSize: "22px", background: "none", border: "none", cursor: "pointer", opacity: rating >= n ? 1 : 0.3 }}
                    >
                      ⭐
                    </button>
                  ))}
                </div>

                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="¿Qué encontraste, qué te gustaría ver, o qué no funcionó?"
                  style={{ background: "#0F1420", border: "1px solid #324055", borderRadius: "10px", padding: "10px", color: "#F8FAFF", fontSize: "13px", fontFamily: "'DM Sans',sans-serif", minHeight: "90px", resize: "vertical" }}
                />

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={submit}
                    disabled={sending || !message.trim()}
                    style={{ flex: 1, padding: "10px", background: "#7B61FF", color: "#fff", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: 700, cursor: "pointer", opacity: sending || !message.trim() ? 0.5 : 1, fontFamily: "'DM Sans',sans-serif" }}
                  >
                    {sending ? "Enviando..." : "Enviar"}
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    style={{ padding: "10px 16px", background: "#324055", color: "#fff", border: "none", borderRadius: "10px", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
                  >
                    Cerrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
