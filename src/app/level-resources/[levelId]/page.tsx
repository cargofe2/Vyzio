"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Resource {
  id: string; type: string; title: string; description: string | null;
  url: string | null; content: { blocks?: { label: string; note?: string }[] } | null;
}

const LEVEL_NAMES: Record<string, string> = {
  "level-1": "Nivel 0 — Origins", "level-new-1": "Nivel 1 — Explorer", "level-new-2": "Nivel 2 — Thinker",
  "level-new-3": "Nivel 3 — Creator", "level-new-4": "Nivel 4 — Builder", "level-new-5": "Nivel 5 — Architect",
  "level-new-6": "Nivel 6 — Founder", "level-new-7": "Nivel 7 — Researcher", "level-new-8": "Nivel 8 — Residency",
};

function ytEmbedId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export default function LevelResourcesPage() {
  const { levelId } = useParams<{ levelId: string }>();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/level-resources?levelId=${levelId}`)
      .then(r => r.json())
      .then(d => setResources(d.resources ?? []))
      .finally(() => setLoading(false));
  }, [levelId]);

  const videos = resources.filter(r => r.type === "video");
  const articles = resources.filter(r => r.type === "article");
  const diagrams = resources.filter(r => r.type === "diagram");

  return (
    <div style={{ minHeight: "100vh", background: "#0F1420", paddingBottom: "40px" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(15,20,32,0.93)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(123,97,255,0.1)", padding: "14px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
        <Link href={`/worlds?levelId=${levelId}`} style={{ color: "rgba(255,255,255,0.4)", fontSize: "18px", textDecoration: "none" }}>←</Link>
        <div>
          <p style={{ fontSize: "10px", color: "#A78BFA", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>📚 PROFUNDIZA MÁS</p>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#fff", fontSize: "17px" }}>{LEVEL_NAMES[levelId] ?? levelId}</h1>
        </div>
      </div>

      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "24px" }}>
        {loading && <p style={{ color: "#7E8798", fontSize: "13px", fontFamily: "'DM Sans',sans-serif" }}>Cargando recursos...</p>}
        {!loading && resources.length === 0 && (
          <p style={{ color: "#7E8798", fontSize: "13px", fontFamily: "'DM Sans',sans-serif" }}>Aún no hay recursos adicionales para este nivel. Vuelve pronto.</p>
        )}

        {diagrams.length > 0 && (
          <section>
            <h2 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#7E8798", marginBottom: "10px", fontFamily: "'DM Sans',sans-serif" }}>🗺️ Mapas conceptuales</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {diagrams.map(d => (
                <div key={d.id} style={{ background: "#1E2533", border: "1px solid #324055", borderRadius: "14px", padding: "16px" }}>
                  <p style={{ fontWeight: 700, color: "#F8FAFF", fontSize: "13px", marginBottom: d.description ? "4px" : "12px", fontFamily: "'DM Sans',sans-serif" }}>{d.title}</p>
                  {d.description && <p style={{ fontSize: "11px", color: "#7E8798", marginBottom: "12px", fontFamily: "'DM Sans',sans-serif" }}>{d.description}</p>}
                  {d.content?.blocks && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {d.content.blocks.map((b, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                          <div style={{ width: "22px", height: "22px", borderRadius: "7px", background: "rgba(123,97,255,0.15)", border: "1px solid rgba(123,97,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "10px", color: "#A78BFA", fontWeight: 700, marginTop: "1px" }}>{i + 1}</div>
                          <div>
                            <p style={{ fontSize: "12px", fontWeight: 600, color: "#F8FAFF", fontFamily: "'DM Sans',sans-serif" }}>{b.label}</p>
                            {b.note && <p style={{ fontSize: "11px", color: "#7E8798", fontFamily: "'DM Sans',sans-serif" }}>{b.note}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {videos.length > 0 && (
          <section>
            <h2 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#7E8798", marginBottom: "10px", fontFamily: "'DM Sans',sans-serif" }}>🎥 Videos recomendados</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {videos.map(v => {
                const yid = v.url ? ytEmbedId(v.url) : null;
                return (
                  <div key={v.id} style={{ background: "#1E2533", border: "1px solid #324055", borderRadius: "14px", overflow: "hidden" }}>
                    {yid ? (
                      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                        <iframe
                          src={`https://www.youtube.com/embed/${yid}`}
                          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <a href={v.url ?? "#"} target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: "14px", textDecoration: "none" }}>
                        <p style={{ color: "#468BFF", fontSize: "12px" }}>🔗 Ver video externo</p>
                      </a>
                    )}
                    <div style={{ padding: "12px 14px" }}>
                      <p style={{ fontWeight: 700, color: "#F8FAFF", fontSize: "13px", fontFamily: "'DM Sans',sans-serif" }}>{v.title}</p>
                      {v.description && <p style={{ fontSize: "11px", color: "#7E8798", marginTop: "3px", fontFamily: "'DM Sans',sans-serif" }}>{v.description}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {articles.length > 0 && (
          <section>
            <h2 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#7E8798", marginBottom: "10px", fontFamily: "'DM Sans',sans-serif" }}>📄 Lecturas recomendadas</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {articles.map(a => (
                <a key={a.id} href={a.url ?? "#"} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <div style={{ background: "#1E2533", border: "1px solid #324055", borderRadius: "12px", padding: "12px 14px" }}>
                    <p style={{ fontWeight: 700, color: "#F8FAFF", fontSize: "13px", fontFamily: "'DM Sans',sans-serif" }}>{a.title}</p>
                    {a.description && <p style={{ fontSize: "11px", color: "#7E8798", marginTop: "3px", fontFamily: "'DM Sans',sans-serif" }}>{a.description}</p>}
                    <p style={{ fontSize: "10px", color: "#468BFF", marginTop: "4px", fontFamily: "'DM Sans',sans-serif" }}>{a.url}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
