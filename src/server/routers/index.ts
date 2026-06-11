import { createTRPCRouter } from "@/server/trpc";
import { contentRouter } from "./content";
import { progressRouter } from "./progress";
import { gamificationRouter } from "./gamification";
import { vyRouter } from "./vy";
import { subscriptionRouter } from "./subscription";
import { communityRouter } from "./community";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
  content: contentRouter,
  progress: progressRouter,
  gamification: gamificationRouter,
  vy: vyRouter,
  subscription: subscriptionRouter,
  community: communityRouter,
  user: userRouter,
});
export type AppRouter = typeof appRouter;
