"use client";
import { useRouter } from "next/navigation";
import { useZai } from "@/lib/ZaiContext";
import ZaiCompanion from "@/components/ZaiCompanion";

export default function ZaiFloatingCompanion() {
  const { mood } = useZai();
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/vy")}
      aria-label="Hablar con ZAI"
      style={{
        position: "fixed", bottom: "76px", left: "16px", zIndex: 90,
        width: "52px", height: "52px", border: "none", background: "transparent",
        cursor: "pointer", padding: 0,
        filter: "drop-shadow(0 4px 14px rgba(123,97,255,0.45))",
      }}
    >
      <ZaiCompanion mood={mood} size={52} />
    </button>
  );
}
