-- Correr en Supabase SQL editor antes de deployar el panel de usuarios/tema

ALTER TABLE users ADD COLUMN IF NOT EXISTS "isBanned" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "bannedReason" TEXT;

CREATE TABLE IF NOT EXISTS theme_settings (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'color',
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

-- Semilla con los design tokens vigentes documentados
INSERT INTO theme_settings (id, key, value, category) VALUES
  ('ts_bg', 'byzai-bg', '#0F1420', 'color'),
  ('ts_surface', 'byzai-surface', '#161C27', 'color'),
  ('ts_card', 'byzai-card', '#1E2533', 'color'),
  ('ts_card_hl', 'byzai-card-highlight', '#242E40', 'color'),
  ('ts_border', 'byzai-border', '#324055', 'color'),
  ('ts_divider', 'byzai-divider', '#2A3445', 'color'),
  ('ts_text_primary', 'byzai-text-primary', '#F8FAFF', 'color'),
  ('ts_text_secondary', 'byzai-text-secondary', '#B3BDD1', 'color'),
  ('ts_text_tertiary', 'byzai-text-tertiary', '#7E8798', 'color'),
  ('ts_purple', 'byzai-purple', '#7B61FF', 'color'),
  ('ts_blue', 'byzai-blue', '#468BFF', 'color'),
  ('ts_cyan', 'byzai-cyan', '#26C6DA', 'color'),
  ('ts_orange', 'byzai-orange', '#FB923C', 'color'),
  ('ts_success', 'byzai-success', '#36D399', 'color'),
  ('ts_warning', 'byzai-warning', '#F2C04D', 'color'),
  ('ts_danger', 'byzai-danger', '#FF6B6B', 'color'),
  ('ts_font_heading', 'font-heading', 'Syne', 'font'),
  ('ts_font_body', 'font-body', 'DM Sans', 'font')
ON CONFLICT (key) DO NOTHING;
