"use client";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return (
    <div style={{ minHeight: "100vh", background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#FFFC00", fontSize: "14px" }}>Cargando...</div>
    </div>
  );

  return (
    <main style={{ minHeight: "100vh", background: "#F7F7F5", padding: "24px", maxWidth: "480px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ background: "#111", borderRadius: "20px", padding: "20px", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div style={{ width: "44px", height: "44px", background: "#FFFC00", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
            🧑‍💻
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: "700", fontSize: "15px" }}>
              Hola, {user?.firstName ?? "Estudiante"} 👋
            </p>
            <p style={{ color: "#FFFC00", fontSize: "12px", fontWeight: "600" }}>Nivel 1 · AI Explorer</p>
          </div>
        </div>
        {/* XP Bar */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>NOVICE</span>
            <span style={{ color: "#FFFC00", fontSize: "11px", fontWeight: "700" }}>0 XP</span>
          </div>
          <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: "5%", background: "#FFFC00", borderRadius: "3px" }} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>
        {[
          { label: "XP", value: "0", color: "#FFFC00" },
          { label: "Racha", value: "0 días", color: "#6C63FF" },
          { label: "Lecciones", value: "0", color: "#00D4FF" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "#fff", borderRadius: "14px", padding: "14px", textAlign: "center", border: "0.5px solid rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: "18px", fontWeight: "800", color }}>{value}</div>
            <div style={{ fontSize: "10px", color: "rgba(0,0,0,0.4)", marginTop: "2px" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Mundos */}
      <div style={{ background: "#fff", borderRadius: "20px", padding: "16px", marginBottom: "16px", border: "0.5px solid rgba(0,0,0,0.08)" }}>
        <h2 style={{ fontSize: "13px", fontWeight: "700", color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>Tu camino</h2>
        {[
          { emoji: "🌍", name: "Bienvenido al Futuro", lessons: 15, pct: 0, active: true },
          { emoji: "📜", name: "Historia de la IA", lessons: 15, pct: 0, active: false },
          { emoji: "🤖", name: "IA en tu Vida", lessons: 15, pct: 0, active: false },
        ].map(({ emoji, name, lessons, pct, active }) => (
          <div key={name} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", borderRadius: "12px", marginBottom: "6px", background: active ? "rgba(255,252,0,0.08)" : "transparent", border: active ? "1px solid rgba(255,252,0,0.3)" : "1px solid transparent" }}>
            <div style={{ fontSize: "24px" }}>{emoji}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "#111", marginBottom: "4px" }}>{name}</p>
              <div style={{ height: "3px", background: "rgba(0,0,0,0.08)", borderRadius: "2px" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: "#6C63FF", borderRadius: "2px" }} />
              </div>
            </div>
            <span style={{ fontSize: "10px", color: "rgba(0,0,0,0.3)" }}>{lessons} lecs</span>
          </div>
        ))}
      </div>

      {/* VY */}
      <div style={{ background: "#111", borderRadius: "20px", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "40px", height: "40px", background: "rgba(108,99,255,0.2)", border: "2px solid #6C63FF", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
          🤖
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: "#fff", fontWeight: "700", fontSize: "13px" }}>VY — Tu tutor de IA</p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>10 mensajes disponibles hoy</p>
        </div>
        <Link href="/vy" style={{ padding: "8px 14px", background: "#6C63FF", color: "#fff", borderRadius: "10px", fontSize: "12px", fontWeight: "700", textDecoration: "none" }}>
          Hablar
        </Link>
      </div>
    </main>
  );
}
