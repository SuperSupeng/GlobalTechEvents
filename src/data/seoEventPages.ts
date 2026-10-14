import generatedSEOEventPages from './generatedSEOEventPages.json' with { type: 'json' };

export interface SEOEventPageData {
  slug: string;
  eventName: string;
  shortName: string;
  startDate: string;
  endDate: string;
  city: string;
  country: string;
  format: 'offline' | 'online' | 'hybrid';
  officialUrl: string;
  registrationUrl?: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  seoTitle: string;
  metaDescription: string;
  whyItMatters: string;
  whoShouldAttend: string[];
  topics: string[];
  faq: Array<{ q: string; a: string }>;
}

export const SEO_EVENT_PAGES: SEOEventPageData[] = [
  {
    slug: 'ces-2026',
    eventName: 'CES 2026',
    shortName: 'CES',
    startDate: '2026-01-06',
    endDate: '2026-01-09',
    city: 'Las Vegas',
    country: 'United States',
    format: 'offline',
    officialUrl: 'https://www.ces.tech/',
    primaryKeyword: 'CES 2026 dates',
    secondaryKeywords: ['CES 2026 location', 'CES 2026 tickets', 'CES 2026 agenda'],
    seoTitle: 'CES 2026 Dates, Location, Tickets & Agenda | GlobalTechEvents',
    metaDescription:
      'CES 2026 dates, location, and key tracks. Get a fast overview of what matters, who should attend, and where to get official CES registration details.',
    whyItMatters:
      'CES is one of the largest global stages for consumer technology, where product launches, hardware trends, and ecosystem partnerships are announced first.',
    whoShouldAttend: ['Founders building hardware or AI products', 'DevRel and product marketers', 'Investors tracking consumer tech trends'],
    topics: ['Consumer Tech', 'AI', 'Mobility', 'Smart Home', 'Enterprise Innovation'],
    faq: [
      { q: 'When is CES 2026?', a: 'CES 2026 is expected in early January 2026, with core exhibition days in Las Vegas.' },
      { q: 'Where is CES 2026 held?', a: 'CES is held in Las Vegas, United States, across major venues on and around the Las Vegas Strip.' },
      { q: 'Where can I register for CES 2026?', a: 'Use the official CES site for current registration windows, pass types, and pricing updates.' },
    ],
  },
  {
    slug: 'mobile-world-congress-2026',
    eventName: 'Mobile World Congress 2026',
    shortName: 'MWC',
    startDate: '2026-03-02',
    endDate: '2026-03-05',
    city: 'Barcelona',
    country: 'Spain',
    format: 'offline',
    officialUrl: 'https://www.mwcbarcelona.com/',
    primaryKeyword: 'Mobile World Congress 2026 dates',
    secondaryKeywords: ['MWC 2026 location', 'MWC 2026 tickets', 'MWC 2026 agenda'],
    seoTitle: 'Mobile World Congress 2026 Dates, Location & Tickets | GlobalTechEvents',
    metaDescription:
      'MWC 2026 dates, venue, and highlights. See who should attend and what trends in telecom, AI devices, and mobile infrastructure are expected.',
    whyItMatters:
      'MWC remains a major meeting point for telecom operators, device makers, and platform companies shaping next-generation mobile connectivity.',
    whoShouldAttend: ['Telecom and infrastructure teams', 'Product leaders in mobile apps and devices', 'Investors and analysts in connectivity'],
    topics: ['5G/6G', 'Telecom Infrastructure', 'Mobile AI', 'Devices', 'Digital Transformation'],
    faq: [
      { q: 'When is Mobile World Congress 2026?', a: 'MWC Barcelona 2026 is expected in early March 2026.' },
      { q: 'Where is MWC 2026?', a: 'MWC is held in Barcelona, Spain, primarily at Fira Gran Via.' },
      { q: 'How do I get MWC tickets?', a: 'Ticket and pass options are released on the official MWC website.' },
    ],
  },
  {
    slug: 'google-io-2026',
    eventName: 'Google I/O 2026',
    shortName: 'Google I/O',
    startDate: '2026-05-01',
    endDate: '2026-05-02',
    city: 'Mountain View',
    country: 'United States',
    format: 'hybrid',
    officialUrl: 'https://io.google/',
    primaryKeyword: 'Google I/O 2026 dates',
    secondaryKeywords: ['Google I/O 2026 location', 'Google I/O 2026 tickets', 'Google I/O 2026 agenda'],
    seoTitle: 'Google I/O 2026 Dates, Location & Sessions | GlobalTechEvents',
    metaDescription:
      'Google I/O 2026 date guide with expected themes, developer tracks, and official links. Quickly decide if this conference fits your roadmap.',
    whyItMatters:
      'Google I/O defines platform direction across Android, web, AI services, and cloud developer tools—often setting priorities for the next 12 months.',
    whoShouldAttend: ['Android and web developers', 'AI application teams', 'Product teams integrating Google ecosystem APIs'],
    topics: ['Android', 'Web', 'AI', 'Cloud APIs', 'Developer Tooling'],
    faq: [
      { q: 'When is Google I/O 2026?', a: 'Google I/O is typically hosted around late spring; check the official site for final dates.' },
      { q: 'Is Google I/O online or in-person?', a: 'Google I/O often includes both in-person and online sessions.' },
      { q: 'Where do I find Google I/O registration?', a: 'Registration details are announced on the official io.google website.' },
    ],
  },
  {
    slug: 'wwdc-2026',
    eventName: 'WWDC 2026',
    shortName: 'WWDC',
    startDate: '2026-06-08',
    endDate: '2026-06-12',
    city: 'Cupertino',
    country: 'United States',
    format: 'hybrid',
    officialUrl: 'https://developer.apple.com/wwdc/',
    primaryKeyword: 'WWDC 2026 dates',
    secondaryKeywords: ['WWDC 2026 location', 'WWDC 2026 tickets', 'WWDC 2026 agenda'],
    seoTitle: 'WWDC 2026 Dates, Location & Developer Highlights | GlobalTechEvents',
    metaDescription:
      'WWDC 2026 dates and event overview. Track keynote timing, platform announcements, and who should follow Apple developer sessions this year.',
    whyItMatters:
      'WWDC is Apple’s primary platform event where OS updates and developer-facing APIs shape product decisions for iOS, macOS, and adjacent ecosystems.',
    whoShouldAttend: ['Apple ecosystem developers', 'Product managers in mobile apps', 'Design and growth teams dependent on iOS platform changes'],
    topics: ['iOS', 'macOS', 'Developer APIs', 'Privacy', 'Apple Intelligence'],
    faq: [
      { q: 'When is WWDC 2026?', a: 'WWDC generally takes place in June; refer to Apple Developer for exact dates.' },
      { q: 'Where is WWDC held?', a: 'WWDC includes online content and selected in-person sessions in Cupertino, California.' },
      { q: 'How can developers access WWDC content?', a: 'Most sessions are published through Apple Developer channels.' },
    ],
  },
  {
    slug: 'nvidia-gtc-2026',
    eventName: 'NVIDIA GTC 2026',
    shortName: 'NVIDIA GTC',
    startDate: '2026-03-16',
    endDate: '2026-03-19',
    city: 'San Jose',
    country: 'United States',
    format: 'hybrid',
    officialUrl: 'https://www.nvidia.com/gtc/',
    primaryKeyword: 'NVIDIA GTC 2026 dates',
    secondaryKeywords: ['NVIDIA GTC 2026 location', 'NVIDIA GTC 2026 tickets', 'NVIDIA GTC 2026 agenda'],
    seoTitle: 'NVIDIA GTC 2026 Dates, Location & AI Agenda | GlobalTechEvents',
    metaDescription:
      'NVIDIA GTC 2026 quick guide: dates, location, and major AI themes. Compare sessions and decide whether your team should prioritize attendance.',
    whyItMatters:
      'GTC is one of the strongest signals for enterprise AI infrastructure, model deployment direction, and practical GenAI use cases.',
    whoShouldAttend: ['AI engineers and platform teams', 'CTOs planning model infrastructure', 'Startups building on accelerated computing stacks'],
    topics: ['Generative AI', 'Inference', 'Data Platforms', 'Robotics', 'Accelerated Computing'],
    faq: [
      { q: 'When is NVIDIA GTC 2026?', a: 'NVIDIA GTC 2026 is expected around mid-March, with both live and on-demand components.' },
      { q: 'Where is GTC hosted?', a: 'Recent editions include San Jose as the in-person hub with online session access.' },
      { q: 'Is NVIDIA GTC suitable for non-research teams?', a: 'Yes, many sessions focus on practical enterprise and product implementation.' },
    ],
  },
  {
    slug: 'aws-reinvent-2026',
    eventName: 'AWS re:Invent 2026',
    shortName: 'AWS re:Invent',
    startDate: '2026-11-30',
    endDate: '2026-12-04',
    city: 'Las Vegas',
    country: 'United States',
    format: 'offline',
    officialUrl: 'https://reinvent.awsevents.com/',
    primaryKeyword: 'AWS re:Invent 2026 dates',
    secondaryKeywords: ['AWS re:Invent 2026 location', 'AWS re:Invent 2026 tickets', 'AWS re:Invent 2026 agenda'],
    seoTitle: 'AWS re:Invent 2026 Dates, Location & Registration | GlobalTechEvents',
    metaDescription:
      'AWS re:Invent 2026 dates and location summary with key tracks for cloud architecture, AI, and security teams planning annual conference priorities.',
    whyItMatters:
      'AWS re:Invent is a major annual checkpoint for cloud architecture, platform roadmap updates, and ecosystem-level implementation patterns.',
    whoShouldAttend: ['Cloud architects and DevOps teams', 'CTOs and platform leads', 'Security and data engineering teams'],
    topics: ['Cloud Architecture', 'Serverless', 'Data & AI', 'Security', 'DevOps'],
    faq: [
      { q: 'When is AWS re:Invent 2026?', a: 'AWS re:Invent is typically held in late November to early December.' },
      { q: 'Where is AWS re:Invent hosted?', a: 're:Invent takes place in Las Vegas across multiple major conference venues.' },
      { q: 'How do I register for AWS re:Invent?', a: 'Use the official re:Invent event portal for pass options and updates.' },
    ],
  },
  {
    slug: 'leap-2026',
    eventName: 'LEAP 2026',
    shortName: 'LEAP',
    startDate: '2026-02-09',
    endDate: '2026-02-12',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    format: 'offline',
    officialUrl: 'https://www.onegiantleap.com/',
    primaryKeyword: 'LEAP 2026 dates',
    secondaryKeywords: ['LEAP 2026 location', 'LEAP 2026 tickets', 'LEAP 2026 agenda'],
    seoTitle: 'LEAP 2026 Dates, Location & Event Guide | GlobalTechEvents',
    metaDescription:
      'LEAP 2026 dates, venue, and focus tracks. Understand why LEAP matters for AI startups, enterprise transformation, and regional tech expansion.',
    whyItMatters:
      'LEAP has become a high-visibility platform for global technology announcements, ecosystem partnerships, and rapid market expansion in MENA.',
    whoShouldAttend: ['AI and SaaS founders', 'Investors entering MENA markets', 'Enterprise innovation teams'],
    topics: ['AI', 'Smart Cities', 'Enterprise IT', 'Cloud', 'Digital Economy'],
    faq: [
      { q: 'When is LEAP 2026?', a: 'LEAP 2026 is expected in February; check official channels for final schedule.' },
      { q: 'Where is LEAP held?', a: 'LEAP is hosted in Riyadh, Saudi Arabia.' },
      { q: 'What audience is LEAP best for?', a: 'LEAP is strong for founders, enterprise leaders, and ecosystem builders in emerging growth markets.' },
    ],
  },
  {
    slug: 'gitex-2026',
    eventName: 'GITEX 2026',
    shortName: 'GITEX',
    startDate: '2026-10-12',
    endDate: '2026-10-16',
    city: 'Dubai',
    country: 'United Arab Emirates',
    format: 'offline',
    officialUrl: 'https://www.gitex.com/',
    primaryKeyword: 'GITEX 2026 dates',
    secondaryKeywords: ['GITEX 2026 location', 'GITEX 2026 tickets', 'GITEX 2026 agenda'],
    seoTitle: 'GITEX 2026 Dates, Location & Technology Tracks | GlobalTechEvents',
    metaDescription:
      'GITEX 2026 dates, location, and track overview. Fast summary for teams exploring enterprise AI, cybersecurity, and digital government themes.',
    whyItMatters:
      'GITEX is a strategic global event for enterprise technology adoption, public-private innovation collaboration, and market-entry visibility in the Gulf region.',
    whoShouldAttend: ['Enterprise digital teams', 'Government innovation leaders', 'Vendors targeting EMEA expansion'],
    topics: ['Enterprise AI', 'Cybersecurity', 'Cloud', 'Digital Government', 'Startup Ecosystems'],
    faq: [
      { q: 'When is GITEX 2026?', a: 'GITEX Global is typically held in October each year.' },
      { q: 'Where is GITEX hosted?', a: 'GITEX is hosted in Dubai, UAE.' },
      { q: 'Is GITEX suitable for startup teams?', a: 'Yes, especially for teams seeking partnerships and regional visibility.' },
    ],
  },
  {
    slug: 'vivatech-2026',
    eventName: 'VivaTech 2026',
    shortName: 'VivaTech',
    startDate: '2026-06-17',
    endDate: '2026-06-20',
    city: 'Paris',
    country: 'France',
    format: 'offline',
    officialUrl: 'https://vivatechnology.com/',
    primaryKeyword: 'VivaTech 2026 dates',
    secondaryKeywords: ['VivaTech 2026 location', 'VivaTech 2026 tickets', 'VivaTech 2026 agenda'],
    seoTitle: 'VivaTech 2026 Dates, Location & Startup Highlights | GlobalTechEvents',
    metaDescription:
      'VivaTech 2026 event guide with dates, venue, and key themes. Useful for founders, product teams, and investors tracking European tech momentum.',
    whyItMatters:
      'VivaTech is a high-signal European event bridging startups, corporates, and public-sector innovation agendas across AI and deep tech.',
    whoShouldAttend: ['Startup founders', 'Corporate innovation teams', 'VC and ecosystem operators in Europe'],
    topics: ['Startups', 'AI', 'Sustainability Tech', 'Corporate Innovation', 'European Ecosystems'],
    faq: [
      { q: 'When is VivaTech 2026?', a: 'VivaTech is usually scheduled in June in Paris.' },
      { q: 'Where is VivaTech held?', a: 'VivaTech is hosted in Paris, France, typically at Paris Expo Porte de Versailles.' },
      { q: 'What makes VivaTech different?', a: 'VivaTech combines startup exposure, enterprise partnership opportunities, and policy-level ecosystem visibility.' },
    ],
  },
  {
    slug: 'rsa-conference-2026',
    eventName: 'RSA Conference 2026',
    shortName: 'RSA Conference',
    startDate: '2026-04-27',
    endDate: '2026-04-30',
    city: 'San Francisco',
    country: 'United States',
    format: 'offline',
    officialUrl: 'https://www.rsaconference.com/',
    primaryKeyword: 'RSA Conference 2026 dates',
    secondaryKeywords: ['RSA Conference 2026 location', 'RSA Conference 2026 tickets', 'RSA Conference 2026 agenda'],
    seoTitle: 'RSA Conference 2026 Dates, Location & Security Agenda | GlobalTechEvents',
    metaDescription:
      'RSA Conference 2026 dates and venue plus key cybersecurity themes. Quick briefing for security teams planning conference priorities and attendance.',
    whyItMatters:
      'RSA Conference is a core global security event where vendors, practitioners, and policy stakeholders align on emerging cyber risk priorities.',
    whoShouldAttend: ['Security leaders and SOC teams', 'CISOs and compliance managers', 'Security product and platform vendors'],
    topics: ['Cybersecurity', 'Cloud Security', 'Identity', 'Threat Intelligence', 'Governance'],
    faq: [
      { q: 'When is RSA Conference 2026?', a: 'RSA Conference generally runs in spring, with the 2026 edition expected in late April.' },
      { q: 'Where is RSA Conference held?', a: 'The conference is hosted in San Francisco, United States.' },
      { q: 'Who should prioritize RSA Conference?', a: 'Security operations, compliance, and product teams evaluating cybersecurity strategy.' },
    ],
  },
];

export const ALL_SEO_EVENT_PAGES: SEOEventPageData[] =
  generatedSEOEventPages.length > 0 ? (generatedSEOEventPages as SEOEventPageData[]) : SEO_EVENT_PAGES;

export function getSEOEventPageBySlug(slug: string): SEOEventPageData | undefined {
  return ALL_SEO_EVENT_PAGES.find((item) => item.slug === slug);
}

export function getSEOEventPageByPath(pathname: string): SEOEventPageData | undefined {
  const match = pathname.match(/^\/events\/([a-z0-9-]+)\/?$/i);
  if (!match) return undefined;
  return getSEOEventPageBySlug(match[1]);
}
