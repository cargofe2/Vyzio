"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useUserLang } from "@/hooks/useUserLang";

const CATEGORIES_ES = [
  { id: "bug", label: "🐛 Bug" },
  { id: "suggestion", label: "💡 Sugerencia" },
  { id: "content", label: "📚 Contenido" },
  { id: "other", label: "💬 Otro" },
];

const CATEGORIES_EN = [
  { id: "bug", label: "🐛 Bug" },
  { id: "suggestion", label: "💡 Suggestion" },
  { id: "content", label: "📚 Content" },
  { id: "other", label: "💬 Other" },
];

const T = {
  title:       { es: "Cuéntanos qué piensas",                                    en: "Tell us what you think" },
  placeholder: { es: "¿Qué encontraste, qué te gustaría ver, o qué no funcionó?", en: "What did you find, what would you like to see, or what did not work?" },
  send:        { es: "Enviar",                                                    en: "Send" },
  sending:     { es: "Enviando...",                                               en: "Sending..." },
  close:       { es: "Cerrar",                                                    en: "Close" },
  thanks:      { es: "¡Gracias por tu feedback! ✓",                              en: "Thanks for your feedback! ✓" },
};

export default function FeedbackButton() {
  const pathname = usePathname();
  const { lang } = useUserLang();
  const t = (key: keyof typeof T) => T[key][lang];
  const categories = lang === "en" ? CATEGORIES_EN : CATEGORIES_ES;

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
        aria-label={lang === "en" ? "Send feedback" : "Enviar feedback"}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
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
              <p style={{ color: "#36D399", textAlign: "center", padding: "20px 0", fontFamily: "'DM Sans',sans-serif", fontWeight: 700 }}>{t("thanks")}</p>
            ) : (
              <>
                <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "15px" }}>{t("title")}</p>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {categories.map(c => (
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
                      ★
                    </button>
                  ))}
                </div>

                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={t("placeholder")}
                  style={{ background: "#0F1420", border: "1px solid #324055", borderRadius: "10px", padding: "10px", color: "#F8FAFF", fontSize: "13px", fontFamily: "'DM Sans',sans-serif", minHeight: "90px", resize: "vertical" }}
                />

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={submit}
                    disabled={sending || !message.trim()}
                    style={{ flex: 1, padding: "10px", background: "#7B61FF", color: "#fff", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: 700, cursor: "pointer", opacity: sending || !message.trim() ? 0.5 : 1, fontFamily: "'DM Sans',sans-serif" }}
                  >
                    {sending ? t("sending") : t("send")}
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    style={{ padding: "10px 16px", background: "#324055", color: "#fff", border: "none", borderRadius: "10px", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
                  >
                    {t("close")}
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
