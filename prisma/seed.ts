import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding VYZIO...");

  // Levels
  const level1 = await prisma.level.upsert({
    where: { number: 1 },
    update: {},
    create: { number: 1, name: "AI Explorer", slug: "ai-explorer", description: "Comprende la IA y su presencia en el mundo", xpRequired: 0, isFree: true, order: 1 },
  });

  await prisma.level.upsert({ where: { number: 2 }, update: {}, create: { number: 2, name: "AI Creator", slug: "ai-creator", description: "Domina las herramientas de IA para crear", xpRequired: 5000, isFree: false, order: 2 } });
  await prisma.level.upsert({ where: { number: 3 }, update: {}, create: { number: 3, name: "AI Builder", slug: "ai-builder", description: "Construye soluciones reales con IA", xpRequired: 15000, isFree: false, order: 3 } });
  await prisma.level.upsert({ where: { number: 4 }, update: {}, create: { number: 4, name: "AI Entrepreneur", slug: "ai-entrepreneur", description: "Convierte IA en ingresos reales", xpRequired: 50000, isFree: false, order: 4 } });

  // Worlds
  const worlds = [
    { number: 1, name: "Bienvenido al Futuro", slug: "bienvenido-al-futuro", description: "Descubre qué es la IA", emoji: "🌍", order: 1 },
    { number: 2, name: "Historia de la IA", slug: "historia-de-la-ia", description: "De Turing a ChatGPT", emoji: "📜", order: 2 },
    { number: 3, name: "IA en tu Vida", slug: "ia-en-tu-vida", description: "La IA que usas sin saberlo", emoji: "🤖", order: 3 },
    { number: 4, name: "IA en Videojuegos", slug: "ia-en-videojuegos", description: "IA en los juegos", emoji: "🎮", order: 4 },
    { number: 5, name: "IA y Creatividad", slug: "ia-y-creatividad", description: "Genera con IA", emoji: "🎨", order: 5 },
    { number: 6, name: "IA en Música", slug: "ia-en-musica", description: "Audio con IA", emoji: "🎵", order: 6 },
    { number: 7, name: "IA en Salud", slug: "ia-en-salud", description: "IA médica", emoji: "💊", order: 7 },
    { number: 8, name: "IA y Transporte", slug: "ia-y-transporte", description: "Autos autónomos", emoji: "🚗", order: 8 },
    { number: 9, name: "IA y Sostenibilidad", slug: "ia-y-sostenibilidad", description: "IA para el planeta", emoji: "🌱", order: 9 },
    { number: 10, name: "Ética de la IA", slug: "etica-de-la-ia", description: "IA responsable", emoji: "⚖️", order: 10 },
  ];

  for (const w of worlds) {
    await prisma.world.upsert({
      where: { slug: w.slug },
      update: {},
      create: { ...w, xpReward: 500, levelId: level1.id },
    });
  }

  // Achievements
  const achievements = [
    { slug: "first-lesson", name: "Primera lección", emoji: "⚡", rarity: "common", triggerType: "lessons_completed", triggerValue: 1, xpBonus: 0, gemBonus: 5, description: "Completaste tu primera lección" },
    { slug: "lessons-10", name: "10 lecciones", emoji: "🧠", rarity: "common", triggerType: "lessons_completed", triggerValue: 10, xpBonus: 100, gemBonus: 10, description: "Completaste 10 lecciones" },
    { slug: "streak-3", name: "Racha 3 días", emoji: "🔥", rarity: "common", triggerType: "streak_days", triggerValue: 3, xpBonus: 50, gemBonus: 5, description: "3 días de racha" },
    { slug: "streak-7", name: "Racha 7 días", emoji: "🔥", rarity: "uncommon", triggerType: "streak_days", triggerValue: 7, xpBonus: 200, gemBonus: 20, description: "7 días de racha" },
    { slug: "quiz-perfect-1", name: "Quiz perfecto", emoji: "🎯", rarity: "uncommon", triggerType: "quiz_perfect", triggerValue: 1, xpBonus: 150, gemBonus: 15, description: "Quiz correcto al primer intento" },
    { slug: "project-1", name: "Primer proyecto", emoji: "🚀", rarity: "uncommon", triggerType: "projects_published", triggerValue: 1, xpBonus: 200, gemBonus: 20, description: "Publicaste tu primer proyecto" },
    { slug: "xp-1000", name: "1K XP", emoji: "⚙️", rarity: "common", triggerType: "xp_total", triggerValue: 1000, xpBonus: 0, gemBonus: 10, description: "Alcanzaste 1,000 XP" },
  ];

  for (const a of achievements) {
    await prisma.achievement.upsert({ where: { slug: a.slug }, update: {}, create: a });
  }

  // Missions
  const missions = [
    { slug: "daily-2-lessons", name: "Estudia hoy", description: "Completa 2 lecciones hoy", type: "DAILY" as any, xpReward: 150, gemReward: 10, coinReward: 0, targetType: "lessons_today", targetValue: 2, isActive: true },
    { slug: "daily-quiz-perfect", name: "Quiz perfecto", description: "Responde un quiz al primer intento", type: "DAILY" as any, xpReward: 120, gemReward: 10, coinReward: 0, targetType: "quiz_perfect", targetValue: 1, isActive: true },
    { slug: "weekly-10-lessons", name: "10 lecciones", description: "Completa 10 lecciones esta semana", type: "WEEKLY" as any, xpReward: 300, gemReward: 30, coinReward: 10, targetType: "lessons_completed", targetValue: 10, isActive: true },
  ];

  for (const m of missions) {
    await prisma.mission.upsert({ where: { slug: m.slug }, update: {}, create: m });
  }

  console.log("✅ Seed completado exitosamente!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
