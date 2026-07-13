CREATE TABLE IF NOT EXISTS level_resources (
  id TEXT PRIMARY KEY,
  "levelId" TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  content JSONB,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS level_resources_levelid_idx ON level_resources("levelId");
