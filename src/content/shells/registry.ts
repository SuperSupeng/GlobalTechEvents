export type ShellEventRef = {
  slug: string;
  eventName: string;
  city: string;
  country: string;
  startDate: string;
  topics: string[];
};

type CityMatch = {
  type: 'city';
  cities: string[];
};

type TrackMatch = {
  type: 'track';
  needles: string[];
};

export type IndexableShell = {
  kind: 'city' | 'track';
  slug: string;
  path: string;
  h1: string;
  intro: string;
  seoTitle: string;
  metaDescription: string;
  limit: number;
  links?: { href: string; label: string }[];
  match: CityMatch | TrackMatch;
};

export const INDEXABLE_SHELLS: IndexableShell[] = [
  {
    kind: 'city',
    slug: 'san-francisco',
    path: '/cities/san-francisco',
    h1: 'Tech events in San Francisco',
    intro:
      'San Francisco events on this calendar are listed below. Each link opens the event guide for dates and location.',
    seoTitle: 'Tech events in San Francisco | GlobalTechEvents',
    metaDescription:
      'Tech events in San Francisco with links to event guides for dates and location.',
    limit: 50,
    match: { type: 'city', cities: ['San Francisco'] },
  },
  {
    kind: 'track',
    slug: 'ai',
    path: '/tracks/ai',
    h1: 'AI and agent conferences',
    intro:
      'These events match an AI or agent title or topic on this calendar. Open an event for dates and location. For a longer comparison, read the AI conferences guide.',
    seoTitle: 'AI and agent conferences | GlobalTechEvents',
    metaDescription:
      'AI and agent conferences from the GlobalTechEvents calendar, with links to event guides.',
    limit: 30,
    links: [{ href: '/guides/best-ai-conferences-2026', label: 'Best AI conferences 2026' }],
    match: { type: 'track', needles: ['ai', 'agent'] },
  },
];

function hasToken(haystack: string, needle: string): boolean {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:[^a-z0-9]|$)`, 'i').test(haystack);
}

function eventMatches(shell: IndexableShell, event: ShellEventRef): boolean {
  if (shell.match.type === 'city') {
    const city = event.city.trim().toLowerCase();
    return shell.match.cities.some((name) => name.toLowerCase() === city);
  }

  const haystack = `${event.eventName} ${event.topics.join(' ')}`;
  return shell.match.needles.some((needle) => hasToken(haystack, needle));
}

export function relatedEventsForShell(shell: IndexableShell, events: ShellEventRef[]): ShellEventRef[] {
  return events
    .filter((event) => event.slug && eventMatches(shell, event))
    .sort((a, b) => a.startDate.localeCompare(b.startDate) || a.eventName.localeCompare(b.eventName))
    .slice(0, shell.limit);
}
