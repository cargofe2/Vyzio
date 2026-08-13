"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [lang, setLang] = useState<"es" | "en">("es");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const browserLang = navigator.language?.toLowerCase() ?? "es";
    if (browserLang.startsWith("en")) setLang("en");
  }, []);

  const T = {
    title:    { es: "¿Cuándo naciste?",    en: "When were you born?" },
    subtitle: { es: "Necesitamos tu fecha de nacimiento para cumplir con regulaciones de privacidad.", en: "We need your date of birth to comply with privacy regulations." },
    day:      { es: "DÍA",                 en: "DAY" },
    month:    { es: "MES",                 en: "MONTH" },
    year:     { es: "AÑO",                 en: "YEAR" },
    invalid:  { es: "Por favor ingresa una fecha válida.", en: "Please enter a valid date." },
    continue: { es: "Continuar →",         en: "Continue →" },
    saving:   { es: "Guardando...",        en: "Saving..." },
    privacy:  { es: "Esta información es privada y no se comparte con terceros. Al continuar aceptas nuestros", en: "This information is private and not shared with third parties. By continuing you accept our" },
    terms:    { es: "Términos",            en: "Terms" },
    and:      { es: " y ",                 en: " and " },
    privacyLink: { es: "Privacidad",       en: "Privacy" },
    error:    { es: "Error al guardar. Intenta de nuevo.", en: "Error saving. Please try again." },
    connError:{ es: "Error de conexión. Intenta de nuevo.", en: "Connection error. Please try again." },
  };
  const t = (key: keyof typeof T) => T[key][lang];

  async function handleContinue() {
    setError("");
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);

    if (!d || !m || !y || d < 1 || d > 31 || m < 1 || m > 12 || y < 1900 || y > new Date().getFullYear()) {
      setError(t("invalid"));
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
        body: JSON.stringify({ age, language: lang }),
      });

      if (age < 16) {
        router.push("/excluido");
        return;
      }

      if (!res.ok) {
        setError(t("error"));
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError(t("connError"));
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#0F1420", border: "1px solid #324055",
    borderRadius: "10px", padding: "12px 10px", color: "#F8FAFF",
    fontSize: "16px", fontFamily: "'DM Sans',sans-serif",
    textAlign: "center", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0F1420", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>

      {/* Lang toggle */}
      <div style={{ position: "absolute", top: "16px", right: "16px" }}>
        <button onClick={() => setLang(lang === "es" ? "en" : "es")}
          style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #324055", background: "#1E2533", color: "#F8FAFF", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
          {lang === "es" ? "EN" : "ES"}
        </button>
      </div>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "conic-gradient(from 135deg, #A78BFA, #7B61FF, #4C3AA8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "18px" }}>Z</span>
        </div>
        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "20px", letterSpacing: "3px", color: "#F8FAFF" }}>Bymyzai</span>
      </div>

      {/* Card */}
      <div style={{ background: "#161C27", border: "1px solid #2A3445", borderRadius: "20px", padding: "32px 28px", width: "100%", maxWidth: "360px" }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "22px", color: "#F8FAFF", marginBottom: "8px", textAlign: "center" }}>
          {t("title")}
        </h1>
        <p style={{ fontSize: "13px", color: "#7E8798", fontFamily: "'DM Sans',sans-serif", textAlign: "center", marginBottom: "28px", lineHeight: 1.5 }}>
          {t("subtitle")}
        </p>

        {/* Date inputs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "10px", color: "#7E8798", fontFamily: "'DM Sans',sans-serif", display: "block", marginBottom: "6px" }}>{t("day")}</label>
            <input type="number" min="1" max="31" placeholder="DD" value={day} onChange={e => setDay(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "10px", color: "#7E8798", fontFamily: "'DM Sans',sans-serif", display: "block", marginBottom: "6px" }}>{t("month")}</label>
            <input type="number" min="1" max="12" placeholder="MM" value={month} onChange={e => setMonth(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: "1.5" }}>
            <label style={{ fontSize: "10px", color: "#7E8798", fontFamily: "'DM Sans',sans-serif", display: "block", marginBottom: "6px" }}>{t("year")}</label>
            <input type="number" min="1900" max={new Date().getFullYear()} placeholder="AAAA" value={year} onChange={e => setYear(e.target.value)} style={inputStyle} />
          </div>
        </div>

        {error && (
          <p style={{ fontSize: "12px", color: "#FF6B6B", fontFamily: "'DM Sans',sans-serif", marginBottom: "16px", textAlign: "center" }}>{error}</p>
        )}

        <button onClick={handleContinue} disabled={loading || !day || !month || !year}
          style={{ width: "100%", padding: "14px", background: loading || !day || !month || !year ? "#324055" : "linear-gradient(135deg,#7B61FF,#8B5CF6)", color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: 700, cursor: loading || !day || !month || !year ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif" }}>
          {loading ? t("saving") : t("continue")}
        </button>

        <p style={{ fontSize: "10px", color: "#4A5568", fontFamily: "'DM Sans',sans-serif", textAlign: "center", marginTop: "16px", lineHeight: 1.5 }}>
          {t("privacy")}{" "}
          <a href="/terms" style={{ color: "#7B61FF" }}>{t("terms")}</a>
          {t("and")}
          <a href="/privacy" style={{ color: "#7B61FF" }}>{t("privacyLink")}</a>.
        </p>
      </div>
    </div>
  );
}
