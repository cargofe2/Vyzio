"use client";
import { useEffect, useState } from "react";

interface Setting { id: string; key: string; value: string; category: string; }

const card: React.CSSProperties = { background: "#1E2533", border: "1px solid #324055", borderRadius: "14px", padding: "14px" };
const btn: React.CSSProperties = { padding: "6px 12px", background: "#7B61FF", color: "#fff", borderRadius: "8px", fontSize: "12px", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", border: "none", cursor: "pointer" };
const inputStyle: React.CSSProperties = { background: "#0F1420", border: "1px solid #324055", borderRadius: "8px", padding: "6px 8px", color: "#F8FAFF", fontSize: "12px", fontFamily: "'DM Sans',sans-serif", width: "100px" };

export default function AdminThemePage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedKey, setSavedKey] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/theme");
    const d = await res.json();
    setSettings(d.settings ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save(key: string, value: string) {
    await fetch("/api/admin/theme", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    setSavedKey(key);
    setTimeout(() => setSavedKey(""), 1200);
    load();
  }

  if (loading) return <p style={{ color: "#7E8798", fontFamily: "'DM Sans',sans-serif" }}>Cargando...</p>;

  const colors = settings.filter(s => s.category === "color");
  const fonts = settings.filter(s => s.category === "font");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "20px", color: "#F8FAFF" }}>Tema</h1>

      <div style={{ ...card, background: "rgba(242,192,77,0.08)", border: "1px solid rgba(242,192,77,0.25)" }}>
        <p style={{ fontSize: "12px", color: "#F2C04D", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.6 }}>
          ⚠️ Estos valores se guardan en la base de datos pero <strong>aún no se aplican</strong> a la app en vivo — el frontend usa colores fijos escritos en cada archivo, no estas variables. Esta pantalla es el paso 1 (almacenamiento). Falta migrar los estilos del código para que lean de aquí.
        </p>
      </div>

      <div style={card}>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "14px", marginBottom: "10px" }}>Colores</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {colors.map(s => (
            <ColorRow key={s.key} setting={s} onSave={save} saved={savedKey === s.key} />
          ))}
        </div>
      </div>

      <div style={card}>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "14px", marginBottom: "10px" }}>Tipografía</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {fonts.map(s => (
            <FontRow key={s.key} setting={s} onSave={save} saved={savedKey === s.key} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ColorRow({ setting, onSave, saved }: { setting: Setting; onSave: (k: string, v: string) => void; saved: boolean }) {
  const [val, setVal] = useState(setting.value);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#161C27", border: "1px solid #324055", borderRadius: "8px", padding: "6px 8px" }}>
      <input type="color" value={val} onChange={e => setVal(e.target.value)} style={{ width: "28px", height: "28px", border: "none", background: "none", cursor: "pointer" }} />
      <span style={{ fontSize: "11px", color: "#7E8798", fontFamily: "'DM Sans',sans-serif", flex: 1 }}>{setting.key}</span>
      <input style={inputStyle} value={val} onChange={e => setVal(e.target.value)} />
      <button style={{ ...btn, padding: "4px 8px", fontSize: "10px" }} onClick={() => onSave(setting.key, val)}>{saved ? "✓" : "Guardar"}</button>
    </div>
  );
}

function FontRow({ setting, onSave, saved }: { setting: Setting; onSave: (k: string, v: string) => void; saved: boolean }) {
  const [val, setVal] = useState(setting.value);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#161C27", border: "1px solid #324055", borderRadius: "8px", padding: "6px 8px" }}>
      <span style={{ fontSize: "11px", color: "#7E8798", fontFamily: "'DM Sans',sans-serif", flex: 1 }}>{setting.key}</span>
      <input style={{ ...inputStyle, width: "180px" }} value={val} onChange={e => setVal(e.target.value)} />
      <button style={{ ...btn, padding: "4px 8px", fontSize: "10px" }} onClick={() => onSave(setting.key, val)}>{saved ? "✓" : "Guardar"}</button>
    </div>
  );
}
