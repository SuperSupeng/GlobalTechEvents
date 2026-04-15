import { track as vercelTrack } from '@vercel/analytics';
import { GA_MEASUREMENT_ID } from '../config/publicEnv';

type AnalyticsPrimitive = string | number | boolean;
type AnalyticsPayload = Record<string, AnalyticsPrimitive | null | undefined>;

const VISITOR_ID_KEY = 'gte_visitor_id';
const SESSION_ID_KEY = 'gte_session_id';

export interface OutboundClickPayload {
  sourcePage: string;
  pageType: string;
  targetUrl: string;
  eventSlug?: string;
  ctaLabel: string;
}

export interface AddToCalendarPayload {
  sourcePage: string;
  pageType: string;
  calendarProvider: 'google' | 'apple' | 'outlook' | 'ics';
  eventSlug?: string;
  ctaLabel: string;
}

export interface LandingPageViewPayload {
  sourcePage: string;
  pageType: string;
  eventSlug?: string;
}

const createStableId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `gte-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const getStorageValue = (storage: Storage, key: string) => {
  const existing = storage.getItem(key);
  if (existing) return existing;

  const next = createStableId();
  storage.setItem(key, next);
  return next;
};

export const getVisitorId = () => {
  if (typeof window === 'undefined') return undefined;

  try {
    return getStorageValue(window.localStorage, VISITOR_ID_KEY);
  } catch {
    return undefined;
  }
};

export const getSessionId = () => {
  if (typeof window === 'undefined') return undefined;

  try {
    return getStorageValue(window.sessionStorage, SESSION_ID_KEY);
  } catch {
    return undefined;
  }
};

const sanitizePayload = (payload: AnalyticsPayload): Record<string, AnalyticsPrimitive> => {
  return Object.entries(payload).reduce<Record<string, AnalyticsPrimitive>>((acc, [key, value]) => {
    if (value === null || value === undefined || value === '') {
      return acc;
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      acc[key] = value;
    } else {
      acc[key] = String(value);
    }

    return acc;
  }, {});
};

export const resolveTargetDomain = (targetUrl: string): string => {
  try {
    const parsed = new URL(targetUrl, window.location.origin);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
};

export const createEventSlug = (value?: string): string | undefined => {
  if (!value) return undefined;

  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || undefined;
};

export const trackCustomEvent = (eventName: string, payload: AnalyticsPayload = {}) => {
  const sanitizedPayload = sanitizePayload(payload);

  try {
    vercelTrack(eventName, sanitizedPayload);
  } catch (error) {
    console.warn(`[analytics] failed to send ${eventName} to Vercel Analytics`, error);
  }

  if (GA_MEASUREMENT_ID && typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, sanitizedPayload);
  }
};

export const trackLandingPageView = async ({ sourcePage, pageType, eventSlug }: LandingPageViewPayload) => {
  const payload = sanitizePayload({
    source_page: sourcePage,
    page_type: pageType,
    event_slug: eventSlug,
    visitor_id: getVisitorId(),
    session_id: getSessionId(),
  });

  trackCustomEvent('landing_page_view', payload);

  if (typeof window === 'undefined') return;

  try {
    await fetch('/api/track-page-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'landing_page_view',
        payload,
      }),
      keepalive: true,
    });
  } catch (error) {
    console.warn('[analytics] failed to send landing_page_view to server log exporter', error);
  }
};

export const trackOutboundClick = ({
  sourcePage,
  pageType,
  targetUrl,
  eventSlug,
  ctaLabel,
}: OutboundClickPayload) => {
  trackCustomEvent('outbound_click', {
    source_page: sourcePage,
    page_type: pageType,
    target_url: targetUrl,
    target_domain: resolveTargetDomain(targetUrl),
    event_slug: eventSlug,
    cta_label: ctaLabel,
  });
};

export const trackAddToCalendar = ({
  sourcePage,
  pageType,
  calendarProvider,
  eventSlug,
  ctaLabel,
}: AddToCalendarPayload) => {
  trackCustomEvent('add_to_calendar', {
    source_page: sourcePage,
    page_type: pageType,
    calendar_provider: calendarProvider,
    event_slug: eventSlug,
    cta_label: ctaLabel,
  });
};
