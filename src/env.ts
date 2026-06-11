import { z } from "zod";
const envSchema = z.object({
  NODE_ENV: z.enum(["development","test","production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  CLERK_WEBHOOK_SECRET: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  STRIPE_PRICE_PRO_MONTHLY: z.string().min(1),
  STRIPE_PRICE_PRO_ANNUAL: z.string().min(1),
  STRIPE_PRICE_PREMIUM_MONTHLY: z.string().min(1),
  STRIPE_PRICE_FAMILY_ANNUAL: z.string().min(1),
  STRIPE_PRICE_SCHOOL_ANNUAL: z.string().min(1),
  PINECONE_API_KEY: z.string().min(1),
  PINECONE_INDEX: z.string().min(1),
  PINECONE_ENVIRONMENT: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET_NAME: z.string().min(1),
  NEXT_PUBLIC_R2_PUBLIC_URL: z.string().url(),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("❌ VYZIO: Invalid environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment variables.");
}
export const env = parsed.data;
