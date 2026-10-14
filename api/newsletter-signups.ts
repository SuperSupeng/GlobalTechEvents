import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getMissingSupabaseEnv, getSupabaseAdmin } from './_lib/supabase-admin.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, sourcePage, pageType } = req.body ?? {};
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }

  const missingEnv = getMissingSupabaseEnv();
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return res.status(503).json({
      error: `Supabase is not configured. Missing: ${missingEnv.join(', ')}`,
    });
  }

  const { data: existing, error: selectError } = await supabase
    .from('newsletter_signups')
    .select('id')
    .ilike('email', normalizedEmail)
    .limit(1)
    .maybeSingle();

  if (selectError) {
    console.error('Failed to check newsletter signups', selectError);
    return res.status(500).json({ error: 'Failed to check newsletter subscription state.' });
  }

  if (existing) {
    return res.status(200).json({ ok: true, duplicate: true });
  }

  const { error: insertError } = await supabase.from('newsletter_signups').insert({
    email: normalizedEmail,
    source_page: typeof sourcePage === 'string' ? sourcePage : null,
    page_type: typeof pageType === 'string' ? pageType : null,
  });

  if (insertError) {
    console.error('Failed to create newsletter signup', insertError);
    return res.status(500).json({ error: 'Failed to save newsletter signup.' });
  }

  return res.status(200).json({ ok: true });
}
