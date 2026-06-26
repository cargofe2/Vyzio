"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface QuizQuestion {
  id: string; question: string; options: string[];
  correctIndex: number; explanation: string; order: number;
}
interface Lesson {
  id: string; number: number; title: string; type: string;
  content: { blocks: Array<{ type: string; text?: string; heading?: string }> } | null;
  durationMin: number; xpReward: number;
  world: { id: string; name: string; emoji: string };
  quizQuestions: QuizQuestion[];
  progress: { completed: boolean; score: number | null } | null;
}

const IS_DIAGNOSTIC = (id: string) => id === "lesson-0-1";

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<"reading" | "quiz" | "done" | "diagnostic-result">("reading");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [answers, setAnswers] = useState<{question: string; answer: string; index: number}[]>([]);
  const [vyResponse, setVyResponse] = useState("");
  const [vyLoading, setVyLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/lessons/${id}`);
        if (res.ok) {
          const data = await res.json();
          setLesson(data.lesson);
          if (data.lesson?.type === "QUIZ") setPhase("quiz");
        }
      } catch (err) {
        console.error("Lesson load error:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  async function completeReading() {
    if (!lesson) return;
    if (lesson.quizQuestions.length > 0) {
      setPhase("quiz");
    } else {
      await completeLesson();
    }
  }

  async function completeLesson(finalScore?: number) {
    if (!lesson) return;
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: lesson.id, score: finalScore }),
    });
    if (res.ok) {
      const data = await res.json();
      setXpEarned(data.xpAwarded ?? lesson.xpReward);
    }
    setPhase("done");
  }

  async function completeDiagnostic(finalAnswers: {question: string; answer: string; index: number}[]) {
    if (!lesson) return;

    // Save progress
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: lesson.id, score: 100 }),
    });

    setVyLoading(true);
    setPhase("diagnostic-result");

    // Build prompt for VY
    const answersText = finalAnswers.map((a, i) =>
      `Pregunta ${i + 1}: ${a.question}\nRespuesta: ${a.answer}`
    ).join("\n\n");

    const prompt = `Acabo de completar el diagnóstico inicial de VYZIO. Estas son mis respuestas:\n\n${answersText}\n\nBasándote en mis respuestas, dime:\n1. Mi perfil de aprendizaje (Explorer, Creator, Developer o Entrepreneur)\n2. Por qué mundo específico de VYZIO debo empezar\n3. Qué puedo lograr en los próximos 30 días si sigo mi ruta\n\nSé directo y motivador. Máximo 150 palabras.`;

    try {
      const res = await fetch("/api/vy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
      if (res.ok) {
        const data = await res.json();
        setVyResponse(data.message ?? "");
      }
    } catch (err) {
      setVyResponse("Basado en tus respuestas, te recomiendo empezar por el Mundo 1 — Fundamentos de IA. ¡Tienes todo para aprender rápido!");
    } finally {
      setVyLoading(false);
    }
  }

  async function handleAnswer(idx: number) {
    if (answered || !lesson) return;
    setSelected(idx);
    setAnswered(true);

    const q = lesson.quizQuestions[currentQ];
    const isCorrect = idx === q.correctIndex;

    if (!IS_DIAGNOSTIC(id)) {
      await fetch("/api/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: q.id, selectedIndex: idx }),
      });
      if (isCorrect) setScore(s => s + 1);
    } else {
      // For diagnostic, record the answer text
      const newAnswers = [...answers, {
        question: q.question,
        answer: q.options[idx],
        index: idx
      }];
      setAnswers(newAnswers);
    }
  }

  async function nextQuestion() {
    if (!lesson) return;
    if (currentQ < lesson.quizQuestions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      if (IS_DIAGNOSTIC(id)) {
        await completeDiagnostic(answers);
      } else {
        const finalScore = Math.round((score / lesson.quizQuestions.length) * 100);
        await completeLesson(finalScore);
      }
    }
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "32px", marginBottom: "8px" }}>⚡</div>
        <p style={{ color: "rgba(0,0,0,0.3)", fontSize: "13px" }}>Cargando...</p>
      </div>
    </div>
  );

  if (!lesson) return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>😕</div>
        <p style={{ color: "rgba(0,0,0,0.4)", fontSize: "14px", marginBottom: "16px" }}>Lección no encontrada</p>
        <Link href="/worlds" style={{ padding: "10px 20px", background: "#111", color: "#FFFC00", borderRadius: "12px", textDecoration: "none", fontWeight: 700, fontSize: "13px" }}>
          Ver mundos →
        </Link>
      </div>
    </div>
  );

  // Diagnostic result screen
  if (phase === "diagnostic-result") {
    return (
      <div style={{ minHeight: "100vh", background: "#111", display: "flex", flexDirection: "column", padding: "24px" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>🎯</div>
          <h2 style={{ fontWeight: 900, color: "#fff", fontSize: "22px", marginBottom: "8px", textAlign: "center" }}>
            Tu perfil de aprendizaje
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginBottom: "24px" }}>
            Análisis de VY basado en tu diagnóstico
          </p>

          <div style={{ width: "100%", maxWidth: "360px", background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.3)", borderRadius: "20px", padding: "20px", marginBottom: "24px" }}>
            {vyLoading ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>🤖</div>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>VY está analizando tus respuestas...</p>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <div style={{ width: "28px", height: "28px", background: "rgba(108,99,255,0.3)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>🤖</div>
                  <span style={{ color: "#6C63FF", fontSize: "11px", fontWeight: 700 }}>VY — Tu tutor personal</span>
                </div>
                <p style={{ color: "#fff", fontSize: "13px", lineHeight: 1.7 }}
                  dangerouslySetInnerHTML={{ __html: vyResponse.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "360px" }}>
            <Link href="/worlds" style={{ display: "block", padding: "14px", background: "#FFFC00", color: "#111", borderRadius: "14px", fontWeight: 800, fontSize: "14px", textDecoration: "none", textAlign: "center" }}>
              Ver mi ruta de aprendizaje →
            </Link>
            <Link href="/vy" style={{ display: "block", padding: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", borderRadius: "14px", fontWeight: 600, fontSize: "13px", textDecoration: "none", textAlign: "center" }}>
              Hablar más con VY
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Done screen
  if (phase === "done") {
    return (
      <div style={{ minHeight: "100vh", background: "#111", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
        <h2 style={{ fontWeight: 900, color: "#fff", fontSize: "22px", marginBottom: "8px", textAlign: "center" }}>¡Lección completada!</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "24px" }}>{lesson.title}</p>
        {xpEarned > 0 && (
          <div style={{ background: "rgba(255,252,0,0.1)", border: "1px solid rgba(255,252,0,0.2)", borderRadius: "14px", padding: "12px 24px", marginBottom: "24px" }}>
            <p style={{ color: "#FFFC00", fontWeight: 900, fontSize: "24px", textAlign: "center" }}>+{xpEarned} XP</p>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "300px" }}>
          <Link href={`/worlds?id=${lesson.world.id}`} style={{ display: "block", padding: "14px", background: "#FFFC00", color: "#111", borderRadius: "14px", fontWeight: 800, fontSize: "14px", textDecoration: "none", textAlign: "center" }}>
            Siguiente lección →
          </Link>
          <Link href="/dashboard" style={{ display: "block", padding: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", borderRadius: "14px", fontWeight: 600, fontSize: "13px", textDecoration: "none", textAlign: "center" }}>
            Ir al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Quiz screen
  if (phase === "quiz" && lesson.quizQuestions.length > 0) {
    const q = lesson.quizQuestions[currentQ];
    const total = lesson.quizQuestions.length;
    const isDiag = IS_DIAGNOSTIC(id);

    return (
      <div style={{ minHeight: "100vh", background: isDiag ? "#111" : "#F7F7F5", display: "flex", flexDirection: "column" }}>
        <div style={{ background: "#111", padding: "16px" }}>
          {isDiag && (
            <p style={{ color: "#FFFC00", fontSize: "11px", fontWeight: 700, marginBottom: "8px" }}>🎯 DIAGNÓSTICO INICIAL</p>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>Pregunta {currentQ + 1} de {total}</p>
            {!isDiag && <p style={{ color: "#FFFC00", fontSize: "11px", fontWeight: 700 }}>🎯 Quiz</p>}
          </div>
          <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }}>
            <div style={{ height: "100%", width: `${((currentQ + 1) / total) * 100}%`, background: isDiag ? "#6C63FF" : "#FFFC00", borderRadius: "2px", transition: "width 0.3s" }} />
          </div>
        </div>

        <div style={{ flex: 1, padding: "20px 16px", background: isDiag ? "#111" : "#F7F7F5" }}>
          <h2 style={{ fontWeight: 700, fontSize: "16px", color: isDiag ? "#fff" : "#111", marginBottom: "20px", lineHeight: 1.4 }}>{q.question}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {q.options.map((opt, i) => {
              let bg = isDiag ? "rgba(255,255,255,0.05)" : "#fff";
              let border = isDiag ? "1px solid rgba(255,255,255,0.1)" : "0.5px solid rgba(0,0,0,0.1)";
              let color = isDiag ? "#fff" : "#111";

              if (isDiag) {
                if (selected === i) { bg = "rgba(108,99,255,0.2)"; border = "2px solid #6C63FF"; }
              } else if (answered) {
                if (i === q.correctIndex) { bg = "#E8F5E9"; border = "2px solid #2E7D32"; color = "#1B5E20"; }
                else if (i === selected) { bg = "#FFEBEE"; border = "2px solid #C62828"; color = "#B71C1C"; }
              } else if (selected === i) {
                bg = "rgba(108,99,255,0.08)"; border = "2px solid #6C63FF";
              }

              return (
                <button key={i} onClick={() => handleAnswer(i)}
                  disabled={isDiag ? false : answered}
                  style={{ width: "100%", padding: "14px 16px", borderRadius: "14px", textAlign: "left", fontSize: "13px", fontWeight: 500, cursor: "pointer", background: bg, border, color, transition: "all 0.2s" }}>
                  <span style={{ fontWeight: 700, marginRight: "8px" }}>{["A","B","C","D"][i]}.</span>{opt}
                </button>
              );
            })}
          </div>

          {!isDiag && answered && (
            <div style={{ marginTop: "16px", padding: "14px", borderRadius: "14px", background: selected === q.correctIndex ? "#E8F5E9" : "#FFF3E0", border: `1px solid ${selected === q.correctIndex ? "#A5D6A7" : "#FFCC80"}` }}>
              <p style={{ fontWeight: 700, fontSize: "12px", marginBottom: "4px", color: selected === q.correctIndex ? "#1B5E20" : "#E65100" }}>
                {selected === q.correctIndex ? "✅ ¡Correcto!" : "❌ Incorrecto"}
              </p>
              <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.6)", lineHeight: 1.5 }}>{q.explanation}</p>
            </div>
          )}
        </div>

        {(isDiag ? selected !== null : answered) && (
          <div style={{ padding: "16px", background: isDiag ? "#111" : "#fff", borderTop: isDiag ? "1px solid rgba(255,255,255,0.08)" : "0.5px solid rgba(0,0,0,0.08)" }}>
            <button onClick={nextQuestion} style={{ width: "100%", padding: "14px", background: isDiag ? "#6C63FF" : "#111", color: isDiag ? "#fff" : "#FFFC00", border: "none", borderRadius: "14px", fontWeight: 800, fontSize: "14px", cursor: "pointer" }}>
              {currentQ < total - 1 ? "Siguiente →" : isDiag ? "Ver mi perfil →" : "Ver resultados →"}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Reading screen
  const blocks = lesson.content?.blocks ?? [];

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", paddingBottom: "100px" }}>
      <div style={{ background: "#111", padding: "16px" }}>
        <Link href={`/worlds?id=${lesson.world.id}`} style={{ color: "rgba(255,255,255,0.4)", fontSize: "20px", textDecoration: "none" }}>←</Link>
        <div style={{ marginTop: "12px", marginBottom: "12px" }}>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "4px" }}>
            {lesson.world.emoji} {lesson.world.name} · Lección {lesson.number}
          </p>
          <h1 style={{ fontWeight: 900, color: "#fff", fontSize: "18px", lineHeight: 1.3 }}>{lesson.title}</h1>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{lesson.durationMin} min</span>
          <span style={{ fontSize: "10px", color: "#FFFC00", fontWeight: 700 }}>+{lesson.xpReward} XP</span>
        </div>
        <div style={{ height: "3px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }}>
          <div style={{ height: "100%", width: lesson.progress?.completed ? "100%" : "10%", background: "#FFFC00", borderRadius: "2px" }} />
        </div>
      </div>

      <div style={{ padding: "20px 16px" }}>
        {blocks.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontSize: "40px", marginBottom: "12px" }}>📖</p>
            <p style={{ color: "rgba(0,0,0,0.3)", fontSize: "13px" }}>Contenido próximamente</p>
          </div>
        )}
        {blocks.map((block, i) => {
          if (block.type === "text") return (
            <p key={i} style={{ fontSize: "14px", lineHeight: 1.7, color: "rgba(0,0,0,0.75)", marginBottom: "14px" }}
              dangerouslySetInnerHTML={{ __html: (block.text ?? "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
          );
          if (block.type === "heading") return (
            <h3 key={i} style={{ fontWeight: 800, fontSize: "16px", color: "#111", margin: "20px 0 10px" }}>{block.text}</h3>
          );
          if (block.type === "callout") return (
            <div key={i} style={{ padding: "14px", borderRadius: "14px", background: "rgba(108,99,255,0.06)", border: "1px solid rgba(108,99,255,0.15)", marginBottom: "14px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#6C63FF", marginBottom: "4px" }}>💡 IMPORTANTE</p>
              <p style={{ fontSize: "13px", lineHeight: 1.6, color: "rgba(0,0,0,0.7)" }}
                dangerouslySetInnerHTML={{ __html: (block.text ?? "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
            </div>
          );
          if (block.type === "tip") return (
            <div key={i} style={{ padding: "12px", borderRadius: "12px", background: "rgba(255,252,0,0.08)", border: "1px solid rgba(255,252,0,0.2)", marginBottom: "14px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#6B5900", marginBottom: "4px" }}>⚡ TIP</p>
              <p style={{ fontSize: "13px", lineHeight: 1.6, color: "rgba(0,0,0,0.65)" }}>{block.text}</p>
            </div>
          );
          return null;
        })}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px", background: "#fff", borderTop: "0.5px solid rgba(0,0,0,0.08)" }}>
        {lesson.progress?.completed ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "12px", color: "#2E7D32", fontWeight: 700, marginBottom: "8px" }}>✅ Lección completada</p>
            <Link href={`/worlds?id=${lesson.world.id}`} style={{ display: "block", padding: "12px", background: "#111", color: "#FFFC00", borderRadius: "14px", fontWeight: 800, fontSize: "14px", textDecoration: "none", textAlign: "center" }}>
              Siguiente lección →
            </Link>
          </div>
        ) : (
          <button onClick={completeReading} style={{ width: "100%", padding: "14px", background: "#111", color: "#FFFC00", border: "none", borderRadius: "14px", fontWeight: 800, fontSize: "14px", cursor: "pointer" }}>
            {lesson.quizQuestions.length > 0 ? `Quiz (${lesson.quizQuestions.length} preguntas) →` : "Completar lección →"}
          </button>
        )}
      </div>
    </div>
  );
}
