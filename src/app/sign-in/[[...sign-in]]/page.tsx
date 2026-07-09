import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0F1420", padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", position: "relative", flexShrink: 0 }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "conic-gradient(from 0deg, #A78BFA, #7B61FF, #4C3AA8, #7B61FF, #A78BFA)", opacity: 0.9 }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.5), transparent 45%)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 256 256"><g transform="rotate(-12 128 128)"><path d="M78 88H178L82 168H178" stroke="#FFFFFF" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" fill="none"/></g></svg>
          </div>
        </div>
        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "22px", letterSpacing: "4px", color: "#F8FAFF" }}>Bymyzai</span>
      </div>
      <SignIn afterSignInUrl="/dashboard" signUpUrl="/sign-up" />
    </main>
  );
}
