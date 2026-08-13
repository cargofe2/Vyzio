"use client";
import { useEffect, useState, ReactElement } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import AvatarIcon, { FREE_AVATAR_IDS, PREMIUM_AVATAR_IDS } from "@/components/AvatarIcon";
import { isSoundEnabled, setSoundEnabled } from "@/lib/sounds";
import { useUserLang } from "@/hooks/useUserLang";
import LangToggle from "@/components/LangToggle";

const T = {
  student:      { es: "Estudiante",                              en: "Student" },
  soundOn:      { es: "Silenciar",                               en: "Mute" },
  soundOff:     { es: "Activar sonido",                         en: "Enable sound" },
  lessons:      { es: "Lecciones",                               en: "Lessons" },
  xpTotal:      { es: "XP Total",                                en: "Total XP" },
  streak:       { es: "Racha",                                   en: "Streak" },
  myPath:       { es: "Mi camino",                               en: "My path" },
  completed:    { es: "Completado",                              en: "Completed" },
  current:      { es: "Nivel actual",                            en: "Current level" },
  locked:       { es: "Bloqueado",                               en: "Locked" },
  claim:        { es: "Reclamar certificado",                    en: "Claim certificate" },
  claimed:      { es: "Certificado obtenido",                    en: "Certificate earned" },
  incomplete:   { es: "Faltan lecciones",                        en: "Lessons remaining" },
  achievements: { es: "Logros",                                  en: "Achievements" },
  noAchiev:     { es: "Sin logros aún",                          en: "No achievements yet" },
  noAchievSub:  { es: "Completa lecciones para desbloquear",    en: "Complete lessons to unlock" },
  terms:        { es: "Términos",                                en: "Terms" },
  privacy:      { es: "Privacidad",                             en: "Privacy" },
  disclaimer:   { es: "Disclaimer",                             en: "Disclaimer" },
  chooseAvatar: { es: "Elige tu avatar",                        en: "Choose your avatar" },
  free:         { es: "GRATIS",                                  en: "FREE" },
  premium:      { es: "PREMIUM",                                 en: "PREMIUM" },
  close:        { es: "Cerrar",                                  en: "Close" },
  xpToNext:     { es: "XP para siguiente rango",                en: "XP to next rank" },
};

const LEVELS = [
  { id: "level-1",     number: 0, name: { es: "Origins",    en: "Origins" },    color: "#468BFF", icon: "🌱" },
  { id: "level-new-1", number: 1, name: { es: "Explorer",   en: "Explorer" },   color: "#7B61FF", icon: "🧭" },
  { id: "level-new-2", number: 2, name: { es: "Thinker",    en: "Thinker" },    color: "#26C6DA", icon: "🧠" },
  { id: "level-new-3", number: 3, name: { es: "Creator",    en: "Creator" },    color: "#FF7DAE", icon: "🎨" },
  { id: "level-new-4", number: 4, name: { es: "Builder",    en: "Builder" },    color: "#36D399", icon: "🛠️" },
  { id: "level-new-5", number: 5, name: { es: "Architect",  en: "Architect" },  color: "#FF9E5B", icon: "🏗️" },
  { id: "level-new-6", number: 6, name: { es: "Founder",    en: "Founder" },    color: "#F2C04D", icon: "🚀" },
  { id: "level-new-7", number: 7, name: { es: "Researcher", en: "Researcher" }, color: "#A78BFA", icon: "🔬" },
  { id: "level-new-8", number: 8, name: { es: "Residency",  en: "Residency" },  color: "#FF6B6B", icon: "🎓" },
];


