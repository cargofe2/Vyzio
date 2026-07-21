"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AvatarIcon, { FREE_AVATAR_IDS, PREMIUM_AVATAR_IDS } from "@/components/AvatarIcon";
import ZaiCompanion from "@/components/ZaiCompanion";
import { useZai } from "@/lib/ZaiContext";
import { playCorrect, playIncorrect, playComplete, playXP } from "@/lib/sounds";

interface QuizQuestion {
  id: string; question: string; options: string[];
  correctIndex: number; explanation: string; order: number;
}
interface Lesson {
  id: string; number: number; title: string; type: string;
  content: { blocks: Array<{ type: string; text?: string; url?: string; alt?: string; terms?: { term: string; def: string }[] }> } | null;
  durationMin: number; xpReward: number;
  world: { id: string; name: string; emoji: string };
  quizQuestions: QuizQuestion[];
  progress: { completed: boolean; score: number | null } | null;
}

const IS_DIAGNOSTIC = (id: string) => id === "lesson-0-1";
const IS_PROFILE_SETUP = (id: string) => id === "lesson-0-4";

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  VIDEO: { label: "Video", color: "#F87171" }, READING: { label: "Lectura", color: "#7DD3FC" },
  QUIZ: { label: "Quiz", color: "#FB923C" }, PROJECT: { label: "Proyecto", color: "#A78BFA" },
  EVALUATION: { label: "Evaluación", color: "#F472B6" }, PRACTICE: { label: "Práctica", color: "#34D399" },
};

const LEVELS_DATA = [
  { n: 0, name: "Origins", color: "#26C6DA", desc: "Alfabetización en IA. Entiendes qué es la IA, cómo funciona, y por qué importa en tu vida." },
  { n: 1, name: "Explorer", color: "#468BFF", desc: "Dominas herramientas de IA reales — prompts, ChatGPT, Claude — como usuario avanzado." },
  { n: 2, name: "Thinker", color: "#A78BFA", desc: "Desarrollas pensamiento crítico, lógica y capacidad de decisión — con o sin IA de por medio." },
  { n: 3, name: "Creator", color: "#36D399", desc: "Conviertes ideas en productos reales usando design thinking y herramientas sin código." },
  { n: 4, name: "Builder", color: "#7B61FF", desc: "Construyes sistemas de IA en producción — RAG, fine-tuning, arquitectura real." },
  { n: 5, name: "Architect", color: "#26C6DA", desc: "Diseñas sistemas a escala — multi-agente, infraestructura, seguridad." },
  { n: 6, name: "Founder", color: "#FB923C", desc: "Aprendes a crear y liderar una organización alrededor de lo que construyes." },
  { n: 7, name: "Researcher", color: "#36D399", desc: "Lees, reproduces y produces investigación rigurosa en IA." },
  { n: 8, name: "Residency", color: "#F472B6", desc: "Aplicas todo en un proyecto real con un stakeholder real. Termina en el Grand Challenge." },
];

