-- =====================================================
-- Supabase RLS (Row Level Security) 设置
-- =====================================================
-- 在 Supabase SQL Editor 中执行此文件
-- =====================================================

-- 1. 启用 RLS (如果还没启用)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 2. 删除所有现有策略（避免冲突）
DROP POLICY IF EXISTS "Allow public read access" ON events;
DROP POLICY IF EXISTS "Deny anonymous write" ON events;
DROP POLICY IF EXISTS "Deny anonymous update" ON events;
DROP POLICY IF EXISTS "Deny anonymous delete" ON events;
DROP POLICY IF EXISTS "Service role full access" ON events;

-- =====================================================
-- 公开读取策略
-- =====================================================
-- 允许所有人（包括匿名用户）读取活动数据
CREATE POLICY "Public read access on events" 
ON events 
FOR SELECT 
USING (true);

-- =====================================================
-- 禁止匿名用户写入
-- =====================================================
-- 禁止通过 ANON KEY 插入数据（只能通过 SERVICE KEY）
CREATE POLICY "Deny anonymous insert" 
ON events 
FOR INSERT 
WITH CHECK (false);

-- 禁止通过 ANON KEY 更新数据
CREATE POLICY "Deny anonymous update" 
ON events 
FOR UPDATE 
USING (false);

-- 禁止通过 ANON KEY 删除数据
CREATE POLICY "Deny anonymous delete" 
ON events 
FOR DELETE 
USING (false);

-- =====================================================
-- Service Role 完全访问策略
-- =====================================================
-- 允许使用 SERVICE_ROLE_KEY 的操作（你的爬虫）进行所有操作
-- 注意：这个策略对 service_role 自动生效，无需手动创建
-- Supabase 的 service_role 会绕过 RLS

-- =====================================================
-- 验证 RLS 是否生效
-- =====================================================
-- 查看当前表的 RLS 状态
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'events';

-- 查看所有策略
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd as command,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'events';

-- =====================================================
-- 测试（可选）
-- =====================================================
-- 在 Supabase Dashboard 中，切换到 "Table Editor"
-- 尝试直接删除一行数据，应该会失败（因为 ANON KEY 无权限）
-- 但是你可以正常查看数据

-- =====================================================
-- 完成！
-- =====================================================
-- 现在你的数据库安全了：
-- ✅ 任何人都可以读取活动数据（通过你的网站前端）
-- ✅ 只有使用 SERVICE_ROLE_KEY 才能写入/更新/删除数据
-- ✅ 即使 ANON KEY 泄露，攻击者也无法破坏数据

SELECT '✅ RLS setup completed successfully!' as status;
