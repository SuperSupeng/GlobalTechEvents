import type { VercelRequest, VercelResponse } from '@vercel/node';
import { track } from '@vercel/analytics/server';

type AllowedEventName = 'landing_page_view';

interface EventPayload {
  page_type?: string;
  event_slug?: string;
  source_page?: string;
  visitor_id?: string;
  session_id?: string;
}

interface LoggedLandingPageView extends EventPayload {
  event_name: AllowedEventName;
  tracked_at: string;
}

function isAllowedEventName(value: unknown): value is AllowedEventName {
  return value === 'landing_page_view';
}

function buildLoggedEvent(eventName: AllowedEventName, payload: EventPayload): LoggedLandingPageView {
  return {
    ...payload,
    event_name: eventName,
    tracked_at: new Date().toISOString(),
  };
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
    visitor_id: typeof payload.visitor_id === 'string' ? payload.visitor_id.slice(0, 120) : undefined,
    session_id: typeof payload.session_id === 'string' ? payload.session_id.slice(0, 120) : undefined,
  };
}

function toTrackProperties(payload: EventPayload): Record<string, string> {
  return Object.entries(payload).reduce<Record<string, string>>((acc, [key, value]) => {
    if (typeof value === 'string' && value.length > 0) {
      acc[key] = value;
    }
    return acc;
  }, {});
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
    await track(eventName, toTrackProperties(payload));

    const loggedEvent = buildLoggedEvent(eventName, payload);
    console.info(`LANDING_PAGE_VIEW ${JSON.stringify(loggedEvent)}`);

    return res.status(204).end();
  } catch (error) {
    console.error('Failed to record landing_page_view', error);
    return res.status(500).json({ ok: false, error: 'Failed to record landing_page_view' });
  }
}
