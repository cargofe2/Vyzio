// src/middleware.ts
// Clerk auth middleware — protects dashboard routes

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/pricing",
  "/about",
  "/verify/(.*)",
  "/@(.*)",          // public profiles
  "/api/webhooks/(.*)",
  "/api/trpc/(.*)",  // tRPC handles its own auth per-procedure
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth().protect();
  }

  // Redirect authenticated users away from sign-in/sign-up
  const { userId } = auth();
  const isAuthPage = req.nextUrl.pathname.startsWith("/sign-");
  if (userId && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
