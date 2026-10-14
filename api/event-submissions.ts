import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getMissingSupabaseEnv, getSupabaseAdmin } from './_lib/supabase-admin.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isHttpUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, eventName, eventUrl, sourcePage, pageType, notes } = req.body ?? {};
  const normalizedName = typeof name === 'string' ? name.trim() : '';
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const normalizedEventName = typeof eventName === 'string' ? eventName.trim() : '';
  const normalizedEventUrl = typeof eventUrl === 'string' ? eventUrl.trim() : '';
  const normalizedNotes = typeof notes === 'string' ? notes.trim() : '';

  if (!normalizedName) {
    return res.status(400).json({ error: 'Your name is required.' });
  }

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }

  if (!normalizedEventName) {
    return res.status(400).json({ error: 'Event name is required.' });
  }

  if (!isHttpUrl(normalizedEventUrl)) {
    return res.status(400).json({ error: 'A valid event URL is required.' });
  }

  const missingEnv = getMissingSupabaseEnv();
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return res.status(503).json({
      error: `Supabase is not configured. Missing: ${missingEnv.join(', ')}`,
    });
  }

  const { error } = await supabase.from('event_submissions').insert({
    name: normalizedName,
    email: normalizedEmail,
    event_name: normalizedEventName,
    event_url: normalizedEventUrl,
    notes: normalizedNotes || null,
    source_page: typeof sourcePage === 'string' ? sourcePage : null,
    page_type: typeof pageType === 'string' ? pageType : null,
  });

  if (error) {
    console.error('Failed to save event submission', error);
    return res.status(500).json({ error: 'Failed to save event submission.' });
  }

  return res.status(200).json({ ok: true });
}
