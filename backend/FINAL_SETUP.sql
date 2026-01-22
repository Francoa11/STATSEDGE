-- 1. SETUP TABLES (First, ensure tables exist to avoid "relation does not exist" errors)
CREATE TABLE IF NOT EXISTS daily_combos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),
  combo_type text, 
  total_odds numeric,
  selections jsonb,
  status text DEFAULT 'active'
);

-- 2. CLEANUP (Now safe to delete)
DELETE FROM daily_picks;
DELETE FROM daily_combos;

-- 3. SCHEMA ALIGNMENT (Ensure all columns exist)
ALTER TABLE daily_picks ADD COLUMN IF NOT EXISTS bet_description text;
ALTER TABLE daily_picks ADD COLUMN IF NOT EXISTS match_date timestamp with time zone;
ALTER TABLE daily_picks ADD COLUMN IF NOT EXISTS is_gold boolean DEFAULT false;
ALTER TABLE daily_picks ADD COLUMN IF NOT EXISTS category text; 
ALTER TABLE daily_picks ADD COLUMN IF NOT EXISTS variance_label text;
ALTER TABLE daily_picks ADD COLUMN IF NOT EXISTS confidence_score integer;
ALTER TABLE daily_picks ADD COLUMN IF NOT EXISTS analysis_structure jsonb;

-- 4. VERIFICATION
-- Run this script to fully reset and prep the DB for V1.0 Agent.
