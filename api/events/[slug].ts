import type { VercelRequest, VercelResponse } from '@vercel/node';
import { WHATSAPP_GROUP_URL } from '../../src/config/constants.js';
import { getSEOEventPageBySlug } from '../../src/data/seoEventPages.js';
import { renderEventGuideDocument } from '../_lib/event-guide-html.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const slug = req.query.slug;
  const normalizedSlug = Array.isArray(slug) ? slug[0] : slug;

  if (!normalizedSlug) {
    return res.status(400).send('Missing event slug');
  }

  const page = getSEOEventPageBySlug(normalizedSlug);
  if (!page) {
    return res.status(404).send('Event page not found');
  }

  const html = renderEventGuideDocument(page, WHATSAPP_GROUP_URL);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).send(html);
}
