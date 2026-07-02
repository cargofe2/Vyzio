export function isEvalMode(clerkId: string | null | undefined): boolean {
  if (!clerkId) return false;
  const ids = (process.env.FOUNDER_CLERK_IDS || "").split(",").map(s => s.trim());
  return ids.includes(clerkId);
}
