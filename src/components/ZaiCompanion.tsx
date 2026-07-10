"use client";
import { useEffect, useState } from "react";
import { ZaiMood } from "@/lib/ZaiContext";

interface Props {
  mood: ZaiMood;
  size?: number;
}

/**
 * Compañero ZAI animado con cara propia (variante viva del ZaiOrb de marca).
 * - idle/thinking: flota, deambula, parpadea y mira alrededor mientras el usuario piensa
 * - correct: ojos felices en arco + sonrisa grande + anillo verde + chispas
 * - incorrect: ojos preocupados + boca plana + leve sacudida + anillo rojo suave (nunca punitivo)
 * - celebrate: ojos estrella + boca abierta de alegría + giro + escala grande
 */
export default function ZaiCompanion({ mood, size = 56 }: Props) {
  const [animKey, setAnimKey] = useState(0);
  const [blink, setBlink] = useState(false);
  const [lookX, setLookX] = useState(0);

  // Reinicia la animación de reacción cada vez que cambia el mood
  useEffect(() => { setAnimKey(k => k + 1); }, [mood]);

  // Parpadeo periódico + mirada errante, solo en reposo
  useEffect(() => {
    if (mood !== "idle" && mood !== "thinking") return;
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, 3200 + Math.random() * 1800);
    const lookInterval = setInterval(() => {
      setLookX(Math.random() > 0.5 ? 1.5 : -1.5);
    }, 2200 + Math.random() * 1400);
    return () => { clearInterval(blinkInterval); clearInterval(lookInterval); };
  }, [mood]);

  const orbAnimation =
    mood === "correct" ? "zaiCorrectPop 0.6s ease-out" :
    mood === "incorrect" ? "zaiWrongShake 0.5s ease-in-out" :
    mood === "celebrate" ? "zaiCelebrate 1s ease-in-out" :
    mood === "thinking" ? "zaiFloatIdle 3.5s ease-in-out infinite, zaiBob 1.6s ease-in-out infinite" :
    "zaiFloatIdle 6s ease-in-out infinite, zaiBob 2.4s ease-in-out infinite";

  const ringAnimation =
    mood === "correct" ? "zaiRingPulseGreen 0.7s ease-out" :
    mood === "incorrect" ? "zaiRingPulseRed 0.5s ease-out" :
    "none";

  const eyeH = blink ? 0.6 : 7; // altura del ojo (parpadeo = casi cerrado)

  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div key={`ring-${animKey}`} style={{ position: "absolute", inset: 0, borderRadius: "50%", animation: ringAnimation }} />

      <div key={`orb-${animKey}`} style={{ position: "relative", width: size, height: size, animation: orbAnimation }}>
        <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "conic-gradient(from 0deg, #A78BFA, #7B61FF, #4C3AA8, #7B61FF, #A78BFA)", animation: "zaiSpin 7s linear infinite" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.5), transparent 45%)" }} />

        {/* Cara */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={size} height={size} viewBox="0 0 100 100">
            {mood === "correct" && (
              <>
                <path d="M28 46 Q34 38 40 46" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" />
                <path d="M60 46 Q66 38 72 46" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" />
                <path d="M32 62 Q50 78 68 62" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" />
              </>
            )}
            {mood === "incorrect" && (
              <>
                <ellipse cx="34" cy="46" rx="6" ry="7" fill="#fff" />
                <ellipse cx="66" cy="46" rx="6" ry="7" fill="#fff" />
                <path d="M26 36 L40 40" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M74 36 L60 40" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M36 66 Q50 60 64 66" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" />
              </>
            )}
            {mood === "celebrate" && (
              <>
                <path d="M27 40l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#fff" />
                <path d="M59 40l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#fff" />
                <path d="M30 60 Q50 82 70 60 Q50 74 30 60" fill="#fff" />
              </>
            )}
            {(mood === "idle" || mood === "thinking") && (
              <>
                <ellipse cx={34 + lookX} cy="46" rx="6" ry={eyeH} fill="#fff" style={{ transition: "cy 0.3s, rx 0.3s" }} />
                <ellipse cx={66 + lookX} cy="46" rx="6" ry={eyeH} fill="#fff" style={{ transition: "cy 0.3s, rx 0.3s" }} />
                <path d={mood === "thinking" ? "M38 65 Q50 62 62 65" : "M36 64 Q50 72 64 64"} stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.85" />
              </>
            )}
          </svg>
        </div>
      </div>

      {mood === "correct" && (
        <div key={`spark-${animKey}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{ position: "absolute", left: `${20 + i * 25}%`, top: "10%", fontSize: `${size * 0.22}px`, animation: `zaiSparkle 0.7s ease-out ${i * 0.08}s` }}>✨</span>
          ))}
        </div>
      )}
    </div>
  );
}
