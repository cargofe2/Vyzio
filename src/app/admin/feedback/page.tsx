"use client";
import { useEffect, useState } from "react";

interface FeedbackRow {
  id: string; category: string; rating: number | null; message: string;
  page: string | null; status: string; createdAt: string;
  user: { email: string; username: string; displayName: string } | null;
}

const card: React.CSSProperties = { background: "#1E2533", border: "1px solid #324055", borderRadius: "14px", padding: "14px" };
const btn: React.CSSProperties = { padding: "5px 10px", background: "#7B61FF", color: "#fff", borderRadius: "7px", fontSize: "11px", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", border: "none", cursor: "pointer" };
const btnGhost: React.CSSProperties = { ...btn, background: "#324055" };
const btnDanger: React.CSSProperties = { ...btn, background: "#FF6B6B" };
const CATEGORY_LABELS: Record<string, string> = { bug: "🐛 Bug", suggestion: "💡 Sugerencia", content: "📚 Contenido", other: "💬 Otro" };
const STATUS_COLORS: Record<string, string> = { new: "#F2C04D", reviewed: "#468BFF", done: "#36D399" };
const STATUSES = ["new", "reviewed", "done"];

export default function AdminFeedbackPage() {
  const [items, setItems] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/feedback");
    const d = await res.json();
    setItems(d.feedback ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/feedback/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("¿Borrar este feedback?")) return;
    await fetch(`/api/admin/feedback/${id}`, { method: "DELETE" });
    load();
  }

  const filtered = filter === "all" ? items : items.filter(i => i.status === filter);

  if (loading) return <p style={{ color: "#7E8798", fontFamily: "'DM Sans',sans-serif" }}>Cargando...</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "20px", color: "#F8FAFF" }}>Feedback ({items.length})</h1>

      <div style={{ display: "flex", gap: "8px" }}>
        {["all", ...STATUSES].map(s => (
          <button key={s} style={filter === s ? btn : btnGhost} onClick={() => setFilter(s)}>
            {s === "all" ? "Todos" : s === "new" ? "Nuevos" : s === "reviewed" ? "Revisados" : "Resueltos"}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {filtered.map(f => (
          <div key={f.id} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: "11px" }}>{CATEGORY_LABELS[f.category] ?? f.category}</span>
                {f.rating && <span style={{ fontSize: "11px" }}>{"⭐".repeat(f.rating)}</span>}
                <span style={{ fontSize: "10px", color: STATUS_COLORS[f.status], fontWeight: 700 }}>● {f.status.toUpperCase()}</span>
              </div>
              <button style={{ ...btnDanger, padding: "3px 8px", fontSize: "10px" }} onClick={() => remove(f.id)}>Borrar</button>
            </div>
            <p style={{ color: "#F8FAFF", fontSize: "13px", fontFamily: "'DM Sans',sans-serif", marginBottom: "8px", lineHeight: 1.5 }}>{f.message}</p>
            <p style={{ color: "#7E8798", fontSize: "10px", fontFamily: "'DM Sans',sans-serif", marginBottom: "8px" }}>
              {f.user ? `${f.user.displayName} · @${f.user.username} · ${f.user.email}` : "Usuario anónimo"} · {f.page} · {new Date(f.createdAt).toLocaleString()}
            </p>
            <div style={{ display: "flex", gap: "6px" }}>
              {STATUSES.map(s => (
                <button key={s} style={f.status === s ? btn : btnGhost} onClick={() => updateStatus(f.id, s)}>
                  {s === "new" ? "Nuevo" : s === "reviewed" ? "Revisado" : "Resuelto"}
                </button>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p style={{ color: "#7E8798", fontSize: "12px" }}>Sin feedback en esta categoría.</p>}
      </div>
    </div>
  );
}
