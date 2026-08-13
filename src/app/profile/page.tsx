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
    <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(15,20,32,0.96)", backdropFilter: "blur(20px)", borderTop: "1px solid #2A3445", display: "flex", padding: "6px 0" }}>
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
    <div style={{ minHeight: "100vh", background: "#0F1420", paddingBottom: "88px" }}>

      {/* HEADER */}
      <div style={{ background: "rgba(15,20,32,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(123,97,255,0.1)", padding: "20px 16px 16px" }}>
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
            { value: String(gamification?.lessonsCompleted ?? 0), label: t("lessons"), icon: "📖" },
            { value: xp.toLocaleString(), label: t("xpTotal"), icon: "⚡" },
            { value: `${gamification?.streakDays ?? 0}`, label: t("streak"), icon: "🔥" },
          ].map(({ value, label, icon }, i) => (
            <div key={label} style={{ padding: "12px 8px", textAlign: "center", borderLeft: i > 0 ? "1px solid rgba(123,97,255,0.1)" : "none" }}>
              <div style={{ fontSize: "16px", marginBottom: "2px" }}>{icon}</div>
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
                        <span>{level.icon}</span>
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
                            {certLoading === level.id ? "..." : "🎓"}
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
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🏆</div>
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

      <NavBar lang={lang} />
    </div>
  );
}
