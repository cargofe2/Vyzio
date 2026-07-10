"use client";
import { useEffect, useState } from "react";

interface UserRow {
  id: string; clerkId: string; email: string; username: string; displayName: string;
  isBanned: boolean; createdAt: string; lastSeenAt: string;
  subscription: { plan: string; status: string } | null;
  gamification: { xpTotal: number; rank: string; lessonsCompleted: number } | null;
}

const card: React.CSSProperties = { background: "#1E2533", border: "1px solid #324055", borderRadius: "14px", padding: "14px" };
const btn: React.CSSProperties = { padding: "5px 10px", background: "#7B61FF", color: "#fff", borderRadius: "7px", fontSize: "11px", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", border: "none", cursor: "pointer" };
const btnDanger: React.CSSProperties = { ...btn, background: "#FF6B6B" };
const btnGhost: React.CSSProperties = { ...btn, background: "#324055" };
const inputStyle: React.CSSProperties = { background: "#0F1420", border: "1px solid #324055", borderRadius: "8px", padding: "8px 10px", color: "#F8FAFF", fontSize: "12px", fontFamily: "'DM Sans',sans-serif", width: "100%", boxSizing: "border-box" };
const PLANS = ["STARTER", "PRO", "PREMIUM", "FAMILY", "SCHOOL", "ENTERPRISE"];

export default function AdminUsersPage() {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  async function search() {
    setLoading(true);
    const res = await fetch(`/api/admin/users?q=${encodeURIComponent(q)}`);
    const d = await res.json();
    setUsers(d.users ?? []);
    setLoading(false);
  }
  useEffect(() => { search(); }, []);

  async function toggleBan(u: UserRow) {
    const nextBanned = !u.isBanned;
    if (nextBanned && !confirm(`¿Excluir a ${u.email}? Perderá acceso a la app.`)) return;
    await fetch(`/api/admin/users/${u.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBanned: nextBanned, bannedReason: nextBanned ? reason : null }),
    });
    setReason("");
    search();
  }

  async function changePlan(u: UserRow, plan: string) {
    await fetch(`/api/admin/users/${u.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    search();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "20px", color: "#F8FAFF" }}>Usuarios</h1>

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          style={inputStyle} placeholder="Buscar por email, username, nombre o Clerk ID"
          value={q} onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === "Enter" && search()}
        />
        <button style={btn} onClick={search}>Buscar</button>
      </div>

      {loading ? (
        <p style={{ color: "#7E8798", fontFamily: "'DM Sans',sans-serif" }}>Cargando...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {users.map(u => (
            <div key={u.id} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ color: "#F8FAFF", fontSize: "13px", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
                    {u.displayName} <span style={{ color: "#7E8798", fontWeight: 400 }}>· @{u.username}</span>
                    {u.isBanned && <span style={{ color: "#FF6B6B", fontSize: "10px", marginLeft: "8px" }}>● EXCLUIDO</span>}
                  </p>
                  <p style={{ color: "#7E8798", fontSize: "11px", fontFamily: "'DM Sans',sans-serif" }}>{u.email}</p>
                  <p style={{ color: "#7E8798", fontSize: "10px", fontFamily: "'DM Sans',sans-serif" }}>
                    {u.subscription?.plan ?? "STARTER"} · {u.gamification?.rank ?? "NOVICE"} · {u.gamification?.xpTotal ?? 0} XP · {u.gamification?.lessonsCompleted ?? 0} lecc. · registrado {new Date(u.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button style={btnGhost} onClick={() => setExpanded(expanded === u.id ? null : u.id)}>{expanded === u.id ? "Cerrar" : "Gestionar"}</button>
              </div>

              {expanded === u.id && (
                <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #324055", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ fontSize: "11px", color: "#7E8798" }}>Plan:</span>
                    <select style={{ ...inputStyle, width: "auto" }} value={u.subscription?.plan ?? "STARTER"} onChange={e => changePlan(u, e.target.value)}>
                      {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  {!u.isBanned ? (
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input style={{ ...inputStyle, flex: 1 }} placeholder="Razón de exclusión (opcional)" value={reason} onChange={e => setReason(e.target.value)} />
                      <button style={btnDanger} onClick={() => toggleBan(u)}>Excluir</button>
                    </div>
                  ) : (
                    <button style={btn} onClick={() => toggleBan(u)}>Reincluir</button>
                  )}
                  <p style={{ fontSize: "10px", color: "#7E8798" }}>Clerk ID: {u.clerkId} · Última vez: {new Date(u.lastSeenAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          ))}
          {users.length === 0 && <p style={{ color: "#7E8798", fontSize: "12px" }}>Sin resultados.</p>}
        </div>
      )}
    </div>
  );
}
