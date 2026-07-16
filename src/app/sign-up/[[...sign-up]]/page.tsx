import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0F1420", padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
        <img src="/logo.png" alt="Bymyzai" width={40} height={40} style={{ borderRadius: "50%", flexShrink: 0 }} />
        <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "22px", letterSpacing: "4px", color: "#F8FAFF" }}>Bymyzai</span>
      </div>
      <SignUp afterSignUpUrl="/dashboard" signInUrl="/sign-in" />
    </main>
  );
}
