"use client";
import { useEffect, useState, Suspense, ReactElement } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface World { id: string; name: string; emoji: string; description: string; lessonCount: number; pctComplete: number; order: number; slug: string; levelId?: string; }
interface Lesson { id: string; number: number; title: string; type: string; durationMin: number; xpReward: number; order: number; progress: { completed: boolean; score: number | null } | null; }

const LEVEL_NAMES: Record<string, string> = {
  "level-1": "Nivel 0 · Origins", "level-new-1": "Nivel 1 · Explorer", "level-new-2": "Nivel 2 · Thinker",
  "level-new-3": "Nivel 3 · Creator", "level-new-4": "Nivel 4 · Builder", "level-new-5": "Nivel 5 · Architect",
  "level-new-6": "Nivel 6 · Founder", "level-new-7": "Nivel 7 · Researcher", "level-new-8": "Nivel 8 · Residency",
};

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  VIDEO: { label: "Video", color: "#F87171", bg: "rgba(248,113,113,0.1)", icon: "▶" },
  READING: { label: "Lectura", color: "#7DD3FC", bg: "rgba(125,211,252,0.1)", icon: "📖" },
  QUIZ: { label: "Quiz", color: "#FB923C", bg: "rgba(251,146,60,0.1)", icon: "🎯" },
  PROJECT: { label: "Proyecto", color: "#A78BFA", bg: "rgba(167,139,250,0.1)", icon: "🚀" },
  EVALUATION: { label: "Eval", color: "#F472B6", bg: "rgba(244,114,182,0.1)", icon: "📊" },
  PRACTICE: { label: "Práctica", color: "#34D399", bg: "rgba(52,211,153,0.1)", icon: "💪" },
};

