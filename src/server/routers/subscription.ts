// src/server/routers/subscription.ts
// Stripe subscriptions: checkout, billing portal, webhook handler

import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { stripe, PRICE_TO_PLAN, getPlanLimits } from "@/lib/stripe";
import { env } from "@/env";
import type Stripe from "stripe";

export const subscriptionRouter = createTRPCRouter({

  // ── Current subscription status ──────────────────────────
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const sub = await ctx.prisma.subscription.findUnique({
      where: { userId: ctx.user!.id },
    });
    return {
      plan: sub?.plan ?? "STARTER",
      status: sub?.status ?? "ACTIVE",
      currentPeriodEnd: sub?.currentPeriodEnd,
      cancelAtPeriodEnd: sub?.cancelAtPeriodEnd ?? false,
      limits: getPlanLimits(sub?.plan ?? "STARTER"),
    };
  }),

  // ── Create Stripe checkout session ───────────────────────
  createCheckout: protectedProcedure
    .input(z.object({
      priceId: z.string(),
      successUrl: z.string().url().optional(),
      cancelUrl: z.string().url().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user!;
      let customerId = user.subscription?.stripeCustomerId;

      // Create Stripe customer if doesn't exist
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.displayName,
          metadata: { userId: user.id, clerkId: user.clerkId },
        });
        customerId = customer.id;

        await ctx.prisma.subscription.upsert({
          where: { userId: user.id },
          create: { userId: user.id, stripeCustomerId: customerId },
          update: { stripeCustomerId: customerId },
        });
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: input.priceId, quantity: 1 }],
        success_url:
          input.successUrl ??
          `${env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
        cancel_url:
          input.cancelUrl ?? `${env.NEXT_PUBLIC_APP_URL}/pricing`,
        subscription_data: {
          trial_period_days: 7,
          metadata: { userId: user.id },
        },
        allow_promotion_codes: true,
        metadata: { userId: user.id },
      });

      return { url: session.url! };
    }),

  // ── Billing portal (manage/cancel) ──────────────────────
  createPortalSession: protectedProcedure
    .input(z.object({ returnUrl: z.string().url().optional() }))
    .mutation(async ({ ctx, input }) => {
      const customerId = ctx.user!.subscription?.stripeCustomerId;
      if (!customerId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No tienes una suscripción activa.",
        });
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url:
          input.returnUrl ?? `${env.NEXT_PUBLIC_APP_URL}/dashboard`,
      });

      return { url: session.url };
    }),

  // ── Available plans ──────────────────────────────────────
  getPlans: publicProcedure.query(() => {
    return PLANS_CONFIG;
  }),
});

// ─── Plan configuration ──────────────────────────────────────
export const PLANS_CONFIG = [
  {
    id: "STARTER",
    name: "Starter",
    tagline: "Empieza gratis",
    monthlyPrice: 0,
    annualPrice: 0,
    priceId: null,
    color: "#999",
    features: [
      "Nivel 1 completo (150 lecciones)",
      "VY tutor: 10 mensajes/día",
      "Sistema de misiones básico",
      "Ranking semanal",
    ],
    limitations: ["Sin certificados", "Sin Nivel 2, 3 o 4"],
    cta: "Empezar gratis",
  },
  {
    id: "PRO",
    name: "Pro",
    tagline: "El más popular",
    monthlyPrice: 9.99,
    annualPrice: 79.99,
    priceIdMonthly: env.STRIPE_PRICE_PRO_MONTHLY,
    priceIdAnnual: env.STRIPE_PRICE_PRO_ANNUAL,
    color: "#FFFC00",
    popular: true,
    features: [
      "Niveles 1, 2 y 3 completos (525 lecciones)",
      "VY tutor: mensajes ilimitados",
      "Certificados verificables",
      "Proyectos y portafolio",
      "Torneos globales",
      "Streak multiplier activo",
      "7 días de prueba gratis",
    ],
    cta: "Empezar Pro",
  },
  {
    id: "PREMIUM",
    name: "Premium",
    tagline: "Máximo potencial",
    monthlyPrice: 14.99,
    annualPrice: 119.99,
    priceIdMonthly: env.STRIPE_PRICE_PREMIUM_MONTHLY,
    color: "#6C63FF",
    features: [
      "Todo lo de Pro",
      "Nivel 4: AI Entrepreneur (100 lecciones)",
      "Bootcamps live mensuales",
      "Mentoría grupal con expertos",
      "Acceso beta a nuevas funciones",
    ],
    cta: "Empezar Premium",
  },
  {
    id: "FAMILY",
    name: "Familiar",
    tagline: "Para toda la familia",
    monthlyPrice: null,
    annualPrice: 149.99,
    priceIdAnnual: env.STRIPE_PRICE_FAMILY_ANNUAL,
    color: "#00FFB3",
    features: [
      "Hasta 5 cuentas Pro",
      "Panel de seguimiento para padres",
      "Control de tiempo de estudio",
      "Reportes de progreso semanales",
    ],
    cta: "Plan Familiar",
  },
  {
    id: "SCHOOL",
    name: "School",
    tagline: "Para educadores",
    monthlyPrice: null,
    annualPrice: 399,
    priceIdAnnual: env.STRIPE_PRICE_SCHOOL_ANNUAL,
    color: "#00D4FF",
    features: [
      "Hasta 35 estudiantes",
      "Dashboard docente completo",
      "Asignación de lecciones",
      "Analytics de clase",
      "Reportes exportables",
      "Soporte prioritario",
    ],
    cta: "Plan Escolar",
  },
];
