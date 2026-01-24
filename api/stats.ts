import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 简单的 API Key 认证（用于后台查看）
  const apiKey = req.headers['x-api-key'] || req.query.key;
  const validApiKey = process.env.STATS_API_KEY;

  if (!validApiKey || apiKey !== validApiKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // 调用统计函数
    const { data, error } = await supabase.rpc('get_ics_download_stats');

    if (error) {
      console.error('Stats error:', error);
      return res.status(500).json({ error: 'Failed to fetch stats' });
    }

    // 缓存 5 分钟
    res.setHeader('Cache-Control', 'private, max-age=300');
    
    return res.status(200).json({
      success: true,
      generated_at: new Date().toISOString(),
      stats: data,
    });

  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