const LEVEL_SVGS: Record<string, string> = {
  "level-1":     `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21V11"/><path d="M12 12c0-3.5-2.5-6-7-6.5C5.3 10 7.5 12.3 12 12Z"/><path d="M12 9c0-2.8 2-4.8 5.5-5.2C17.8 7.3 16 9.3 12 9Z"/></svg>`,
  "level-new-1": `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M15.2 8.8l-1.7 5.1-5.1 1.7 1.7-5.1 5.1-1.7Z"/></svg>`,
  "level-new-2": `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 4.5c-2 0-3.5 1.5-3.5 3.5-1.3.4-2 1.6-2 3s.7 2.7 2 3.1c0 2.1 1.5 3.9 3.5 3.9M8.5 4.5c1.3 0 2.4.7 3 1.7M8.5 4.5v13.5M15.5 4.5c2 0 3.5 1.5 3.5 3.5 1.3.4 2 1.6 2 3s-.7 2.7-2 3.1c0 2.1-1.5 3.9-3.5 3.9M15.5 4.5c-1.3 0-2.4.7-3 1.7M15.5 4.5v13.5"/></svg>`,
  "level-new-3": `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3.5C7.3 3.5 3.5 7.3 3.5 12c0 4.4 3.6 8.5 8.5 8.5.9 0 1.3-.5 1.3-1.1 0-.4-.1-.7-.4-.9-.2-.3-.4-.6-.4-.9 0-.6.5-1.1 1.1-1.1h1.4c3 0 5.5-2.5 5.5-5.5 0-4.1-3.6-7.5-8.5-7.5Z"/><circle cx="8" cy="10.5" r="1" fill="currentColor" stroke="none"/><circle cx="10.5" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="7.5" r="1" fill="currentColor" stroke="none"/></svg>`,
  "level-new-4": `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 6.2a3.5 3.5 0 0 0-4.6 4.3L4.5 15.9v3.6h3.6l5.4-5.4a3.5 3.5 0 0 0 4.3-4.6L15.5 12l-3.5-3.5 2.5-2.3Z"/></svg>`,
  "level-new-5": `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V10l5-2.5V20M9 20V4.5L14 2v18M14 20V9l5-1.5V20"/><path d="M3 20h18"/></svg>`,
  "level-new-6": `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.5c2.8 1.6 4.5 4.9 4.5 8.3 0 1.9-.6 3.6-1.6 5L12 19l-2.9-3.2c-1-1.4-1.6-3.1-1.6-5 0-3.4 1.7-6.7 4.5-8.3Z"/><circle cx="12" cy="10.5" r="1.5"/><path d="M8.8 16.2L6.5 20.5l3-1.3M15.2 16.2l2.3 4.3-3-1.3"/></svg>`,
  "level-new-7": `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3.5v6L6.3 16.8A2.3 2.3 0 0 0 8.3 20.2h7.4a2.3 2.3 0 0 0 2-3.4L14 9.5v-6"/><path d="M8.7 3.5h6.6M7.5 15h9"/></svg>`,
  "level-new-8": `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 9L12 4.5 21.5 9 12 13.5 2.5 9Z"/><path d="M6.5 11v5c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-5"/><path d="M21.5 9v6"/></svg>`,
};

function renderLevelIcon(levelId: string) {
  const svg = LEVEL_SVGS[levelId] ?? LEVEL_SVGS["level-1"];
  return <span dangerouslySetInnerHTML={{ __html: svg }} style={{ display: "flex" }} />;
}

const RANK_CONFIG: Record<string, { color: string; label: string; xpMin: number; xpMax: number }> = {
  NOVICE:    { color: "#7E8798", label: "Novato",    xpMin: 0,      xpMax: 500 },
  EXPLORER:  { color: "#7B61FF", label: "Explorer",  xpMin: 500,    xpMax: 2000 },
  CREATOR:   { color: "#26C6DA", label: "Creator",   xpMin: 2000,   xpMax: 6000 },
  BUILDER:   { color: "#36D399", label: "Builder",   xpMin: 6000,   xpMax: 15000 },
  INNOVATOR: { color: "#F2C04D", label: "Innovator", xpMin: 15000,  xpMax: 30000 },
  VISIONARY: { color: "#F472B6", label: "Visionary", xpMin: 30000,  xpMax: 55000 },
  PIONEER:   { color: "#FB923C", label: "Pioneer",   xpMin: 55000,  xpMax: 90000 },
  MASTER:    { color: "#A78BFA", label: "Master",    xpMin: 90000,  xpMax: 140000 },
  LEGEND:    { color: "#FF6B6B", label: "Legend",    xpMin: 140000, xpMax: 200000 },
  AI_TITAN:  { color: "#F2C04D", label: "AI Titan",  xpMin: 200000, xpMax: 999999 },
};

