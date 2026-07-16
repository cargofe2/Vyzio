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
 * Compañero ZAI vivo — cara, expresiones, sueño por inactividad, trucos aleatorios en reposo.
 * El truco "spin" es un flip 3D real: gira y muestra la Z de marca en el reverso, como el logo ZaiOrb.
 */
export default function ZaiCompanion({ mood, size = 56 }: Props) {
  const [animKey, setAnimKey] = useState(0);
  const [blink, setBlink] = useState(false);
  const [lookX, setLookX] = useState(0);
  const [trick, setTrick] = useState<Trick>(null);
  const [gradient, setGradient] = useState(GRADIENTS[0]);

  useEffect(() => { setAnimKey(k => k + 1); }, [mood]);

  useEffect(() => {
    if (mood !== "idle" && mood !== "thinking") return;
    const blinkInterval = setInterval(() => { setBlink(true); setTimeout(() => setBlink(false), 140); }, 3200 + Math.random() * 1800);
    const lookInterval = setInterval(() => setLookX(Math.random() > 0.5 ? 1.5 : -1.5), 2200 + Math.random() * 1400);
    return () => { clearInterval(blinkInterval); clearInterval(lookInterval); };
  }, [mood]);

  useEffect(() => {
    if (mood !== "idle") { setTrick(null); return; }
    const id = setInterval(() => {
      const options: Trick[] = ["jump", "spin", "colorshift"];
      const pick = options[Math.floor(Math.random() * options.length)];
      setTrick(pick);
      const dur = pick === "spin" ? 1300 : pick === "jump" ? 500 : 2200;
      setTimeout(() => { setTrick(null); if (pick === "colorshift") setGradient(GRADIENTS[0]); }, dur);
      if (pick === "colorshift") setGradient(GRADIENTS[Math.floor(Math.random() * (GRADIENTS.length - 1)) + 1]);
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

  const jumpAnim = trick === "jump" ? "zaiJump 0.5s ease-out" : "";
  const orbAnimation = jumpAnim ? `${jumpAnim}, ${reactionAnim}` : reactionAnim;

  const ringAnimation =
    mood === "correct" ? "zaiRingPulseGreen 0.7s ease-out" :
    mood === "incorrect" ? "zaiRingPulseRed 0.5s ease-out" :
    "none";

  const eyeH = blink || mood === "sleeping" ? 0.6 : 10;
  const faceSvg = size;

  const face = (
    <svg width={faceSvg} height={faceSvg} viewBox="0 0 100 100">
      {mood === "correct" && (
        <>
          <path d="M24 44 Q34 30 44 44" stroke="#fff" strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M56 44 Q66 30 76 44" stroke="#fff" strokeWidth="7" strokeLinecap="round" fill="none" />
        </>
      )}
      {mood === "incorrect" && (
        <>
          <ellipse cx="34" cy="48" rx="9" ry="10" fill="#fff" />
          <ellipse cx="66" cy="48" rx="9" ry="10" fill="#fff" />
          <path d="M22 33 L40 39" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M78 33 L60 39" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" />
        </>
      )}
      {mood === "celebrate" && (
        <>
          <path d="M23 37l4.5 10 10 4.5-10 4.5-4.5 10-4.5-10-10-4.5 10-4.5z" fill="#fff" />
          <path d="M55 37l4.5 10 10 4.5-10 4.5-4.5 10-4.5-10-10-4.5 10-4.5z" fill="#fff" />
        </>
      )}
      {mood === "sleeping" && (
        <>
          <path d="M24 46 Q34 40 44 46" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" fill="none" />
          <path d="M56 46 Q66 40 76 46" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" fill="none" />
        </>
      )}
      {(mood === "idle" || mood === "thinking") && (
        <>
          <ellipse cx={34 + lookX} cy="47" rx="9" ry={eyeH} fill="#fff" style={{ transition: "cy 0.3s, rx 0.3s" }} />
          <ellipse cx={66 + lookX} cy="47" rx="9" ry={eyeH} fill="#fff" style={{ transition: "cy 0.3s, rx 0.3s" }} />
        </>
      )}
    </svg>
  );

  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", perspective: "500px" }}>
      <div key={`ring-${animKey}`} style={{ position: "absolute", inset: 0, borderRadius: "50%", animation: ringAnimation }} />

      {/* Contenedor exterior: maneja flotar/reaccionar/saltar */}
      <div key={`orb-${animKey}-${trick === "jump"}`} style={{ position: "relative", width: size, height: size, animation: orbAnimation, opacity: mood === "sleeping" ? 0.75 : 1, transition: "opacity 0.5s" }}>

        {/* Flipper 3D: gira sobre su eje para mostrar la Z de marca en el reverso */}
        <div
          key={`flip-${animKey}-${trick === "spin"}`}
          style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", animation: trick === "spin" ? "zaiFlipReveal 1.3s ease-in-out" : "none" }}
        >
          {/* Cara frontal: expresión */}
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", backfaceVisibility: "hidden" }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: gradient, animation: mood === "sleeping" ? "zaiSpin 16s linear infinite" : "zaiSpin 7s linear infinite", transition: "background 0.4s" }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.5), transparent 45%)" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{face}</div>
          </div>

          {/* Reverso: la Z de marca (ZaiOrb clásico) */}
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "conic-gradient(from 0deg, #A78BFA, #7B61FF, #4C3AA8, #7B61FF, #A78BFA)" }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.5), transparent 45%)" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 256 256">
                <g transform="rotate(-12 128 128)">
                  <path d="M78 88H178L82 168H178" stroke="#FFFFFF" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </g>
              </svg>
            </div>
          </div>
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
