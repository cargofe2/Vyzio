"use client";

// Sonidos sintetizados con Web Audio API — cero archivos externos, cero peso.
// Preferencia de sonido (on/off) guardada en localStorage, por dispositivo.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const v = localStorage.getItem("bymyzai_sound");
  return v === null ? true : v === "on";
}

export function setSoundEnabled(on: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem("bymyzai_sound", on ? "on" : "off");
}

function tone(freq: number, start: number, duration: number, type: OscillatorType, gainPeak: number, ac: AudioContext, dest: GainNode) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ac.currentTime + start);
  gain.gain.linearRampToValueAtTime(gainPeak, ac.currentTime + start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + start + duration);
  osc.connect(gain);
  gain.connect(dest);
  osc.start(ac.currentTime + start);
  osc.stop(ac.currentTime + start + duration + 0.02);
}

function play(fn: (ac: AudioContext, dest: GainNode) => void) {
  if (!isSoundEnabled()) return;
  const ac = getCtx();
  if (!ac) return;
  const master = ac.createGain();
  master.gain.value = 0.18;
  master.connect(ac.destination);
  try { fn(ac, master); } catch { /* ignore */ }
}

/** Respuesta correcta: ding ascendente alegre */
export function playCorrect() {
  play((ac, dest) => {
    tone(523.25, 0, 0.14, "sine", 1, ac, dest);
    tone(783.99, 0.08, 0.18, "sine", 1, ac, dest);
  });
}

/** Respuesta incorrecta: buzz suave, no punitivo */
export function playIncorrect() {
  play((ac, dest) => {
    tone(220, 0, 0.16, "triangle", 0.7, ac, dest);
    tone(196, 0.08, 0.18, "triangle", 0.6, ac, dest);
  });
}

/** Lección completada: mini fanfarria */
export function playComplete() {
  play((ac, dest) => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.09, 0.22, "sine", 0.9, ac, dest));
  });
}

/** Ganancia de XP: chispa breve */
export function playXP() {
  play((ac, dest) => {
    tone(1046.5, 0, 0.08, "sine", 0.7, ac, dest);
    tone(1318.5, 0.05, 0.1, "sine", 0.6, ac, dest);
  });
}

/** Subida de rango: la más grande, celebratoria */
export function playRankUp() {
  play((ac, dest) => {
    [392, 523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.1, 0.3, "sine", 1, ac, dest));
  });
}

/** Click de UI: sutil, para botones importantes */
export function playClick() {
  play((ac, dest) => {
    tone(700, 0, 0.05, "sine", 0.4, ac, dest);
  });
}

/** Racha activa: sonido cálido tipo "whoosh" ascendente */
export function playStreak() {
  play((ac, dest) => {
    tone(440, 0, 0.1, "sine", 0.8, ac, dest);
    tone(660, 0.06, 0.14, "sine", 0.9, ac, dest);
    tone(880, 0.12, 0.16, "sine", 0.7, ac, dest);
  });
}
