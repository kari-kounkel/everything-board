-- ============================================================
-- EMPIRE COMMAND CENTER — Supabase Tables
-- Run this in your Supabase SQL editor
-- ============================================================

-- Empire Apps (My Empire tab)
CREATE TABLE IF NOT EXISTS empire_apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  url TEXT DEFAULT '',
  stack TEXT DEFAULT '',
  status TEXT DEFAULT 'planning',
  universe TEXT DEFAULT '',
  description TEXT DEFAULT '',
  color TEXT DEFAULT '#c9a84c',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Empire Subscriptions (My Stack tab)
CREATE TABLE IF NOT EXISTS empire_subs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT DEFAULT '',
  cost NUMERIC DEFAULT 0,
  billing TEXT DEFAULT 'monthly',
  status TEXT DEFAULT 'active',
  notes TEXT DEFAULT '',
  url TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Empire Posts (Social tab)
CREATE TABLE IF NOT EXISTS empire_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day TEXT DEFAULT 'Monday',
  platform TEXT DEFAULT 'Facebook',
  content TEXT DEFAULT '',
  status TEXT DEFAULT 'idea',
  link TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── RLS ────────────────────────────────────────────────────
ALTER TABLE empire_apps  ENABLE ROW LEVEL SECURITY;
ALTER TABLE empire_subs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE empire_posts ENABLE ROW LEVEL SECURITY;

-- Apps policies
CREATE POLICY "Users manage own apps"  ON empire_apps  FOR ALL USING (auth.uid() = user_id);
-- Subs policies
CREATE POLICY "Users manage own subs"  ON empire_subs  FOR ALL USING (auth.uid() = user_id);
-- Posts policies
CREATE POLICY "Users manage own posts" ON empire_posts FOR ALL USING (auth.uid() = user_id);
