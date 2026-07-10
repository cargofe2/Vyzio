"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";

function ExcludedContent() {
  const params = useSearchParams();
  const razon = params.get("razon");

  return (
    <>
      <p style={{ fontSize: "40px", marginBottom: "12px" }}>🚫</p>
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#F8FAFF", fontSize: "18px", marginBottom: "8px" }}>Tu cuenta fue excluida</h1>
      <p style={{ color: "#7E8798", fontSize: "13px", fontFamily: "'DM Sans',sans-serif", maxWidth: "320px", marginBottom: "20px" }}>
        {razon || "Contacta al equipo de Bymyzai si crees que esto es un error."}
      </p>
      <SignOutButton>
        <button style={{ padding: "10px 20px", background: "#324055", color: "#fff", borderRadius: "10px", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
          Cerrar sesión
        </button>
      </SignOutButton>
    </>
  );
}

export default function ExcludedPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0F1420", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center" }}>
      <Suspense fallback={<p style={{ color: "#7E8798" }}>Cargando...</p>}>
        <ExcludedContent />
      </Suspense>
    </div>
  );
}
