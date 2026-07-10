"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface LessonRow {
  id: string; number: number; title: string; type: string; order: number;
  isPublished: boolean; _count: { quizQuestions: number };
}
interface WorldDetail {
  id: string; name: string; description: string; emoji: string;
  lessons: LessonRow[];
}

const card: React.CSSProperties = { background: "#1E2533", border: "1px solid #324055", borderRadius: "14px", padding: "14px" };
const btn: React.CSSProperties = { padding: "6px 12px", background: "#7B61FF", color: "#fff", borderRadius: "8px", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", border: "none", cursor: "pointer" };
const inputStyle: React.CSSProperties = { background: "#0F1420", border: "1px solid #324055", borderRadius: "8px", padding: "8px 10px", color: "#F8FAFF", fontSize: "12px", fontFamily: "'DM Sans',sans-serif" };
const LESSON_TYPES = ["READING", "VIDEO", "QUIZ", "PROJECT", "EVALUATION", "PRACTICE"];

export default function AdminWorldPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [world, setWorld] = useState<WorldDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingMeta, setEditingMeta] = useState(false);
  const [meta, setMeta] = useState({ name: "", description: "", emoji: "" });
  const [newLesson, setNewLesson] = useState(false);
  const [lf, setLf] = useState({ number: "", title: "", slug: "", type: "READING", order: "" });
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/worlds/${id}`);
    const d = await res.json();
    if (res.ok) { setWorld(d.world); setMeta({ name: d.world.name, description: d.world.description, emoji: d.world.emoji }); }
    setLoading(false);
  }
  useEffect(() => { load(); }, [id]);

  async function saveMeta() {
    await fetch(`/api/admin/worlds/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(meta) });
    setEditingMeta(false);
    load();
  }

  async function createLesson() {
    setErr("");
    const res = await fetch("/api/admin/lessons", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ worldId: id, number: Number(lf.number), title: lf.title, slug: lf.slug, type: lf.type, order: Number(lf.order) }),
    });
    const d = await res.json();
    if (!res.ok) { setErr(d.error); return; }
    setNewLesson(false);
    setLf({ number: "", title: "", slug: "", type: "READING", order: "" });
    load();
  }

  async function deleteWorld() {
    if (!confirm("¿Borrar este world? Solo funciona si no tiene lecciones.")) return;
    const res = await fetch(`/api/admin/worlds/${id}`, { method: "DELETE" });
    const d = await res.json();
    if (!res.ok) { alert(d.error); return; }
    router.push("/admin");
  }

  if (loading || !world) return <p style={{ color: "#7E8798", fontFamily: "'DM Sans',sans-serif" }}>Cargando...</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Link href="/admin" style={{ color: "#7E8798", fontSize: "12px", textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>← Niveles y Mundos</Link>

      <div style={card}>
        {!editingMeta ? (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "18px", color: "#F8FAFF" }}>{world.emoji} {world.name}</h1>
              <p style={{ color: "#7E8798", fontSize: "12px", marginTop: "6px", fontFamily: "'DM Sans',sans-serif" }}>{world.description}</p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={btn} onClick={() => setEditingMeta(true)}>Editar</button>
              <button style={{ ...btn, background: "#FF6B6B" }} onClick={deleteWorld}>Borrar</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <input style={inputStyle} value={meta.emoji} onChange={e => setMeta(m => ({ ...m, emoji: e.target.value }))} placeholder="Emoji" />
            <input style={inputStyle} value={meta.name} onChange={e => setMeta(m => ({ ...m, name: e.target.value }))} placeholder="Nombre" />
            <textarea style={{ ...inputStyle, minHeight: "60px" }} value={meta.description} onChange={e => setMeta(m => ({ ...m, description: e.target.value }))} placeholder="Descripción" />
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={btn} onClick={saveMeta}>Guardar</button>
              <button style={{ ...btn, background: "#324055" }} onClick={() => setEditingMeta(false)}>Cancelar</button>
            </div>
          </div>
        )}
      </div>

      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "14px" }}>Lecciones ({world.lessons.length})</h2>
          <button style={btn} onClick={() => { setNewLesson(!newLesson); setErr(""); }}>+ Lección</button>
        </div>

        {newLesson && (
          <div style={{ background: "#161C27", border: "1px solid #324055", borderRadius: "10px", padding: "12px", marginBottom: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {err && <p style={{ color: "#FF6B6B", fontSize: "12px" }}>{err}</p>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              <input style={inputStyle} placeholder="Número" value={lf.number} onChange={e => setLf(f => ({ ...f, number: e.target.value }))} />
              <input style={inputStyle} placeholder="Order" value={lf.order} onChange={e => setLf(f => ({ ...f, order: e.target.value }))} />
              <select style={inputStyle} value={lf.type} onChange={e => setLf(f => ({ ...f, type: e.target.value }))}>
                {LESSON_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <input style={inputStyle} placeholder="Título" value={lf.title} onChange={e => setLf(f => ({ ...f, title: e.target.value }))} />
            <input style={inputStyle} placeholder="Slug único" value={lf.slug} onChange={e => setLf(f => ({ ...f, slug: e.target.value }))} />
            <button style={btn} onClick={createLesson}>Crear lección</button>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {world.lessons.map(l => (
            <Link key={l.id} href={`/admin/lessons/${l.id}`} style={{ textDecoration: "none" }}>
              <div style={{ background: "#161C27", border: "1px solid #324055", borderRadius: "8px", padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#F8FAFF", fontSize: "12px", fontFamily: "'DM Sans',sans-serif" }}>{l.number}. {l.title}</span>
                <span style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ fontSize: "10px", color: "#7E8798" }}>{l.type} · {l._count.quizQuestions}q</span>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: l.isPublished ? "#36D399" : "#F2C04D" }}>{l.isPublished ? "PUBLICADA" : "BORRADOR"}</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
