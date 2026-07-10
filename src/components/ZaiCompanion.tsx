"use client";
import { useEffect, useState } from "react";
import { ZaiMood } from "@/lib/ZaiContext";

interface Props {
  mood: ZaiMood;
  size?: number;
}

const GRADIENTS = [
  "conic-gradient(from 0deg, #A78BFA, #7B61FF, #4C3AA8, #7B61FF, #A78BFA)", // morado (default)
  "conic-gradient(from 0deg, #7DD3FC, #468BFF, #1E4FA0, #468BFF, #7DD3FC)", // azul
  "conic-gradient(from 0deg, #67E8F9, #26C6DA, #0E7A8C, #26C6DA, #67E8F9)", // cyan
  "conic-gradient(from 0deg, #FDBA74, #FB923C, #B2530F, #FB923C, #FDBA74)", // naranja
  "conic-gradient(from 0deg, #F9A8D4, #F472B6, #A02C63, #F472B6, #F9A8D4)", // rosa
];

type Trick = null | "jump" | "spin" | "colorshift";

/**
 * Compañero ZAI vivo — cara, expresiones, sueño por inactividad, y trucos aleatorios en reposo.
 */
export default function ZaiCompanion({ mood, size = 56 }: Props) {
  const [animKey, setAnimKey] = useState(0);
  const [blink, setBlink] = useState(false);
  const [lookX, setLookX] = useState(0);
  const [trick, setTrick] = useState<Trick>(null);
  const [gradient, setGradient] = useState(GRADIENTS[0]);

  useEffect(() => { setAnimKey(k => k + 1); }, [mood]);

  // Parpadeo + mirada errante en reposo
  useEffect(() => {
    if (mood !== "idle" && mood !== "thinking") return;
    const blinkInterval = setInterval(() => { setBlink(true); setTimeout(() => setBlink(false), 140); }, 3200 + Math.random() * 1800);
    const lookInterval = setInterval(() => setLookX(Math.random() > 0.5 ? 1.5 : -1.5), 2200 + Math.random() * 1400);
    return () => { clearInterval(blinkInterval); clearInterval(lookInterval); };
  }, [mood]);

  // Trucos aleatorios mientras está despierto e inactivo: salta, gira, cambia de color
  useEffect(() => {
    if (mood !== "idle") { setTrick(null); return; }
    const id = setInterval(() => {
      const options: Trick[] = ["jump", "spin", "colorshift"];
      const pick = options[Math.floor(Math.random() * options.length)];
      setTrick(pick);
      if (pick === "colorshift") setGradient(GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)]);
      setTimeout(() => { setTrick(null); if (pick === "colorshift") setGradient(GRADIENTS[0]); }, pick === "spin" ? 700 : pick === "jump" ? 500 : 2200);
    }, 5000 + Math.random() * 5000);
    return () => clearInterval(id);
  }, [mood]);

  const reactionAnim =
    mood === "correct" ? "zaiCorrectPop 0.6s ease-out" :
    mood === "incorrect" ? "zaiWrongShake 0.5s ease-in-out" :
    mood === "celebrate" ? "zaiCelebrate 1s ease-in-out" :
    mood === "sleeping" ? "zaiFloatIdle 8s ease-in-out infinite" :
    mood === "thinking" ? "zaiFloatIdle 3.5s ease-in-out infinite, zaiBob 1.6s ease-in-out infinite" :
    "zaiFloatIdle 6s ease-in-out infinite, zaiBob 2.4s ease-in-out infinite";

  const trickAnim = trick === "jump" ? "zaiJump 0.5s ease-out" : trick === "spin" ? "zaiTrickSpin 0.7s ease-in-out" : "";
  const orbAnimation = trickAnim ? `${trickAnim}, ${reactionAnim}` : reactionAnim;

  const ringAnimation =
    mood === "correct" ? "zaiRingPulseGreen 0.7s ease-out" :
    mood === "incorrect" ? "zaiRingPulseRed 0.5s ease-out" :
    "none";

  const eyeH = blink || mood === "sleeping" ? 0.6 : 7;

  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div key={`ring-${animKey}`} style={{ position: "absolute", inset: 0, borderRadius: "50%", animation: ringAnimation }} />

      <div key={`orb-${animKey}-${trick}`} style={{ position: "relative", width: size, height: size, animation: orbAnimation, opacity: mood === "sleeping" ? 0.75 : 1, transition: "opacity 0.5s" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: gradient, animation: mood === "sleeping" ? "zaiSpin 16s linear infinite" : "zaiSpin 7s linear infinite", transition: "background 0.4s" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.5), transparent 45%)" }} />

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
            {mood === "sleeping" && (
              <>
                <path d="M28 46 Q34 43 40 46" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M60 46 Q66 43 72 46" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M42 65 Q50 68 58 65" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.7" />
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

      {mood === "sleeping" && (
        <div key={`zzz-${animKey}`} style={{ position: "absolute", top: "-8px", right: "-6px", pointerEvents: "none" }}>
          {["Z", "z", "z"].map((z, i) => (
            <span key={i} style={{ position: "absolute", right: i * 5, fontSize: `${size * (0.22 - i * 0.03)}px`, color: "#fff", fontWeight: 700, animation: `zaiZzz 2.6s ease-in-out ${i * 0.4}s infinite` }}>{z}</span>
          ))}
        </div>
      )}

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
