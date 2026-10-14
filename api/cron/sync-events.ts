import type { VercelRequest, VercelResponse } from '@vercel/node';
import { runEventSync } from '../_lib/event-sync.js';

function isAuthorized(req: VercelRequest) {
  if (req.headers['x-vercel-cron']) {
    return true;
  }

  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return false;
  }

  const authHeader = req.headers.authorization;
  return authHeader === `Bearer ${secret}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const dryRun = String(req.query.dryRun ?? 'false') === 'true';
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const eventId = typeof req.query.eventId === 'string' ? req.query.eventId : undefined;

    const summary = await runEventSync({
      dryRun,
      limit: Number.isFinite(limit) ? limit : undefined,
      eventId,
    });

    return res.status(200).json({ ok: true, summary });
  } catch (error) {
    console.error('Event sync failed', error);
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
