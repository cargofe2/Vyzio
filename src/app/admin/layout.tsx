import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isEvalMode } from "@/lib/evalMode";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!isEvalMode(userId)) redirect("/dashboard");

  return (
    <div style={{ minHeight: "100vh", background: "#0F1420" }}>
      <div style={{ background: "rgba(15,20,32,0.93)", borderBottom: "1px solid #324055", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <a href="/admin" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#F8FAFF", fontSize: "15px", textDecoration: "none" }}>Bymyzai · Admin</a>
          <nav style={{ display: "flex", gap: "14px" }}>
            <a href="/admin" style={{ color: "#7E8798", fontSize: "12px", textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>Currículo</a>
            <a href="/admin/users" style={{ color: "#7E8798", fontSize: "12px", textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>Usuarios</a>
            <a href="/admin/theme" style={{ color: "#7E8798", fontSize: "12px", textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>Tema</a>
            <a href="/admin/feedback" style={{ color: "#7E8798", fontSize: "12px", textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>Feedback</a>
          </nav>
        </div>
        <a href="/dashboard" style={{ fontSize: "12px", color: "#7E8798", textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>← Volver a la app</a>
      </div>
      <div style={{ padding: "20px", maxWidth: "1100px", margin: "0 auto" }}>{children}</div>
    </div>
  );
}
