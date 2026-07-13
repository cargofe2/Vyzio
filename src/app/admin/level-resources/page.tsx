"use client";
import { useEffect, useState } from "react";

interface Resource {
  id: string; levelId: string; type: string; title: string;
  description: string | null; url: string | null; order: number;
}

const LEVELS = [
  { id: "level-1", label: "Nivel 0 — Origins" }, { id: "level-new-1", label: "Nivel 1 — Explorer" },
  { id: "level-new-2", label: "Nivel 2 — Thinker" }, { id: "level-new-3", label: "Nivel 3 — Creator" },
  { id: "level-new-4", label: "Nivel 4 — Builder" }, { id: "level-new-5", label: "Nivel 5 — Architect" },
  { id: "level-new-6", label: "Nivel 6 — Founder" }, { id: "level-new-7", label: "Nivel 7 — Researcher" },
  { id: "level-new-8", label: "Nivel 8 — Residency" },
];
const TYPES = ["video", "article", "diagram"];

const card: React.CSSProperties = { background: "#1E2533", border: "1px solid #324055", borderRadius: "14px", padding: "14px" };
const btn: React.CSSProperties = { padding: "6px 12px", background: "#7B61FF", color: "#fff", borderRadius: "8px", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", border: "none", cursor: "pointer" };
const btnDanger: React.CSSProperties = { ...btn, background: "#FF6B6B" };
const inputStyle: React.CSSProperties = { background: "#0F1420", border: "1px solid #324055", borderRadius: "8px", padding: "8px 10px", color: "#F8FAFF", fontSize: "12px", fontFamily: "'DM Sans',sans-serif", width: "100%", boxSizing: "border-box" };

export default function AdminLevelResourcesPage() {
  const [levelId, setLevelId] = useState(LEVELS[0].id);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ type: "video", title: "", description: "", url: "", order: "0" });
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/level-resources?levelId=${levelId}`);
    const d = await res.json();
    setResources(d.resources ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, [levelId]);

  async function create() {
    setErr("");
    if (!form.title.trim()) { setErr("Falta el título"); return; }
    const res = await fetch("/api/admin/level-resources", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ levelId, type: form.type, title: form.title, description: form.description || null, url: form.url || null, order: Number(form.order) }),
    });
    const d = await res.json();
    if (!res.ok) { setErr(d.error); return; }
    setForm({ type: "video", title: "", description: "", url: "", order: "0" });
    load();
  }

  async function remove(id: string) {
    if (!confirm("¿Borrar este recurso?")) return;
    await fetch(`/api/admin/level-resources/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "20px", color: "#F8FAFF" }}>Recursos "Profundiza más"</h1>

      <select style={inputStyle} value={levelId} onChange={e => setLevelId(e.target.value)}>
        {LEVELS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
      </select>

      <div style={card}>
        <p style={{ fontSize: "12px", fontWeight: 700, color: "#F8FAFF", marginBottom: "10px" }}>+ Nuevo recurso</p>
        {err && <p style={{ color: "#FF6B6B", fontSize: "12px", marginBottom: "8px" }}>{err}</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <select style={{ ...inputStyle, width: "140px" }} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input style={{ ...inputStyle, width: "80px" }} placeholder="Order" value={form.order} onChange={e => setForm(f => ({ ...f, order: e.target.value }))} />
          </div>
          <input style={inputStyle} placeholder="Título" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <input style={inputStyle} placeholder="URL (video de YouTube o artículo)" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
          <textarea style={{ ...inputStyle, minHeight: "50px" }} placeholder="Descripción breve (opcional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <button style={btn} onClick={create}>Crear recurso</button>
        </div>
      </div>

      {loading ? <p style={{ color: "#7E8798" }}>Cargando...</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {resources.map(r => (
            <div key={r.id} style={{ ...card, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: "10px", color: "#7E8798", fontWeight: 700 }}>{r.type.toUpperCase()} · order {r.order}</p>
                <p style={{ color: "#F8FAFF", fontSize: "13px", fontWeight: 600 }}>{r.title}</p>
                {r.url && <p style={{ color: "#468BFF", fontSize: "11px" }}>{r.url}</p>}
              </div>
              <button style={{ ...btnDanger, padding: "4px 8px", fontSize: "10px" }} onClick={() => remove(r.id)}>Borrar</button>
            </div>
          ))}
          {resources.length === 0 && <p style={{ color: "#7E8798", fontSize: "12px" }}>Sin recursos para este nivel.</p>}
        </div>
      )}
    </div>
  );
}
