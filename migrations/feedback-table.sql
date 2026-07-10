CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  "userId" TEXT,
  category TEXT NOT NULL DEFAULT 'other',
  rating INTEGER,
  message TEXT NOT NULL,
  page TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);
