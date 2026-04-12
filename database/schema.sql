-- GlobalTechEvents 数据库架构
-- 创建日期: 2026-01-23

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  summary TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  timezone TEXT NOT NULL,
  is_all_day BOOLEAN DEFAULT false,
  format TEXT NOT NULL CHECK (format IN ('online', 'offline', 'hybrid')),
  location JSONB,
  organizer JSONB NOT NULL,
  links JSONB NOT NULL,
  tags TEXT[] DEFAULT '{}',
  language TEXT[] DEFAULT '{English}',
  price JSONB DEFAULT '{"type": "unknown"}',
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'ended', 'canceled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_format ON events(format);
CREATE INDEX IF NOT EXISTS idx_events_tags ON events USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON events;
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON events;
DROP POLICY IF EXISTS "Allow authenticated users to update" ON events;
DROP POLICY IF EXISTS "Allow authenticated users to delete" ON events;

CREATE POLICY "Allow public read access" ON events
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON events
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete" ON events
  FOR DELETE USING (true);

CREATE TABLE IF NOT EXISTS newsletter_signups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  source_page TEXT,
  page_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_signups_email_unique
  ON newsletter_signups (LOWER(email));

DROP TRIGGER IF EXISTS update_newsletter_signups_updated_at ON newsletter_signups;
CREATE TRIGGER update_newsletter_signups_updated_at BEFORE UPDATE ON newsletter_signups
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS event_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_url TEXT NOT NULL,
  notes TEXT,
  source_page TEXT,
  page_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_submissions_created_at ON event_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_submissions_event_name ON event_submissions(event_name);

DROP TRIGGER IF EXISTS update_event_submissions_updated_at ON event_submissions;
CREATE TRIGGER update_event_submissions_updated_at BEFORE UPDATE ON event_submissions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE event_submissions ENABLE ROW LEVEL SECURITY;
