import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin } from './_lib/supabase-admin.js';

/**
 * Public calendar-follower count for the homepage.
 *
 * followers = COUNT(*) FROM ics_downloads
 * Every ICS download row counts. This is not distinct ip_hash,
 * not newsletter_signups, and not pageviews.
 *
 * Unauthenticated on purpose. The keyed breakdown stays on /api/stats.
 */

const LABEL = 'calendar_subscribers';
const SOURCE = 'ics_downloads_count';

const setCors = (res: VercelResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

const unavailable = (res: VercelResponse, generatedAt: string) => {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(503).json({
    ok: false,
    followers: null,
    label: LABEL,
    source: SOURCE,
    generated_at: generatedAt,
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const generatedAt = new Date().toISOString();
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return unavailable(res, generatedAt);
  }

  // head:true + count:exact is COUNT(*) and does not return row contents.
  const { count, error } = await supabase
    .from('ics_downloads')
    .select('id', { count: 'exact', head: true });

  if (error || typeof count !== 'number' || !Number.isInteger(count) || count < 0) {
    console.error('Public follower count failed', error);
    return unavailable(res, generatedAt);
  }

  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

  return res.status(200).json({
    ok: true,
    followers: count,
    label: LABEL,
    source: SOURCE,
    generated_at: generatedAt,
  });
}
