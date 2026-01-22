-- SCHEMA UPDATE FOR V2 ENGINE (SELECTION & SEGMENTATION)
-- Run this in your Supabase SQL Editor or via psql

ALTER TABLE daily_picks ADD COLUMN IF NOT EXISTS variance_label text; -- 'Low', 'Medium', 'High'
ALTER TABLE daily_picks ADD COLUMN IF NOT EXISTS category text;       -- 'gold', 'todays_edge', 'pro_market'
