"use client";
import { useEffect, useState } from "react";

export type ZaiMood = "idle" | "correct" | "incorrect" | "celebrate";

interface Props {
  mood: ZaiMood;
  size?: number;
}

/**
 * Compañero ZAI animado (variante del ZaiOrb de marca).
 * - idle: flota/deambula suavemente mientras el usuario piensa
 * - correct: salto alegre + anillo verde + chispas
 * - incorrect: sacudida + anillo rojo suave (nunca punitivo)
 * - celebrate: giro + escala grande (lección completada / rank up)
 */
export default function ZaiCompanion({ mood, size = 56 }: Props) {
  const [animKey, setAnimKey] = useState(0);

  // Reinicia la animación cada vez que cambia el mood, para que siempre se vea el gesto completo
  useEffect(() => { setAnimKey(k => k + 1); }, [mood]);

  const orbAnimation =
    mood === "correct" ? "zaiCorrectPop 0.6s ease-out" :
    mood === "incorrect" ? "zaiWrongShake 0.5s ease-in-out" :
    mood === "celebrate" ? "zaiCelebrate 1s ease-in-out" :
    "zaiFloatIdle 6s ease-in-out infinite, zaiBob 2.4s ease-in-out infinite";

  const ringAnimation =
    mood === "correct" ? "zaiRingPulseGreen 0.7s ease-out" :
    mood === "incorrect" ? "zaiRingPulseRed 0.5s ease-out" :
    "none";

  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div key={`ring-${animKey}`} style={{ position: "absolute", inset: 0, borderRadius: "50%", animation: ringAnimation }} />

      <div
        key={`orb-${animKey}`}
        style={{ position: "relative", width: size, height: size, animation: orbAnimation }}
      >
        <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "conic-gradient(from 0deg, #A78BFA, #7B61FF, #4C3AA8, #7B61FF, #A78BFA)", animation: "zaiSpin 4s linear infinite" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.5), transparent 45%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 256 256">
            <g transform="rotate(-12 128 128)">
              <path d="M78 88H178L82 168H178" stroke="#FFFFFF" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
          </svg>
        </div>
      </div>

      {mood === "correct" && (
        <div key={`spark-${animKey}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                position: "absolute", left: `${20 + i * 25}%`, top: "10%",
                fontSize: `${size * 0.22}px`, animation: `zaiSparkle 0.7s ease-out ${i * 0.08}s`,
              }}
            >✨</span>
          ))}
        </div>
      )}
    </div>
  );
}