const WV: Record<number, { color: string; bg: string; border: string; grad: string; path: string }> = {
  0: { color: "#26C6DA", bg: "rgba(38,198,218,0.1)", border: "rgba(38,198,218,0.2)", grad: "linear-gradient(90deg,#26C6DA,#FB923C)", path: "M12 2L13.8 8.2H20L14.8 11.8L16.6 18L12 14.4L7.4 18L9.2 11.8L4 8.2H10.2L12 2Z" },
  1: { color: "#818CF8", bg: "rgba(123,97,255,0.1)", border: "rgba(123,97,255,0.18)", grad: "linear-gradient(90deg,#7B61FF,#8B5CF6)", path: "" },
  2: { color: "#FB923C", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.18)", grad: "linear-gradient(90deg,#FB923C,#EA580C)", path: "" },
  3: { color: "#00D4FF", bg: "rgba(0,212,255,0.1)", border: "rgba(0,212,255,0.18)", grad: "linear-gradient(90deg,#00D4FF,#0EA5E9)", path: "" },
  4: { color: "#A78BFA", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.18)", grad: "linear-gradient(90deg,#A78BFA,#7C3AED)", path: "" },
  5: { color: "#F472B6", bg: "rgba(244,114,182,0.1)", border: "rgba(244,114,182,0.18)", grad: "linear-gradient(90deg,#F472B6,#EC4899)", path: "" },
  6: { color: "#34D399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.18)", grad: "linear-gradient(90deg,#34D399,#10B981)", path: "" },
  7: { color: "#F87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.18)", grad: "linear-gradient(90deg,#F87171,#EF4444)", path: "" },
  8: { color: "#38BDF8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.18)", grad: "linear-gradient(90deg,#38BDF8,#0284C7)", path: "" },
  9: { color: "#4ADE80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.18)", grad: "linear-gradient(90deg,#4ADE80,#16A34A)", path: "" },
  10: { color: "#FB923C", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.18)", grad: "linear-gradient(90deg,#FB923C,#EA580C)", path: "" },
};
const LEVEL_PALETTES: Record<string, { color: string; bg: string; border: string; grad: string }[]> = {
  "level-1": [
    { color: "#26C6DA", bg: "rgba(38,198,218,0.1)", border: "rgba(38,198,218,0.2)", grad: "linear-gradient(90deg,#26C6DA,#FB923C)" },
    { color: "#818CF8", bg: "rgba(123,97,255,0.1)", border: "rgba(123,97,255,0.18)", grad: "linear-gradient(90deg,#7B61FF,#8B5CF6)" },
    { color: "#FB923C", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.18)", grad: "linear-gradient(90deg,#FB923C,#EA580C)" },
    { color: "#00D4FF", bg: "rgba(0,212,255,0.1)", border: "rgba(0,212,255,0.18)", grad: "linear-gradient(90deg,#00D4FF,#0EA5E9)" },
    { color: "#A78BFA", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.18)", grad: "linear-gradient(90deg,#A78BFA,#7C3AED)" },
    { color: "#F472B6", bg: "rgba(244,114,182,0.1)", border: "rgba(244,114,182,0.18)", grad: "linear-gradient(90deg,#F472B6,#EC4899)" },
    { color: "#34D399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.18)", grad: "linear-gradient(90deg,#34D399,#10B981)" },
    { color: "#F87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.18)", grad: "linear-gradient(90deg,#F87171,#EF4444)" },
    { color: "#38BDF8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.18)", grad: "linear-gradient(90deg,#38BDF8,#0284C7)" },
    { color: "#4ADE80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.18)", grad: "linear-gradient(90deg,#4ADE80,#16A34A)" },
    { color: "#FB923C", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.18)", grad: "linear-gradient(90deg,#FB923C,#EA580C)" },
  ],
  "level-new-1": [
    { color: "#38BDF8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.2)", grad: "linear-gradient(90deg,#38BDF8,#0EA5E9)" },
    { color: "#22D3EE", bg: "rgba(34,211,238,0.1)", border: "rgba(34,211,238,0.2)", grad: "linear-gradient(90deg,#22D3EE,#06B6D4)" },
    { color: "#60A5FA", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.2)", grad: "linear-gradient(90deg,#60A5FA,#3B82F6)" },
    { color: "#38BDF8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.2)", grad: "linear-gradient(90deg,#38BDF8,#0284C7)" },
    { color: "#7DD3FC", bg: "rgba(125,211,252,0.1)", border: "rgba(125,211,252,0.2)", grad: "linear-gradient(90deg,#7DD3FC,#0EA5E9)" },
    { color: "#0EA5E9", bg: "rgba(14,165,233,0.1)", border: "rgba(14,165,233,0.2)", grad: "linear-gradient(90deg,#0EA5E9,#0284C7)" },
    { color: "#67E8F9", bg: "rgba(103,232,249,0.1)", border: "rgba(103,232,249,0.2)", grad: "linear-gradient(90deg,#67E8F9,#22D3EE)" },
    { color: "#3B82F6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)", grad: "linear-gradient(90deg,#3B82F6,#2563EB)" },
    { color: "#06B6D4", bg: "rgba(6,182,212,0.1)", border: "rgba(6,182,212,0.2)", grad: "linear-gradient(90deg,#06B6D4,#0891B2)" },
    { color: "#93C5FD", bg: "rgba(147,197,253,0.1)", border: "rgba(147,197,253,0.2)", grad: "linear-gradient(90deg,#93C5FD,#60A5FA)" },
    { color: "#0284C7", bg: "rgba(2,132,199,0.1)", border: "rgba(2,132,199,0.2)", grad: "linear-gradient(90deg,#0284C7,#075985)" },
  ],
  "level-new-2": [
    { color: "#A78BFA", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.2)", grad: "linear-gradient(90deg,#A78BFA,#8B5CF6)" },
    { color: "#F472B6", bg: "rgba(244,114,182,0.1)", border: "rgba(244,114,182,0.2)", grad: "linear-gradient(90deg,#F472B6,#EC4899)" },
    { color: "#C084FC", bg: "rgba(192,132,252,0.1)", border: "rgba(192,132,252,0.2)", grad: "linear-gradient(90deg,#C084FC,#A855F7)" },
    { color: "#E879F9", bg: "rgba(232,121,249,0.1)", border: "rgba(232,121,249,0.2)", grad: "linear-gradient(90deg,#E879F9,#D946EF)" },
    { color: "#8B5CF6", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.2)", grad: "linear-gradient(90deg,#8B5CF6,#7C3AED)" },
    { color: "#F0ABFC", bg: "rgba(240,171,252,0.1)", border: "rgba(240,171,252,0.2)", grad: "linear-gradient(90deg,#F0ABFC,#E879F9)" },
    { color: "#D946EF", bg: "rgba(217,70,239,0.1)", border: "rgba(217,70,239,0.2)", grad: "linear-gradient(90deg,#D946EF,#C026D3)" },
    { color: "#DDD6FE", bg: "rgba(221,214,254,0.1)", border: "rgba(221,214,254,0.2)", grad: "linear-gradient(90deg,#DDD6FE,#C4B5FD)" },
    { color: "#A855F7", bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.2)", grad: "linear-gradient(90deg,#A855F7,#9333EA)" },
    { color: "#FBCFE8", bg: "rgba(251,207,232,0.1)", border: "rgba(251,207,232,0.2)", grad: "linear-gradient(90deg,#FBCFE8,#F9A8D4)" },
    { color: "#9333EA", bg: "rgba(147,51,234,0.1)", border: "rgba(147,51,234,0.2)", grad: "linear-gradient(90deg,#9333EA,#7E22CE)" },
  ],
  "level-new-3": [
    { color: "#4ADE80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.2)", grad: "linear-gradient(90deg,#4ADE80,#22C55E)" },
    { color: "#FB923C", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.2)", grad: "linear-gradient(90deg,#FB923C,#F97316)" },
    { color: "#34D399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)", grad: "linear-gradient(90deg,#34D399,#10B981)" },
    { color: "#FDBA74", bg: "rgba(253,186,116,0.1)", border: "rgba(253,186,116,0.2)", grad: "linear-gradient(90deg,#FDBA74,#FB923C)" },
    { color: "#22C55E", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)", grad: "linear-gradient(90deg,#22C55E,#16A34A)" },
    { color: "#22D3EE", bg: "rgba(34,211,238,0.1)", border: "rgba(34,211,238,0.2)", grad: "linear-gradient(90deg,#22D3EE,#0E7490)" },
    { color: "#86EFAC", bg: "rgba(134,239,172,0.1)", border: "rgba(134,239,172,0.2)", grad: "linear-gradient(90deg,#86EFAC,#4ADE80)" },
    { color: "#F97316", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.2)", grad: "linear-gradient(90deg,#F97316,#EA580C)" },
    { color: "#16A34A", bg: "rgba(22,163,74,0.1)", border: "rgba(22,163,74,0.2)", grad: "linear-gradient(90deg,#16A34A,#15803D)" },
    { color: "#67E8F9", bg: "rgba(103,232,249,0.1)", border: "rgba(103,232,249,0.2)", grad: "linear-gradient(90deg,#67E8F9,#22D3EE)" },
    { color: "#EA580C", bg: "rgba(234,88,12,0.1)", border: "rgba(234,88,12,0.2)", grad: "linear-gradient(90deg,#EA580C,#C2410C)" },
  ],
  "level-new-4": [
    { color: "#A78BFA", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.2)", grad: "linear-gradient(90deg,#A78BFA,#7C3AED)" },
    { color: "#F472B6", bg: "rgba(244,114,182,0.1)", border: "rgba(244,114,182,0.2)", grad: "linear-gradient(90deg,#F472B6,#EC4899)" },
    { color: "#818CF8", bg: "rgba(123,97,255,0.1)", border: "rgba(123,97,255,0.2)", grad: "linear-gradient(90deg,#818CF8,#6366F1)" },
    { color: "#C084FC", bg: "rgba(192,132,252,0.1)", border: "rgba(192,132,252,0.2)", grad: "linear-gradient(90deg,#C084FC,#A855F7)" },
    { color: "#F0ABFC", bg: "rgba(240,171,252,0.1)", border: "rgba(240,171,252,0.2)", grad: "linear-gradient(90deg,#F0ABFC,#E879F9)" },
    { color: "#7C3AED", bg: "rgba(124,58,237,0.1)", border: "rgba(124,58,237,0.2)", grad: "linear-gradient(90deg,#7C3AED,#6D28D9)" },
    { color: "#DDD6FE", bg: "rgba(221,214,254,0.1)", border: "rgba(221,214,254,0.2)", grad: "linear-gradient(90deg,#DDD6FE,#C4B5FD)" },
    { color: "#A855F7", bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.2)", grad: "linear-gradient(90deg,#A855F7,#9333EA)" },
    { color: "#EC4899", bg: "rgba(236,72,153,0.1)", border: "rgba(236,72,153,0.2)", grad: "linear-gradient(90deg,#EC4899,#DB2777)" },
    { color: "#9333EA", bg: "rgba(147,51,234,0.1)", border: "rgba(147,51,234,0.2)", grad: "linear-gradient(90deg,#9333EA,#7E22CE)" },
  ],
  "level-new-5": [
    { color: "#26C6DA", bg: "rgba(38,198,218,0.1)", border: "rgba(38,198,218,0.2)", grad: "linear-gradient(90deg,#26C6DA,#0891B2)" },
    { color: "#468BFF", bg: "rgba(70,139,255,0.1)", border: "rgba(70,139,255,0.2)", grad: "linear-gradient(90deg,#468BFF,#2563EB)" },
    { color: "#22D3EE", bg: "rgba(34,211,238,0.1)", border: "rgba(34,211,238,0.2)", grad: "linear-gradient(90deg,#22D3EE,#06B6D4)" },
    { color: "#60A5FA", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.2)", grad: "linear-gradient(90deg,#60A5FA,#3B82F6)" },
    { color: "#67E8F9", bg: "rgba(103,232,249,0.1)", border: "rgba(103,232,249,0.2)", grad: "linear-gradient(90deg,#67E8F9,#22D3EE)" },
    { color: "#0EA5E9", bg: "rgba(14,165,233,0.1)", border: "rgba(14,165,233,0.2)", grad: "linear-gradient(90deg,#0EA5E9,#0284C7)" },
    { color: "#7DD3FC", bg: "rgba(125,211,252,0.1)", border: "rgba(125,211,252,0.2)", grad: "linear-gradient(90deg,#7DD3FC,#0EA5E9)" },
    { color: "#3B82F6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)", grad: "linear-gradient(90deg,#3B82F6,#2563EB)" },
    { color: "#06B6D4", bg: "rgba(6,182,212,0.1)", border: "rgba(6,182,212,0.2)", grad: "linear-gradient(90deg,#06B6D4,#0891B2)" },
    { color: "#0284C7", bg: "rgba(2,132,199,0.1)", border: "rgba(2,132,199,0.2)", grad: "linear-gradient(90deg,#0284C7,#075985)" },
  ],
  "level-new-6": [
    { color: "#FB923C", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.2)", grad: "linear-gradient(90deg,#FB923C,#F97316)" },
    { color: "#F97316", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.2)", grad: "linear-gradient(90deg,#F97316,#EA580C)" },
    { color: "#FDBA74", bg: "rgba(253,186,116,0.1)", border: "rgba(253,186,116,0.2)", grad: "linear-gradient(90deg,#FDBA74,#FB923C)" },
    { color: "#EA580C", bg: "rgba(234,88,12,0.1)", border: "rgba(234,88,12,0.2)", grad: "linear-gradient(90deg,#EA580C,#C2410C)" },
    { color: "#FDE68A", bg: "rgba(253,230,138,0.1)", border: "rgba(253,230,138,0.2)", grad: "linear-gradient(90deg,#FDE68A,#FCD34D)" },
    { color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)", grad: "linear-gradient(90deg,#F59E0B,#D97706)" },
    { color: "#FCD34D", bg: "rgba(252,211,77,0.1)", border: "rgba(252,211,77,0.2)", grad: "linear-gradient(90deg,#FCD34D,#FBBF24)" },
    { color: "#C2410C", bg: "rgba(194,65,12,0.1)", border: "rgba(194,65,12,0.2)", grad: "linear-gradient(90deg,#C2410C,#9A3412)" },
    { color: "#D97706", bg: "rgba(217,119,6,0.1)", border: "rgba(217,119,6,0.2)", grad: "linear-gradient(90deg,#D97706,#B45309)" },
    { color: "#9A3412", bg: "rgba(154,52,18,0.1)", border: "rgba(154,52,18,0.2)", grad: "linear-gradient(90deg,#9A3412,#7C2D12)" },
  ],
  "level-new-7": [
    { color: "#34D399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)", grad: "linear-gradient(90deg,#34D399,#10B981)" },
    { color: "#4ADE80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.2)", grad: "linear-gradient(90deg,#4ADE80,#22C55E)" },
    { color: "#22C55E", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)", grad: "linear-gradient(90deg,#22C55E,#16A34A)" },
    { color: "#86EFAC", bg: "rgba(134,239,172,0.1)", border: "rgba(134,239,172,0.2)", grad: "linear-gradient(90deg,#86EFAC,#4ADE80)" },
    { color: "#10B981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)", grad: "linear-gradient(90deg,#10B981,#059669)" },
    { color: "#16A34A", bg: "rgba(22,163,74,0.1)", border: "rgba(22,163,74,0.2)", grad: "linear-gradient(90deg,#16A34A,#15803D)" },
    { color: "#6EE7B7", bg: "rgba(110,231,183,0.1)", border: "rgba(110,231,183,0.2)", grad: "linear-gradient(90deg,#6EE7B7,#34D399)" },
    { color: "#059669", bg: "rgba(5,150,105,0.1)", border: "rgba(5,150,105,0.2)", grad: "linear-gradient(90deg,#059669,#047857)" },
    { color: "#15803D", bg: "rgba(21,128,61,0.1)", border: "rgba(21,128,61,0.2)", grad: "linear-gradient(90deg,#15803D,#166534)" },
    { color: "#047857", bg: "rgba(4,120,87,0.1)", border: "rgba(4,120,87,0.2)", grad: "linear-gradient(90deg,#047857,#065F46)" },
  ],
  "level-new-8": [
    { color: "#F472B6", bg: "rgba(244,114,182,0.1)", border: "rgba(244,114,182,0.2)", grad: "linear-gradient(90deg,#F472B6,#EC4899)" },
    { color: "#EC4899", bg: "rgba(236,72,153,0.1)", border: "rgba(236,72,153,0.2)", grad: "linear-gradient(90deg,#EC4899,#DB2777)" },
    { color: "#7B61FF", bg: "rgba(123,97,255,0.1)", border: "rgba(123,97,255,0.2)", grad: "linear-gradient(90deg,#7B61FF,#6366F1)" },
    { color: "#FBCFE8", bg: "rgba(251,207,232,0.1)", border: "rgba(251,207,232,0.2)", grad: "linear-gradient(90deg,#FBCFE8,#F9A8D4)" },
    { color: "#DB2777", bg: "rgba(219,39,119,0.1)", border: "rgba(219,39,119,0.2)", grad: "linear-gradient(90deg,#DB2777,#BE185D)" },
    { color: "#818CF8", bg: "rgba(123,97,255,0.1)", border: "rgba(123,97,255,0.2)", grad: "linear-gradient(90deg,#818CF8,#6366F1)" },
    { color: "#F9A8D4", bg: "rgba(249,168,212,0.1)", border: "rgba(249,168,212,0.2)", grad: "linear-gradient(90deg,#F9A8D4,#F472B6)" },
    { color: "#BE185D", bg: "rgba(190,24,93,0.1)", border: "rgba(190,24,93,0.2)", grad: "linear-gradient(90deg,#BE185D,#9D174D)" },
    { color: "#6366F1", bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.2)", grad: "linear-gradient(90deg,#6366F1,#4F46E5)" },
    { color: "#9D174D", bg: "rgba(157,23,77,0.1)", border: "rgba(157,23,77,0.2)", grad: "linear-gradient(90deg,#9D174D,#831843)" },
  ],
};
const WORLD_ICONS: Record<string, ReactElement> = {
  "🎯": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.5" fill="currentColor"/><circle cx="20" cy="4" r="1.3" fill="currentColor" stroke="none"/></svg>,
  "🧠": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 4.5c-2 0-3.5 1.5-3.5 3.5-1.3.4-2 1.6-2 3s.7 2.7 2 3.1c0 2.1 1.5 3.9 3.5 3.9M8.5 4.5c1.3 0 2.4.7 3 1.7M8.5 4.5v13.5M15.5 4.5c2 0 3.5 1.5 3.5 3.5 1.3.4 2 1.6 2 3s-.7 2.7-2 3.1c0 2.1-1.5 3.9-3.5 3.9M15.5 4.5c-1.3 0-2.4.7-3 1.7M15.5 4.5v13.5"/><circle cx="12" cy="12" r="0.6" fill="currentColor" stroke="none"/></svg>,
  "📚": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6.5C10.3 5 8 4 5.5 4A1.5 1.5 0 0 0 4 5.5v12A1.5 1.5 0 0 1 5.5 16c2 0 4 .8 5.5 2"/><path d="M12 6.5c1.7-1.5 4-2.5 6.5-2.5A1.5 1.5 0 0 1 20 5.5v12A1.5 1.5 0 0 0 18.5 16c-2 0-4 .8-5.5 2"/><path d="M12 6.5V18"/></svg>,
  "✍️": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20l0.9-3.8L15.3 5.8a1.4 1.4 0 0 1 2 0l0.9.9a1.4 1.4 0 0 1 0 2L7.8 19.1 4 20Z"/><path d="M13.3 7.5L16.5 10.7"/><circle cx="19.5" cy="4.5" r="1" fill="currentColor" stroke="none"/></svg>,
  "🔍": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="10.5" cy="10.5" r="6"/><path d="M19.5 19.5L15 15"/><circle cx="10.5" cy="10.5" r="1.8"/></svg>,
  "🎨": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3.5C7.3 3.5 3.5 7.3 3.5 12c0 4.4 3.6 8.5 8.5 8.5.9 0 1.3-.5 1.3-1.1 0-.4-.1-.7-.4-.9-.2-.3-.4-.6-.4-.9 0-.6.5-1.1 1.1-1.1h1.4c3 0 5.5-2.5 5.5-5.5 0-4.1-3.6-7.5-8.5-7.5Z"/><circle cx="8" cy="10.5" r="1" fill="currentColor" stroke="none"/><circle cx="10.5" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="7.5" r="1" fill="currentColor" stroke="none"/></svg>,
  "🎵": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="8.5" cy="17" r="2.3"/><circle cx="17" cy="15" r="2.3"/><path d="M10.8 17V6L19.3 4.5V12.7"/></svg>,
  "⚡": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 3L5.5 13H10l-1 8L18 11h-4.5l-.5-8Z"/></svg>,
  "🚀": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.5c2.8 1.6 4.5 4.9 4.5 8.3 0 1.9-.6 3.6-1.6 5L12 19l-2.9-3.2c-1-1.4-1.6-3.1-1.6-5 0-3.4 1.7-6.7 4.5-8.3Z"/><circle cx="12" cy="10.5" r="1.5"/><path d="M8.8 16.2L6.5 20.5l3-1.3M15.2 16.2l2.3 4.3-3-1.3"/></svg>,
  "🏆": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4.5h10v4.5a5 5 0 0 1-10 0V4.5Z"/><path d="M7 6H4.8A1.3 1.3 0 0 0 3.5 7.3v.4a3.2 3.2 0 0 0 3.2 3.2H7M17 6h2.2a1.3 1.3 0 0 1 1.3 1.3v.4a3.2 3.2 0 0 1-3.2 3.2H17"/><path d="M12 13.5v3M9.2 19.5h5.6c-.1-1.5-.5-2.3-1-2.7h-3.6c-.5.4-.9 1.2-1 2.7Z"/></svg>,
  "🔬": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3.5v6L6.3 16.8A2.3 2.3 0 0 0 8.3 20.2h7.4a2.3 2.3 0 0 0 2-3.4L14 9.5v-6"/><path d="M8.7 3.5h6.6M7.5 15h9"/><circle cx="12" cy="17.3" r="0.6" fill="currentColor" stroke="none"/></svg>,
  "🧭": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M15.2 8.8l-1.7 5.1-5.1 1.7 1.7-5.1 5.1-1.7Z"/></svg>,
  "🧩": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4.2h3.6a1.4 1.4 0 0 1 1.3 2 1.4 1.4 0 0 0 1.3 2h3.6v3.6a1.4 1.4 0 0 0-2 1.3 1.4 1.4 0 0 0 2 1.3v3.6h-3.6a1.4 1.4 0 0 0-1.3 2 1.4 1.4 0 0 1-2 1.3H9v-3.6a1.4 1.4 0 0 0-2-1.3A1.4 1.4 0 0 1 5.7 15v-3.6h3.6a1.4 1.4 0 0 0 1.3-2A1.4 1.4 0 0 1 9 8.2V4.2Z"/></svg>,
  "🕸️": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none"/><circle cx="5" cy="5" r="1.5"/><circle cx="19" cy="5" r="1.5"/><circle cx="5" cy="19" r="1.5"/><circle cx="19" cy="19" r="1.5"/><path d="M6.3 6.3L10.3 10.3M17.7 6.3L13.7 10.3M6.3 17.7L10.3 13.7M17.7 17.7L13.7 13.7"/></svg>,
  "🎲": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="8.3" cy="8.3" r="0.9" fill="currentColor" stroke="none"/><circle cx="15.7" cy="8.3" r="0.9" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none"/><circle cx="8.3" cy="15.7" r="0.9" fill="currentColor" stroke="none"/><circle cx="15.7" cy="15.7" r="0.9" fill="currentColor" stroke="none"/></svg>,
  "🪞": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3.5c-3.6 0-6.5 3-6.5 7.3C5.5 15 8 18.5 12 21c4-2.5 6.5-6 6.5-10.2 0-4.3-2.9-7.3-6.5-7.3Z"/><path d="M9.3 20.5h5.4"/></svg>,
  "📊": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 20V11M12 20V4M19 20v-6.5"/><circle cx="19" cy="10.5" r="1.1" fill="currentColor" stroke="none"/></svg>,
  "⚖️": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v17M8.3 20h7.4"/><circle cx="12" cy="4.5" r="1.3" fill="currentColor" stroke="none"/><path d="M12 6.5L5.5 9l3.3 5.8L12 6.5ZM12 6.5l6.5 2.5-3.3 5.8L12 6.5Z"/></svg>,
  "💡": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9.3 18h5.4M10.2 21h3.6M8 13.6a4.3 4.3 0 1 1 8 0c-.7.9-1.2 1.6-1.2 2.9H9.2c0-1.3-.5-2-1.2-2.9Z"/><circle cx="12" cy="4" r="0.5" fill="currentColor" stroke="none"/></svg>,
  "🗣️": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 6.8A2.3 2.3 0 0 1 6.8 4.5h10.4a2.3 2.3 0 0 1 2.3 2.3v5.4a2.3 2.3 0 0 1-2.3 2.3H10L5.8 18v-3.5H6.8a2.3 2.3 0 0 1-2.3-2.3V6.8Z"/><circle cx="8.5" cy="9.5" r="0.6" fill="currentColor" stroke="none"/><circle cx="12" cy="9.5" r="0.6" fill="currentColor" stroke="none"/><circle cx="15.5" cy="9.5" r="0.6" fill="currentColor" stroke="none"/></svg>,
  "🛠️": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 6.2a3.5 3.5 0 0 0-4.6 4.3L4.5 15.9v3.6h3.6l5.4-5.4a3.5 3.5 0 0 0 4.3-4.6L15.5 12l-3.5-3.5 2.5-2.3Z"/></svg>,
  "✅": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><path d="M8.5 12.3l2.3 2.3 4.7-5"/></svg>,
  "💻": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="10.5" rx="1.8"/><path d="M2 19.3h20M9.5 15.5v3.3M14.5 15.5v3.3"/><path d="M9 10l-1.7 1.7L9 13.4M15 10l1.7 1.7L15 13.4"/></svg>,
  "📣": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10.2v3.4a1 1 0 0 0 1 1h.9l1.4 4.9H9l-.9-4.9h1.4L17 18V6l-7.5 2.8H5a1 1 0 0 0-1 1Z"/><path d="M18 8.3c1.1.6 1.9 1.9 1.9 3.4s-.8 2.8-1.9 3.4"/></svg>,
  "🔄": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 12a7.5 7.5 0 0 1 12.8-5.3L19.5 8.5"/><path d="M19.5 4v4.5H15"/><path d="M19.5 12a7.5 7.5 0 0 1-12.8 5.3L4.5 15.5"/><path d="M4.5 20v-4.5H9"/></svg>,
  "📜": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h9a2.5 2.5 0 0 1 2.5 2.5V19a1.5 1.5 0 0 1-1.5 1.5H8A2.5 2.5 0 0 1 5.5 18V5.5A1.5 1.5 0 0 1 7 4"/><circle cx="6.2" cy="4.2" r="1.4"/><circle cx="6.2" cy="19.8" r="1.4"/><path d="M9 9h6M9 12.5h6M9 16h3.5"/></svg>,
  "🤖": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="9" width="14" height="10" rx="3"/><path d="M12 9V5.5"/><circle cx="12" cy="4" r="1.2" fill="currentColor" stroke="none"/><circle cx="9" cy="14" r="1.1" fill="currentColor" stroke="none"/><circle cx="15" cy="14" r="1.1" fill="currentColor" stroke="none"/><path d="M9 17.5h6M2.5 12.5v3M21.5 12.5v3"/></svg>,
  "🎮": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 8h10a4 4 0 0 1 4 4.5l-.6 3.3a2 2 0 0 1-3.5 1L15 15H9l-1.9 1.8a2 2 0 0 1-3.5-1L3 12.5A4 4 0 0 1 7 8Z"/><path d="M8 11v3M6.5 12.5h3"/><circle cx="17" cy="11.5" r="0.8" fill="currentColor" stroke="none"/><circle cx="15.3" cy="13.2" r="0.8" fill="currentColor" stroke="none"/></svg>,
  "💊": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4.5" y="9" width="15" height="6" rx="3" transform="rotate(-45 12 12)"/><path d="M9.5 9.5L14.5 14.5"/></svg>,
  "🚗": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 15.5V12l1.8-4.2A2 2 0 0 1 8.1 6.5h7.8a2 2 0 0 1 1.8 1.3L19.5 12v3.5"/><path d="M4.5 15.5h15v2a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-1h-9v1a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1v-2Z"/><circle cx="8" cy="15.5" r="1.3"/><circle cx="16" cy="15.5" r="1.3"/><path d="M6.5 11h11"/></svg>,
  "🌱": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21V11"/><path d="M12 12c0-3.5-2.5-6-7-6.5C5.3 10 7.5 12.3 12 12Z"/><path d="M12 9c0-2.8 2-4.8 5.5-5.2C17.8 7.3 16 9.3 12 9Z"/></svg>,
  "🌍": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2.3 2.2 3.7 5 3.7 8s-1.4 5.8-3.7 8c-2.3-2.2-3.7-5-3.7-8s1.4-5.8 3.7-8Z"/></svg>,
  "🏗️": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V10l5-2.5V20M9 20V4.5L14 2v18M14 20V9l5-1.5V20"/><path d="M3 20h18"/></svg>,
  "🎓": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 9L12 4.5 21.5 9 12 13.5 2.5 9Z"/><path d="M6.5 11v5c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-5"/><path d="M21.5 9v6"/></svg>,
  "▶": <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5.5v13l11-6.5-11-6.5Z"/></svg>,
  "📖": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6.5C10.3 5 8 4.2 5.5 4.2A1.3 1.3 0 0 0 4.2 5.5v11.8c2.3 0 4.6.7 6.3 2M12 6.5c1.7-1.5 4-2.3 6.5-2.3a1.3 1.3 0 0 1 1.3 1.3v11.8c-2.3 0-4.6.7-6.3 2M12 6.5v13"/></svg>,
  "💪": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2.5" y="9.5" width="3" height="6" rx="1"/><rect x="18.5" y="9.5" width="3" height="6" rx="1"/><path d="M5.5 10v5M18.5 10v5"/><rect x="8" y="10.5" width="8" height="4" rx="0.8"/></svg>,
};
function renderWorldIcon(emoji: string, size = 20) {
  const icon = WORLD_ICONS[emoji];
  if (icon) return icon;
  return <span style={{ fontSize: `${size}px` }}>{emoji}</span>;
}

function getV(order: number, levelIdForColor?: string) {
  const palette = LEVEL_PALETTES[levelIdForColor || "level-1"] ?? LEVEL_PALETTES["level-1"];
  if (order === 0) return palette[0];
  return palette[((order - 1) % (palette.length - 1)) + 1];
}

function NavBar({ active }: { active: string }) {
  const ACCENT = "#7B61FF";
  const items = [
    { href: "/dashboard", label: "Inicio", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 10.5L12 3L21 10.5V20C21 20.6 20.6 21 20 21H15V15H9V21H4C3.4 21 3 20.6 3 20V10.5Z" strokeWidth="1.8" strokeLinejoin="round"/></svg> },
    { href: "/worlds", label: "Mundos", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="8.5" strokeWidth="1.8"/><ellipse cx="12" cy="12" rx="3.5" ry="8.5" strokeWidth="1.5"/><path d="M4 9.5H20M4 14.5H20" strokeWidth="1.3" strokeLinecap="round"/></svg> },
    { href: "/vy", label: "ZAI", icon: <svg width="18" height="18" viewBox="0 0 24 24"><defs><radialGradient id="zaiOrbNav" cx="35%" cy="30%" r="75%"><stop offset="0%" stopColor="#C4B5FD"/><stop offset="50%" stopColor="#7B61FF"/><stop offset="100%" stopColor="#4C3AA8"/></radialGradient></defs><circle cx="12" cy="12" r="10" fill="url(#zaiOrbNav)"/><path d="M8.5 8.2H15.5L8.5 15.8H15.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg> },
    { href: "/community", label: "Liga", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="9" y="10" width="6" height="12" rx="1" strokeWidth="1.8"/><rect x="2" y="14" width="6" height="8" rx="1" strokeWidth="1.5"/><rect x="16" y="16" width="6" height="6" rx="1" strokeWidth="1.5"/></svg> },
    { href: "/profile", label: "Perfil", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2L20.5 7V17L12 22L3.5 17V7L12 2Z" strokeWidth="1.8" strokeLinejoin="round"/><circle cx="12" cy="9.5" r="2.5" strokeWidth="1.5"/></svg> },
  ];
  return (
    <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(15,20,32,0.96)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid #2A3445", display: "flex", padding: "6px 0" }}>
      {items.map(({ href, label, icon }) => {
        const isActive = href === active;
        return (
          <Link key={href} href={href} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", textDecoration: "none", padding: "4px 0" }}>
            <div style={{ width: "40px", height: "40px", background: isActive ? `${ACCENT}20` : "transparent", border: isActive ? `1px solid ${ACCENT}40` : "1px solid transparent", borderRadius: "13px", display: "flex", alignItems: "center", justifyContent: "center", color: isActive ? ACCENT : "#7E8798" }}>{icon}</div>
            <span style={{ fontSize: "8px", fontFamily: isActive ? "'Syne',sans-serif" : "'DM Sans',sans-serif", fontWeight: isActive ? 800 : 500, color: isActive ? ACCENT : "#7E8798", letterSpacing: isActive ? "0.5px" : "0" }}>{isActive ? label.toUpperCase() : label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function WorldsContent() {
  const searchParams = useSearchParams();
  const worldId = searchParams.get("id");
  const levelIdParam = searchParams.get("levelId");
  const levelId = levelIdParam || "level-1";
  const showJourney = !worldId && !levelIdParam;
  const levelNames: Record<string, string> = {
    "level-1": "Nivel 0 — Origins",
    "level-new-1": "Nivel 1 — AI Explorer",
    "level-new-2": "Nivel 2 — AI Thinker",
    "level-new-3": "Nivel 3 — AI Creator",
    "level-new-4": "Nivel 4 — AI Builder",
    "level-new-5": "Nivel 5 — AI Architect",
    "level-new-6": "Nivel 6 — AI Founder",
    "level-new-7": "Nivel 7 — AI Researcher",
    "level-new-8": "Nivel 8 — AI Residency",
  };
  const [worlds, setWorlds] = useState<World[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("STARTER");
  const [evalMode, setEvalMode] = useState(false);

  useEffect(() => {
    fetch("/api/user").then(r => r.ok ? r.json() : null).then(d => {
      if (d?.user?.subscription?.plan) setPlan(d.user.subscription.plan);
      if (d?.evalMode) setEvalMode(true);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (showJourney) {
          // Journey no necesita datos de mundos, solo el plan (ya cargado aparte)
        } else if (worldId) {
          const lessonsRes = await fetch(`/api/lessons?worldId=${worldId}`);
          let realLevelId = levelId;
          if (lessonsRes.ok) {
            const d = await lessonsRes.json();
            setLessons(d.lessons ?? []);
            if (d.world) { setSelectedWorld(d.world); if (d.world.levelId) realLevelId = d.world.levelId; }
          }
          const worldsRes = await fetch(`/api/lessons?levelId=${realLevelId}`);
          if (worldsRes.ok) {
            const d = await worldsRes.json();
            setWorlds(d.worlds ?? []);
          }
        } else {
          const res = await fetch(`/api/lessons?levelId=${levelId}`);
          if (res.ok) { const d = await res.json(); setWorlds(d.worlds ?? []); }
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [worldId, levelId, showJourney]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0F1420", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", fontFamily: "'DM Sans',sans-serif" }}>Cargando...</p>
    </div>
  );

  // Vista de lecciones
  if (worldId && lessons.length > 0) {
    const completed = lessons.filter(l => l.progress?.completed).length;
    const pct = lessons.length > 0 ? (completed / lessons.length) * 100 : 0;
    const v = selectedWorld ? getV(selectedWorld.order, levelId) : getV(1, levelId);

    return (
      <div style={{ minHeight: "100vh", background: "#0F1420", paddingBottom: "88px" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(15,20,32,0.93)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(123,97,255,0.1)", padding: "11px 16px" }}>
          <Link href={`/worlds?levelId=${selectedWorld?.levelId ?? levelId}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", fontSize: "18px", textDecoration: "none" }}>←</Link>
        </div>

        {/* Tarjeta del mundo — misma tarjeta morada que Dashboard y Level Screen */}
        <div style={{ padding: "18px 16px 4px" }}>
          <div style={{ background: "linear-gradient(160deg, #2A1F5C, #1A1440 60%, #0F1420)", border: "1px solid rgba(123,97,255,0.35)", borderRadius: "22px", padding: "18px", display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ width: "56px", height: "56px", borderRadius: "18px", background: v.bg, border: `1px solid ${v.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: v.color, flexShrink: 0 }}>{renderWorldIcon(selectedWorld?.emoji ?? "🌍", 26)}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", marginBottom: "2px" }}>{LEVEL_NAMES[selectedWorld?.levelId ?? levelId] ?? ""}</p>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#F8FAFF", fontSize: "18px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "6px" }}>{selectedWorld?.name ?? "Mundo"}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden", maxWidth: "160px" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#8B75FF,#468BFF)", borderRadius: "4px", transition: "width 0.8s ease" }} />
                </div>
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>{lessons.length} lecciones · {Math.round(pct)}%</span>
              </div>
            </div>
          </div>
        </div>

        {worlds.length > 0 && (
          <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(123,97,255,0.08)", overflowX: "auto", display: "flex", gap: "6px" }}>
            {worlds.map(w => {
              const isActive = w.id === worldId;
              const wv = getV(w.order, levelId);
              return (
                <Link key={w.id} href={`/worlds?id=${w.id}`} style={{ textDecoration: "none", flexShrink: 0 }}>
                  <div style={{ padding: "5px 12px", borderRadius: "20px", border: isActive ? `1px solid ${wv.color}50` : "1px solid rgba(123,97,255,0.1)", background: isActive ? wv.bg : "rgba(123,97,255,0.04)", color: isActive ? wv.color : "rgba(255,255,255,0.25)", fontSize: "11px", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ display: "flex" }}>{renderWorldIcon(w.emoji, 16)}</span><span>{w.name}</span>
                    {Math.round((w.pctComplete ?? 0) * 100) >= 100 && <span style={{ color: "#34D399" }}>✓</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "9px" }}>
          {lessons.map((lesson, i) => {
            const done = lesson.progress?.completed ?? false;
            const isNext = !done && lessons.slice(0, i).every(l => l.progress?.completed);
            const typeCfg = TYPE_CONFIG[lesson.type] ?? TYPE_CONFIG.READING;
            return (
              <Link key={lesson.id} href={`/lesson/${lesson.id}`} style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "18px", background: done ? "rgba(52,211,153,0.05)" : isNext ? v.bg : "rgba(123,97,255,0.04)", border: done ? "1px solid rgba(52,211,153,0.18)" : isNext ? `1px solid ${v.border}` : "1px solid rgba(123,97,255,0.08)" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "11px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: done ? "rgba(52,211,153,0.12)" : typeCfg.bg, border: `1px solid ${done ? "rgba(52,211,153,0.2)" : typeCfg.color + "30"}`, fontFamily: "'Syne',sans-serif", fontSize: done ? "14px" : "16px", fontWeight: 800, color: done ? "#34D399" : typeCfg.color }}>
                    {done ? "✓" : renderWorldIcon(typeCfg.icon, 16)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "15px", fontWeight: 600, color: done ? "#34D399" : "#fff", marginBottom: "3px", fontFamily: "'DM Sans',sans-serif" }}>{lesson.title}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 6px", borderRadius: "6px", background: typeCfg.bg, color: typeCfg.color, fontFamily: "'DM Sans',sans-serif" }}>{typeCfg.label}</span>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif" }}>{lesson.durationMin} min</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: 800, color: done ? "rgba(255,255,255,0.3)" : "#FB923C", fontFamily: "'Syne',sans-serif" }}>{done ? "✓" : `+${lesson.xpReward}`}</p>
                    <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>{done ? "listo" : isNext ? "▶ Siguiente" : "XP"}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <NavBar active="/worlds" />
      </div>
    );
  }

  // Vista Journey — solo Levels, sin Worlds
  if (showJourney) {
    const LEVELS = [
      { id: "level-1", label: "Origins", icon: "🌱", desc: "Descubre qué es la IA y aprende a aprender con ella.", free: true },
      { id: "level-new-1", label: "Explorer", icon: "🧭", desc: "Domina las herramientas de IA del día a día.", free: true },
      { id: "level-new-2", label: "Thinker", icon: "🧠", desc: "Desarrolla pensamiento crítico y toma de decisiones.", free: true },
      { id: "level-new-3", label: "Creator", icon: "🎨", desc: "Convierte ideas en productos reales.", free: true },
      { id: "level-new-4", label: "Builder", icon: "🛠️", desc: "Construye sistemas de IA listos para producción.", free: false },
      { id: "level-new-5", label: "Architect", icon: "🏗️", desc: "Diseña arquitecturas de IA a gran escala.", free: false },
      { id: "level-new-6", label: "Founder", icon: "🚀", desc: "Crea y escala tu propia organización.", free: false },
      { id: "level-new-7", label: "Researcher", icon: "🔬", desc: "Investiga con rigor científico en IA.", free: false },
      { id: "level-new-8", label: "Residency", icon: "🎓", desc: "Aplica todo en un entorno real, con impacto real.", free: false },
    ];
    return (
      <div style={{ minHeight: "100vh", background: "#0F1420", paddingBottom: "88px" }}>
        {evalMode && <div style={{ position: "fixed", top: "8px", right: "8px", zIndex: 100, background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.4)", color: "#FB923C", fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "8px", fontFamily: "'DM Sans',sans-serif" }}>Founder Review Mode</div>}
        <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(15,20,32,0.93)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(123,97,255,0.1)", padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link href="/dashboard" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", fontSize: "18px", textDecoration: "none" }}>←</Link>
            <div>
              <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#fff", fontSize: "18px" }}>Tu camino en Bymyzai</h1>
              <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans',sans-serif" }}>9 niveles</p>
            </div>
          </div>
        </div>

        <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {LEVELS.map((lvl, i) => {
            const locked = !lvl.free && plan === "STARTER" && !evalMode;
            const lv = getV(0, lvl.id);
            const content = (
              <div style={{ background: "#1E2533", border: locked ? "1px solid #324055" : `1px solid ${lv.border}`, borderRadius: "18px", padding: "16px", display: "flex", alignItems: "center", gap: "14px", opacity: locked ? 0.7 : 1 }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: locked ? "rgba(255,255,255,0.04)" : lv.bg, border: locked ? "1px solid rgba(255,255,255,0.08)" : `1px solid ${lv.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: locked ? "rgba(255,255,255,0.3)" : lv.color, flexShrink: 0, fontSize: "22px" }}>
                  {locked ? "🔒" : renderWorldIcon(lvl.icon, 24)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "15px", color: locked ? "rgba(255,255,255,0.5)" : "#F8FAFF", marginBottom: "3px" }}>
                    {lvl.label}{locked && <span style={{ fontSize: "10px", fontWeight: 700, color: "#A78BFA", marginLeft: "8px" }}>🔒 Pro</span>}
                  </p>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.4 }}>{lvl.desc}</p>
                </div>
                <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>›</span>
              </div>
            );
            return locked
              ? <Link key={lvl.id} href="/pricing" style={{ textDecoration: "none" }} title="Disponible en el plan Pro">{content}</Link>
              : <Link key={lvl.id} href={`/worlds?levelId=${lvl.id}`} style={{ textDecoration: "none" }}>{content}</Link>;
          })}
        </div>
        <NavBar active="/worlds" />
      </div>
    );
  }

  // Vista de mundos con iconos coloridos (Level Screen)
  const LEVEL_DESC: Record<string, { desc: string; icon: string; free: boolean }> = {
    "level-1": { desc: "Descubre qué es la IA y aprende a aprender con ella.", icon: "🌱", free: true },
    "level-new-1": { desc: "Domina las herramientas de IA del día a día.", icon: "🧭", free: true },
    "level-new-2": { desc: "Desarrolla pensamiento crítico y toma de decisiones.", icon: "🧠", free: true },
    "level-new-3": { desc: "Convierte ideas en productos reales.", icon: "🎨", free: true },
    "level-new-4": { desc: "Construye sistemas de IA listos para producción.", icon: "🛠️", free: false },
    "level-new-5": { desc: "Diseña arquitecturas de IA a gran escala.", icon: "🏗️", free: false },
    "level-new-6": { desc: "Crea y escala tu propia organización.", icon: "🚀", free: false },
    "level-new-7": { desc: "Investiga con rigor científico en IA.", icon: "🔬", free: false },
    "level-new-8": { desc: "Aplica todo en un entorno real, con impacto real.", icon: "🎓", free: false },
  };
  const currentLevelInfo = LEVEL_DESC[levelId] ?? LEVEL_DESC["level-1"];
  const worldsDoneCount = worlds.filter(w => Math.round((w.pctComplete ?? 0) * 100) >= 100).length;
  const levelV = getV(0, levelId);
  return (
    <div style={{ minHeight: "100vh", background: "#0F1420", paddingBottom: "88px" }}>
      {evalMode && <div style={{ position: "fixed", top: "8px", right: "8px", zIndex: 100, background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.4)", color: "#FB923C", fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "8px", fontFamily: "'DM Sans',sans-serif" }}>Founder Review Mode</div>}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(15,20,32,0.93)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(123,97,255,0.1)", padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link href="/worlds" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", fontSize: "18px", textDecoration: "none" }}>←</Link>
        </div>
      </div>

      {/* Ilustración + descripción + progreso del nivel — misma tarjeta que Dashboard */}
      <div style={{ padding: "18px 16px 4px" }}>
        <div style={{ background: "linear-gradient(160deg, #2A1F5C, #1A1440 60%, #0F1420)", border: "1px solid rgba(123,97,255,0.35)", borderRadius: "22px", padding: "18px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "18px", background: levelV.bg, border: `1px solid ${levelV.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: levelV.color, flexShrink: 0, fontSize: "26px" }}>
            {renderWorldIcon(currentLevelInfo.icon, 28)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, color: "#F8FAFF", fontSize: "18px", lineHeight: 1.15, marginBottom: "4px" }}>{levelNames[levelId] || "Origins"}</p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.4, marginBottom: "8px" }}>{currentLevelInfo.desc}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden", maxWidth: "160px" }}>
                <div style={{ height: "100%", width: worlds.length > 0 ? `${(worldsDoneCount / worlds.length) * 100}%` : "0%", background: "linear-gradient(90deg,#8B75FF,#468BFF)", borderRadius: "4px" }} />
              </div>
              <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>
                {worldsDoneCount}/{worlds.length} mundos{currentLevelInfo.free ? " · Gratis" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "12px 16px 0" }}>
        {[
          { id: "level-1", label: "Origins", icon: "🌱", free: true },
          { id: "level-new-1", label: "Explorer", icon: "🧭", free: true },
          { id: "level-new-2", label: "Thinker", icon: "🧠", free: true },
          { id: "level-new-3", label: "Creator", icon: "🎨", free: true },
          { id: "level-new-4", label: "Builder", icon: "🛠️", free: false },
          { id: "level-new-5", label: "Architect", icon: "🏗️", free: false },
          { id: "level-new-6", label: "Founder", icon: "🚀", free: false },
          { id: "level-new-7", label: "Researcher", icon: "🔬", free: false },
          { id: "level-new-8", label: "Residency", icon: "🎓", free: false },
        ].map((lvl, i) => {
          const locked = !lvl.free && plan === "STARTER" && !evalMode;
          const active = lvl.id === levelId;
          const lv = getV(0, lvl.id);
          const content = (
            <div style={{
              flexShrink: 0, display: "flex", alignItems: "center", gap: "6px", padding: "7px 13px", borderRadius: "999px",
              background: locked ? "rgba(255,255,255,0.04)" : active ? lv.bg : "rgba(123,97,255,0.06)",
              border: locked ? "1px solid rgba(255,255,255,0.08)" : active ? `1px solid ${lv.border}` : "1px solid rgba(123,97,255,0.15)",
              color: locked ? "rgba(255,255,255,0.35)" : active ? lv.color : "rgba(255,255,255,0.55)", fontSize: "12px", fontWeight: 700,
              fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap",
            }}><span style={{ display: "flex" }}>{locked ? <span style={{fontSize:"13px"}}>🔒</span> : renderWorldIcon(lvl.icon, 15)}</span>{lvl.label}{locked && <span style={{ opacity: 0.7 }}>· Pro</span>}</div>
          );
          return locked
            ? <Link key={lvl.id} href="/pricing" style={{ textDecoration: "none" }} title="Disponible en el plan Pro">{content}</Link>
            : <Link key={lvl.id} href={`/worlds?levelId=${lvl.id}`} style={{ textDecoration: "none" }}>{content}</Link>;
        })}
      </div>

      <div style={{ padding: "14px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {(worlds.length > 0 ? worlds : [{ id: "w0", name: "Comienza", emoji: "🚀", description: "", lessonCount: 1, pctComplete: 0, order: 0, slug: "" }]).map(w => {
          const pctW = Math.round((w.pctComplete ?? 0) * 100);
          const done = pctW >= 100;
          const v = getV(w.order, levelId);
          return (
            <Link key={w.id} href={`/worlds?id=${w.id}`} style={{ textDecoration: "none" }}>
              <div style={{ background: "#1E2533", border: "1px solid #324055", borderRadius: "18px", padding: "14px", position: "relative", overflow: "hidden" }}>
                {done && <div style={{ position: "absolute", top: "8px", right: "8px", width: "20px", height: "20px", background: "rgba(52,211,153,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#34D399" }}>✓</div>}
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: v.bg, border: `1px solid ${v.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: v.color, marginBottom: "10px" }}>{renderWorldIcon(w.emoji, 20)}</div>
                <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "13px", color: "#F8FAFF", marginBottom: "8px", lineHeight: 1.3 }}>{w.name}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: pctW > 0 ? "8px" : 0 }}>
                  <p style={{ fontSize: "9px", color: "#7E8798", fontFamily: "'DM Sans',sans-serif" }}>{w.lessonCount} lecciones</p>
                  {pctW > 0 && <span style={{ fontSize: "10px", color: done ? "#34D399" : v.color, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", background: done ? "rgba(52,211,153,0.15)" : v.bg, padding: "1px 7px", borderRadius: "20px" }}>{pctW}%</span>}
                </div>
                {pctW > 0 && (
                  <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pctW}%`, background: "linear-gradient(90deg,#8B75FF,#468BFF)", borderRadius: "4px" }} />
                  </div>
                )}
              </div>
            </Link>
          );
        })}

        <Link href={`/level-resources/${levelId}`} style={{ textDecoration: "none" }}>
          <div style={{ background: "rgba(123,97,255,0.08)", border: "1px dashed rgba(123,97,255,0.35)", borderRadius: "18px", padding: "14px", display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", minHeight: "116px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(123,97,255,0.15)", border: "1px solid rgba(123,97,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A78BFA", marginBottom: "10px", fontSize: "18px" }}>📚</div>
            <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "13px", color: "#F8FAFF", marginBottom: "4px" }}>Profundiza</p>
            <p style={{ fontSize: "9px", color: "#7E8798", fontFamily: "'DM Sans',sans-serif" }}>Recursos extra de este nivel</p>
          </div>
        </Link>
      </div>
      <NavBar active="/worlds" />
    </div>
  );
}

export default function WorldsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0F1420", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif", fontSize: "12px" }}>Cargando...</p></div>}>
      <WorldsContent />
    </Suspense>
  );
}
