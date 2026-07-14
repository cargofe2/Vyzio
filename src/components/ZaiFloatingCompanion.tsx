"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useZai } from "@/lib/ZaiContext";
import ZaiCompanion from "@/components/ZaiCompanion";

const SPOTS: { bottom: string; left?: string; right?: string }[] = [
  { bottom: "100px", left: "16px" },
  { bottom: "100px", left: "50%" },
  { bottom: "160px", left: "16px" },
  { bottom: "160px", right: "16px" },
  { bottom: "240px", left: "20px" },
];

export default function ZaiFloatingCompanion() {
  const { mood, onTap } = useZai();
  const router = useRouter();
  const [spotIndex, setSpotIndex] = useState(0);

  useEffect(() => {
    if (mood !== "idle") return;
    const id = setInterval(() => {
      setSpotIndex(i => (i + 1) % SPOTS.length);
    }, 9000 + Math.random() * 6000);
    return () => clearInterval(id);
  }, [mood]);

  const spot = SPOTS[spotIndex];

  function handleClick(e: React.MouseEvent) {
    console.log("[ZAI DEBUG] boton clickeado. onTap existe:", !!onTap);
    e.preventDefault();
    e.stopPropagation();
    if (onTap) onTap();
    else router.push("/vy");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={onTap ? "Pídele a ZAI que profundice esta lección" : "Hablar con ZAI"}
      style={{
        position: "fixed", zIndex: 999,
        bottom: spot.bottom, left: spot.left, right: spot.right,
        transform: spot.left === "50%" ? "translateX(-50%)" : undefined,
        width: "52px", height: "52px", border: "none", background: "transparent",
        cursor: "pointer", padding: 0,
        filter: "drop-shadow(0 4px 14px rgba(123,97,255,0.45))",
        transition: "bottom 1.4s cubic-bezier(0.4,0,0.2,1), left 1.4s cubic-bezier(0.4,0,0.2,1), right 1.4s cubic-bezier(0.4,0,0.2,1)",
        pointerEvents: "auto",
      }}
    >
      <div style={{ position: "relative", pointerEvents: "none" }}>
        <ZaiCompanion mood={mood} size={52} />
        {onTap && (
          <span style={{ position: "absolute", top: "-2px", right: "-2px", width: "14px", height: "14px", borderRadius: "50%", background: "#36D399", border: "2px solid #0F1420" }} />
        )}
      </div>
    </button>
  );
}
