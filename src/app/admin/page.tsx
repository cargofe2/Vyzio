"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface WorldRow {
  id: string; name: string; emoji: string; number: number; order: number;
  _count: { lessons: number };
}
interface LevelRow {
  id: string; name: string; number: number; isFree: boolean;
  worlds: WorldRow[];
}

const card: React.CSSProperties = { background: "#1E2533", border: "1px solid #324055", borderRadius: "14px", padding: "14px" };
const btn: React.CSSProperties = { padding: "6px 12px", background: "#7B61FF", color: "#fff", borderRadius: "8px", fontSize: "12px", fontWeight: 700, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", border: "none", cursor: "pointer" };
const label: React.CSSProperties = { fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#7E8798", fontFamily: "'DM Sans',sans-serif" };

export default function AdminHome() {
  const [levels, setLevels] = useState<LevelRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWorldFor, setNewWorldFor] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", emoji: "🌍", number: "", order: "" });
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/worlds");
    const d = await res.json();
    setLevels(d.levels ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function createWorld(levelId: string) {
    setErr("");
    const res = await fetch("/api/admin/worlds", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        levelId, name: form.name, slug: form.slug, description: form.description,
        emoji: form.emoji, number: Number(form.number), order: Number(form.order),
      }),
    });
    const d = await res.json();
    if (!res.ok) { setErr(d.error); return; }
    setNewWorldFor(null);
    setForm({ name: "", slug: "", description: "", emoji: "🌍", number: "", order: "" });
    load();
  }

  if (loading) return <p style={{ color: "#7E8798", fontFamily: "'DM Sans',sans-serif" }}>Cargando...</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "20px", color: "#F8FAFF" }}>Niveles y Mundos</h1>
      {levels.map(lvl => (
        <div key={lvl.id} style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "14px" }}>
              Nivel {lvl.number} — {lvl.name} {lvl.isFree && <span style={{ ...label, color: "#36D399" }}>· GRATIS</span>}
            </span>
            <button style={btn} onClick={() => { setNewWorldFor(newWorldFor === lvl.id ? null : lvl.id); setErr(""); }}>+ World</button>
          </div>

          {newWorldFor === lvl.id && (
            <div style={{ background: "#161C27", border: "1px solid #324055", borderRadius: "10px", padding: "12px", marginBottom: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {err && <p style={{ color: "#FF6B6B", fontSize: "12px" }}>{err}</p>}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                <input placeholder="Número (order dentro del nivel)" value={form.number} onChange={e => setForm(f => ({ ...f, number: e.target.value }))} style={inputStyle} />
                <input placeholder="Order global (dashboard)" value={form.order} onChange={e => setForm(f => ({ ...f, order: e.target.value }))} style={inputStyle} />
                <input placeholder="Emoji" value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} style={inputStyle} />
              </div>
              <input placeholder="Nombre del mundo" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
              <input placeholder="Slug único (ej: nivel4-nuevo-mundo)" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} style={inputStyle} />
              <textarea placeholder="Descripción" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ ...inputStyle, minHeight: "60px" }} />
              <button style={btn} onClick={() => createWorld(lvl.id)}>Crear world</button>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {lvl.worlds.map(w => (
              <Link key={w.id} href={`/admin/worlds/${w.id}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "#161C27", border: "1px solid #324055", borderRadius: "10px", padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#F8FAFF", fontSize: "13px", fontFamily: "'DM Sans',sans-serif" }}>{w.emoji} {w.name}</span>
                  <span style={{ ...label }}>{w._count.lessons} lecc.</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const inputStyle: React.CSSProperties = { background: "#0F1420", border: "1px solid #324055", borderRadius: "8px", padding: "8px 10px", color: "#F8FAFF", fontSize: "12px", fontFamily: "'DM Sans',sans-serif" };
