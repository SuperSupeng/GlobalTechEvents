import generatedSEOEventPages from './generatedSEOEventPages.json' with { type: 'json' };

export interface SEOEventStop {
  name: string;
  startDate: string;
  endDate: string;
  city: string;
  country: string;
  format: 'offline' | 'online' | 'hybrid';
  officialUrl: string;
  detail: string;
}

export interface SEOEventSourceLink {
  label: string;
  url: string;
}

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
  stops?: SEOEventStop[];
  sources?: SEOEventSourceLink[];
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
    slug: 'mwc-barcelona-2027',
    eventName: 'MWC Barcelona 2027',
    shortName: 'MWC Barcelona',
    startDate: '2027-03-01',
    endDate: '2027-03-04',
    city: 'Barcelona',
    country: 'Spain',
    format: 'offline',
    officialUrl: 'https://www.mwcbarcelona.com/',
    primaryKeyword: 'MWC Barcelona 2027 dates',
    secondaryKeywords: ['MWC Barcelona 2027 location', 'MWC Barcelona 2027 tickets', 'MWC Barcelona 2027 agenda'],
    seoTitle: 'MWC Barcelona 2027 Dates, Location & Tickets | GlobalTechEvents',
    metaDescription:
      'MWC Barcelona 2027 is 1-4 March 2027 at Fira Gran Via in Barcelona.',
    whyItMatters:
      'MWC Barcelona is the GSMA flagship for operators, device makers, and connectivity vendors. Go if your 2027 plan depends on carrier roadmaps, device launches, or telecom partnerships. Skip it if you only need a software or crypto expo. Confirm passes on the official site before you book travel.',
    whoShouldAttend: ['Telecom and infrastructure teams', 'Product leaders in mobile apps and devices', 'Investors and analysts in connectivity'],
    topics: ['5G/6G', 'Telecom Infrastructure', 'Mobile AI', 'Devices', 'Connectivity'],
    faq: [
      { q: 'When is MWC Barcelona 2027?', a: 'MWC Barcelona 2027 runs 1-4 March 2027. The GSMA Ministerial Programme is listed for 1-3 March 2027.' },
      { q: 'Where is MWC Barcelona 2027?', a: 'It is at Fira Gran Via in Barcelona, Spain.' },
      { q: 'How do I get MWC Barcelona 2027 tickets?', a: 'Pass options are published on the official MWC Barcelona website.' },
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
    metaDescription: 'NVIDIA GTC 2026 was 16-19 March 2026 in San Jose.',
    whyItMatters:
      'NVIDIA GTC is where NVIDIA sets its enterprise AI infrastructure plans. The 2026 San Jose meeting ran 16-19 March 2026, and the keynote was on 16 March. Go now only for on-demand sessions. Skip a flight for those dates. The official site lists the next San Jose meeting as 15-18 March 2027. Confirm that page before you plan travel.',
    whoShouldAttend: ['AI engineers and platform teams', 'CTOs planning model infrastructure', 'Startups building on accelerated computing stacks'],
    topics: ['Generative AI', 'Inference', 'Data Platforms', 'Robotics', 'Accelerated Computing'],
    faq: [
      { q: 'When is NVIDIA GTC 2026?', a: 'NVIDIA GTC 2026 ran 16-19 March 2026 in San Jose. The keynote was on 16 March.' },
      { q: 'Where was NVIDIA GTC 2026 hosted?', a: 'The in-person hub was San Jose, California, centered on the San Jose McEnery Convention Center. The keynote was also livestreamed.' },
      { q: 'Is NVIDIA GTC suitable for non-research teams?', a: 'Yes. Many sessions cover enterprise deployment, inference, and product implementation.' },
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
    officialUrl: 'https://aws.amazon.com/events/reinvent/',
    primaryKeyword: 'AWS re:Invent 2026 dates',
    secondaryKeywords: ['AWS re:Invent 2026 location', 'AWS re:Invent 2026 tickets', 'AWS re:Invent 2026 agenda'],
    seoTitle: 'AWS re:Invent 2026 Dates, Location & Registration | GlobalTechEvents',
    metaDescription: 'AWS re:Invent 2026 is 30 November through 4 December 2026 in Las Vegas.',
    whyItMatters:
      'AWS re:Invent is still ahead. Go if service launches that week change your cloud, AI, or security plan. Skip the flight if a keynote stream is enough. AWS will livestream keynotes for free. Badge pickup starts 29 November. Sessions run 30 November through 4 December. For 2026, re:Inforce is part of this week, with a security focus day on 3 December at the Wynn.',
    whoShouldAttend: ['Cloud architects and DevOps teams', 'CTOs and platform leads', 'Security and data engineering teams'],
    topics: ['Cloud Architecture', 'Serverless', 'Data & AI', 'Security', 'DevOps'],
    faq: [
      { q: 'When is AWS re:Invent 2026?', a: 'AWS re:Invent 2026 is 30 November through 4 December 2026.' },
      { q: 'Where is AWS re:Invent 2026 hosted?', a: 're:Invent 2026 is in Las Vegas, United States.' },
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
    slug: 'gitex-global-2026',
    eventName: 'GITEX GLOBAL 2026',
    shortName: 'GITEX GLOBAL',
    startDate: '2026-12-07',
    endDate: '2026-12-11',
    city: 'Dubai',
    country: 'United Arab Emirates',
    format: 'offline',
    officialUrl: 'https://www.gitex.com/',
    primaryKeyword: 'GITEX GLOBAL 2026 dates',
    secondaryKeywords: ['GITEX GLOBAL 2026 Dubai', 'GITEX GLOBAL 2026 tickets', 'GITEX GLOBAL 2026 agenda'],
    seoTitle: 'GITEX GLOBAL 2026 Dates, Dubai Location & Tickets | GlobalTechEvents',
    metaDescription: 'GITEX GLOBAL 2026 is 7-11 December 2026 in Dubai.',
    whyItMatters:
      'GITEX GLOBAL is the Dubai enterprise technology exhibition. It is not GITEX AI Europe. Go if you sell to Gulf enterprises or government buyers that week. Skip it if your buyers are only in Europe or North America. The summit is 7 December at Dubai World Trade Centre. The expo is 8-11 December at Dubai Exhibition Centre, Expo City Dubai.',
    whoShouldAttend: ['Enterprise digital teams', 'Government innovation leaders', 'Founders and vendors entering the Gulf market'],
    topics: ['Enterprise AI', 'Cybersecurity', 'Cloud', 'GovTech', 'Startups'],
    faq: [
      { q: 'When is GITEX GLOBAL 2026?', a: 'GITEX GLOBAL 2026 is 7-11 December 2026. The GITEX Summit is 7 December, and the expo and conferences run 8-11 December.' },
      { q: 'Where is GITEX GLOBAL 2026?', a: 'The summit is at Dubai World Trade Centre. The expo is at Dubai Exhibition Centre, Expo City Dubai.' },
      { q: 'Is GITEX AI Europe the same event?', a: 'No. GITEX AI Europe is a separate regional event. This page is GITEX GLOBAL in Dubai.' },
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
    // Published RSAC 2026 window is 23-26 March at Moscone Center, not 27-30 April.
    startDate: '2026-03-23',
    endDate: '2026-03-26',
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
      { q: 'When is RSA Conference 2026?', a: 'RSA Conference 2026 ran 23-26 March 2026.' },
      { q: 'Where is RSA Conference 2026 held?', a: 'It was at Moscone Center in San Francisco, United States.' },
      { q: 'Who should prioritize RSA Conference?', a: 'Security operations, compliance, and product teams evaluating cybersecurity strategy.' },
    ],
  },
  {
    slug: 'token2049-singapore-2026',
    eventName: 'TOKEN2049 Singapore 2026',
    shortName: 'TOKEN2049',
    startDate: '2026-10-07',
    endDate: '2026-10-08',
    city: 'Singapore',
    country: 'Singapore',
    format: 'offline',
    officialUrl: 'https://www.token2049.com/singapore',
    primaryKeyword: 'TOKEN2049 Singapore 2026 dates',
    secondaryKeywords: ['TOKEN2049 Singapore 2026 location', 'TOKEN2049 Singapore 2026 tickets', 'TOKEN2049 Singapore 2026 agenda'],
    seoTitle: 'TOKEN2049 Singapore 2026 Dates, Location & Tickets | GlobalTechEvents',
    metaDescription: 'TOKEN2049 Singapore 2026 was 7-8 October 2026 at Marina Bay Sands.',
    whyItMatters:
      'TOKEN2049 Singapore is the Asia crypto conference, separate from the Dubai edition. As of 16 October 2026, the official page hero lists 6-7 October 2027 at Marina Bay Sands, while its structured data still says 7-8 October 2026. Treat the October 2026 dates as the edition that ended. Confirm 2027 on the official page before you book travel.',
    whoShouldAttend: ['Crypto and Web3 founders', 'Exchange, custody, and fintech operators', 'Investors covering digital assets'],
    topics: ['Crypto', 'Web3', 'Fintech', 'Institutional Digital Assets'],
    faq: [
      { q: 'When was TOKEN2049 Singapore 2026?', a: 'TOKEN2049 Singapore 2026 was Wednesday 7 October and Thursday 8 October 2026.' },
      { q: 'Where was TOKEN2049 Singapore 2026?', a: 'It was at Marina Bay Sands in Singapore.' },
      { q: 'Is TOKEN2049 Dubai the same event?', a: 'No. Dubai is a separate edition. The next Dubai dates are 21-22 April 2027.' },
    ],
  },
  // Official Singapore page hero and FAQ title list 6-7 October 2027.
  // A stale JSON-LD block on the same site still showed 7-8 October 2026 on 2026-10-15.
  {
    slug: 'token2049-singapore-2027',
    eventName: 'TOKEN2049 Singapore 2027',
    shortName: 'TOKEN2049',
    startDate: '2027-10-06',
    endDate: '2027-10-07',
    city: 'Singapore',
    country: 'Singapore',
    format: 'offline',
    officialUrl: 'https://www.token2049.com/singapore',
    primaryKeyword: 'TOKEN2049 Singapore 2027 dates',
    secondaryKeywords: ['TOKEN2049 Singapore 2027 location', 'TOKEN2049 Singapore 2027 tickets', 'TOKEN2049 Singapore 2027 agenda'],
    seoTitle: 'TOKEN2049 Singapore 2027 Dates & Location | GlobalTechEvents',
    metaDescription:
      'TOKEN2049 Singapore 2027 is listed for 6-7 October 2027 in Singapore. Confirm the venue on the official site before you book travel.',
    whyItMatters:
      'TOKEN2049 Singapore is the Asia edition of the TOKEN2049 conference series.',
    whoShouldAttend: ['Crypto and Web3 founders', 'Exchange, custody, and fintech operators', 'Investors covering digital assets'],
    topics: ['Crypto', 'Web3', 'Fintech', 'Institutional Digital Assets'],
    faq: [
      { q: 'When is TOKEN2049 Singapore 2027?', a: 'The official Singapore page currently lists 6-7 October 2027. Confirm the dates on token2049.com before you travel.' },
      { q: 'Where is TOKEN2049 Singapore 2027?', a: 'The edition is in Singapore. The 2027 venue is not restated separately from the 2026 Marina Bay Sands listing, so check the official page.' },
      { q: 'Did TOKEN2049 Singapore 2026 already happen?', a: 'Yes. The 2026 edition was 7-8 October 2026 at Marina Bay Sands.' },
    ],
  },
  {
    slug: 'token2049-dubai-2027',
    eventName: 'TOKEN2049 Dubai 2027',
    shortName: 'TOKEN2049',
    startDate: '2027-04-21',
    endDate: '2027-04-22',
    city: 'Dubai',
    country: 'United Arab Emirates',
    format: 'offline',
    officialUrl: 'https://www.token2049.com/dubai',
    primaryKeyword: 'TOKEN2049 Dubai 2027 dates',
    secondaryKeywords: ['TOKEN2049 Dubai 2027 location', 'TOKEN2049 Dubai 2027 tickets', 'TOKEN2049 Dubai 2027 agenda'],
    seoTitle: 'TOKEN2049 Dubai 2027 Dates, Location & Tickets | GlobalTechEvents',
    metaDescription: 'TOKEN2049 Dubai 2027 is 21-22 April 2027 at Madinat Jumeirah.',
    whyItMatters:
      'TOKEN2049 Dubai is the Middle East crypto conference, not the Singapore edition. Go if you need digital-asset meetings in Dubai in April 2027. Skip it if your counterparties attend Singapore instead. The official Dubai page lists 21-22 April 2027 at Madinat Jumeirah. Confirm tickets there before you book flights. Checked 16 October 2026.',
    whoShouldAttend: ['Crypto and Web3 founders', 'Regional fintech and exchange teams', 'Investors covering digital assets'],
    topics: ['Crypto', 'Web3', 'Fintech', 'Institutional Digital Assets'],
    faq: [
      { q: 'When is TOKEN2049 Dubai 2027?', a: 'The official Dubai page lists 21-22 April 2027. Confirm the dates there before you travel.' },
      { q: 'Where is TOKEN2049 Dubai 2027?', a: 'It is at Madinat Jumeirah in Dubai, United Arab Emirates.' },
      { q: 'Is this the same event as TOKEN2049 Singapore?', a: 'No. Singapore is a separate edition. Use the official page for the city you mean.' },
    ],
  },
  {
    slug: 'consensus-miami-2026',
    eventName: 'Consensus Miami 2026',
    shortName: 'Consensus',
    startDate: '2026-05-05',
    endDate: '2026-05-07',
    city: 'Miami Beach',
    country: 'United States',
    format: 'offline',
    officialUrl: 'https://consensus2026.coindesk.com/',
    primaryKeyword: 'Consensus Miami 2026 dates',
    secondaryKeywords: ['Consensus Miami 2026 location', 'Consensus Miami 2026 tickets', 'Consensus Miami 2026 agenda'],
    seoTitle: 'Consensus Miami 2026 Dates, Location & Agenda | GlobalTechEvents',
    metaDescription: 'Consensus Miami 2026 was 5-7 May 2026 at the Miami Beach Convention Center.',
    whyItMatters:
      'Consensus Miami is CoinDesk\'s Americas crypto conference. It ran 5-7 May 2026 at the Miami Beach Convention Center. Go now only for on-demand sessions from that week. Skip a flight for the 2026 dates. The official event site says the next Miami Beach meeting is 4-6 May 2027. Confirm those dates before you book.',
    whoShouldAttend: ['Crypto founders and protocol teams', 'Finance and fintech operators', 'Investors covering digital assets'],
    topics: ['Crypto', 'Web3', 'Fintech', 'Policy'],
    faq: [
      { q: 'When was Consensus Miami 2026?', a: 'Consensus Miami 2026 was 5-7 May 2026.' },
      { q: 'Where was Consensus Miami 2026?', a: 'It was at the Miami Beach Convention Center in Miami Beach, Florida.' },
      { q: 'When is the next Consensus Miami?', a: 'The 2026 event site says the next Miami Beach dates are 4-6 May 2027.' },
    ],
  },
  {
    slug: 'superai-singapore-2026',
    eventName: 'SuperAI Singapore 2026',
    shortName: 'SuperAI',
    startDate: '2026-06-10',
    endDate: '2026-06-11',
    city: 'Singapore',
    country: 'Singapore',
    format: 'offline',
    officialUrl: 'https://www.superai.com/',
    primaryKeyword: 'SuperAI Singapore 2026 dates',
    secondaryKeywords: ['SuperAI Singapore 2026 location', 'SuperAI Singapore 2026 tickets', 'SuperAI Singapore 2026 agenda'],
    seoTitle: 'SuperAI Singapore 2026 Dates, Location & Agenda | GlobalTechEvents',
    metaDescription: 'SuperAI Singapore 2026 was 10-11 June 2026 at Marina Bay Sands.',
    whyItMatters:
      'SuperAI Singapore is the industry AI conference for founders, buyers, and infrastructure teams. The 2026 edition already ran, on 10-11 June at Marina Bay Sands. Skip a flight for those dates. Use the 2026 event report if you need the recap. The organizer site lists the next Singapore edition for 8-9 September 2027, again at Marina Bay Sands. Confirm that page before you book.',
    whoShouldAttend: ['AI founders and product leads', 'Enterprise teams deploying models', 'Investors tracking applied AI'],
    topics: ['AI', 'Startups', 'Infrastructure', 'Robotics', 'Enterprise AI'],
    faq: [
      { q: 'When was SuperAI Singapore 2026?', a: 'SuperAI Singapore 2026 was 10-11 June 2026.' },
      { q: 'Where was SuperAI Singapore 2026?', a: 'It was at Marina Bay Sands in Singapore.' },
      { q: 'When is the next SuperAI Singapore?', a: 'The 2026 event report points to 8-9 September 2027 for the next Singapore edition.' },
    ],
  },
  {
    slug: 'google-cloud-next-2026',
    eventName: 'Google Cloud Next 2026',
    shortName: 'Google Cloud Next',
    startDate: '2026-04-22',
    endDate: '2026-04-24',
    city: 'Las Vegas',
    country: 'United States',
    format: 'offline',
    officialUrl: 'https://www.googlecloudevents.com/next-vegas',
    primaryKeyword: 'Google Cloud Next 2026 dates',
    secondaryKeywords: ['Google Cloud Next 2026 location', 'Google Cloud Next 2026 tickets', 'Google Cloud Next 2026 agenda'],
    seoTitle: 'Google Cloud Next 2026 Dates, Location & Agenda | GlobalTechEvents',
    metaDescription: 'Google Cloud Next 2026 was 22-24 April 2026 at Mandalay Bay in Las Vegas.',
    whyItMatters:
      'Google Cloud Next is the annual checkpoint for Google Cloud product direction, AI services, and partner programs. The 2026 edition already ran. The main conference was 22-24 April at Mandalay Bay, and partner programming started on 21 April. Skip a flight for those dates. Keynotes are on demand. The event site lists 13-15 April 2027 at Mandalay Bay, with select programming on 12 April.',
    whoShouldAttend: ['Cloud architects and platform teams', 'Developers building on Google Cloud', 'Partners and enterprise buyers'],
    topics: ['Cloud', 'AI', 'Data', 'DevRel', 'Security'],
    faq: [
      { q: 'When was Google Cloud Next 2026?', a: 'The main conference was 22-24 April 2026. Partner Summit programming started on 21 April.' },
      { q: 'Where was Google Cloud Next 2026?', a: 'It was at Mandalay Bay Convention Center in Las Vegas, United States.' },
      { q: 'When is Google Cloud Next 2027?', a: 'The event site lists 13-15 April 2027 at Mandalay Bay, with select programming on 12 April.' },
    ],
  },
  {
    slug: 'microsoft-build-2026',
    eventName: 'Microsoft Build 2026',
    shortName: 'Microsoft Build',
    startDate: '2026-06-02',
    endDate: '2026-06-03',
    city: 'San Francisco',
    country: 'United States',
    format: 'hybrid',
    officialUrl: 'https://build.microsoft.com/',
    primaryKeyword: 'Microsoft Build 2026 dates',
    secondaryKeywords: ['Microsoft Build 2026 location', 'Microsoft Build 2026 tickets', 'Microsoft Build 2026 agenda'],
    seoTitle: 'Microsoft Build 2026 Dates, Location & Sessions | GlobalTechEvents',
    metaDescription: 'Microsoft Build 2026 was 2-3 June 2026 in San Francisco and online.',
    whyItMatters:
      'Microsoft Build is the developer conference for Azure, AI, agents, and the Microsoft platform roadmap. The 2026 edition already ran, on 2-3 June, in San Francisco and online. The in-person venue was Fort Mason Center. Skip a flight for those dates. Watch the session recordings on the official Build site. That site does not list a 2027 Build date.',
    whoShouldAttend: ['Developers on Azure and Microsoft 365', 'Platform and agent teams', 'Product managers shipping on Microsoft APIs'],
    topics: ['Cloud', 'AI', 'Agents', 'DevRel', 'Azure'],
    faq: [
      { q: 'When was Microsoft Build 2026?', a: 'Microsoft Build 2026 was 2-3 June 2026.' },
      { q: 'Where was Microsoft Build 2026?', a: 'In-person sessions were at Fort Mason Center in San Francisco. The event also had an online track.' },
      { q: 'Can I still watch Microsoft Build 2026?', a: 'Session recordings are published on the official Build site.' },
    ],
  },
  {
    slug: 'computex-2026',
    eventName: 'COMPUTEX 2026',
    shortName: 'COMPUTEX',
    startDate: '2026-06-02',
    endDate: '2026-06-05',
    city: 'Taipei',
    country: 'Taiwan',
    format: 'offline',
    officialUrl: 'https://www.computex.biz/',
    primaryKeyword: 'COMPUTEX 2026 dates',
    secondaryKeywords: ['COMPUTEX 2026 Taipei', 'COMPUTEX 2026 tickets', 'COMPUTEX 2026 agenda'],
    seoTitle: 'COMPUTEX 2026 Dates, Taipei Location & Agenda | GlobalTechEvents',
    metaDescription: 'COMPUTEX 2026 was 2-5 June 2026 in Taipei.',
    whyItMatters:
      'COMPUTEX is the Asia hardware and supply-chain exhibition for computing, AI systems, and devices. The 2026 show already ran, on 2-5 June in Taipei, at TaiNEX, TWTC Hall 1, and TICC. The organizer billed it as AI Together. Skip a flight for those dates. The show site lists COMPUTEX 2027 for 1-4 June 2027. Confirm that page before you book.',
    whoShouldAttend: ['Hardware and component teams', 'AI infrastructure buyers', 'OEM and ODM partners'],
    topics: ['Hardware', 'AI Computing', 'Robotics', 'Devices', 'Supply Chain'],
    faq: [
      { q: 'When was COMPUTEX 2026?', a: 'COMPUTEX 2026 was 2-5 June 2026.' },
      { q: 'Where was COMPUTEX 2026?', a: 'It was in Taipei at Taipei Nangang Exhibition Center Halls 1 and 2, TWTC Hall 1, and the Taipei International Convention Center.' },
      { q: 'What was the COMPUTEX 2026 theme?', a: 'The organizer billed the show as AI Together, with tracks for AI and computing, robotics and mobility, and next-gen tech.' },
      { q: 'When is COMPUTEX 2027?', a: 'The show site lists 1-4 June 2027 in Taipei.' },
    ],
  },
  {
    slug: 'dreamforce-2026',
    eventName: 'Dreamforce 2026',
    shortName: 'Dreamforce',
    startDate: '2026-09-15',
    endDate: '2026-09-17',
    city: 'San Francisco',
    country: 'United States',
    format: 'hybrid',
    officialUrl: 'https://www.salesforce.com/dreamforce/',
    primaryKeyword: 'Dreamforce 2026 dates',
    secondaryKeywords: ['Dreamforce 2026 location', 'Dreamforce 2026 tickets', 'Dreamforce 2026 agenda'],
    seoTitle: 'Dreamforce 2026 Dates, Location & Registration | GlobalTechEvents',
    metaDescription: 'Dreamforce 2026 was 15-17 September 2026 at Moscone Center in San Francisco.',
    whyItMatters:
      'Dreamforce is the Salesforce flagship for enterprise CRM, data, and AI product direction. The 2026 edition already ran, on 15-17 September at Moscone Center, with a Salesforce+ broadcast. Skip a flight for those dates. Sessions from that week are on demand. Salesforce lists Dreamforce 2027 for 21-23 September 2027 in San Francisco and on Salesforce+.',
    whoShouldAttend: ['Salesforce admins and developers', 'Enterprise product and revenue teams', 'Partners and CRM buyers'],
    topics: ['Enterprise', 'SaaS', 'AI', 'CRM', 'Data'],
    faq: [
      { q: 'When was Dreamforce 2026?', a: 'Dreamforce 2026 was 15-17 September 2026.' },
      { q: 'Where was Dreamforce 2026?', a: 'It was at Moscone Center in San Francisco, with sessions also streamed on Salesforce+.' },
      { q: 'When is Dreamforce 2027?', a: 'Salesforce lists 21-23 September 2027 in San Francisco, with a Salesforce+ broadcast. Use the official Dreamforce site for registration.' },
    ],
  },
  {
    slug: 'kubecon-na-2026',
    eventName: 'KubeCon + CloudNativeCon North America 2026',
    shortName: 'KubeCon NA',
    startDate: '2026-11-09',
    endDate: '2026-11-12',
    city: 'Salt Lake City',
    country: 'United States',
    format: 'offline',
    officialUrl: 'https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/',
    primaryKeyword: 'KubeCon North America 2026 dates',
    secondaryKeywords: ['KubeCon NA 2026 location', 'KubeCon NA 2026 tickets', 'CloudNativeCon North America 2026'],
    seoTitle: 'KubeCon North America 2026 Dates & Location | GlobalTechEvents',
    metaDescription: 'KubeCon + CloudNativeCon North America 2026 is 9-12 November 2026 in Salt Lake City.',
    whyItMatters:
      'KubeCon North America is the CNCF flagship for Kubernetes, platform engineering, and cloud native operations. It has not been held yet. The dates are 9-12 November 2026 at the Salt Palace Convention Center. Monday 9 November is co-located events. The main conference starts Tuesday 10 November. Go if that platform week changes your roadmap. The organizer site does not list a 2027 North America date.',
    whoShouldAttend: ['Platform and SRE teams', 'Kubernetes maintainers and contributors', 'Cloud infrastructure buyers'],
    topics: ['Kubernetes', 'Cloud Native', 'Platform Engineering', 'Security', 'AI Inference'],
    faq: [
      { q: 'When is KubeCon North America 2026?', a: 'KubeCon + CloudNativeCon North America 2026 is 9-12 November 2026. Monday 9 November is co-located events. The main conference starts Tuesday 10 November.' },
      { q: 'Where is KubeCon North America 2026?', a: 'It is at the Salt Palace Convention Center in Salt Lake City, Utah.' },
      { q: 'Who organizes KubeCon North America?', a: 'The Cloud Native Computing Foundation and the Linux Foundation.' },
    ],
  },
  {
    slug: 'databricks-data-ai-summit-2026',
    eventName: 'Databricks Data + AI Summit 2026',
    shortName: 'Data + AI Summit',
    startDate: '2026-06-15',
    endDate: '2026-06-18',
    city: 'San Francisco',
    country: 'United States',
    format: 'hybrid',
    officialUrl: 'https://www.databricks.com/dataaisummit',
    primaryKeyword: 'Databricks Data + AI Summit 2026 dates',
    secondaryKeywords: ['Data + AI Summit 2026 location', 'Data + AI Summit 2026 tickets', 'Databricks Summit 2026 agenda'],
    seoTitle: 'Data + AI Summit 2026 Dates, Location & Agenda | GlobalTechEvents',
    metaDescription:
      'Databricks Data + AI Summit 2026 was 15-18 June 2026 at Moscone Center in San Francisco.',
    whyItMatters:
      'The Data + AI Summit is the Databricks meeting for data engineering and production AI teams. The 2026 edition already ran at Moscone Center, with a virtual track. Skip travel for those dates. The official site lists the next summit as 21-24 June 2027 in San Francisco, plus virtual, at Moscone North, West, and South. Confirm that page before you book.',
    whoShouldAttend: ['Data engineers and analytics leads', 'ML platform teams', 'Enterprise architects on Databricks'],
    topics: ['Data', 'AI', 'Analytics', 'Cloud', 'Lakehouse'],
    faq: [
      { q: 'When was the Data + AI Summit 2026?', a: 'It was 15-18 June 2026.' },
      { q: 'Where was the Data + AI Summit 2026?', a: 'In-person sessions were at Moscone Center in San Francisco. Databricks also offered a virtual attendance option.' },
      { q: 'Where is the official site?', a: 'Registration and agenda updates are on the Databricks Data + AI Summit site.' },
    ],
  },
  {
    slug: 'openai-devday-2026',
    eventName: 'OpenAI DevDay 2026',
    shortName: 'OpenAI DevDay',
    startDate: '2026-09-29',
    endDate: '2026-09-29',
    city: 'San Francisco',
    country: 'United States',
    format: 'hybrid',
    officialUrl: 'https://devday.openai.com/',
    primaryKeyword: 'OpenAI DevDay 2026 dates',
    secondaryKeywords: ['OpenAI DevDay 2026 location', 'OpenAI DevDay 2026 tickets', 'OpenAI DevDay 2026 agenda'],
    seoTitle: 'OpenAI DevDay 2026 Date, Location & Sessions | GlobalTechEvents',
    metaDescription: 'OpenAI DevDay 2026 was 29 September 2026 at Fort Mason in San Francisco.',
    whyItMatters:
      'OpenAI DevDay is the developer day for people building on OpenAI models, APIs, and agents. The 2026 meeting already happened. In-person entry required an invitation. Use it now for the keynote replay and the sessions OpenAI posts on openai.com. Do not book travel for 29 September. The official site does not list a 2027 DevDay date.',
    whoShouldAttend: ['Developers building on OpenAI APIs', 'Product teams shipping agents', 'Platform leads evaluating model providers'],
    topics: ['AI', 'Agents', 'APIs', 'DevRel', 'Developer Tools'],
    faq: [
      { q: 'When was OpenAI DevDay 2026?', a: 'OpenAI DevDay 2026 was Tuesday 29 September 2026.' },
      { q: 'Where was OpenAI DevDay 2026?', a: 'It was at Fort Mason in San Francisco. The opening keynote was livestreamed.' },
      { q: 'Can I watch OpenAI DevDay 2026 later?', a: 'OpenAI said other sessions would be posted on openai.com after the event.' },
    ],
  },
  {
    slug: 'nrf-2027',
    eventName: 'NRF 2027 Retail\'s Big Show',
    shortName: 'NRF Big Show',
    startDate: '2027-01-10',
    endDate: '2027-01-12',
    city: 'New York',
    country: 'United States',
    format: 'offline',
    officialUrl: 'https://nrfbigshow.nrf.com/',
    primaryKeyword: 'NRF 2027 dates',
    secondaryKeywords: ['NRF Big Show 2027 location', 'NRF Big Show 2027 tickets', 'NRF Big Show 2027 agenda'],
    seoTitle: 'NRF 2027 Retail\'s Big Show Dates & Location | GlobalTechEvents',
    metaDescription:
      'NRF 2027: Retail\'s Big Show is 10-12 January 2027 at the Jacob K. Javits Convention Center in New York.',
    whyItMatters:
      'NRF Retail\'s Big Show is the main retail industry event for store technology, commerce platforms, and operations.',
    whoShouldAttend: ['Retail technology and operations leaders', 'Commerce product teams', 'Vendors selling into retail'],
    topics: ['Retail', 'Commerce', 'Enterprise', 'Store Technology', 'AI'],
    faq: [
      { q: 'When is NRF 2027?', a: 'NRF 2027: Retail\'s Big Show is 10-12 January 2027.' },
      { q: 'Where is NRF 2027?', a: 'It is at the Jacob K. Javits Convention Center in New York City.' },
      { q: 'Where do I register?', a: 'Use the official NRF Big Show site for passes and agenda updates.' },
    ],
  },
  {
    slug: 'anthropic-events',
    eventName: 'Anthropic events',
    shortName: 'Anthropic',
    startDate: '2026-05-06',
    endDate: '2026-06-11',
    city: 'San Francisco, London, and Tokyo',
    country: 'International',
    format: 'hybrid',
    officialUrl: 'https://claude.com/code-with-claude',
    primaryKeyword: 'Anthropic events',
    secondaryKeywords: ['Code with Claude 2026', 'Claude developer conference', 'Anthropic developer event'],
    seoTitle: 'Anthropic Events and Code with Claude 2026 | GlobalTechEvents',
    metaDescription:
      'Code with Claude 2026 listed San Francisco, London, and Tokyo. Official city pages only, with no single venue.',
    whyItMatters:
      'Code with Claude is the Anthropic developer series for people shipping on Claude. The 2026 pages list one-day stops in San Francisco on 6 May, London on 19 May, and Tokyo on 10 June, plus a second in-person day in each city. Those dates have already passed. Go if you need the official Claude Code and platform sessions. Skip travel, because this is not one venue and no 2027 date is printed on the linked pages.',
    whoShouldAttend: [
      'Developers shipping on the Claude API or Claude Code',
      'Product leads comparing model platforms',
      'Founders looking for the Extended session recordings',
    ],
    topics: ['AI', 'Claude', 'Developer Tools', 'Agents', 'APIs'],
    sources: [
      { label: 'Code with Claude series page', url: 'https://claude.com/code-with-claude' },
      {
        label: 'Anthropic page for the San Francisco livestream',
        url: 'https://www.anthropic.com/events/code-with-claude',
      },
    ],
    stops: [
      {
        name: 'Code with Claude San Francisco',
        startDate: '2026-05-06',
        endDate: '2026-05-06',
        city: 'San Francisco',
        country: 'United States',
        format: 'hybrid',
        officialUrl: 'https://claude.com/code-with-claude/san-francisco',
        detail: 'In person. Anthropic.com prints a livestream at 9:00am PT.',
      },
      {
        name: 'Code with Claude: Extended San Francisco',
        startDate: '2026-05-07',
        endDate: '2026-05-07',
        city: 'San Francisco',
        country: 'United States',
        format: 'offline',
        officialUrl: 'https://claude.com/code-with-claude/san-francisco-extended',
        detail: 'The city page lists 08:00 to 18:00 PT. In person only, and it says this day was not livestreamed.',
      },
      {
        name: 'Code with Claude London',
        startDate: '2026-05-19',
        endDate: '2026-05-19',
        city: 'London',
        country: 'United Kingdom',
        format: 'hybrid',
        officialUrl: 'https://claude.com/code-with-claude/london',
        detail: 'In person. The series page says this day was livestreamed.',
      },
      {
        name: 'Code with Claude: Extended London',
        startDate: '2026-05-20',
        endDate: '2026-05-20',
        city: 'London',
        country: 'United Kingdom',
        format: 'offline',
        officialUrl: 'https://claude.com/code-with-claude/london-extended',
        detail: 'The city page lists 08:00 to 18:00 BST. In person only, and it says this day was not livestreamed.',
      },
      {
        name: 'Code with Claude Tokyo',
        startDate: '2026-06-10',
        endDate: '2026-06-10',
        city: 'Tokyo',
        country: 'Japan',
        format: 'hybrid',
        officialUrl: 'https://claude.com/code-with-claude/tokyo',
        detail: 'The city page lists 08:00 to 20:00 JST. The series page says this day was livestreamed.',
      },
      {
        name: 'Code with Claude: Extended Tokyo',
        startDate: '2026-06-11',
        endDate: '2026-06-11',
        city: 'Tokyo',
        country: 'Japan',
        format: 'offline',
        officialUrl: 'https://claude.com/code-with-claude/tokyo-extended',
        detail: 'The city page lists 08:30 to 18:00 JST. In person only, and it says this day was not livestreamed.',
      },
    ],
    faq: [
      {
        q: 'Which Code with Claude dates did Anthropic print for 2026?',
        a: 'San Francisco on 6 May 2026, London on 19 May 2026, and Tokyo on 10 June 2026. Each city also has an Extended day on the next date: 7 May, 20 May, and 11 June 2026.',
      },
      {
        q: 'Is there one Code with Claude venue for 2026?',
        a: 'No. The 2026 city pages name the city and do not name a hall. A 2025 news post at https://www.anthropic.com/news/Introducing-code-with-claude names The Midway for 22 May 2025. That address is not printed on the 2026 city pages.',
      },
      {
        q: 'Does the linked Code with Claude material list a 2027 date?',
        a: 'No. The Code with Claude pages linked on this guide do not list a 2027 date.',
      },
    ],
  },
  {
    slug: 'stripe-sessions-2027',
    eventName: 'Stripe Sessions 2027',
    shortName: 'Stripe Sessions',
    startDate: '2027-05-04',
    endDate: '2027-05-06',
    city: 'San Francisco',
    country: 'United States',
    format: 'offline',
    officialUrl: 'https://stripesessions.com/',
    primaryKeyword: 'Stripe Sessions 2027 dates',
    secondaryKeywords: ['Stripe Sessions 2027 location', 'Stripe Sessions 2027 tickets', 'Stripe Sessions 2027 agenda'],
    seoTitle: 'Stripe Sessions 2027 Dates, Location & Tickets | GlobalTechEvents',
    metaDescription:
      'Stripe Sessions 2027 is 4-6 May 2027 at Moscone North and South in San Francisco.',
    whyItMatters:
      'Stripe Sessions is the Stripe conference for payments, billing, and internet economy teams. Sessions 2027 is 4-6 May 2027 at Moscone North and South in San Francisco. Go if you run payments, billing, or agent commerce on Stripe. Skip it if you only need a model-provider developer day. Passes and the call for proposals are on the official site.',
    whoShouldAttend: [
      'Payments and billing leads',
      'Founders selling on Stripe',
      'Product teams shipping agent commerce',
    ],
    topics: ['Payments', 'Billing', 'Internet Economy', 'Platforms', 'AI'],
    faq: [
      {
        q: 'When is Stripe Sessions 2027?',
        a: 'Stripe Sessions 2027 is 4-6 May 2027. The official site lists Tuesday 4 May, Wednesday 5 May, and Thursday 6 May.',
      },
      {
        q: 'Where is Stripe Sessions 2027?',
        a: 'It is at Moscone North and South in San Francisco. The official page checked on 16 October 2026 does not describe a virtual pass.',
      },
      {
        q: 'What do passes and talk proposals cost?',
        a: 'The official site shows $599 and $999 under early-bird admission, and says early-bird rates expire on 27 January 2027. Talk proposals close on 3 November 2026. There is no fee to present.',
      },
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
