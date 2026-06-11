// src/server/routers/content.ts — Levels, Worlds, Lessons with plan gating
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";

const PLAN_ACCESS: Record<string,number[]> = { STARTER:[1], PRO:[1,2,3], PREMIUM:[1,2,3,4], FAMILY:[1,2,3], SCHOOL:[1,2,3], ENTERPRISE:[1,2,3,4] };

export const contentRouter = createTRPCRouter({
  getLevels: publicProcedure.query(({ ctx }) =>
    ctx.prisma.level.findMany({ orderBy: { order: "asc" }, include: { _count: { select: { worlds: true } } } })
  ),
  getWorlds: protectedProcedure.input(z.object({ levelId: z.string() })).query(async ({ ctx, input }) => {
    const level = await ctx.prisma.level.findUnique({ where: { id: input.levelId } });
    if (!level) throw new TRPCError({ code: "NOT_FOUND" });
    const plan = ctx.user!.subscription?.plan ?? "STARTER";
    if (!(PLAN_ACCESS[plan] ?? [1]).includes(level.number))
      throw new TRPCError({ code: "FORBIDDEN", message: "Requiere plan Pro." });
    const worlds = await ctx.prisma.world.findMany({ where: { levelId: input.levelId }, orderBy: { order: "asc" }, include: { _count: { select: { lessons: true } } } });
    const progress = await ctx.prisma.worldProgress.findMany({ where: { userId: ctx.user!.id, worldId: { in: worlds.map(w => w.id) } } });
    const pm = Object.fromEntries(progress.map(p => [p.worldId, p]));
    return worlds.map(w => ({ ...w, progress: pm[w.id] ?? null }));
  }),
  getLessons: protectedProcedure.input(z.object({ worldId: z.string() })).query(async ({ ctx, input }) => {
    const world = await ctx.prisma.world.findUnique({ where: { id: input.worldId }, include: { level: true } });
    if (!world) throw new TRPCError({ code: "NOT_FOUND" });
    const plan = ctx.user!.subscription?.plan ?? "STARTER";
    if (!(PLAN_ACCESS[plan] ?? [1]).includes(world.level.number))
      throw new TRPCError({ code: "FORBIDDEN" });
    const lessons = await ctx.prisma.lesson.findMany({ where: { worldId: input.worldId, isPublished: true }, orderBy: { order: "asc" } });
    const progress = await ctx.prisma.lessonProgress.findMany({ where: { userId: ctx.user!.id, lessonId: { in: lessons.map(l => l.id) } } });
    const pm = Object.fromEntries(progress.map(p => [p.lessonId, p]));
    let nextSet = false;
    return lessons.map(l => { const lp = pm[l.id] ?? null; const isNext = !nextSet && (!lp || !lp.completed); if (isNext) nextSet = true; return { ...l, progress: lp, isNext }; });
  }),
  getLesson: protectedProcedure.input(z.object({ lessonId: z.string() })).query(async ({ ctx, input }) => {
    const lesson = await ctx.prisma.lesson.findUnique({ where: { id: input.lessonId }, include: { world: { include: { level: true } }, quizQuestions: { orderBy: { order: "asc" } } } });
    if (!lesson || !lesson.isPublished) throw new TRPCError({ code: "NOT_FOUND" });
    const progress = await ctx.prisma.lessonProgress.findUnique({ where: { userId_lessonId: { userId: ctx.user!.id, lessonId: input.lessonId } } });
    return { ...lesson, progress };
  }),
  search: protectedProcedure.input(z.object({ query: z.string().min(2) })).query(({ ctx, input }) =>
    ctx.prisma.lesson.findMany({ where: { isPublished: true, OR: [{ title: { contains: input.query, mode: "insensitive" } }, { description: { contains: input.query, mode: "insensitive" } }] }, take: 10, include: { world: { include: { level: true } } } })
  ),
});
