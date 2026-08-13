"use client";
import { useRouter } from "next/navigation";

export default function BackButton({ href }: { href?: string }) {
  const router = useRouter();

  function handleBack() {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  }

  return (
    <button
      onClick={handleBack}
      aria-label="Volver"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "44px",
        height: "44px",
        borderRadius: "14px",
        background: "rgba(123,97,255,0.08)",
        border: "1px solid rgba(123,97,255,0.18)",
        color: "#A78BFA",
        cursor: "pointer",
        flexShrink: 0,
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
  );
}