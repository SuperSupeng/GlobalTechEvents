import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';
import { generateIcs, ICS_FEED_STATUSES } from './_lib/calendar-ics.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Changing the hash input gives every IP a new hash and inflates the /api/followers unique-IP count.
function hashIp(ip: string): string {
  return createHash('sha256').update(ip + process.env.IP_HASH_SALT || 'default-salt').digest('hex').slice(0, 16);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 设置 CORS 和缓存头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600'); // 1 hour cache
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 解析查询参数
    const { eventId, format, location, tags } = req.query;

    // Subscription feed includes upcoming, live, and ended so past events stay
    // on their original day. Canceled rows stay out. A direct eventId download
    // still returns that one row at any status.
    let query = supabase
      .from('events')
      .select('*')
      .in('status', [...ICS_FEED_STATUSES])
      .order('start_time', { ascending: true });

    // 单个活动
    if (eventId && typeof eventId === 'string') {
      query = supabase
        .from('events')
        .select('*')
        .eq('id', eventId);
    }

    // 格式筛选
    if (format && typeof format === 'string' && format !== 'all') {
      query = query.eq('format', format);
    }

    // 地点筛选
    if (location && typeof location === 'string' && location !== 'all') {
      query = query.or(`location->>city.eq.${location},location->>country.eq.${location}`);
    }

    const { data: events, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch events' });
    }

    if (!events || events.length === 0) {
      return res.status(404).json({ error: 'No events found' });
    }

    // 生成 ICS
    const icsContent = generateIcs(events);

    // 记录下载统计（异步，不阻塞响应）
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket?.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    const country = req.headers['x-vercel-ip-country'] as string || '';

    // 不等待统计完成
    supabase.rpc('record_ics_download', {
      p_download_type: eventId ? 'single' : (format || location || tags ? 'filtered' : 'full'),
      p_event_id: eventId || null,
      p_filters: { format, location, tags },
      p_user_agent: userAgent.slice(0, 500),
      p_ip_hash: hashIp(clientIp),
      p_country: country,
    }).then(() => {}).catch(console.error);

    // 返回 ICS 文件
    const filename = eventId 
      ? `event-${eventId}.ics` 
      : `globaltechevents-${new Date().toISOString().slice(0, 10)}.ics`;

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    return res.status(200).send(icsContent);

  } catch (error) {
    console.error('ICS generation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
