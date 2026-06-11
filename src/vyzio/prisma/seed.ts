// prisma/seed.ts
// Seeds: Achievements, Daily Missions, Level 1 content (first 30 lessons)
// Run: npx tsx prisma/seed.ts

import { PrismaClient, LessonType, MissionType } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding VYZIO database...");

  // ── Achievements ────────────────────────────────────────────
  const achievements = [
    { slug: "first-lesson",   name: "Primera lección",  emoji: "⚡", rarity: "common",    triggerType: "lessons_completed", triggerValue: 1,   xpBonus: 0,    gemBonus: 5,   description: "Completaste tu primera lección" },
    { slug: "lessons-10",     name: "10 lecciones",     emoji: "🧠", rarity: "common",    triggerType: "lessons_completed", triggerValue: 10,  xpBonus: 100,  gemBonus: 10,  description: "Completaste 10 lecciones" },
    { slug: "lessons-25",     name: "25 lecciones",     emoji: "📚", rarity: "uncommon",  triggerType: "lessons_completed", triggerValue: 25,  xpBonus: 200,  gemBonus: 20,  description: "Completaste 25 lecciones" },
    { slug: "lessons-50",     name: "50 lecciones",     emoji: "🌟", rarity: "uncommon",  triggerType: "lessons_completed", triggerValue: 50,  xpBonus: 300,  gemBonus: 30,  description: "Completaste 50 lecciones" },
    { slug: "lessons-100",    name: "100 lecciones",    emoji: "💯", rarity: "rare",      triggerType: "lessons_completed", triggerValue: 100, xpBonus: 500,  gemBonus: 50,  description: "Completaste 100 lecciones" },
    { slug: "streak-3",       name: "Racha 3 días",     emoji: "🔥", rarity: "common",    triggerType: "streak_days",       triggerValue: 3,   xpBonus: 50,   gemBonus: 5,   description: "3 días de racha" },
    { slug: "streak-7",       name: "Racha 7 días",     emoji: "🔥", rarity: "uncommon",  triggerType: "streak_days",       triggerValue: 7,   xpBonus: 200,  gemBonus: 20,  description: "7 días de racha consecutivos" },
    { slug: "streak-30",      name: "Racha 30 días",    emoji: "🏅", rarity: "rare",      triggerType: "streak_days",       triggerValue: 30,  xpBonus: 500,  gemBonus: 50,  description: "30 días de racha consecutivos" },
    { slug: "streak-100",     name: "Racha 100 días",   emoji: "👑", rarity: "epic",      triggerType: "streak_days",       triggerValue: 100, xpBonus: 2000, gemBonus: 200, description: "100 días de racha — leyenda" },
    { slug: "quiz-perfect-1", name: "Quiz perfecto",    emoji: "🎯", rarity: "uncommon",  triggerType: "quiz_perfect",      triggerValue: 1,   xpBonus: 150,  gemBonus: 15,  description: "Quiz correcto al primer intento" },
    { slug: "quiz-perfect-10",name: "Maestro del quiz", emoji: "🏆", rarity: "rare",      triggerType: "quiz_perfect",      triggerValue: 10,  xpBonus: 300,  gemBonus: 30,  description: "10 quizzes perfectos" },
    { slug: "project-1",      name: "Primer proyecto",  emoji: "🚀", rarity: "uncommon",  triggerType: "projects_published",triggerValue: 1,   xpBonus: 200,  gemBonus: 20,  description: "Publicaste tu primer proyecto" },
    { slug: "project-5",      name: "Creador",          emoji: "🎨", rarity: "rare",      triggerType: "projects_published",triggerValue: 5,   xpBonus: 500,  gemBonus: 50,  description: "5 proyectos publicados" },
    { slug: "xp-1000",        name: "1K XP",            emoji: "⚙️", rarity: "common",    triggerType: "xp_total",          triggerValue: 1000,xpBonus: 0,    gemBonus: 10,  description: "Alcanzaste 1,000 XP" },
    { slug: "xp-10000",       name: "10K XP",           emoji: "💎", rarity: "epic",      triggerType: "xp_total",          triggerValue: 10000,xpBonus: 1000,gemBonus: 100, description: "Alcanzaste 10,000 XP" },
  ];

  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: { slug: a.slug },
      update: a,
      create: a,
    });
  }
  console.log(`✅ ${achievements.length} achievements seeded`);

  // ── Missions ─────────────────────────────────────────────────
  const now = new Date();
  const nextWeek = new Date(now); nextWeek.setDate(now.getDate() + 7);

  const missions = [
    { slug: "daily-2-lessons",   name: "Estudia hoy",          description: "Completa 2 lecciones hoy",              type: MissionType.DAILY,   xpReward: 150, gemReward: 10, coinReward: 0, targetType: "lessons_today",    targetValue: 2 },
    { slug: "weekly-world",      name: "Termina un mundo",     description: "Completa todas las lecciones de un mundo", type: MissionType.WEEKLY,  xpReward: 500, gemReward: 50, coinReward: 20, targetType: "world_complete",   targetValue: 1, endsAt: nextWeek },
    { slug: "weekly-10-lessons", name: "10 lecciones",         description: "Completa 10 lecciones esta semana",       type: MissionType.WEEKLY,  xpReward: 300, gemReward: 30, coinReward: 10, targetType: "lessons_completed",targetValue: 10, endsAt: nextWeek },
    { slug: "daily-streak",      name: "Mantén tu racha",      description: "Estudia sin romper la racha",             type: MissionType.DAILY,   xpReward: 100, gemReward: 5,  coinReward: 0, targetType: "lessons_today",    targetValue: 1 },
    { slug: "daily-quiz-perfect",name: "Quiz perfecto",        description: "Responde un quiz correctamente al primer intento", type: MissionType.DAILY, xpReward: 120, gemReward: 10, coinReward: 0, targetType: "quiz_perfect", targetValue: 1 },
  ];

  for (const m of missions) {
    await prisma.mission.upsert({
      where: { slug: m.slug },
      update: m,
      create: { ...m, isActive: true },
    });
  }
  console.log(`✅ ${missions.length} missions seeded`);

  // ── Level 1 content ──────────────────────────────────────────
  const level1 = await prisma.level.upsert({
    where: { number: 1 },
    update: {},
    create: {
      number: 1, name: "AI Explorer", slug: "ai-explorer",
      description: "Comprende la Inteligencia Artificial y su presencia en el mundo",
      xpRequired: 0, isFree: true, order: 1,
    },
  });

  const world1 = await prisma.world.upsert({
    where: { slug: "bienvenido-al-futuro" },
    update: {},
    create: {
      number: 1, name: "Bienvenido al Futuro", slug: "bienvenido-al-futuro",
      description: "Descubre qué es la IA y cómo ya forma parte de tu vida",
      emoji: "🌍", order: 1, xpReward: 500, levelId: level1.id,
    },
  });

  const world2 = await prisma.world.upsert({
    where: { slug: "historia-de-la-ia" },
    update: {},
    create: {
      number: 2, name: "Historia de la IA", slug: "historia-de-la-ia",
      description: "De Turing a ChatGPT: el viaje de 70 años que cambió el mundo",
      emoji: "📜", order: 2, xpReward: 500, levelId: level1.id,
    },
  });

  // Seed first 15 lessons of World 1
  const world1Lessons = [
    { n: 1,  title: "¿Qué es la Inteligencia Artificial?",          type: LessonType.VIDEO,   min: 5, xp: 60 },
    { n: 2,  title: "IA débil vs IA general: diferencias clave",    type: LessonType.READING, min: 4, xp: 55 },
    { n: 3,  title: "¿Cómo aprende una máquina? Intro al ML",       type: LessonType.VIDEO,   min: 6, xp: 70 },
    { n: 4,  title: "Algoritmos: las instrucciones que siguen las máquinas", type: LessonType.READING, min: 5, xp: 60 },
    { n: 5,  title: "Datos: el combustible de la IA",               type: LessonType.VIDEO,   min: 5, xp: 60 },
    { n: 6,  title: "Redes neuronales en términos simples",         type: LessonType.VIDEO,   min: 6, xp: 75 },
    { n: 7,  title: "¿Qué es el entrenamiento de un modelo?",       type: LessonType.READING, min: 5, xp: 65 },
    { n: 8,  title: "Input y output: cómo la IA procesa información", type: LessonType.READING, min: 4, xp: 55 },
    { n: 9,  title: "Tipos de IA: discriminativa vs generativa",    type: LessonType.VIDEO,   min: 5, xp: 65 },
    { n: 10, title: "¿Puedo hablar con una IA? Chatbots vs asistentes", type: LessonType.VIDEO, min: 5, xp: 60 },
    { n: 11, title: "¿La IA piensa? Mitos y realidades",            type: LessonType.READING, min: 4, xp: 55 },
    { n: 12, title: "¿Qué NO puede hacer la IA (todavía)?",         type: LessonType.READING, min: 4, xp: 55 },
    { n: 13, title: "IA estrecha: ejemplos del mundo real",         type: LessonType.VIDEO,   min: 5, xp: 60 },
    { n: 14, title: "Quiz del Mundo 1 — Fundamentos de IA",         type: LessonType.QUIZ,    min: 8, xp: 100 },
    { n: 15, title: "Proyecto: Mapa mental de IA en mi vida",       type: LessonType.PROJECT, min: 15, xp: 150 },
  ];

  for (const l of world1Lessons) {
    const slug = `w1-l${l.n}-${l.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`;
    await prisma.lesson.upsert({
      where: { slug },
      update: {},
      create: {
        number: l.n, title: l.title, slug,
        type: l.type, durationMin: l.min, xpReward: l.xp,
        order: l.n, isPublished: true, worldId: world1.id,
      },
    });
  }
  console.log(`✅ ${world1Lessons.length} lessons seeded for World 1`);

  // Seed quiz questions for lesson 1
  const lesson1 = await prisma.lesson.findFirst({ where: { worldId: world1.id, number: 1 } });
  if (lesson1) {
    const questions = [
      {
        question: "¿Cuál es la definición más precisa de Inteligencia Artificial?",
        options: [
          "Un robot que imita a los humanos físicamente",
          "Sistemas computacionales que realizan tareas que normalmente requieren inteligencia humana",
          "Software que ejecuta instrucciones automáticamente",
          "Cualquier programa de computadora avanzado",
        ],
        correctIndex: 1,
        explanation: "La IA se define por la capacidad de realizar tareas que requieren inteligencia humana: percepción, razonamiento, aprendizaje y toma de decisiones.",
        order: 1,
      },
      {
        question: "¿Cuál de estos ejemplos es IA en la vida real?",
        options: [
          "Una calculadora que suma números",
          "Un semáforo con temporizador",
          "El algoritmo de TikTok que decide qué videos mostrarte",
          "Un termostato analógico",
        ],
        correctIndex: 2,
        explanation: "El algoritmo de TikTok aprende de tu comportamiento y adapta sus recomendaciones — eso es aprendizaje automático, una rama de la IA.",
        order: 2,
      },
      {
        question: "¿Qué necesita principalmente un sistema de IA para aprender?",
        options: ["Electricidad", "Datos", "Un programador disponible", "Internet rápido"],
        correctIndex: 1,
        explanation: "Los datos son el combustible de la IA. Sin datos históricos para aprender, un modelo de IA no puede mejorar ni hacer predicciones.",
        order: 3,
      },
    ];

    for (const q of questions) {
      await prisma.quizQuestion.create({ data: { ...q, lessonId: lesson1.id } });
    }
    console.log(`✅ Quiz questions seeded for Lesson 1`);
  }

  // Levels 2, 3, 4 (metadata only — content seeded separately)
  const otherLevels = [
    { number: 2, name: "AI Creator",      slug: "ai-creator",      description: "Domina las herramientas de IA para crear y automatizar", xpRequired: 5000,  isFree: false, order: 2 },
    { number: 3, name: "AI Builder",      slug: "ai-builder",      description: "Construye soluciones reales con código y APIs de IA",    xpRequired: 15000, isFree: false, order: 3 },
    { number: 4, name: "AI Entrepreneur", slug: "ai-entrepreneur",  description: "Convierte habilidades de IA en ingresos reales",        xpRequired: 50000, isFree: false, order: 4 },
  ];

  for (const l of otherLevels) {
    await prisma.level.upsert({ where: { number: l.number }, update: {}, create: l });
  }

  console.log("🚀 VYZIO seed completed successfully!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
