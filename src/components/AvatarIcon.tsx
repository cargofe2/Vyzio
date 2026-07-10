"use client";
import { ReactElement } from "react";

// Avatares propios geométricos, estilo ZaiOrb (esferas con gradientes de marca).
// orb-1 a orb-10: nivel gratis. orb-11 a orb-20: nivel premium (VY Coins).

interface Props {
  id: string;
  size?: number;
}

const G = "#7B61FF", B = "#468BFF", C = "#26C6DA", O = "#FB923C", S = "#36D399", W = "#F2C04D", D = "#FF6B6B", P = "#F472B6", V = "#A78BFA", DK = "#4C3AA8";

export default function AvatarIcon({ id, size = 44 }: Props) {
  const svg = AVATARS[id] ?? AVATARS["orb-1"];
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
      {svg(size)}
    </div>
  );
}

export const FREE_AVATAR_IDS = ["orb-1", "orb-2", "orb-3", "orb-4", "orb-5", "orb-6", "orb-7", "orb-8", "orb-9", "orb-10"];
export const PREMIUM_AVATAR_IDS: [string, number][] = [
  ["orb-11", 80], ["orb-12", 80], ["orb-13", 100], ["orb-14", 100],
  ["orb-15", 120], ["orb-16", 120], ["orb-17", 140], ["orb-18", 150],
  ["orb-19", 180], ["orb-20", 220],
];

type Renderer = (size: number) => ReactElement;

