"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type Block = { type: string; text?: string; url?: string; alt?: string; terms?: { term: string; def: string }[] };
interface Quiz { id: string; question: string; options: string[]; correctIndex: number; explanation: string; order: number; }
interface LessonDetail {
  id: string; title: string; description: string | null; content: { blocks: Block[] } | null;
  isPublished: boolean; world: { id: string; name: string };
  quizQuestions: Quiz[];
}

const card: React.CSSProperties = { background: "#1E2533", border: "1px solid #324055", borderRadius: "14px", padding: "14px" };
const btn: React.CSSProperties = { padding: "6px 12px", background: "#7B61FF", color: "#fff", borderRadius: "8px", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", border: "none", cursor: "pointer" };
const btnGhost: React.CSSProperties = { ...btn, background: "#324055" };
const btnDanger: React.CSSProperties = { ...btn, background: "#FF6B6B" };
const inputStyle: React.CSSProperties = { background: "#0F1420", border: "1px solid #324055", borderRadius: "8px", padding: "8px 10px", color: "#F8FAFF", fontSize: "12px", fontFamily: "'DM Sans',sans-serif", width: "100%", boxSizing: "border-box" };
const BLOCK_TYPES = ["text", "heading", "callout", "tip", "image", "glossary"];

export default function AdminLessonPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [saveMsg, setSaveMsg] = useState("");
  const [newQ, setNewQ] = useState(false);
  const [qf, setQf] = useState({ question: "", options: ["", "", "", ""], correctIndex: 0, explanation: "", order: "" });
  const [qErr, setQErr] = useState("");
  const [editingQid, setEditingQid] = useState<string | null>(null);
  const [eqf, setEqf] = useState({ question: "", options: ["", "", "", ""], correctIndex: 0, explanation: "", order: "" });
  const [eqErr, setEqErr] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/lessons/${id}`);
    const d = await res.json();
    if (res.ok) {
      setLesson(d.lesson);
      setTitle(d.lesson.title);
      setDescription(d.lesson.description ?? "");
      setBlocks(d.lesson.content?.blocks ?? []);
    }
    setLoading(false);
  }
  useEffect(() => { load(); }, [id]);

  async function saveLesson(extra: Partial<{ isPublished: boolean }> = {}) {
    setSaveMsg("Guardando...");
    await fetch(`/api/admin/lessons/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, content: { blocks }, ...extra }),
    });
    setSaveMsg("Guardado ✓");
    setTimeout(() => setSaveMsg(""), 1500);
    load();
  }

  function updateBlock(i: number, patch: Partial<Block>) {
    setBlocks(bs => bs.map((b, idx) => idx === i ? { ...b, ...patch } : b));
  }
  function addBlock() {
    setBlocks(bs => [...bs, { type: "text", text: "" }]);
  }
  function removeBlock(i: number) {
    setBlocks(bs => bs.filter((_, idx) => idx !== i));
  }
  function moveBlock(i: number, dir: -1 | 1) {
    setBlocks(bs => {
      const arr = [...bs];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return arr;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return arr;
    });
  }

  async function createQuiz() {
    setQErr("");
    if (!qf.question.trim() || qf.options.some(o => !o.trim()) || !qf.explanation.trim() || !qf.order) {
      setQErr("Completa todos los campos"); return;
    }
    const res = await fetch("/api/admin/quiz", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: id, question: qf.question, options: qf.options, correctIndex: qf.correctIndex, explanation: qf.explanation, order: Number(qf.order) }),
    });
    const d = await res.json();
    if (!res.ok) { setQErr(d.error); return; }
    setNewQ(false);
    setQf({ question: "", options: ["", "", "", ""], correctIndex: 0, explanation: "", order: "" });
    load();
  }

  async function deleteQuiz(qid: string) {
    if (!confirm("¿Borrar esta pregunta?")) return;
    await fetch(`/api/admin/quiz/${qid}`, { method: "DELETE" });
    load();
  }

  function startEditQuiz(q: Quiz) {
    setEditingQid(q.id);
    setEqf({ question: q.question, options: [...q.options], correctIndex: q.correctIndex, explanation: q.explanation, order: String(q.order) });
    setEqErr("");
  }

  async function saveEditQuiz(qid: string) {
    setEqErr("");
    if (!eqf.question.trim() || eqf.options.some(o => !o.trim()) || !eqf.explanation.trim() || !eqf.order) {
      setEqErr("Completa todos los campos"); return;
    }
    const res = await fetch(`/api/admin/quiz/${qid}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: eqf.question, options: eqf.options, correctIndex: eqf.correctIndex, explanation: eqf.explanation, order: Number(eqf.order) }),
    });
    const d = await res.json();
    if (!res.ok) { setEqErr(d.error ?? "Error al guardar"); return; }
    setEditingQid(null);
    load();
  }

  async function deleteLesson() {
    if (!confirm("¿Borrar esta lección y todo su contenido/quiz?")) return;
    await fetch(`/api/admin/lessons/${id}`, { method: "DELETE" });
    router.push(`/admin/worlds/${lesson?.world.id}`);
  }

  if (loading || !lesson) return <p style={{ color: "#7E8798", fontFamily: "'DM Sans',sans-serif" }}>Cargando...</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Link href={`/admin/worlds/${lesson.world.id}`} style={{ color: "#7E8798", fontSize: "12px", textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>← {lesson.world.name}</Link>

      <div style={card}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <input style={{ ...inputStyle, fontWeight: 700, fontSize: "14px" }} value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" />
          <textarea style={{ ...inputStyle, minHeight: "50px" }} value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción corta" />
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button style={btn} onClick={() => saveLesson()}>Guardar</button>
            <button style={lesson.isPublished ? btnGhost : btn} onClick={() => saveLesson({ isPublished: !lesson.isPublished })}>
              {lesson.isPublished ? "Despublicar" : "Publicar"}
            </button>
            <button style={btnDanger} onClick={deleteLesson}>Borrar lección</button>
            {saveMsg && <span style={{ color: "#36D399", fontSize: "12px" }}>{saveMsg}</span>}
          </div>
        </div>
      </div>

      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "14px" }}>Contenido ({blocks.length} bloques)</h2>
          <button style={btn} onClick={addBlock}>+ Bloque</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {blocks.map((b, i) => (
            <div key={i} style={{ background: "#161C27", border: "1px solid #324055", borderRadius: "10px", padding: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <select style={{ ...inputStyle, width: "120px" }} value={b.type} onChange={e => updateBlock(i, { type: e.target.value })}>
                  {BLOCK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <button style={{ ...btnGhost, padding: "4px 8px" }} onClick={() => moveBlock(i, -1)}>↑</button>
                <button style={{ ...btnGhost, padding: "4px 8px" }} onClick={() => moveBlock(i, 1)}>↓</button>
                <button style={{ ...btnDanger, padding: "4px 8px", marginLeft: "auto" }} onClick={() => removeBlock(i)}>Borrar</button>
              </div>
              {b.type === "image" ? (
                <>
                  <input style={inputStyle} placeholder="URL de imagen" value={b.url ?? ""} onChange={e => updateBlock(i, { url: e.target.value })} />
                  <input style={inputStyle} placeholder="Texto alternativo" value={b.alt ?? ""} onChange={e => updateBlock(i, { alt: e.target.value })} />
                </>
              ) : b.type === "glossary" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {(b.terms ?? []).map((t, ti) => (
                    <div key={ti} style={{ display: "flex", gap: "6px" }}>
                      <input style={{ ...inputStyle, width: "140px" }} placeholder="Término" value={t.term} onChange={e => {
                        const next = [...(b.terms ?? [])]; next[ti] = { ...next[ti], term: e.target.value }; updateBlock(i, { terms: next });
                      }} />
                      <input style={inputStyle} placeholder="Definición breve" value={t.def} onChange={e => {
                        const next = [...(b.terms ?? [])]; next[ti] = { ...next[ti], def: e.target.value }; updateBlock(i, { terms: next });
                      }} />
                      <button style={{ ...btnDanger, padding: "4px 8px" }} onClick={() => {
                        const next = (b.terms ?? []).filter((_, idx) => idx !== ti); updateBlock(i, { terms: next });
                      }}>×</button>
                    </div>
                  ))}
                  <button style={btnGhost} onClick={() => updateBlock(i, { terms: [...(b.terms ?? []), { term: "", def: "" }] })}>+ Término</button>
                </div>
              ) : (
                <textarea style={{ ...inputStyle, minHeight: "70px" }} placeholder="Texto (soporta **negrita**)" value={b.text ?? ""} onChange={e => updateBlock(i, { text: e.target.value })} />
              )}
            </div>
          ))}
          {blocks.length === 0 && <p style={{ color: "#7E8798", fontSize: "12px" }}>Sin bloques. Agrega uno.</p>}
        </div>
      </div>

      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "14px" }}>Quiz ({lesson.quizQuestions.length})</h2>
          <button style={btn} onClick={() => { setNewQ(!newQ); setQErr(""); }}>+ Pregunta</button>
        </div>

        {newQ && (
          <div style={{ background: "#161C27", border: "1px solid #324055", borderRadius: "10px", padding: "12px", marginBottom: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {qErr && <p style={{ color: "#FF6B6B", fontSize: "12px" }}>{qErr}</p>}
            <input style={inputStyle} placeholder="Pregunta" value={qf.question} onChange={e => setQf(f => ({ ...f, question: e.target.value }))} />
            {qf.options.map((o, i) => (
              <div key={i} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <input type="radio" checked={qf.correctIndex === i} onChange={() => setQf(f => ({ ...f, correctIndex: i }))} />
                <input style={inputStyle} placeholder={`Opción ${i + 1}`} value={o} onChange={e => setQf(f => ({ ...f, options: f.options.map((x, idx) => idx === i ? e.target.value : x) }))} />
              </div>
            ))}
            <textarea style={{ ...inputStyle, minHeight: "50px" }} placeholder="Explicación de la respuesta correcta" value={qf.explanation} onChange={e => setQf(f => ({ ...f, explanation: e.target.value }))} />
            <input style={inputStyle} placeholder="Order" value={qf.order} onChange={e => setQf(f => ({ ...f, order: e.target.value }))} />
            <button style={btn} onClick={createQuiz}>Crear pregunta</button>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {lesson.quizQuestions.map(q => (
            <div key={q.id} style={{ background: "#161C27", border: "1px solid #324055", borderRadius: "10px", padding: "10px" }}>
              {editingQid === q.id ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {eqErr && <p style={{ color: "#FF6B6B", fontSize: "12px" }}>{eqErr}</p>}
                  <input style={inputStyle} placeholder="Pregunta" value={eqf.question} onChange={e => setEqf(f => ({ ...f, question: e.target.value }))} />
                  {eqf.options.map((o, i) => (
                    <div key={i} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <input type="radio" checked={eqf.correctIndex === i} onChange={() => setEqf(f => ({ ...f, correctIndex: i }))} />
                      <input style={inputStyle} placeholder={`Opción ${i + 1}`} value={o} onChange={e => setEqf(f => ({ ...f, options: f.options.map((x, idx) => idx === i ? e.target.value : x) }))} />
                    </div>
                  ))}
                  <textarea style={{ ...inputStyle, minHeight: "50px" }} placeholder="Explicación" value={eqf.explanation} onChange={e => setEqf(f => ({ ...f, explanation: e.target.value }))} />
                  <input style={inputStyle} placeholder="Order" value={eqf.order} onChange={e => setEqf(f => ({ ...f, order: e.target.value }))} />
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button style={btn} onClick={() => saveEditQuiz(q.id)}>Guardar</button>
                    <button style={btnGhost} onClick={() => setEditingQid(null)}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <p style={{ color: "#F8FAFF", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>{q.order}. {q.question}</p>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button style={{ ...btnGhost, padding: "3px 8px", fontSize: "10px" }} onClick={() => startEditQuiz(q)}>Editar</button>
                      <button style={{ ...btnDanger, padding: "3px 8px", fontSize: "10px" }} onClick={() => deleteQuiz(q.id)}>Borrar</button>
                    </div>
                  </div>
                  {q.options.map((o, i) => (
                    <p key={i} style={{ fontSize: "11px", color: i === q.correctIndex ? "#36D399" : "#7E8798", marginLeft: "8px" }}>{i === q.correctIndex ? "✓" : "·"} {o}</p>
                  ))}
                </>
              )}
            </div>
          ))}
          {lesson.quizQuestions.length === 0 && <p style={{ color: "#7E8798", fontSize: "12px" }}>Sin preguntas.</p>}
        </div>
      </div>
    </div>
  );
}
