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

type TopicMatch = {
  type: 'topic';
  slugs: string[];
};

export type ShellLink = {
  href: string;
  label: string;
  note?: string;
};

export type ShellSection = {
  heading: string;
  intro?: string;
  links: ShellLink[];
};

export type IndexableShell = {
  kind: 'city' | 'track' | 'topic';
  slug: string;
  path: string;
  h1: string;
  intro: string;
  seoTitle: string;
  metaDescription: string;
  limit: number;
  links?: ShellLink[];
  sections?: ShellSection[];
  match: CityMatch | TrackMatch | TopicMatch;
};

const ACADEMIC_EVENT = /neurips|icml|cvpr/i;

export function isAcademicEvent(event: Pick<ShellEventRef, 'slug' | 'eventName'>): boolean {
  return ACADEMIC_EVENT.test(event.slug) || ACADEMIC_EVENT.test(event.eventName);
}

export const INDEXABLE_SHELLS: IndexableShell[] = [
  {
    kind: 'city',
    slug: 'san-francisco',
    path: '/cities/san-francisco',
    h1: 'Tech events in San Francisco',
    intro:
      'As of 16 October 2026, pick a San Francisco or Bay Area week by the stack you ship. Microsoft Build, Dreamforce, OpenAI DevDay, and the Databricks Data + AI Summit were in the city and have already run. Code with Claude listed a San Francisco day on 6 May 2026 and also listed London and Tokyo. NVIDIA GTC was the GPU week in San Jose, not in San Francisco, and it has already run. TechCrunch Disrupt is the startup week listed on this calendar. Stripe Sessions 2027 is 4-6 May 2027 at Moscone North and South. The AI conferences guide separates what is still ahead from weeks that have finished, including Bay Area venues outside the city.',
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
        href: '/events/anthropic-events',
        label: 'Anthropic events',
        note: 'Code with Claude had a San Francisco day on 6 May 2026, plus London and Tokyo. The 2026 city page does not name a venue.',
      },
      {
        href: '/events/stripe-sessions-2027',
        label: 'Stripe Sessions 2027',
        note: '4-6 May 2027 at Moscone North and South, San Francisco.',
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
  {
    kind: 'topic',
    slug: 'ai',
    path: '/topics/ai',
    h1: 'AI conferences',
    intro:
      'As of 16 October 2026, pick an industry AI week by the stack you ship. NVIDIA GTC in San Jose (16-19 March) is the GPU and inference week, and it has already run. Google Cloud Next in Las Vegas (22-24 April) has already run. AWS re:Invent in Las Vegas (30 November-4 December) is still ahead. Microsoft Build (2-3 June, Fort Mason) and OpenAI DevDay (29 September, Fort Mason) were the San Francisco builder weeks, and both have already run. Code with Claude listed San Francisco on 6 May, London on 19 May, and Tokyo on 10 June 2026, and those days have already run. The Databricks Data + AI Summit (15-18 June, Moscone Center) was the production data week and has already run. SuperAI Singapore (10-11 June, Marina Bay Sands) and Dreamforce (15-17 September, Moscone Center) have already run. KubeCon North America in Salt Lake City (9-12 November) is still ahead for platform teams. TechCrunch Disrupt (13-16 October, San Francisco) is the startup week on this calendar. The best AI conferences guide and the San Francisco AI conferences guide compare these weeks in more detail.',
    seoTitle: 'AI conferences | GlobalTechEvents',
    metaDescription:
      'Industry AI conferences on this calendar, with guides for GTC, Cloud Next, Build, DevDay, Databricks, re:Invent, and KubeCon.',
    limit: 20,
    links: [
      {
        href: '/events/nvidia-gtc-2026',
        label: 'NVIDIA GTC 2026',
        note: 'Already held 16-19 March 2026 in San Jose. GPU, inference, and accelerated computing.',
      },
      {
        href: '/events/google-cloud-next-2026',
        label: 'Google Cloud Next 2026',
        note: 'Already held 22-24 April 2026 at Mandalay Bay, Las Vegas. Partner programming started 21 April.',
      },
      {
        href: '/events/microsoft-build-2026',
        label: 'Microsoft Build 2026',
        note: 'Already held 2-3 June 2026 at Fort Mason, San Francisco, plus an online track.',
      },
      {
        href: '/events/superai-singapore-2026',
        label: 'SuperAI Singapore 2026',
        note: 'Already held 10-11 June 2026 at Marina Bay Sands.',
      },
      {
        href: '/events/databricks-data-ai-summit-2026',
        label: 'Databricks Data + AI Summit 2026',
        note: 'Already held 15-18 June 2026 at Moscone Center, San Francisco, with a virtual track.',
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
        href: '/events/anthropic-events',
        label: 'Anthropic events',
        note: 'Code with Claude 2026. San Francisco 6 May, London 19 May, Tokyo 10 June. Already held. No single venue printed.',
      },
      {
        href: '/events/techcrunch-disrupt-2026',
        label: 'TechCrunch Disrupt 2026',
        note: 'Listed 13-16 October 2026 in San Francisco.',
      },
      {
        href: '/events/kubecon-na-2026',
        label: 'KubeCon + CloudNativeCon North America 2026',
        note: '9-12 November 2026 at the Salt Palace, Salt Lake City. Monday 9 November is co-located.',
      },
      {
        href: '/events/aws-reinvent-2026',
        label: 'AWS re:Invent 2026',
        note: '30 November-4 December 2026 in Las Vegas. Badge pickup starts 29 November.',
      },
      { href: '/topics/ai-agents', label: 'AI agent conferences' },
      { href: '/tracks/ai', label: 'AI and agent conferences' },
      { href: '/cities/san-francisco', label: 'Tech events in San Francisco' },
      { href: '/guides/best-ai-conferences-2026', label: 'Best AI conferences 2026' },
      { href: '/guides/ai-conferences-san-francisco-2026', label: 'AI conferences in San Francisco 2026' },
    ],
    match: {
      type: 'topic',
      slugs: [
        'nvidia-gtc-2026',
        'google-cloud-next-2026',
        'microsoft-build-2026',
        'superai-singapore-2026',
        'databricks-data-ai-summit-2026',
        'dreamforce-2026',
        'openai-devday-2026',
        'anthropic-events',
        'techcrunch-disrupt-2026',
        'kubecon-na-2026',
        'aws-reinvent-2026',
      ],
    },
  },
  {
    kind: 'topic',
    slug: 'ai-agents',
    path: '/topics/ai-agents',
    h1: 'AI agent conferences',
    intro:
      'As of 16 October 2026, start with the builder and product weeks on this calendar that cover agents, APIs, and shipping software. OpenAI DevDay (29 September, Fort Mason) and Microsoft Build (2-3 June, Fort Mason) are the agent rooms, and both have already run. Code with Claude listed San Francisco on 6 May, London on 19 May, and Tokyo on 10 June 2026, and those days have already run. Google Cloud Next (22-24 April, Las Vegas), Google I/O (1-2 May, Mountain View), and the Databricks Data + AI Summit (15-18 June, Moscone Center) are the product and production weeks, and those 2026 editions have already run. AWS re:Invent (30 November-4 December, Las Vegas) and KubeCon North America (9-12 November, Salt Lake City) are still ahead. NVIDIA GTC (16-19 March, San Jose) was the infrastructure week and has already run. Dreamforce (15-17 September, Moscone Center) was the enterprise product week and has already run. SuperAI Singapore (10-11 June, Marina Bay Sands) was the founder and buyer week and has already run.',
    seoTitle: 'AI agent conferences | GlobalTechEvents',
    metaDescription:
      'Agent, builder, and product conferences on this calendar, including DevDay, Build, Cloud Next, re:Invent, and KubeCon.',
    limit: 20,
    links: [
      { href: '/topics/ai', label: 'AI conferences' },
      { href: '/tracks/ai', label: 'AI and agent conferences' },
      { href: '/cities/san-francisco', label: 'Tech events in San Francisco' },
      { href: '/guides/best-ai-conferences-2026', label: 'Best AI conferences 2026' },
      { href: '/guides/ai-conferences-san-francisco-2026', label: 'AI conferences in San Francisco 2026' },
    ],
    sections: [
      {
        heading: 'Agents',
        intro: 'Open these industry event guides for the agent, builder, and product weeks on this calendar.',
        links: [
          {
            href: '/events/openai-devday-2026',
            label: 'OpenAI DevDay 2026',
            note: 'Agent and API builder day. Already held 29 September 2026 at Fort Mason. In-person entry required an invitation.',
          },
          {
            href: '/events/anthropic-events',
            label: 'Anthropic events',
            note: 'Code with Claude 2026 across San Francisco, London, and Tokyo. Already held. No single venue printed.',
          },
          {
            href: '/events/microsoft-build-2026',
            label: 'Microsoft Build 2026',
            note: 'Azure, AI, and agents. Already held 2-3 June 2026 at Fort Mason and online.',
          },
          {
            href: '/events/google-cloud-next-2026',
            label: 'Google Cloud Next 2026',
            note: 'Google Cloud product direction and AI services. Already held 22-24 April 2026 at Mandalay Bay.',
          },
          {
            href: '/events/google-io-2026',
            label: 'Google I/O 2026',
            note: 'Android, web, AI services, and cloud developer tools. Listed 1-2 May 2026 in Mountain View.',
          },
          {
            href: '/events/databricks-data-ai-summit-2026',
            label: 'Databricks Data + AI Summit 2026',
            note: 'Production data and AI teams. Already held 15-18 June 2026 at Moscone Center, with a virtual track.',
          },
          {
            href: '/events/aws-reinvent-2026',
            label: 'AWS re:Invent 2026',
            note: 'Cloud, AI, and security product launches. 30 November-4 December 2026 in Las Vegas.',
          },
          {
            href: '/events/nvidia-gtc-2026',
            label: 'NVIDIA GTC 2026',
            note: 'Enterprise AI infrastructure. Already held 16-19 March 2026 in San Jose.',
          },
          {
            href: '/events/kubecon-na-2026',
            label: 'KubeCon + CloudNativeCon North America 2026',
            note: 'Platform engineering and AI inference. 9-12 November 2026 in Salt Lake City.',
          },
          {
            href: '/events/dreamforce-2026',
            label: 'Dreamforce 2026',
            note: 'Enterprise CRM, data, and AI product direction. Already held 15-17 September 2026 at Moscone Center.',
          },
          {
            href: '/events/superai-singapore-2026',
            label: 'SuperAI Singapore 2026',
            note: 'Founders, buyers, and infrastructure. Already held 10-11 June 2026 at Marina Bay Sands.',
          },
        ],
      },
    ],
    match: {
      type: 'topic',
      slugs: [
        'openai-devday-2026',
        'anthropic-events',
        'microsoft-build-2026',
        'google-cloud-next-2026',
        'google-io-2026',
        'databricks-data-ai-summit-2026',
        'aws-reinvent-2026',
        'nvidia-gtc-2026',
        'kubecon-na-2026',
        'dreamforce-2026',
        'superai-singapore-2026',
      ],
    },
  },
];

function hasToken(haystack: string, needle: string): boolean {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:[^a-z0-9]|$)`, 'i').test(haystack);
}

function eventMatches(shell: IndexableShell, event: ShellEventRef): boolean {
  if (isAcademicEvent(event)) return false;

  if (shell.match.type === 'city') {
    const city = event.city.trim().toLowerCase();
    return shell.match.cities.some((name) => name.toLowerCase() === city);
  }

  if (shell.match.type === 'topic') {
    return shell.match.slugs.includes(event.slug);
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
