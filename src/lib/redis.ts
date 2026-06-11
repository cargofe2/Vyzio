// src/lib/redis.ts — Upstash Redis client
import { Redis } from "@upstash/redis";
import { env } from "@/env";

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

export const LEADERBOARD_KEYS = {
  weekly:  "leaderboard:weekly",
  allTime: "leaderboard:alltime",
  // Tournament keys: "leaderboard:tournament:{id}"
} as const;

// Cache helpers
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    return redis.get<T>(key);
  },
  async set(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  },
  async del(key: string): Promise<void> {
    await redis.del(key);
  },
};