const AVATARS: Record<string, Renderer> = {
  // --- GRATIS ---
  "orb-1": (s) => ( // Z clásico (default)
    <svg width={s} height={s} viewBox="0 0 44 44"><defs><radialGradient id="g1" cx="35%" cy="30%"><stop offset="0%" stopColor={V} /><stop offset="60%" stopColor={G} /><stop offset="100%" stopColor={DK} /></radialGradient></defs>
      <circle cx="22" cy="22" r="22" fill="url(#g1)" />
      <path d="M15 16h14L15 28h14" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>),
  "orb-2": (s) => ( // esfera azul con highlight
    <svg width={s} height={s} viewBox="0 0 44 44"><defs><radialGradient id="g2" cx="35%" cy="30%"><stop offset="0%" stopColor="#9DC4FF" /><stop offset="70%" stopColor={B} /><stop offset="100%" stopColor="#1E4FA0" /></radialGradient></defs>
      <circle cx="22" cy="22" r="22" fill="url(#g2)" /></svg>),
  "orb-3": (s) => ( // cyan con anillo
    <svg width={s} height={s} viewBox="0 0 44 44"><defs><radialGradient id="g3" cx="35%" cy="30%"><stop offset="0%" stopColor="#9CF0FA" /><stop offset="70%" stopColor={C} /><stop offset="100%" stopColor="#0E7A8C" /></radialGradient></defs>
      <circle cx="22" cy="22" r="22" fill="url(#g3)" /><circle cx="22" cy="22" r="14" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" /></svg>),
  "orb-4": (s) => ( // split morado/azul
    <svg width={s} height={s} viewBox="0 0 44 44"><defs><clipPath id="cp4"><circle cx="22" cy="22" r="22" /></clipPath></defs>
      <g clipPath="url(#cp4)"><rect x="0" y="0" width="22" height="44" fill={G} /><rect x="22" y="0" width="22" height="44" fill={B} /></g></svg>),
  "orb-5": (s) => ( // naranja con puntos
    <svg width={s} height={s} viewBox="0 0 44 44"><defs><radialGradient id="g5" cx="35%" cy="30%"><stop offset="0%" stopColor="#FFD9AD" /><stop offset="70%" stopColor={O} /><stop offset="100%" stopColor="#B2530F" /></radialGradient></defs>
      <circle cx="22" cy="22" r="22" fill="url(#g5)" />
      {[[15,15],[29,15],[22,22],[15,29],[29,29]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="2" fill="#fff" fillOpacity="0.55"/>)}
    </svg>),
  "orb-6": (s) => ( // verde con ondas
    <svg width={s} height={s} viewBox="0 0 44 44"><defs><radialGradient id="g6" cx="35%" cy="30%"><stop offset="0%" stopColor="#A9F2D6" /><stop offset="70%" stopColor={S} /><stop offset="100%" stopColor="#177A56" /></radialGradient></defs>
      <circle cx="22" cy="22" r="22" fill="url(#g6)" />
      <path d="M6 24c4-4 8 4 12 0s8-4 12 0 8 4 8 4" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" fill="none" /></svg>),
  "orb-7": (s) => ( // rosa con satélite
    <svg width={s} height={s} viewBox="0 0 44 44"><defs><radialGradient id="g7" cx="35%" cy="30%"><stop offset="0%" stopColor="#FCD3E6" /><stop offset="70%" stopColor={P} /><stop offset="100%" stopColor="#A02C63" /></radialGradient></defs>
      <circle cx="22" cy="22" r="18" fill="url(#g7)" /><circle cx="35" cy="12" r="4" fill={P} /></svg>),
  "orb-8": (s) => ( // rayas diagonales
    <svg width={s} height={s} viewBox="0 0 44 44"><defs><clipPath id="cp8"><circle cx="22" cy="22" r="22" /></clipPath></defs>
      <g clipPath="url(#cp8)"><rect width="44" height="44" fill={DK} />
        {[-20,-10,0,10,20,30,40].map((x,i)=><rect key={i} x={x} y="-10" width="6" height="64" fill={G} fillOpacity="0.7" transform="rotate(30 22 22)" />)}
      </g></svg>),
  "orb-9": (s) => ( // facetas hexagonales
    <svg width={s} height={s} viewBox="0 0 44 44"><defs><radialGradient id="g9" cx="35%" cy="30%"><stop offset="0%" stopColor={V} /><stop offset="100%" stopColor={DK} /></radialGradient></defs>
      <circle cx="22" cy="22" r="22" fill="url(#g9)" />
      <polygon points="22,10 30,15 30,25 22,30 14,25 14,15" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.5" /></svg>),
  "orb-10": (s) => ( // triángulos
    <svg width={s} height={s} viewBox="0 0 44 44"><defs><radialGradient id="g10" cx="35%" cy="30%"><stop offset="0%" stopColor="#CFE0FF" /><stop offset="70%" stopColor={B} /><stop offset="100%" stopColor="#1E4FA0" /></radialGradient></defs>
      <circle cx="22" cy="22" r="22" fill="url(#g10)" />
      <polygon points="22,12 28,26 16,26" fill="#fff" fillOpacity="0.35" />
      <polygon points="14,28 20,40 8,40" fill="#fff" fillOpacity="0.2" /></svg>),

  // --- PREMIUM ---
  "orb-11": (s) => ( // anillos concéntricos multi-color
    <svg width={s} height={s} viewBox="0 0 44 44"><defs><radialGradient id="g11" cx="50%" cy="50%"><stop offset="0%" stopColor={C} /><stop offset="50%" stopColor={B} /><stop offset="100%" stopColor={G} /></radialGradient></defs>
      <circle cx="22" cy="22" r="22" fill="url(#g11)" />
      <circle cx="22" cy="22" r="16" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5" />
      <circle cx="22" cy="22" r="9" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.5" /></svg>),
  "orb-12": (s) => ( // cristal facetado
    <svg width={s} height={s} viewBox="0 0 44 44"><defs><linearGradient id="g12" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#D6C9FF" /><stop offset="100%" stopColor={G} /></linearGradient></defs>
      <circle cx="22" cy="22" r="22" fill="url(#g12)" />
      <polygon points="22,6 34,18 28,38 16,38 10,18" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.5" />
      <line x1="22" y1="6" x2="22" y2="38" stroke="#fff" strokeOpacity="0.4" strokeWidth="1" /></svg>),
  "orb-13": (s) => ( // aurora
    <svg width={s} height={s} viewBox="0 0 44 44"><defs><linearGradient id="g13" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={G} /><stop offset="50%" stopColor={P} /><stop offset="100%" stopColor={O} /></linearGradient></defs>
      <circle cx="22" cy="22" r="22" fill="url(#g13)" /></svg>),
  "orb-14": (s) => ( // campo de estrellas
    <svg width={s} height={s} viewBox="0 0 44 44"><defs><radialGradient id="g14" cx="50%" cy="50%"><stop offset="0%" stopColor="#1E2547" /><stop offset="100%" stopColor="#05070F" /></radialGradient></defs>
      <circle cx="22" cy="22" r="22" fill="url(#g14)" />
      {[[10,10],[30,8],[20,15],[35,25],[8,28],[24,34],[16,22],[32,36]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i%3===0?1.4:0.8} fill="#fff" fillOpacity={0.8}/>)}
      <circle cx="22" cy="22" r="4" fill={V} /></svg>),
  "orb-15": (s) => ( // espiral galaxia
    <svg width={s} height={s} viewBox="0 0 44 44"><defs><radialGradient id="g15" cx="50%" cy="50%"><stop offset="0%" stopColor="#fff" /><stop offset="30%" stopColor={V} /><stop offset="100%" stopColor="#100826" /></radialGradient></defs>
      <circle cx="22" cy="22" r="22" fill="url(#g15)" />
      <path d="M22 22C28 18 30 10 22 8C12 8 8 18 14 26C20 34 32 32 32 22" stroke="#fff" strokeOpacity="0.4" strokeWidth="1.5" fill="none" /></svg>),
  "orb-16": (s) => ( // plasma
    <svg width={s} height={s} viewBox="0 0 44 44"><defs><radialGradient id="g16" cx="40%" cy="40%"><stop offset="0%" stopColor="#FFE8A3" /><stop offset="45%" stopColor={O} /><stop offset="100%" stopColor={D} /></radialGradient></defs>
      <circle cx="22" cy="22" r="22" fill="url(#g16)" />
      <path d="M14 30c4-10 4-16 8-22" stroke="#fff" strokeOpacity="0.3" strokeWidth="2.5" fill="none" strokeLinecap="round" /></svg>),
  "orb-17": (s) => ( // eléctrico
    <svg width={s} height={s} viewBox="0 0 44 44"><defs><radialGradient id="g17" cx="35%" cy="30%"><stop offset="0%" stopColor="#F2F5FF" /><stop offset="60%" stopColor={B} /><stop offset="100%" stopColor="#0B1A3D" /></radialGradient></defs>
      <circle cx="22" cy="22" r="22" fill="url(#g17)" />
      <path d="M24 8L14 24h7l-3 12 12-18h-8z" fill="#fff" fillOpacity="0.85" /></svg>),
  "orb-18": (s) => ( // nebulosa
    <svg width={s} height={s} viewBox="0 0 44 44"><defs><radialGradient id="g18a" cx="30%" cy="30%" r="60%"><stop offset="0%" stopColor={P} stopOpacity="0.9" /><stop offset="100%" stopColor={P} stopOpacity="0" /></radialGradient>
      <radialGradient id="g18b" cx="70%" cy="60%" r="60%"><stop offset="0%" stopColor={C} stopOpacity="0.9" /><stop offset="100%" stopColor={C} stopOpacity="0" /></radialGradient></defs>
      <circle cx="22" cy="22" r="22" fill="#12081F" />
      <circle cx="22" cy="22" r="22" fill="url(#g18a)" /><circle cx="22" cy="22" r="22" fill="url(#g18b)" /></svg>),
  "orb-19": (s) => ( // dorado prestigio
    <svg width={s} height={s} viewBox="0 0 44 44"><defs><radialGradient id="g19" cx="35%" cy="30%"><stop offset="0%" stopColor="#FFF3C4" /><stop offset="60%" stopColor={W} /><stop offset="100%" stopColor="#9A6B00" /></radialGradient></defs>
      <circle cx="22" cy="22" r="22" fill="url(#g19)" />
      <path d="M14 18l4 6 4-9 4 9 4-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>),
  "orb-20": (s) => ( // legendario arcoíris
    <svg width={s} height={s} viewBox="0 0 44 44"><defs><linearGradient id="g20" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={D} /><stop offset="25%" stopColor={O} /><stop offset="50%" stopColor={W} /><stop offset="75%" stopColor={S} /><stop offset="100%" stopColor={G} /></linearGradient></defs>
      <circle cx="22" cy="22" r="22" fill="url(#g20)" />
      {[[12,14],[32,12],[22,8],[36,26],[8,26],[22,36]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="1.6" fill="#fff" fillOpacity="0.9"/>)}
    </svg>),
};
