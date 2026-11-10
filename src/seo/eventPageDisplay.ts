import {
  collectionLocationLabel,
  isSeoCollection,
} from '../data/seoEventSchema';
import type { SEOEventPageData } from '../data/seoEventPages';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

interface IsoDate {
  y: number;
  m: number;
  d: number;
}

export interface EventFact {
  label: string;
  primary: string;
  /** When a range needs two lines, each entry is one designed line. */
  lines?: string[];
  secondary?: string;
  note?: string;
}

function splitRange(primary: string): string[] | undefined {
  if (!/[A-Za-z]+ \d+–[A-Za-z]/.test(primary)) return undefined;
  const index = primary.indexOf('–');
  return [primary.slice(0, index).trim(), `– ${primary.slice(index + 1).trim()}`];
}

export interface EventLink {
  href: string;
  label: string;
  external: boolean;
  trackLabel: string;
  downloadIcs?: boolean;
}

function parseIso(iso: string): IsoDate {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return { y, m, d };
}

function monthDay(date: IsoDate): string {
  return `${MONTHS[date.m - 1]} ${date.d}`;
}

/** Scannable date: the days on one line, the year on the next. Same calendar day collapses. */
export function formatEventDateRange(start: string, end: string): { primary: string; secondary: string; spoken: string } {
  const s = parseIso(start);
  const e = parseIso(end || start);
  if (s.y === e.y && s.m === e.m && s.d === e.d) {
    return {
      primary: monthDay(s),
      secondary: String(s.y),
      spoken: `${monthDay(s)}, ${s.y}`,
    };
  }
  if (s.y === e.y && s.m === e.m) {
    return {
      primary: `${MONTHS[s.m - 1]} ${s.d}–${e.d}`,
      secondary: String(s.y),
      spoken: `${MONTHS[s.m - 1]} ${s.d} through ${e.d}, ${s.y}`,
    };
  }
  if (s.y === e.y) {
    return {
      primary: `${monthDay(s)}–${monthDay(e)}`,
      secondary: String(s.y),
      spoken: `${monthDay(s)} through ${monthDay(e)}, ${s.y}`,
    };
  }
  return {
    primary: `${monthDay(s)}, ${s.y}`,
    secondary: `through ${monthDay(e)}, ${e.y}`,
    spoken: `${monthDay(s)}, ${s.y} through ${monthDay(e)}, ${e.y}`,
  };
}

export function attendanceLabel(format: SEOEventPageData['format']): string {
  if (format === 'online') return 'Online';
  if (format === 'hybrid') return 'In person and online';
  return 'In person';
}

/** "Singapore, Singapore" collapses. Online events read as Online. */
export function formatPlace(city: string, country: string, format: SEOEventPageData['format']): { primary: string; secondary?: string } {
  if (format === 'online') return { primary: 'Online' };
  const place = city.trim();
  const region = country.trim();
  if (!region || place.toLowerCase() === region.toLowerCase()) return { primary: place };
  if (/^(international|global|tba|worldwide)$/i.test(region)) return { primary: place };
  return { primary: place, secondary: region };
}

export function eventFacts(page: SEOEventPageData): EventFact[] {
  const date = formatEventDateRange(page.startDate, page.endDate);
  const facts: EventFact[] = [
    {
      label: 'Dates',
      primary: date.primary,
      lines: splitRange(date.primary),
      secondary: date.secondary,
      note: page.dateNote,
    },
  ];

  if (isSeoCollection(page)) {
    facts.push({ label: 'Location', primary: collectionLocationLabel(page) });
  } else {
    const place = formatPlace(page.city, page.country, page.format);
    facts.push({ label: 'Location', primary: place.primary, secondary: place.secondary });
  }

  if (page.admission?.amount) {
    facts.push({
      label: 'Price',
      primary: page.admission.amount,
      secondary: page.admission.detail,
    });
  }

  if (page.format !== 'online') {
    facts.push({ label: 'Format', primary: attendanceLabel(page.format) });
  }

  return facts;
}

export function eventLede(page: SEOEventPageData): string {
  if (page.planning) return `${page.planning.tip[0]} ${page.planning.tip[1]}`;
  return page.whyItMatters;
}

export function eventHeadline(page: SEOEventPageData): string {
  return page.headline ?? `${page.eventName}: Dates, Location & Event Guide`;
}

export interface CalendarAction {
  href: string;
  label: string;
  hint: string;
  provider: 'ics' | 'google';
  trackLabel: string;
}

export function calendarAction(page: SEOEventPageData, googleCalendarUrl: string): CalendarAction {
  if (page.subscribeFirst) {
    return {
      href: '/api/calendar',
      label: 'Subscribe to the calendar',
      hint: 'One calendar for the major tech events, including this one.',
      provider: 'ics',
      trackLabel: 'Subscribe to the calendar',
    };
  }
  return {
    href: googleCalendarUrl,
    label: 'Add to your calendar',
    hint: 'Opens Google Calendar for this event.',
    provider: 'google',
    trackLabel: 'Add to Calendar',
  };
}

export function secondaryLinks(page: SEOEventPageData, whatsappUrl: string): EventLink[] {
  const links: EventLink[] = [];
  const seen = new Set<string>();
  const push = (link: EventLink) => {
    const key = `${link.href}|${link.label}`;
    if (seen.has(key)) return;
    seen.add(key);
    links.push(link);
  };

  for (const action of page.planning?.actions ?? []) {
    push({
      href: action.href,
      label: action.label,
      external: /^https?:/i.test(action.href),
      trackLabel: action.label,
    });
  }

  if (page.registrationUrl) {
    push({
      href: page.registrationUrl,
      label: 'Registration',
      external: true,
      trackLabel: 'Registration',
    });
  }

  push({
    href: page.officialUrl,
    label: 'Official site',
    external: true,
    trackLabel: 'Official Website',
  });

  push({
    href: '#download-ics',
    label: 'Download .ics',
    external: false,
    trackLabel: 'Download .ics',
    downloadIcs: true,
  });

  push({
    href: whatsappUrl,
    label: 'Join WhatsApp',
    external: true,
    trackLabel: 'Join WhatsApp',
  });

  return links;
}

export function relatedLinks(page: SEOEventPageData): Array<{ href?: string; label: string; note?: string }> {
  return (page.relatedLinks ?? []).filter((link) => link.href !== '/api/calendar');
}