interface Gamification { xpTotal: number; rank: string; rankLevel: number; streakDays: number; lessonsCompleted: number; gems: number; vyCoins: number; }
interface Achievement { achievement: { emoji: string; name: string; description: string }; earnedAt: string; }

function NavBar({ lang }: { lang: "es" | "en" }) {
  const ACCENT = "#7B61FF";
  const items = [
    { href: "/dashboard", label: lang === "en" ? "Home" : "Inicio", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 10.5L12 3L21 10.5V20C21 20.6 20.6 21 20 21H15V15H9V21H4C3.4 21 3 20.6 3 20V10.5Z" strokeWidth="1.8" strokeLinejoin="round"/></svg> },
    { href: "/worlds", label: lang === "en" ? "Levels" : "Niveles", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="8.5" strokeWidth="1.8"/><ellipse cx="12" cy="12" rx="3.5" ry="8.5" strokeWidth="1.5"/><path d="M4 9.5H20M4 14.5H20" strokeWidth="1.3" strokeLinecap="round"/></svg> },
    { href: "/vy", label: "ZAI", icon: <svg width="18" height="18" viewBox="0 0 24 24"><defs><radialGradient id="zaiN" cx="35%" cy="30%" r="75%"><stop offset="0%" stopColor="#C4B5FD"/><stop offset="50%" stopColor="#7B61FF"/><stop offset="100%" stopColor="#4C3AA8"/></radialGradient></defs><circle cx="12" cy="12" r="10" fill="url(#zaiN)"/><path d="M8.5 8.2H15.5L8.5 15.8H15.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg> },
    { href: "/community", label: lang === "en" ? "League" : "Liga", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="9" y="10" width="6" height="12" rx="1" strokeWidth="1.8"/><rect x="2" y="14" width="6" height="8" rx="1" strokeWidth="1.5"/><rect x="16" y="16" width="6" height="6" rx="1" strokeWidth="1.5"/></svg> },
    { href: "/profile", label: lang === "en" ? "Profile" : "Perfil", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2L20.5 7V17L12 22L3.5 17V7L12 2Z" strokeWidth="1.8" strokeLinejoin="round"/><circle cx="12" cy="9.5" r="2.5" strokeWidth="1.5"/></svg> },
  ];
  return (
    <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(15,20,32,0.96)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid #2A3445", display: "flex", padding: "6px 0" }}>
      {items.map(({ href, label, icon }) => {
        const isActive = href === "/profile";
        return (
          <Link key={href} href={href} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", textDecoration: "none", padding: "4px 0" }}>
            <div style={{ width: "40px", height: "40px", background: isActive ? `${ACCENT}20` : "transparent", border: isActive ? `1px solid ${ACCENT}40` : "1px solid transparent", borderRadius: "13px", display: "flex", alignItems: "center", justifyContent: "center", color: isActive ? ACCENT : "#7E8798" }}>{icon}</div>
            <span style={{ fontSize: "10px", fontFamily: isActive ? "'Syne',sans-serif" : "'DM Sans',sans-serif", fontWeight: isActive ? 800 : 500, color: isActive ? ACCENT : "#7E8798", letterSpacing: isActive ? "0.5px" : "0" }}>{isActive ? label.toUpperCase() : label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { lang } = useUserLang();
  const t = (key: keyof typeof T) => T[key][lang];
  const [gamification, setGamification] = useState<Gamification | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [avatarId, setAvatarId] = useState("orb-1");
  const [currentLevelId, setCurrentLevelId] = useState<string>("level-1");
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [unlockedAvatars, setUnlockedAvatars] = useState<string[]>([]);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [displayName, setDisplayName] = useState<string>("");
  const [certMsg, setCertMsg] = useState<Record<string, string>>({});
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [certLoading, setCertLoading] = useState<string | null>(null);

  async function saveName() {
    if (!nameInput.trim()) return;
    await fetch('/api/user', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ displayName: nameInput.trim() }) });
    setDisplayName(nameInput.trim());
    setEditingName(false);
  }

  async function selectAvatar(id: string, price = 0) {
    if (price > 0 && !unlockedAvatars.includes(id)) {
      if ((gamification?.vyCoins ?? 0) < price) return;
      const res = await fetch("/api/shop/avatar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ avatar: id }) });
      if (!res.ok) return;
      const data = await res.json();
      setUnlockedAvatars(u => [...u, id]);
      setGamification(g => g ? { ...g, vyCoins: g.vyCoins - (data.spent ?? 0) } : g);
    }
    setAvatarSaving(true);
    await fetch("/api/user", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ avatarEmoji: id }) });
    setAvatarId(id);
    setAvatarSaving(false);
    setAvatarPickerOpen(false);
  }

  async function claimCertificate(levelId: string) {
    setCertLoading(levelId);
    try {
      const res = await fetch("/api/certificate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ levelId }) });
      const data = await res.json();
      if (res.ok) {
        setCertMsg(m => ({ ...m, [levelId]: `✓ /verify/${data.certificate.verificationCode}` }));
      } else {
        const left = data.total - data.completed;
        setCertMsg(m => ({ ...m, [levelId]: lang === "en" ? `${left} lessons left` : `Faltan ${left} lecciones` }));
      }
    } catch { setCertMsg(m => ({ ...m, [levelId]: "Error" })); }
    finally { setCertLoading(null); }
  }

  useEffect(() => { setSoundOn(isSoundEnabled()); }, []);

  useEffect(() => {
    async function load() {
      try {
        const [gamRes, userRes] = await Promise.all([fetch("/api/gamification"), fetch("/api/user")]);
        if (gamRes.ok) {
          const d = await gamRes.json();
          setGamification(d.gamification);
          setAchievements(d.achievements ?? []);
          const lvl = d.recentLessons?.[0]?.lesson?.world?.level;
          if (lvl) setCurrentLevelId(lvl.id);
        }
        if (userRes.ok) {
          const d = await userRes.json();
          if (d.user?.avatarEmoji) setAvatarId(d.user.avatarEmoji);
          if (d.user?.unlockedAvatars) setUnlockedAvatars(d.user.unlockedAvatars);
          if (d.user?.displayName) setDisplayName(d.user.displayName);
        }
      } catch (err) { console.error(err); }
    }
    if (isLoaded && user) load();
  }, [isLoaded, user]);

  if (!isLoaded) return <div style={{ minHeight: "100vh", background: "#0F1420", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: "28px" }}>⚡</span></div>;

  const rank = gamification?.rank ?? "NOVICE";
  const rankCfg = RANK_CONFIG[rank] ?? RANK_CONFIG.NOVICE;
  const xp = gamification?.xpTotal ?? 0;
  const xpMin = rankCfg.xpMin;
  const xpMax = rankCfg.xpMax;
  const xpProgress = Math.min(100, Math.round(((xp - xpMin) / (xpMax - xpMin)) * 100));
  const currentLevelIndex = LEVELS.findIndex(l => l.id === currentLevelId);

  return (
    <div style={{ minHeight: "100vh", background: "#0F1420", paddingBottom: "100px" }}>

      {/* HEADER */}
      <div style={{ background: "rgba(15,20,32,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(123,97,255,0.1)", padding: "12px 16px 16px" }}>
        <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "10px", background: "rgba(123,97,255,0.1)", border: "1px solid rgba(123,97,255,0.2)", marginBottom: "12px", color: "#A78BFA" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg></Link>

        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "16px" }}>

          {/* Avatar */}
          <button onClick={() => setAvatarPickerOpen(true)} style={{ position: "relative", width: "72px", height: "72px", borderRadius: "50%", padding: 0, cursor: "pointer", border: "none", background: "none", flexShrink: 0 }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: `${rankCfg.color}20`, border: `2.5px solid ${rankCfg.color}`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AvatarIcon id={avatarId} size={68} />
            </div>
            <div style={{ position: "absolute", bottom: 0, right: 0, width: "22px", height: "22px", borderRadius: "50%", background: "#7B61FF", border: "2px solid #0F1420", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#fff" }}>✎</div>
          </button>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
              <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "18px", color: "#fff", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {displayName || user?.fullName || t("student")}
              </h1>
              <button onClick={() => { setNameInput(displayName || ""); setEditingName(true); }} style={{ background: "none", border: "none", color: "#7B61FF", cursor: "pointer", fontSize: "12px", padding: "2px", flexShrink: 0 }}>✎</button>
            </div>
            <p style={{ fontSize: "11px", color: "#7E8798", fontFamily: "'DM Sans',sans-serif", margin: "0 0 6px" }}>@{user?.username ?? user?.firstName?.toLowerCase() ?? "usuario"}</p>

            {/* Rank badge + XP bar */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "8px", fontWeight: 700, background: rankCfg.color + "18", color: rankCfg.color, border: "1px solid " + rankCfg.color + "33", fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>
                {rankCfg.label} · Lv.{gamification?.rankLevel ?? 1}
              </span>
            </div>

            {/* XP progress bar */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ flex: 1, height: "4px", background: "#1E2533", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${xpProgress}%`, background: `linear-gradient(90deg, ${rankCfg.color}, ${rankCfg.color}99)`, borderRadius: "2px", transition: "width 0.6s ease" }} />
              </div>
              <span style={{ fontSize: "9px", color: "#7E8798", fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>{xp.toLocaleString()} XP</span>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end" }}>
            <LangToggle />
            <div style={{ display: "flex", gap: "6px" }}>
              <button onClick={() => { const n = !soundOn; setSoundOn(n); setSoundEnabled(n); }} style={{ width: "30px", height: "30px", borderRadius: "50%", border: "1px solid #324055", background: "#1E2533", color: soundOn ? "#F8FAFF" : "#7E8798", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {soundOn ? <><path d="M11 5L6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></> : <><path d="M11 5L6 9H3v6h3l5 4V5Z"/><path d="M17 9l4 6M21 9l-4 6"/></>}
                </svg>
              </button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>

        {editingName && (
          <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
            <input value={nameInput} onChange={e => setNameInput(e.target.value)} autoFocus style={{ flex: 1, background: "#0F1420", border: "1px solid #7B61FF", borderRadius: "8px", padding: "8px 10px", color: "#F8FAFF", fontSize: "14px", fontFamily: "DM Sans,sans-serif" }} />
            <button onClick={saveName} style={{ padding: "8px 14px", background: "#7B61FF", color: "#fff", borderRadius: "8px", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}>OK</button>
            <button onClick={() => setEditingName(false)} style={{ padding: "8px 10px", background: "#324055", color: "#fff", borderRadius: "8px", fontSize: "12px", border: "none", cursor: "pointer" }}>✕</button>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "rgba(123,97,255,0.06)", border: "1px solid rgba(123,97,255,0.1)", borderRadius: "14px", overflow: "hidden" }}>
          {[
            { value: String(gamification?.lessonsCompleted ?? 0), label: t("lessons"), icon: "book" },
            { value: xp.toLocaleString(), label: t("xpTotal"), icon: "zap" },
            { value: `${gamification?.streakDays ?? 0}`, label: t("streak"), icon: "flame" },
          ].map(({ value, label, icon }, i) => (
            <div key={label} style={{ padding: "12px 8px", textAlign: "center", borderLeft: i > 0 ? "1px solid rgba(123,97,255,0.1)" : "none" }}>
              <div style={{ marginBottom: "2px", display: "flex", justifyContent: "center", color: "#7B61FF" }}>{icon === "book" ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> : icon === "zap" ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 3L5.5 13H10l-1 8L18 11h-4.5l-.5-8Z"/></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c0 6-6 8-6 13a6 6 0 0 0 12 0c0-5-6-7-6-13Z"/><path d="M12 2c0 4 3 5.5 3 9a3 3 0 0 1-6 0c0-3.5 3-5 3-9Z"/></svg>}</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "16px", color: "#fff" }}>{value}</div>
              <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* MAPA DE NIVELES */}
        <section>
          <h2 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.25)", marginBottom: "12px", fontFamily: "'DM Sans',sans-serif" }}>{t("myPath")}</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {LEVELS.map((level, index) => {
              const isCompleted = index < currentLevelIndex;
              const isCurrent = index === currentLevelIndex;
              const isLocked = index > currentLevelIndex;
              const hasCertMsg = certMsg[level.id];

              return (
                <div key={level.id} style={{ position: "relative" }}>
                  {/* Connector line */}
                  {index < LEVELS.length - 1 && (
                    <div style={{ position: "absolute", left: "23px", top: "52px", width: "2px", height: "12px", background: isCompleted ? level.color : "#2A3445", zIndex: 0 }} />
                  )}

                  <div style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    background: isCurrent ? `${level.color}10` : "rgba(30,37,51,0.6)",
                    border: isCurrent ? `1px solid ${level.color}40` : "1px solid rgba(50,64,85,0.5)",
                    borderRadius: "14px", padding: "12px", position: "relative", zIndex: 1
                  }}>
                    {/* Icon */}
                    <div style={{
                      width: "44px", height: "44px", borderRadius: "12px", flexShrink: 0,
                      background: isLocked ? "#1E2533" : `${level.color}18`,
                      border: `1.5px solid ${isLocked ? "#2A3445" : level.color + "50"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "20px", opacity: isLocked ? 0.4 : 1
                    }}>
                      {isLocked ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7E8798" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      ) : (
                        renderLevelIcon(level.id)
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "13px", color: isLocked ? "#7E8798" : "#fff", margin: 0 }}>
                          Nivel {level.number} — {level.name[lang]}
                        </p>
                        {isCurrent && <span style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "6px", background: `${level.color}20`, color: level.color, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>{t("current")}</span>}
                        {isCompleted && <span style={{ fontSize: "14px" }}>✅</span>}
                      </div>
                      {hasCertMsg && (
                        <p style={{ fontSize: "10px", color: hasCertMsg.startsWith("✓") ? "#36D399" : "#FB923C", fontFamily: "'DM Sans',sans-serif", margin: "2px 0 0" }}>{hasCertMsg}</p>
                      )}
                    </div>

                    {/* Action */}
                    {!isLocked && !hasCertMsg && (
                      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                        <Link href={`/worlds?levelId=${level.id}`} style={{ padding: "6px 10px", background: "rgba(123,97,255,0.1)", border: "1px solid rgba(123,97,255,0.2)", borderRadius: "8px", color: "#A78BFA", fontSize: "11px", fontWeight: 600, textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>
                          →
                        </Link>
                        {(isCompleted || isCurrent) && (
                          <button onClick={() => claimCertificate(level.id)} disabled={certLoading === level.id} style={{ padding: "6px 10px", background: `${level.color}15`, border: `1px solid ${level.color}40`, borderRadius: "8px", color: level.color, fontSize: "10px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                            {certLoading === level.id ? "..." : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 9L12 4.5 21.5 9 12 13.5 2.5 9Z"/><path d="M6.5 11v5c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-5"/><path d="M21.5 9v6"/></svg>}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* LOGROS */}
        <section>
          <h2 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.25)", marginBottom: "12px", fontFamily: "'DM Sans',sans-serif" }}>{t("achievements")}</h2>
          {achievements.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {achievements.map((a, i) => (
                <div key={i} style={{ background: "rgba(123,97,255,0.05)", border: "1px solid rgba(123,97,255,0.1)", borderRadius: "14px", padding: "12px" }}>
                  <div style={{ fontSize: "24px", marginBottom: "6px" }}>{a.achievement.emoji}</div>
                  <p style={{ fontWeight: 700, fontSize: "11px", color: "#fff", marginBottom: "2px", fontFamily: "'DM Sans',sans-serif" }}>{a.achievement.name}</p>
                  <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>{a.achievement.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: "rgba(123,97,255,0.05)", border: "1px solid rgba(123,97,255,0.1)", borderRadius: "16px", padding: "24px", textAlign: "center" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(123,97,255,0.12)", border: "1px solid rgba(123,97,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", color: "#A78BFA" }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4.5h10v4.5a5 5 0 0 1-10 0V4.5Z"/><path d="M7 6H4.8A1.3 1.3 0 0 0 3.5 7.3v.4a3.2 3.2 0 0 0 3.2 3.2H7M17 6h2.2a1.3 1.3 0 0 1 1.3 1.3v.4a3.2 3.2 0 0 1-3.2 3.2H17"/><path d="M12 13.5v3M9.2 19.5h5.6c-.1-1.5-.5-2.3-1-2.7h-3.6c-.5.4-.9 1.2-1 2.7Z"/></svg></div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "4px", fontFamily: "'DM Sans',sans-serif" }}>{t("noAchiev")}</p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>{t("noAchievSub")}</p>
              <Link href="/worlds" style={{ display: "inline-block", marginTop: "12px", padding: "8px 16px", background: "rgba(123,97,255,0.15)", border: "1px solid rgba(123,97,255,0.3)", borderRadius: "10px", color: "#A78BFA", fontSize: "12px", fontWeight: 700, textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>
                {lang === "en" ? "Start learning →" : "Empezar →"}
              </Link>
            </div>
          )}
        </section>

        {/* LEGAL */}
        <div style={{ display: "flex", gap: "8px", padding: "0 4px" }}>
          <Link href="/terms" style={{ fontSize: "11px", color: "#7E8798", textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>{t("terms")}</Link>
          <span style={{ color: "#324055" }}>·</span>
          <Link href="/privacy" style={{ fontSize: "11px", color: "#7E8798", textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>{t("privacy")}</Link>
          <span style={{ color: "#324055" }}>·</span>
          <Link href="/disclaimer" style={{ fontSize: "11px", color: "#7E8798", textDecoration: "none", fontFamily: "'DM Sans',sans-serif" }}>{t("disclaimer")}</Link>
        </div>
      </div>

      {/* AVATAR PICKER */}
      {avatarPickerOpen && (
        <div onClick={() => setAvatarPickerOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#1E2533", border: "1px solid #324055", borderRadius: "18px 18px 0 0", padding: "20px", width: "100%", maxWidth: "480px", maxHeight: "70vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px" }}>
            <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: "#F8FAFF", fontSize: "15px" }}>{t("chooseAvatar")}</p>
            <div>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "#7E8798", marginBottom: "8px" }}>{t("free")}</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {FREE_AVATAR_IDS.map(id => (
                  <button key={id} disabled={avatarSaving} onClick={() => selectAvatar(id)} style={{ width: "48px", height: "48px", borderRadius: "12px", padding: 0, background: avatarId === id ? "rgba(123,97,255,0.25)" : "#161C27", border: avatarId === id ? "1px solid #7B61FF" : "1px solid #324055", cursor: "pointer", overflow: "hidden" }}>
                    <AvatarIcon id={id} size={48} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#7E8798" }}>{t("premium")}</p>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#F2C04D" }}>🪙 {gamification?.vyCoins ?? 0}</span>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {PREMIUM_AVATAR_IDS.map(([id, price]) => {
                  const owned = unlockedAvatars.includes(id);
                  return (
                    <button key={id} disabled={avatarSaving} onClick={() => selectAvatar(id, price)} style={{ position: "relative", width: "48px", height: "48px", borderRadius: "12px", padding: 0, background: avatarId === id ? "rgba(123,97,255,0.25)" : "#161C27", border: avatarId === id ? "1px solid #7B61FF" : "1px solid #324055", cursor: "pointer", opacity: owned ? 1 : 0.6, overflow: "hidden" }}>
                      <AvatarIcon id={id} size={48} />
                      {!owned && <span style={{ position: "absolute", bottom: "-2px", right: "-2px", fontSize: "8px", background: "#F2C04D", color: "#000", borderRadius: "5px", padding: "1px 3px", fontWeight: 700 }}>{price}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            <button onClick={() => setAvatarPickerOpen(false)} style={{ padding: "10px", background: "#324055", color: "#fff", border: "none", borderRadius: "10px", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>{t("close")}</button>
          </div>
        </div>
      )}

      <div style={{ position: "fixed", bottom: "56px", left: 0, right: 0, height: "40px", background: "linear-gradient(to top, #0F1420, transparent)", pointerEvents: "none", zIndex: 89 }} />
      <NavBar lang={lang} />
    </div>
  );
}
