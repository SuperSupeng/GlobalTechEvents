import type { SEOEventPageData } from './seoEventPages';

const SITE_ORIGIN = 'https://www.globaltechevents.xyz';

export interface PublicEvent {
  name: string;
  dates: {
    start: string;
    end: string;
  };
  city: string;
  url: string;
  slug: string;
}

export function toPublicEvent(page: SEOEventPageData): PublicEvent {
  const officialUrl = page.officialUrl.trim();

  return {
    name: page.eventName,
    dates: {
      start: page.startDate,
      end: page.endDate,
    },
    city: page.city,
    url: officialUrl || `${SITE_ORIGIN}/events/${page.slug}`,
    slug: page.slug,
  };
}

export function listPublicEvents(pages: readonly SEOEventPageData[]): PublicEvent[] {
  return pages.map(toPublicEvent).sort((left, right) => {
    const byStart = left.dates.start.localeCompare(right.dates.start);
    if (byStart !== 0) return byStart;
    return left.slug.localeCompare(right.slug);
  });
}
