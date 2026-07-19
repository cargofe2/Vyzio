import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
export default function SignUpPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0F1420", padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
        <img src="/logo.png" alt="Bymyzai" width={40} height={40} style={{ borderRadius: "50%", flexShrink: 0 }} />
        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "22px", letterSpacing: "4px", color: "#F8FAFF" }}>Bymyzai</span>
      </div>
      <SignUp afterSignUpUrl="/dashboard" signInUrl="/sign-in" />
      <p style={{ marginTop: "20px", fontSize: "11px", color: "#7E8798", fontFamily: "'DM Sans',sans-serif", textAlign: "center", maxWidth: "320px" }}>
        Al registrarte aceptas nuestros{" "}
        <Link href="/terms" style={{ color: "#7B61FF" }}>Términos</Link>
        {" · "}
        <Link href="/privacy" style={{ color: "#7B61FF" }}>Privacidad</Link>
        {" · "}
        <Link href="/disclaimer" style={{ color: "#7B61FF" }}>Disclaimer</Link>
      </p>
    </main>
  );
}
