import { initTRPC, TRPCError } from "@trpc/server";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import superjson from "superjson";
import { ZodError } from "zod";

export async function createTRPCContext(opts: FetchCreateContextFnOptions) {
  const { userId: clerkId } = auth();
  let user = null;
  if (clerkId) {
    user = await prisma.user.findUnique({
      where: { clerkId },
      include: { gamification: true, subscription: true },
    });
  }
  return { prisma, clerkId, user, headers: opts.req.headers };
}
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return { ...shape, data: { ...shape.data, zodError: error.cause instanceof ZodError ? error.cause.flatten() : null } };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

const enforceAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.clerkId || !ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx: { ...ctx, clerkId: ctx.clerkId, user: ctx.user } });
});
export const protectedProcedure = t.procedure.use(enforceAuthed);

const enforcePro = t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  const plan = ctx.user.subscription?.plan ?? "STARTER";
  if (!["PRO","PREMIUM","FAMILY","SCHOOL","ENTERPRISE"].includes(plan))
    throw new TRPCError({ code: "FORBIDDEN", message: "Requiere plan Pro." });
  return next({ ctx: { ...ctx, user: ctx.user } });
});
export const proProcedure = protectedProcedure.use(enforcePro);

const enforceInstitution = t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  if (!["SCHOOL","ENTERPRISE"].includes(ctx.user.subscription?.plan ?? ""))
    throw new TRPCError({ code: "FORBIDDEN" });
  return next({ ctx: { ...ctx, user: ctx.user } });
});
export const institutionProcedure = protectedProcedure.use(enforceInstitution);
