import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ALL_SEO_EVENT_PAGES } from '../../src/data/seoEventPages.js';
import { listPublicEvents } from '../../src/data/publicEvents.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const events = listPublicEvents(ALL_SEO_EVENT_PAGES);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'HEAD') {
    return res.status(200).end();
  }

  return res.status(200).json({ events });
}
