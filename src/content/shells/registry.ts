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
  links?: { href: string; label: string; note?: string }[];
  match: CityMatch | TrackMatch;
};

export const INDEXABLE_SHELLS: IndexableShell[] = [
  {
    kind: 'city',
    slug: 'san-francisco',
    path: '/cities/san-francisco',
    h1: 'Tech events in San Francisco',
    intro:
      'As of 16 October 2026, pick a San Francisco or Bay Area week by the stack you ship. Microsoft Build, Dreamforce, OpenAI DevDay, and the Databricks Data + AI Summit were in the city and have already run. NVIDIA GTC was the GPU week in San Jose, not in San Francisco, and it has already run. TechCrunch Disrupt is the startup week listed on this calendar. The AI conferences guide separates what is still ahead from weeks that have finished, including Bay Area venues outside the city.',
    seoTitle: 'Tech events in San Francisco | GlobalTechEvents',
    metaDescription:
      'San Francisco and Bay Area AI-tech events on this calendar, with guides for Build, Dreamforce, DevDay, Databricks, Disrupt, and NVIDIA GTC in San Jose.',
    limit: 50,
    links: [
      {
        href: '/events/microsoft-build-2026',
        label: 'Microsoft Build 2026',
        note: 'Already held 2-3 June 2026 at Fort Mason, San Francisco, plus an online track.',
      },
      {
        href: '/events/dreamforce-2026',
        label: 'Dreamforce 2026',
        note: 'Already held 15-17 September 2026 at Moscone Center, San Francisco, with Salesforce+.',
      },
      {
        href: '/events/openai-devday-2026',
        label: 'OpenAI DevDay 2026',
        note: 'Already held 29 September 2026 at Fort Mason, San Francisco.',
      },
      {
        href: '/events/databricks-data-ai-summit-2026',
        label: 'Databricks Data + AI Summit 2026',
        note: 'Already held 15-18 June 2026 at Moscone Center, San Francisco, with a virtual track.',
      },
      {
        href: '/events/techcrunch-disrupt-2026',
        label: 'TechCrunch Disrupt 2026',
        note: 'Listed 13-16 October 2026 in San Francisco.',
      },
      {
        href: '/events/nvidia-gtc-2026',
        label: 'NVIDIA GTC 2026',
        note: 'Already held 16-19 March 2026 in San Jose, not in San Francisco.',
      },
      {
        href: '/guides/ai-conferences-san-francisco-2026',
        label: 'AI conferences in San Francisco 2026',
        note: 'Upcoming versus held, including Bay Area venues outside the city.',
      },
    ],
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
    links: [
      { href: '/guides/best-ai-conferences-2026', label: 'Best AI conferences 2026' },
      { href: '/guides/ai-conferences-san-francisco-2026', label: 'AI conferences in San Francisco 2026' },
    ],
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
