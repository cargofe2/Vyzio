// src/lib/stripe.ts
// Stripe client, webhook verification, plan utilities

import Stripe from "stripe";
import { env } from "@/env";
import { type Plan } from "@prisma/client";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
  typescript: true,
  appInfo: { name: "VYZIO", version: "1.0.0" },
});

// Maps Stripe price IDs → VYZIO plan names
export const PRICE_TO_PLAN: Record<string, Plan> = {
  [env.STRIPE_PRICE_PRO_MONTHLY]:    "PRO",
  [env.STRIPE_PRICE_PRO_ANNUAL]:     "PRO",
  [env.STRIPE_PRICE_PREMIUM_MONTHLY]: "PREMIUM",
  [env.STRIPE_PRICE_FAMILY_ANNUAL]:  "FAMILY",
  [env.STRIPE_PRICE_SCHOOL_ANNUAL]:  "SCHOOL",
};

export interface PlanLimits {
  levels: number[];
  vyMessagesPerDay: number;
  vyUnlimited: boolean;
  hasCertificates: boolean;
  hasPortfolio: boolean;
  hasTournaments: boolean;
  hasStreakMultiplier: boolean;
  hasBootcamps: boolean;
  seatCount: number;
  hasTeacherDashboard: boolean;
}

export function getPlanLimits(plan: string): PlanLimits {
  switch (plan) {
    case "STARTER":
      return {
        levels: [1],
        vyMessagesPerDay: 10,
        vyUnlimited: false,
        hasCertificates: false,
        hasPortfolio: false,
        hasTournaments: false,
        hasStreakMultiplier: false,
        hasBootcamps: false,
        seatCount: 1,
        hasTeacherDashboard: false,
      };
    case "PRO":
      return {
        levels: [1, 2, 3],
        vyMessagesPerDay: 9999,
        vyUnlimited: true,
        hasCertificates: true,
        hasPortfolio: true,
        hasTournaments: true,
        hasStreakMultiplier: true,
        hasBootcamps: false,
        seatCount: 1,
        hasTeacherDashboard: false,
      };
    case "PREMIUM":
      return {
        levels: [1, 2, 3, 4],
        vyMessagesPerDay: 9999,
        vyUnlimited: true,
        hasCertificates: true,
        hasPortfolio: true,
        hasTournaments: true,
        hasStreakMultiplier: true,
        hasBootcamps: true,
        seatCount: 1,
        hasTeacherDashboard: false,
      };
    case "FAMILY":
      return {
        levels: [1, 2, 3],
        vyMessagesPerDay: 9999,
        vyUnlimited: true,
        hasCertificates: true,
        hasPortfolio: true,
        hasTournaments: true,
        hasStreakMultiplier: true,
        hasBootcamps: false,
        seatCount: 5,
        hasTeacherDashboard: false,
      };
    case "SCHOOL":
    case "ENTERPRISE":
      return {
        levels: [1, 2, 3, 4],
        vyMessagesPerDay: 9999,
        vyUnlimited: true,
        hasCertificates: true,
        hasPortfolio: true,
        hasTournaments: true,
        hasStreakMultiplier: true,
        hasBootcamps: true,
        seatCount: plan === "SCHOOL" ? 35 : 9999,
        hasTeacherDashboard: true,
      };
    default:
      return getPlanLimits("STARTER");
  }
}

// ─── Webhook event handler ───────────────────────────────────
import { type PrismaClient } from "@prisma/client";

export async function handleStripeWebhook(
  payload: string,
  signature: string,
  prisma: PrismaClient
): Promise<void> {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    throw new Error(`Stripe webhook signature verification failed: ${err}`);
  }

  switch (event.type) {

    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription") break;

      const userId = session.metadata?.userId;
      if (!userId) break;

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      const priceId = subscription.items.data[0]?.price.id ?? "";
      const plan = PRICE_TO_PLAN[priceId] ?? "PRO";

      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          plan,
          status: "ACTIVE",
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          trialEnd: subscription.trial_end
            ? new Date(subscription.trial_end * 1000)
            : null,
        },
        update: {
          plan,
          status: "ACTIVE",
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      if (!invoice.subscription) break;

      const subscription = await stripe.subscriptions.retrieve(
        invoice.subscription as string
      );
      const customerId = subscription.customer as string;

      await prisma.subscription.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
          status: "ACTIVE",
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      await prisma.subscription.updateMany({
        where: { stripeCustomerId: customerId },
        data: { status: "PAST_DUE" },
      });
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const priceId = sub.items.data[0]?.price.id ?? "";
      const plan = PRICE_TO_PLAN[priceId] ?? "PRO";

      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: {
          plan,
          status: sub.status.toUpperCase() as any,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          currentPeriodStart: new Date(sub.current_period_start * 1000),
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;

      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: {
          plan: "STARTER",
          status: "CANCELED",
          stripeSubscriptionId: null,
          stripePriceId: null,
        },
      });
      break;
    }
  }
}
