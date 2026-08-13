"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    setError("");
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);

    if (!d || !m || !y || d < 1 || d > 31 || m < 1 || m > 12 || y < 1900 || y > new Date().getFullYear()) {
      setError("Por favor ingresa una fecha válida.");
      return;
    }

    const birthDate = new Date(y, m - 1, d);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;

    setLoading(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age }),
      });

      if (age < 16) {
        router.push("/excluido");
        return;
      }

      if (!res.ok) {
        setError("Error al guardar. Intenta de nuevo.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#0F1420",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px"
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px" }}>
        <div style={{
          width: "44px", height: "44px", borderRadius: "50%",
          background: "conic-gradient(from 135deg, #A78BFA, #7B61FF, #4C3AA8)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <span style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "18px" }}>Z</span>
        </div>
        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "20px", letterSpacing: "3px", color: "#F8FAFF" }}>
          Bymyzai
        </span>
      </div>

      {/* Card */}
      <div style={{
        background: "#161C27", border: "1px solid #2A3445",
        borderRadius: "20px", padding: "32px 28px",
        width: "100%", maxWidth: "360px"
      }}>
        <h1 style={{
          fontFamily: "'Syne',sans-serif", fontWeight: 900,
          fontSize: "22px", color: "#F8FAFF",
          marginBottom: "8px", textAlign: "center"
        }}>
          ¿Cuándo naciste?
        </h1>
        <p style={{
          fontSize: "13px", color: "#7E8798",
          fontFamily: "'DM Sans',sans-serif",
          textAlign: "center", marginBottom: "28px", lineHeight: 1.5
        }}>
          Necesitamos tu fecha de nacimiento para cumplir con regulaciones de privacidad.
        </p>

        {/* Date inputs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "10px", color: "#7E8798", fontFamily: "'DM Sans',sans-serif", display: "block", marginBottom: "6px" }}>DÍA</label>
            <input
              type="number" min="1" max="31" placeholder="DD"
              value={day} onChange={e => setDay(e.target.value)}
              style={{
                width: "100%", background: "#0F1420", border: "1px solid #324055",
                borderRadius: "10px", padding: "12px 10px", color: "#F8FAFF",
                fontSize: "16px", fontFamily: "'DM Sans',sans-serif",
                textAlign: "center", boxSizing: "border-box"
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "10px", color: "#7E8798", fontFamily: "'DM Sans',sans-serif", display: "block", marginBottom: "6px" }}>MES</label>
            <input
              type="number" min="1" max="12" placeholder="MM"
              value={month} onChange={e => setMonth(e.target.value)}
              style={{
                width: "100%", background: "#0F1420", border: "1px solid #324055",
                borderRadius: "10px", padding: "12px 10px", color: "#F8FAFF",
                fontSize: "16px", fontFamily: "'DM Sans',sans-serif",
                textAlign: "center", boxSizing: "border-box"
              }}
            />
          </div>
          <div style={{ flex: "1.5" }}>
            <label style={{ fontSize: "10px", color: "#7E8798", fontFamily: "'DM Sans',sans-serif", display: "block", marginBottom: "6px" }}>AÑO</label>
            <input
              type="number" min="1900" max={new Date().getFullYear()} placeholder="AAAA"
              value={year} onChange={e => setYear(e.target.value)}
              style={{
                width: "100%", background: "#0F1420", border: "1px solid #324055",
                borderRadius: "10px", padding: "12px 10px", color: "#F8FAFF",
                fontSize: "16px", fontFamily: "'DM Sans',sans-serif",
                textAlign: "center", boxSizing: "border-box"
              }}
            />
          </div>
        </div>

        {error && (
          <p style={{
            fontSize: "12px", color: "#FF6B6B",
            fontFamily: "'DM Sans',sans-serif",
            marginBottom: "16px", textAlign: "center"
          }}>{error}</p>
        )}

        <button
          onClick={handleContinue}
          disabled={loading || !day || !month || !year}
          style={{
            width: "100%", padding: "14px",
            background: loading || !day || !month || !year
              ? "#324055" : "linear-gradient(135deg,#7B61FF,#8B5CF6)",
            color: "#fff", border: "none", borderRadius: "12px",
            fontSize: "14px", fontWeight: 700, cursor: loading || !day || !month || !year ? "not-allowed" : "pointer",
            fontFamily: "'DM Sans',sans-serif", transition: "opacity 0.2s"
          }}
        >
          {loading ? "Guardando..." : "Continuar →"}
        </button>

        <p style={{
          fontSize: "10px", color: "#4A5568",
          fontFamily: "'DM Sans',sans-serif",
          textAlign: "center", marginTop: "16px", lineHeight: 1.5
        }}>
          Esta información es privada y no se comparte con terceros.
          Al continuar aceptas nuestros{" "}
          <a href="/terms" style={{ color: "#7B61FF" }}>Términos</a>
          {" y "}
          <a href="/privacy" style={{ color: "#7B61FF" }}>Privacidad</a>.
        </p>
      </div>
    </div>
  );
}
