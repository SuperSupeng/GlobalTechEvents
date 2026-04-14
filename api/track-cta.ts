import type { VercelRequest, VercelResponse } from '@vercel/node';
import { track } from '@vercel/analytics/server';

type AllowedEventName = 'add_to_calendar' | 'outbound_click';

interface EventPayload {
  page_type?: string;
  event_slug?: string;
  source_page?: string;
  cta_label?: string;
  calendar_provider?: string;
  target_url?: string;
}

function isAllowedEventName(value: unknown): value is AllowedEventName {
  return value === 'add_to_calendar' || value === 'outbound_click';
}

function normalizePayload(input: unknown): EventPayload {
  if (!input || typeof input !== 'object') {
    return {};
  }

  const payload = input as Record<string, unknown>;
  return {
    page_type: typeof payload.page_type === 'string' ? payload.page_type.slice(0, 64) : undefined,
    event_slug: typeof payload.event_slug === 'string' ? payload.event_slug.slice(0, 120) : undefined,
    source_page: typeof payload.source_page === 'string' ? payload.source_page.slice(0, 200) : undefined,
    cta_label: typeof payload.cta_label === 'string' ? payload.cta_label.slice(0, 80) : undefined,
    calendar_provider:
      typeof payload.calendar_provider === 'string' ? payload.calendar_provider.slice(0, 40) : undefined,
    target_url: typeof payload.target_url === 'string' ? payload.target_url.slice(0, 500) : undefined,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const eventName = req.body?.eventName;
    if (!isAllowedEventName(eventName)) {
      return res.status(400).json({ ok: false, error: 'Invalid eventName' });
    }

    const payload = normalizePayload(req.body?.payload);
    await track(eventName, payload);
    return res.status(204).end();
  } catch (error) {
    console.error('Failed to record CTA event', error);
    return res.status(500).json({ ok: false, error: 'Failed to record CTA event' });
  }
}
