import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin } from './_lib/supabase-admin.js';
import { loadCalendarDownloadsBody } from '../src/data/calendarDownloads.js';

const setCors = (res: VercelResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = await loadCalendarDownloadsBody(getSupabaseAdmin(), new Date().toISOString());
  // A cached 503 would keep the wall hidden after the database recovers.
  res.setHeader('Cache-Control', body.ok ? 'public, s-maxage=300, stale-while-revalidate=600' : 'no-store');
  return res.status(body.ok ? 200 : 503).json(body);
}
