-- GlobalTechEvents 数据库架构
-- 创建日期: 2026-01-23

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建 events 表
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- 基本信息
  title TEXT NOT NULL,
  summary TEXT,
  
  -- 时间（统一使用 TIMESTAMPTZ）
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  timezone TEXT NOT NULL,
  is_all_day BOOLEAN DEFAULT false,
  
  -- 地点
  format TEXT NOT NULL CHECK (format IN ('online', 'offline', 'hybrid')),
  location JSONB,  -- { country, city, address }
  
  -- 组织方
  organizer JSONB NOT NULL,  -- { name, logo }
  
  -- 链接
  links JSONB NOT NULL,  -- { officialSite, registration, source }
  
  -- 标签
  tags TEXT[] DEFAULT '{}',
  language TEXT[] DEFAULT '{English}',
  
  -- 价格
  price JSONB DEFAULT '{"type": "unknown"}',  -- { type, range }
  
  -- 状态
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'ended', 'canceled')),
  
  -- 元数据
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引（优化查询性能）
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_format ON events(format);
CREATE INDEX IF NOT EXISTS idx_events_tags ON events USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

-- 创建更新时间触发器
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

-- 启用 Row Level Security（安全性）
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 删除现有策略（如果存在）
DROP POLICY IF EXISTS "Allow public read access" ON events;
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON events;
DROP POLICY IF EXISTS "Allow authenticated users to update" ON events;
DROP POLICY IF EXISTS "Allow authenticated users to delete" ON events;

-- 允许所有人读取
CREATE POLICY "Allow public read access" ON events
  FOR SELECT USING (true);

-- 允许所有人插入（方便测试，生产环境应该限制）
CREATE POLICY "Allow public insert" ON events
  FOR INSERT WITH CHECK (true);

-- 允许所有人更新（方便测试，生产环境应该限制）
CREATE POLICY "Allow public update" ON events
  FOR UPDATE USING (true);

-- 允许所有人删除（方便测试，生产环境应该限制）
CREATE POLICY "Allow public delete" ON events
  FOR DELETE USING (true);
