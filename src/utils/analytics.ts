import { track as vercelTrack } from '@vercel/analytics';
import { GA_MEASUREMENT_ID } from '../config/publicEnv';

type AnalyticsPrimitive = string | number | boolean;
type AnalyticsPayload = Record<string, AnalyticsPrimitive | null | undefined>;

export interface OutboundClickPayload {
  sourcePage: string;
  pageType: string;
  targetUrl: string;
  eventSlug?: string;
  ctaLabel: string;
}

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