function LevelMapInteractive() {
  const [active, setActive] = useState(0);
  const sel = LEVELS_DATA[active];
  const icons = ["🌱","🧭","🧠","🎨","🛠️","🏗️","🚀","🔬","🎓"];
  const worlds = [11,11,10,10,10,10,10,9,2];
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 4px 24px", position: "relative" }}>
        <div style={{ position: "absolute", top: "20px", left: "24px", right: "24px", height: "2px", background: "#324055", zIndex: 0 }} />
        {LEVELS_DATA.map((lvl, i) => (
          <button key={lvl.n} onClick={() => setActive(i)} style={{ background: "none", border: "none", cursor: "pointer", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: 0 }}>
            <div style={{ width: active === i ? "42px" : "34px", height: active === i ? "42px" : "34px", borderRadius: "50%", background: active === i ? lvl.color : "#1E2533", border: `2px solid ${lvl.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: active === i ? "18px" : "14px", boxShadow: active === i ? `0 0 16px ${lvl.color}88` : "none", transition: "all 0.2s" }}>{icons[i]}</div>
            <span style={{ fontSize: "7px", fontWeight: 700, color: active === i ? lvl.color : "#7E8798", fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>{lvl.name}</span>
          </button>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, #1E2533, #161C27)", border: `1px solid ${sel.color}50`, borderRadius: "16px", padding: "18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: sel.color + "20", border: `1px solid ${sel.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>{icons[active]}</div>
          <div>
            <p style={{ fontSize: "9px", fontWeight: 700, color: sel.color, fontFamily: "'DM Sans',sans-serif", letterSpacing: "1px", marginBottom: "2px" }}>NIVEL {sel.n}</p>
            <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "18px", color: "#F8FAFF" }}>{sel.name}</p>
          </div>
        </div>
        <p style={{ fontSize: "13px", lineHeight: 1.7, color: "#B3BDD1", fontFamily: "'DM Sans',sans-serif", marginBottom: "12px" }}>{sel.desc}</p>
        <div style={{ display: "flex", gap: "8px" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, color: sel.color, background: sel.color + "15", border: `1px solid ${sel.color}30`, borderRadius: "8px", padding: "3px 10px", fontFamily: "'DM Sans',sans-serif" }}>{worlds[active]} mundos</span>
          <span style={{ fontSize: "10px", fontWeight: 700, color: "#7E8798", background: "rgba(255,255,255,0.05)", borderRadius: "8px", padding: "3px 10px", fontFamily: "'DM Sans',sans-serif" }}>~{Math.round(worlds[active] * 1.5)} semanas</span>
        </div>
      </div>
    </div>
  );
}



















}export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<"reading" | "quiz" | "done" | "diagnostic-result">("reading");
  const { triggerMood, setOnTap } = useZai();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [answers, setAnswers] = useState<{question: string; answer: string}[]>([]);
  const [vyResponse, setVyResponse] = useState("");
  const [vyLoading, setVyLoading] = useState(false);
  const [paywalled, setPaywalled] = useState(false);
  const [nextLessonId, setNextLessonId] = useState<string|null>(null);
  const [nextUrl, setNextUrl] = useState<string>('/worlds');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/lessons/${id}`);
        if (res.status === 402) { setPaywalled(true); setLoading(false); return; }
        if (res.ok) {
          const data = await res.json();
          setLesson(data.lesson);
          if (data.lesson?.type === "QUIZ") setPhase("quiz");
          // Calcular siguiente URL
          const les = data.lesson;
          const worldId = les?.world?.id;
          const levelId = les?.world?.levelId;
          if (worldId) {
            const wRes = await fetch('/api/lessons?worldId=' + worldId);
            if (wRes.ok) {
              const wData = await wRes.json();
              const lessons = wData.lessons ?? [];
              const curr = lessons.findIndex((l: any) => l.id === id);
              if (curr >= 0 && curr < lessons.length - 1) {
                setNextUrl('/lesson/' + lessons[curr + 1].id);
              } else if (levelId) {
                const lvRes = await fetch('/api/lessons?levelId=' + levelId);
                if (lvRes.ok) {
                  const lvData = await lvRes.json();
                  const worlds = lvData.worlds ?? [];
                  const wIdx = worlds.findIndex((w: any) => w.id === worldId);
                  if (wIdx >= 0 && wIdx < worlds.length - 1) {
                    setNextUrl('/worlds?id=' + worlds[wIdx + 1].id);
                  } else {
                    setNextUrl('/worlds');
                  }
                }
              }
            }
          }
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    if (id) load();
  }, [id]);

  async function askZaiToExpand() {
    if (!lesson) return;
    const prompt = `Estoy estudiando "${lesson.title}" en ${lesson.world.name}. Dame un ejemplo practico y concreto en maximo 3 oraciones.`;





    sessionStorage.setItem("zai_pending_prompt", prompt);
    router.push("/vy");
  }

  useEffect(() => {
    const shouldRegister = lesson && phase === "reading" && lesson.type !== "PROJECT" && !IS_PROFILE_SETUP(id);
    if (shouldRegister) {
      setOnTap(askZaiToExpand);
    } else {
      setOnTap(null);
    }
    return () => setOnTap(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson, phase]);

  async function completeReading() {
    if (!lesson) return;
    if (lesson.quizQuestions.length > 0) setPhase("quiz");
    else await completeLesson();
  }

  const [profileName, setProfileName] = useState("");
  const [profileEmoji, setProfileEmoji] = useState("orb-1");
  const [profileLang, setProfileLang] = useState("es");
  const [profileAge, setProfileAge] = useState("");
  const [profileGoal, setProfileGoal] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const AVATAR_OPTIONS = FREE_AVATAR_IDS;
  const PREMIUM_AVATARS: [string, number][] = PREMIUM_AVATAR_IDS;
  const [vyCoins, setVyCoins] = useState(0);
  const [unlockedAvatars, setUnlockedAvatars] = useState<string[]>([]);
  const [shopMsg, setShopMsg] = useState("");

  useEffect(() => {
    if (!IS_PROFILE_SETUP(id)) return;
    fetch("/api/gamification").then(r => r.ok ? r.json() : null).then(d => {
      if (d?.gamification?.vyCoins !== undefined) setVyCoins(d.gamification.vyCoins);
    }).catch(() => {});
    fetch("/api/user").then(r => r.ok ? r.json() : null).then(d => {
      if (d?.user?.unlockedAvatars) setUnlockedAvatars(d.user.unlockedAvatars);
    }).catch(() => {});
  }, [id]);

  async function unlockAvatar(avatar: string, price: number) {
    if (unlockedAvatars.includes(avatar)) { setProfileEmoji(avatar); return; }
    if (vyCoins < price) { setShopMsg(`Necesitas ${price - vyCoins} monedas más`); setTimeout(() => setShopMsg(""), 2000); return; }
    const res = await fetch("/api/shop/avatar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ avatar }) });
    if (res.ok) {
      const data = await res.json();
      setVyCoins(v => v - (data.spent ?? 0));
      setUnlockedAvatars(u => [...u, avatar]);
      setProfileEmoji(avatar);
    }
  }

  async function saveProfileAndComplete() {
    if (!profileName.trim() || !profileAge.trim()) return;
    const ageNum = parseInt(profileAge, 10);
    if (isNaN(ageNum) || ageNum < 16) {
      setShopMsg("Bymyzai está disponible para mayores de 16 años por ahora.");
      setTimeout(() => setShopMsg(""), 4000);
      return;
    }
    setProfileSaving(true);
    try {
      await fetch("/api/user", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: profileName.trim(), avatarEmoji: profileEmoji,
          language: profileLang, age: parseInt(profileAge, 10) || null,
          goal: profileGoal.trim() || null,
        }),
      });
    } catch (err) { console.error(err); }
    finally { setProfileSaving(false); }
    await completeLesson();
  }

  const [battleSubmission, setBattleSubmission] = useState("");
  const [battleLoading, setBattleLoading] = useState(false);
  const [battleResult, setBattleResult] = useState<{ passed: boolean; feedback: string; attempts: number } | null>(null);

  async function submitBossBattle() {
    if (!lesson || !battleSubmission.trim()) return;
    setBattleLoading(true);
    try {
      const res = await fetch("/api/boss-battle", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id, submission: battleSubmission.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setBattleResult(data);
        if (data.passed) await completeLesson(); else { playIncorrect(); triggerMood("incorrect"); }
      }
    } catch (err) { console.error(err); }
    finally { setBattleLoading(false); }
  }

  async function completeLesson(finalScore?: number) {
    if (!lesson) return;
    const res = await fetch("/api/progress", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: lesson.id, score: finalScore }),
    });
    if (res.ok) { const data = await res.json(); setXpEarned(data.xpAwarded ?? lesson.xpReward); }
    playComplete();
    triggerMood("celebrate", 2500);
    setTimeout(() => playXP(), 250);
    setPhase("done");
  }

  async function completeDiagnostic(finalAnswers: {question: string; answer: string}[]) {
    if (!lesson) return;
    await fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lessonId: lesson.id, score: 100 }) });
    setVyLoading(true); setPhase("diagnostic-result");
    const answersText = finalAnswers.map((a, i) => `Pregunta ${i + 1}: ${a.question}\nRespuesta: ${a.answer}`).join("\n\n");
    const prompt = `Acabo de completar el diagnóstico inicial de Bymyzai. Estas son mis respuestas:\n\n${answersText}\n\nBasándote en mis respuestas, dime:\n1. Mi perfil de aprendizaje (responde con exactamente una palabra: Explorer, Thinker, Creator o Developer)\n2. Por qué mundo específico de Bymyzai debo empezar\n3. Qué puedo lograr en los próximos 30 días si sigo mi ruta\n\nEmpieza tu respuesta con la palabra exacta del perfil entre corchetes, ej: [Explorer]. Luego continúa el resto de tu respuesta normal. Sé directo y motivador. Máximo 150 palabras.`;
    try {
      const res = await fetch("/api/vy", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: prompt }) });
      if (res.ok) {
        const data = await res.json();
        const raw = data.message ?? "";
        const match = raw.match(/\[(Explorer|Thinker|Creator|Developer)\]/i);
        const identity = match ? match[1] : "Explorer";
        setVyResponse(raw.replace(/^\[(Explorer|Thinker|Creator|Developer)\]\s*/i, ""));
        await fetch("/api/user", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identity }) });
      }
    } catch { setVyResponse("Basado en tus respuestas, te recomiendo empezar por el Mundo 1 — Fundamentos de IA."); }
    finally { setVyLoading(false); }
  }

  async function handleAnswer(idx: number) {
    if (answered || !lesson) return;
    setSelected(idx); setAnswered(true);
    const q = lesson.quizQuestions[currentQ];
    if (!IS_DIAGNOSTIC(id)) {
      await fetch("/api/progress", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ questionId: q.id, selectedIndex: idx }) });
      if (idx === q.correctIndex) { setScore(s => s + 1); playCorrect(); triggerMood("correct"); } else { playIncorrect(); triggerMood("incorrect"); }
    } else {
      setAnswers(p => [...p, { question: q.question, answer: q.options[idx] }]);
    }
  }

  async function nextQuestion() {
    if (!lesson) return;
    if (currentQ < lesson.quizQuestions.length - 1) {
      setCurrentQ(c => c + 1); setSelected(null); setAnswered(false);
    } else {
      if (IS_DIAGNOSTIC(id)) await completeDiagnostic(answers);
      else await completeLesson(Math.round((score / lesson.quizQuestions.length) * 100));
    }
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0F1420", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <img src="/logo.png" alt="Bymyzai" width={36} height={36} style={{ borderRadius: "50%", flexShrink: 0 }} />
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", fontFamily: "'DM Sans',sans-serif" }}>Cargando lección...</p>
      </div>
    </div>
  );

  if (paywalled) return (
    <div style={{ minHeight: "100vh", background: "#0F1420", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ textAlign: "center", maxWidth: "300px" }}>
        <div style={{ width: "64px", height: "64px", background: "rgba(123,97,255,0.12)", border: "1px solid rgba(123,97,255,0.25)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 16px" }}>🔒</div>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "18px", marginBottom: "8px" }}>Contenido Pro</h2>
        <p style={{ fontSize: "13px", color: "#B3BDD1", marginBottom: "20px", lineHeight: 1.6, fontFamily: "'DM Sans',sans-serif" }}>Esta lección es parte de los niveles Thinker y Creator, disponibles en el plan Pro.</p>
        <Link href="/pricing" style={{ display: "block", padding: "14px", background: "linear-gradient(135deg,#7B61FF,#8B5CF6)", color: "#fff", borderRadius: "14px", fontWeight: 800, fontSize: "14px", textDecoration: "none", marginBottom: "10px", fontFamily: "'DM Sans',sans-serif" }}>Ver planes Pro →</Link>
        <Link href="/worlds" style={{ display: "block", padding: "12px", color: "#7E8798", fontSize: "13px", textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>Volver a mundos</Link>
      </div>
    </div>
  );

  if (!lesson) return (
    <div style={{ minHeight: "100vh", background: "#0F1420", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "36px", marginBottom: "10px" }}>😕</p>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "16px", fontFamily: "'DM Sans',sans-serif" }}>Lección no encontrada</p>
        <Link href="/worlds" style={{ padding: "10px 20px", background: "#7B61FF", color: "#fff", borderRadius: "12px", textDecoration: "none", fontWeight: 700, fontSize: "13px", fontFamily: "'DM Sans',sans-serif" }}>Ver mundos →</Link>
      </div>
    </div>
  );

  // Diagnostic result
  if (phase === "diagnostic-result") {
    return (
      <div style={{ minHeight: "100vh", background: "#0F1420", display: "flex", flexDirection: "column", padding: "24px" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "64px", height: "64px", background: "rgba(123,97,255,0.12)", border: "1px solid rgba(123,97,255,0.25)", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", marginBottom: "16px" }}>🎯</div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#fff", fontSize: "22px", marginBottom: "6px", textAlign: "center" }}>Tu perfil de aprendizaje</h2>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", marginBottom: "22px", fontFamily: "'DM Sans',sans-serif" }}>Análisis de VY basado en tu diagnóstico</p>

          <div style={{ width: "100%", maxWidth: "360px", background: "rgba(123,97,255,0.08)", border: "1px solid rgba(123,97,255,0.25)", borderRadius: "20px", padding: "20px", marginBottom: "24px" }}>
            {vyLoading ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", fontFamily: "'DM Sans',sans-serif" }}>VY está analizando tus respuestas...</p>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <div style={{ width: "26px", height: "26px", background: "rgba(0,255,179,0.12)", border: "1px solid rgba(0,255,179,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" stroke="#00FFB3" strokeWidth="2"/><path d="M8 8L12 16L16 8" stroke="#00FFB3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span style={{ color: "#00FFB3", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>VY — Tu tutor personal</span>
                </div>
                <p style={{ color: "#fff", fontSize: "13px", lineHeight: 1.7, fontFamily: "'DM Sans',sans-serif" }}
                  dangerouslySetInnerHTML={{ __html: vyResponse.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "360px" }}>
            <Link href="/worlds" style={{ display: "block", padding: "14px", background: "linear-gradient(135deg,#7B61FF,#8B5CF6)", color: "#fff", borderRadius: "14px", fontWeight: 800, fontSize: "14px", textDecoration: "none", textAlign: "center", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 0 12px rgba(123,97,255,0.25)" }}>
              Ver mi ruta de aprendizaje →
            </Link>
            <Link href="/vy" style={{ display: "block", padding: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", borderRadius: "14px", fontWeight: 600, fontSize: "13px", textDecoration: "none", textAlign: "center", fontFamily: "'DM Sans',sans-serif" }}>
              Hablar más con VY
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Done
  if (phase === "done") {
    return (
      <div style={{ minHeight: "100vh", background: "#0F1420", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ marginBottom: "16px" }}><ZaiCompanion mood="celebrate" size={80} /></div>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#fff", fontSize: "22px", marginBottom: "6px", textAlign: "center" }}>¡Lección completada!</h2>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginBottom: "22px", fontFamily: "'DM Sans',sans-serif" }}>{lesson.title}</p>
        {xpEarned > 0 && (
          <div style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.25)", borderRadius: "14px", padding: "12px 28px", marginBottom: "24px" }}>
            <p style={{ color: "#FB923C", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "26px", textAlign: "center" }}>+{xpEarned} XP</p>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "300px" }}>
          <Link href={nextUrl} style={{ display: "block", padding: "14px", background: "linear-gradient(135deg,#7B61FF,#8B5CF6)", color: "#fff", borderRadius: "14px", fontWeight: 800, fontSize: "14px", textDecoration: "none", textAlign: "center", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 0 12px rgba(123,97,255,0.25)" }}>
            {nextUrl.startsWith("/lesson") ? "Siguiente leccion →" : nextUrl === "/worlds" ? "Ver niveles →" : "Siguiente mundo →"}
          </Link>
          <Link href="/dashboard" style={{ display: "block", padding: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", borderRadius: "14px", fontWeight: 600, fontSize: "13px", textDecoration: "none", textAlign: "center", fontFamily: "'DM Sans',sans-serif" }}>
            Ir al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Quiz
  if (phase === "quiz" && lesson.quizQuestions.length > 0) {
    const q = lesson.quizQuestions[currentQ];
    const total = lesson.quizQuestions.length;
    const isDiag = IS_DIAGNOSTIC(id);

    return (
      <div style={{ minHeight: "100vh", background: "#0F1420", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px", borderBottom: "1px solid rgba(123,97,255,0.1)" }}>
          {isDiag && <p style={{ color: "#818CF8", fontSize: "11px", fontWeight: 700, marginBottom: "8px", fontFamily: "'DM Sans',sans-serif" }}>🎯 DIAGNÓSTICO INICIAL</p>}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", fontFamily: "'DM Sans',sans-serif" }}>Pregunta {currentQ + 1} de {total}</p>
            {!isDiag && <p style={{ color: "#FB923C", fontSize: "11px", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>🎯 Quiz</p>}
          </div>
          <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
            <div style={{ height: "100%", width: `${((currentQ + 1) / total) * 100}%`, background: isDiag ? "linear-gradient(90deg,#7B61FF,#A78BFA)" : "linear-gradient(90deg,#FB923C,#EA580C)", borderRadius: "2px", transition: "width 0.3s" }} />
          </div>
        </div>

        <div style={{ flex: 1, padding: "20px 16px" }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "17px", color: "#fff", marginBottom: "20px", lineHeight: 1.4 }}>{q.question}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {q.options.map((opt, i) => {
              let bg = "rgba(123,97,255,0.04)", border = "1px solid rgba(123,97,255,0.1)", color = "#fff";
              if (isDiag) {
                if (selected === i) { bg = "rgba(123,97,255,0.18)"; border = "2px solid #7B61FF"; }
              } else if (answered) {
                if (i === q.correctIndex) { bg = "rgba(52,211,153,0.12)"; border = "2px solid #34D399"; color = "#34D399"; }
                else if (i === selected) { bg = "rgba(248,113,113,0.12)"; border = "2px solid #F87171"; color = "#F87171"; }
              } else if (selected === i) { bg = "rgba(123,97,255,0.1)"; border = "2px solid #7B61FF"; }
              return (
                <button key={i} onClick={() => handleAnswer(i)} disabled={isDiag ? false : answered}
                  style={{ width: "100%", padding: "14px 16px", borderRadius: "14px", textAlign: "left", fontSize: "13px", fontWeight: 500, cursor: "pointer", background: bg, border, color, transition: "all 0.2s", fontFamily: "'DM Sans',sans-serif" }}>
                  <span style={{ fontWeight: 700, marginRight: "8px", color: "#818CF8" }}>{["A","B","C","D"][i]}.</span>{opt}
                </button>
              );
            })}
          </div>
          {!isDiag && answered && (
            <div style={{ marginTop: "16px", padding: "14px", borderRadius: "14px", background: selected === q.correctIndex ? "rgba(52,211,153,0.08)" : "rgba(251,146,60,0.08)", border: `1px solid ${selected === q.correctIndex ? "rgba(52,211,153,0.2)" : "rgba(251,146,60,0.2)"}` }}>
              <p style={{ fontWeight: 700, fontSize: "12px", marginBottom: "4px", color: selected === q.correctIndex ? "#34D399" : "#FB923C", fontFamily: "'DM Sans',sans-serif" }}>
                {selected === q.correctIndex ? "✅ ¡Correcto!" : "❌ Incorrecto"}
              </p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5, fontFamily: "'DM Sans',sans-serif" }}>{q.explanation}</p>
            </div>
          )}
        </div>

        {(isDiag ? selected !== null : answered) && (
          <div style={{ padding: "16px", borderTop: "1px solid rgba(123,97,255,0.1)" }}>
            <button onClick={nextQuestion} style={{ width: "100%", padding: "14px", background: isDiag ? "linear-gradient(135deg,#7B61FF,#8B5CF6)" : "linear-gradient(135deg,#FB923C,#EA580C)", color: isDiag ? "#fff" : "#0F1420", border: "none", borderRadius: "14px", fontWeight: 800, fontSize: "14px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
              {currentQ < total - 1 ? "Siguiente →" : isDiag ? "Ver mi perfil →" : "Ver resultados →"}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Reading
  const blocks = lesson.content?.blocks ?? [];
  const typeCfg = TYPE_CONFIG[lesson.type] ?? TYPE_CONFIG.READING;

  return (
    <div style={{ minHeight: "100vh", background: "#0F1420", paddingBottom: "100px" }}>
      <div style={{ padding: "16px", borderBottom: "1px solid rgba(123,97,255,0.1)" }}>
        <Link href={`/worlds?id=${lesson.world.id}`} style={{ color: "rgba(255,255,255,0.4)", fontSize: "20px", textDecoration: "none" }}>←</Link>
        <div style={{ marginTop: "12px", marginBottom: "12px" }}>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "4px", fontFamily: "'DM Sans',sans-serif" }}>
            {lesson.world.emoji} {lesson.world.name} · Lección {lesson.number}
          </p>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#fff", fontSize: "19px", lineHeight: 1.3 }}>{lesson.title}</h1>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", alignItems: "center" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px", background: `${typeCfg.color}18`, color: typeCfg.color, fontFamily: "'DM Sans',sans-serif" }}>{typeCfg.label} · {lesson.durationMin} min</span>
          <span style={{ fontSize: "10px", color: "#FB923C", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>+{lesson.xpReward} XP</span>
        </div>
        <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
          <div style={{ height: "100%", width: lesson.progress?.completed ? "100%" : "10%", background: "linear-gradient(90deg,#7B61FF,#A78BFA)", borderRadius: "2px" }} />
        </div>
      </div>

      <div style={{ padding: "20px 16px" }}>
        {lesson.type === "PROJECT" && !battleResult?.passed ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ padding: "14px", borderRadius: "14px", background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.25)" }}>
              <p style={{ fontSize: "11px", fontWeight: 800, color: "#A78BFA", marginBottom: "6px", letterSpacing: "1px" }}>⚔️ BOSS BATTLE</p>
              {blocks.map((block, i) => block.text && (
                <p key={i} style={{ fontSize: "13px", lineHeight: 1.7, color: "rgba(255,255,255,0.8)", marginBottom: "8px", fontFamily: "'DM Sans',sans-serif" }}>{block.text}</p>
              ))}
            </div>
            <div>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#818CF8", marginBottom: "8px" }}>TU ENTREGA</p>
              <textarea value={battleSubmission} onChange={e => setBattleSubmission(e.target.value)} placeholder="Pega o describe tu trabajo completo aquí..." rows={6} style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", background: "#1E2533", border: "1px solid #324055", color: "#F8FAFF", fontSize: "13px", fontFamily: "'DM Sans',sans-serif", resize: "none" }} />
            </div>
            {battleResult && (
              <div style={{ padding: "14px", borderRadius: "14px", background: battleResult.passed ? "rgba(52,211,153,0.1)" : "rgba(255,107,107,0.1)", border: `1px solid ${battleResult.passed ? "rgba(52,211,153,0.3)" : "rgba(255,107,107,0.3)"}` }}>
                <p style={{ fontSize: "12px", fontWeight: 800, color: battleResult.passed ? "#34D399" : "#FF6B6B", marginBottom: "6px" }}>{battleResult.passed ? "✓ APROBADO" : "✗ REINTENTA — Intento " + battleResult.attempts}</p>
                <p style={{ fontSize: "13px", lineHeight: 1.6, color: "rgba(255,255,255,0.8)" }}>{battleResult.feedback}</p>
              </div>
            )}
          </div>
        ) : IS_PROFILE_SETUP(id) ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#818CF8", marginBottom: "8px", fontFamily: "'DM Sans',sans-serif" }}>ELIGE TU AVATAR</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {AVATAR_OPTIONS.map(id => (
                  <button key={id} onClick={() => setProfileEmoji(id)} style={{ width: "44px", height: "44px", borderRadius: "12px", padding: 0, background: profileEmoji === id ? "rgba(123,97,255,0.2)" : "#1E2533", border: profileEmoji === id ? "1px solid rgba(123,97,255,0.5)" : "1px solid #324055", cursor: "pointer", overflow: "hidden" }}><AvatarIcon id={id} size={44} /></button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <p style={{ fontSize: "12px", fontWeight: 700, color: "#818CF8", fontFamily: "'DM Sans',sans-serif" }}>AVATARES PREMIUM</p>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#FCD34D", fontFamily: "'DM Sans',sans-serif" }}>🪙 {vyCoins}</span>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {PREMIUM_AVATARS.map(([id, price]) => {
                  const owned = unlockedAvatars.includes(id);
                  return (
                    <button key={id} onClick={() => unlockAvatar(id, price)} style={{ position: "relative", width: "44px", height: "44px", borderRadius: "12px", padding: 0, background: profileEmoji === id ? "rgba(123,97,255,0.2)" : "#1E2533", border: profileEmoji === id ? "1px solid rgba(123,97,255,0.5)" : "1px solid #324055", cursor: "pointer", opacity: owned ? 1 : 0.6, overflow: "hidden" }}>
                      <AvatarIcon id={id} size={44} />
                      {!owned && <span style={{ position: "absolute", bottom: "-6px", right: "-6px", fontSize: "8px", background: "#FCD34D", color: "#000", borderRadius: "6px", padding: "1px 4px", fontWeight: 700 }}>{price}</span>}
                    </button>
                  );
                })}
              </div>
              {shopMsg && <p style={{ fontSize: "11px", color: "#FF6B6B", marginTop: "6px", fontFamily: "'DM Sans',sans-serif" }}>{shopMsg}</p>}
            </div>
            <div>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#818CF8", marginBottom: "8px", fontFamily: "'DM Sans',sans-serif" }}>NOMBRE VISIBLE</p>
              <input value={profileName} onChange={e => setProfileName(e.target.value)} placeholder="¿Cómo te llamas?" style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", background: "#1E2533", border: "1px solid #324055", color: "#F8FAFF", fontSize: "14px", fontFamily: "'DM Sans',sans-serif" }} />
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "12px", fontWeight: 700, color: "#818CF8", marginBottom: "8px", fontFamily: "'DM Sans',sans-serif" }}>EDAD</p>
                <input type="number" min={16} max={99} value={profileAge} onChange={e => setProfileAge(e.target.value)} placeholder="16" style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", background: "#1E2533", border: "1px solid #324055", color: "#F8FAFF", fontSize: "14px", fontFamily: "'DM Sans',sans-serif" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "12px", fontWeight: 700, color: "#818CF8", marginBottom: "8px", fontFamily: "'DM Sans',sans-serif" }}>IDIOMA</p>
                <select value={profileLang} onChange={e => setProfileLang(e.target.value)} style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", background: "#1E2533", border: "1px solid #324055", color: "#F8FAFF", fontSize: "14px", fontFamily: "'DM Sans',sans-serif" }}>
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="it">Italiano</option>
                  <option value="pt">Português</option>
                </select>
              </div>
            </div>
            <div>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#818CF8", marginBottom: "8px", fontFamily: "'DM Sans',sans-serif" }}>¿QUÉ QUIERES LOGRAR?</p>
              <textarea value={profileGoal} onChange={e => setProfileGoal(e.target.value)} placeholder="Ej: quiero construir mi primera app con IA" rows={3} style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", background: "#1E2533", border: "1px solid #324055", color: "#F8FAFF", fontSize: "14px", fontFamily: "'DM Sans',sans-serif", resize: "none" }} />
            </div>
          </div>
        ) : (
          <>
            {blocks.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <p style={{ fontSize: "36px", marginBottom: "12px" }}>📖</p>
                <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "13px", fontFamily: "'DM Sans',sans-serif" }}>Contenido próximamente</p>
              </div>
            )}
            {blocks.map((block, i) => {
              if (block.type === "text") return (
                <p key={i} style={{ fontSize: "16px", lineHeight: 1.8, color: "rgba(255,255,255,0.85)", marginBottom: "16px", fontFamily: "'DM Sans',sans-serif" }}
                  dangerouslySetInnerHTML={{ __html: (block.text ?? "").replace(/\*\*(.*?)\*\*/g, "<strong style='color:#fff'>$1</strong>") }} />
              );
              if (block.type === "heading") return (
                <h3 key={i} style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "17px", color: "#fff", margin: "22px 0 12px" }}>{block.text}</h3>
              );
              if (block.type === "callout") return (
                <div key={i} style={{ padding: "14px", borderRadius: "14px", background: "rgba(123,97,255,0.08)", border: "1px solid rgba(123,97,255,0.2)", marginBottom: "16px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#818CF8", marginBottom: "5px", fontFamily: "'DM Sans',sans-serif" }}>💡 IMPORTANTE</p>
                  <p style={{ fontSize: "15px", lineHeight: 1.7, color: "rgba(255,255,255,0.8)", fontFamily: "'DM Sans',sans-serif" }}
                    dangerouslySetInnerHTML={{ __html: (block.text ?? "").replace(/\*\*(.*?)\*\*/g, "<strong style='color:#fff'>$1</strong>") }} />
                </div>
              );
if (block.type === "level_map") return <LevelMapInteractive key={i} />;
              if (block.type === "image") return (
                <img key={i} src={block.url} alt={block.alt ?? ""} style={{ width: "100%", borderRadius: "14px", marginBottom: "16px" }} />
              );
              if (block.type === "tip") return (
                <div key={i} style={{ padding: "12px", borderRadius: "12px", background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.18)", marginBottom: "16px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#FB923C", marginBottom: "5px", fontFamily: "'DM Sans',sans-serif" }}>⚡ TIP</p>
                  <p style={{ fontSize: "13px", lineHeight: 1.6, color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans',sans-serif" }}>{block.text}</p>
                </div>
              );
              if (block.type === "glossary") return (
                <div key={i} style={{ padding: "16px", borderRadius: "14px", background: "#161C27", border: "1px solid #324055", marginBottom: "16px", marginTop: "8px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#7E8798", marginBottom: "10px", fontFamily: "'DM Sans',sans-serif", textTransform: "uppercase", letterSpacing: "0.5px" }}>📖 Glosario de esta lección</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {(block.terms ?? []).map((t, ti) => (
                      <div key={ti}>
                        <p style={{ fontSize: "13px", fontWeight: 700, color: "#A78BFA", fontFamily: "'DM Sans',sans-serif" }}>{t.term}</p>
                        <p style={{ fontSize: "13px", lineHeight: 1.5, color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans',sans-serif" }}>{t.def}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
              return null;
            })}
          </>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px", background: "rgba(15,20,32,0.96)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid rgba(123,97,255,0.1)" }}>
        {lesson.progress?.completed ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "12px", color: "#34D399", fontWeight: 700, marginBottom: "8px", fontFamily: "'DM Sans',sans-serif" }}>✅ Lección completada</p>
            <Link href={`/worlds?id=${lesson.world.id}`} style={{ display: "block", padding: "12px", background: "linear-gradient(135deg,#7B61FF,#8B5CF6)", color: "#fff", borderRadius: "14px", fontWeight: 800, fontSize: "14px", textDecoration: "none", textAlign: "center", fontFamily: "'DM Sans',sans-serif" }}>
              Siguiente lección →
            </Link>
          </div>
        ) : (
          <button
            onClick={lesson.type === "PROJECT" ? submitBossBattle : IS_PROFILE_SETUP(id) ? saveProfileAndComplete : completeReading}
            disabled={(lesson.type === "PROJECT" && (!battleSubmission.trim() || battleLoading)) || (IS_PROFILE_SETUP(id) && (!profileName.trim() || !profileAge.trim() || profileSaving))}
            style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#7B61FF,#8B5CF6)", color: "#fff", border: "none", borderRadius: "14px", fontWeight: 800, fontSize: "14px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 0 12px rgba(123,97,255,0.2)", opacity: (lesson.type === "PROJECT" && !battleSubmission.trim()) || (IS_PROFILE_SETUP(id) && (!profileName.trim() || !profileAge.trim())) ? 0.5 : 1 }}>
            {lesson.type === "PROJECT" ? (battleLoading ? "ZAI está evaluando..." : "⚔️ Enviar al Boss") : IS_PROFILE_SETUP(id) ? (profileSaving ? "Guardando..." : "Guardar y continuar →") : (lesson.quizQuestions.length > 0 ? `Quiz (${lesson.quizQuestions.length} preguntas) →` : "Completar lección →")}
          </button>
        )}
      </div>
    </div>
  );
}
