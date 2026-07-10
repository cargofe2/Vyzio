"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useZai } from "@/lib/ZaiContext";
import ZaiCompanion from "@/components/ZaiCompanion";

// Posiciones seguras en pantalla (evita el navbar inferior, el header, y el botón de feedback en bottom-right)
const SPOTS: { bottom: string; left?: string; right?: string }[] = [
  { bottom: "76px", left: "16px" },
  { bottom: "76px", left: "50%" },
  { bottom: "140px", left: "16px" },
  { bottom: "140px", right: "16px" },
  { bottom: "220px", left: "20px" },
];

export default function ZaiFloatingCompanion() {
  const { mood } = useZai();
  const router = useRouter();
  const [spotIndex, setSpotIndex] = useState(0);

  // Cambia de posición cada tanto, solo mientras está despierto e inactivo (no interrumpe reacciones)
  useEffect(() => {
    if (mood !== "idle") return;
    const id = setInterval(() => {
      setSpotIndex(i => (i + 1) % SPOTS.length);
    }, 9000 + Math.random() * 6000);
    return () => clearInterval(id);
  }, [mood]);

  const spot = SPOTS[spotIndex];

  return (
    <button
      onClick={() => router.push("/vy")}
      aria-label="Hablar con ZAI"
      style={{
        position: "fixed", zIndex: 90,
        bottom: spot.bottom, left: spot.left, right: spot.right,
        transform: spot.left === "50%" ? "translateX(-50%)" : undefined,
        width: "52px", height: "52px", border: "none", background: "transparent",
        cursor: "pointer", padding: 0,
        filter: "drop-shadow(0 4px 14px rgba(123,97,255,0.45))",
        transition: "bottom 1.4s cubic-bezier(0.4,0,0.2,1), left 1.4s cubic-bezier(0.4,0,0.2,1), right 1.4s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <ZaiCompanion mood={mood} size={52} />
    </button>
  );
}
