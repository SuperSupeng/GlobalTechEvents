export interface RecapFact {
  label: string;
  primary: string;
  secondary?: string;
  note?: string;
}

export interface RecapEntryNote {
  /** Matched against the entry title from the approved draft. */
  titleIncludes: string;
  note: string;
}

export interface RecapPage {
  slug: string;
  eventSlug: string;
  eventName: string;
  title: string;
  seoTitle: string;
  description: string;
  updated: string;
  facts: RecapFact[];
  /** Shown under the facts when a figure needs a label before the long source list. */
  callout?: string;
  entryNotes?: RecapEntryNote[];
}

export const RECAP_PAGES: RecapPage[] = [
  {
    slug: 'web-summit-lisbon-2026',
    eventSlug: 'web-summit-lisbon-2026',
    eventName: 'Web Summit Lisbon 2026',
    title: 'Web Summit Lisbon 2026: public notes and recap posts',
    seoTitle: 'Web Summit Lisbon 2026: public notes and recap posts | GlobalTechEvents',
    description:
      'Official updates, session summaries, news reports, and public posts from Web Summit Lisbon, 9–12 November 2026 at MEO Arena and FIL.',
    updated: '13 November 2026',
    facts: [
      {
        label: 'Dates',
        primary: '9–12 November',
        secondary: '2026',
        note: '11 November did not take place.',
      },
      {
        label: 'Place',
        primary: 'Lisbon',
        secondary: 'Portugal',
        note: 'MEO Arena and FIL',
      },
      {
        label: 'Attendees',
        primary: '70,003',
        secondary: '164 countries',
        note: 'Official figure',
      },
    ],
  },
  {
    slug: 'openai-devday-2026',
    eventSlug: 'openai-devday-2026',
    eventName: 'OpenAI DevDay 2026',
    title: 'OpenAI DevDay 2026: public notes and recap posts',
    seoTitle: 'OpenAI DevDay 2026: public notes and recap posts | GlobalTechEvents',
    description:
      'Official updates, news reports, and attendee recaps from OpenAI DevDay on 29 September 2026. Fort Mason and the roughly 2,500 figure are from reports, not the official recap.',
    updated: '13 November 2026',
    facts: [
      { label: 'Dates', primary: '29 September', secondary: '2026' },
      {
        label: 'Place',
        primary: 'San Francisco',
        secondary: 'Fort Mason Center',
        note: 'From reports, not the official announcement',
      },
      {
        label: 'Attendance',
        primary: 'Roughly 2,500',
        note: 'From reports and attendee recaps, not the official recap',
      },
    ],
  },
  {
    slug: 'github-universe-2026',
    eventSlug: 'github-universe-2026',
    eventName: 'GitHub Universe 2026',
    title: 'GitHub Universe 2026: public notes and recap posts',
    seoTitle: 'GitHub Universe 2026: public notes and recap posts | GlobalTechEvents',
    description:
      'Official updates, talk reports, and attendee recaps from GitHub Universe, 28–29 October 2026 in San Francisco. Octoverse figures are platform-year stats, not attendance.',
    updated: '13 November 2026',
    facts: [
      { label: 'Dates', primary: '28–29 October', secondary: '2026' },
      { label: 'Place', primary: 'San Francisco', secondary: 'Fort Mason Center' },
    ],
    callout:
      'Octoverse figures on this page are GitHub platform-year stats for 1 October 2025 through 30 September 2026. They are not attendance at Universe.',
    entryNotes: [
      {
        titleIncludes: 'Octoverse:',
        note: 'Platform-year stats, not attendance at Universe.',
      },
    ],
  },
];

const SITE_ORIGIN = 'https://www.globaltechevents.xyz';

export function recapPublicPath(slug: string): string {
  return `/recaps/${slug}`;
}

export function recapPathForEvent(eventSlug: string): string | undefined {
  const page = RECAP_PAGES.find((item) => item.eventSlug === eventSlug);
  return page ? recapPublicPath(page.slug) : undefined;
}

export function indexableRecapUrls(origin = SITE_ORIGIN): string[] {
  return RECAP_PAGES.map((page) => `${origin}${recapPublicPath(page.slug)}`);
}
