import { TechEvent } from '../types';

export const mockEvents: TechEvent[] = [
  {
    id: '1',
    title: 'AI Summit Tokyo',
    summary: 'Explore the latest advances in artificial intelligence and machine learning with industry leaders.',
    startTime: '2026-01-25T01:00:00Z',
    endTime: '2026-01-25T09:00:00Z',
    timezone: 'Asia/Tokyo',
    format: 'hybrid',
    location: {
      country: 'Japan',
      city: 'Tokyo',
      address: 'Tokyo International Forum'
    },
    tags: ['AI', 'Machine Learning', 'Deep Learning'],
    language: ['English', 'Japanese'],
    links: {
      officialSite: 'https://aisummit.tokyo',
      source: 'AI Summit Official'
    },
    organizer: {
      name: 'AI Summit',
    },
    price: {
      type: 'paid',
      range: '¥50,000 - ¥150,000'
    },
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'React Conf 2026',
    summary: 'The official React conference bringing together developers from around the world.',
    startTime: '2026-01-28T16:00:00Z',
    endTime: '2026-01-29T23:00:00Z',
    timezone: 'America/New_York',
    format: 'hybrid',
    location: {
      country: 'USA',
      city: 'New York',
      address: 'Javits Center'
    },
    tags: ['React', 'JavaScript', 'Frontend'],
    language: ['English'],
    links: {
      officialSite: 'https://conf.react.dev',
      source: 'React Official'
    },
    organizer: {
      name: 'Meta',
    },
    price: {
      type: 'paid',
      range: '$299 - $999'
    },
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'DevOps Days Berlin',
    summary: 'Two days of talks, workshops, and networking for DevOps practitioners.',
    startTime: '2026-01-30T08:00:00Z',
    endTime: '2026-01-31T17:00:00Z',
    timezone: 'Europe/Berlin',
    format: 'offline',
    location: {
      country: 'Germany',
      city: 'Berlin',
      address: 'Kosmos Berlin'
    },
    tags: ['DevOps', 'CI/CD', 'Infrastructure'],
    language: ['English', 'German'],
    links: {
      officialSite: 'https://devopsdays.org/berlin',
      source: 'DevOps Days'
    },
    organizer: {
      name: 'DevOps Days',
    },
    price: {
      type: 'paid',
      range: '€150 - €350'
    },
    status: 'upcoming'
  },
  {
    id: '4',
    title: 'Web3 Summit Singapore',
    summary: 'Discover the future of decentralized web and blockchain technology.',
    startTime: '2026-02-03T02:00:00Z',
    endTime: '2026-02-04T10:00:00Z',
    timezone: 'Asia/Singapore',
    format: 'offline',
    location: {
      country: 'Singapore',
      city: 'Singapore',
      address: 'Marina Bay Sands'
    },
    tags: ['Web3', 'Blockchain', 'Crypto'],
    language: ['English'],
    links: {
      officialSite: 'https://web3summit.sg',
      source: 'Web3 Summit'
    },
    organizer: {
      name: 'Web3 Foundation',
    },
    price: {
      type: 'paid',
      range: '$500 - $2,000'
    },
    status: 'upcoming'
  },
  {
    id: '5',
    title: 'Cloud Native Webinar',
    summary: 'Learn about Kubernetes, containers, and cloud-native architecture from experts.',
    startTime: '2026-02-05T14:00:00Z',
    endTime: '2026-02-05T16:00:00Z',
    timezone: 'UTC',
    format: 'online',
    tags: ['Kubernetes', 'Cloud', 'Containers'],
    language: ['English'],
    links: {
      officialSite: 'https://cncf.io/webinars',
      source: 'CNCF'
    },
    organizer: {
      name: 'CNCF',
    },
    price: {
      type: 'free'
    },
    status: 'upcoming'
  },
  {
    id: '6',
    title: 'Google I/O 2026',
    summary: 'Join us for the latest developer news and technology updates from Google.',
    startTime: '2026-05-14T17:00:00Z',
    endTime: '2026-05-15T01:00:00Z',
    timezone: 'America/Los_Angeles',
    format: 'hybrid',
    location: {
      country: 'USA',
      city: 'Mountain View',
      address: 'Shoreline Amphitheatre'
    },
    tags: ['AI', 'Cloud', 'Android'],
    language: ['English'],
    links: {
      officialSite: 'https://events.google.com/io',
      source: 'Google Official'
    },
    organizer: {
      name: 'Google',
    },
    price: {
      type: 'free'
    },
    status: 'upcoming'
  },
  {
    id: '7',
    title: 'Apple WWDC 2026',
    summary: 'Apple Worldwide Developers Conference. Experience the latest in iOS, iPadOS, macOS, and more.',
    startTime: '2026-06-08T17:00:00Z',
    endTime: '2026-06-12T23:00:00Z',
    timezone: 'America/Los_Angeles',
    format: 'online',
    tags: ['iOS', 'Swift', 'Hardware'],
    language: ['English'],
    links: {
      officialSite: 'https://developer.apple.com/wwdc',
      source: 'Apple Official'
    },
    organizer: {
      name: 'Apple',
    },
    price: {
      type: 'free'
    },
    status: 'upcoming'
  },
  {
    id: '8',
    title: 'Web Summit 2026',
    summary: 'The largest tech conference in the world, bringing together technology leaders.',
    startTime: '2026-11-11T09:00:00Z',
    endTime: '2026-11-14T18:00:00Z',
    timezone: 'Europe/Lisbon',
    format: 'offline',
    location: {
      country: 'Portugal',
      city: 'Lisbon',
      address: 'Altice Arena'
    },
    tags: ['Business', 'Tech', 'SaaS'],
    language: ['English'],
    links: {
      officialSite: 'https://websummit.com',
      source: 'Web Summit'
    },
    organizer: {
      name: 'Web Summit',
    },
    price: {
      type: 'paid',
      range: '€850 - €4,950'
    },
    status: 'upcoming'
  },
  // This week's events for testing Week View
  {
    id: '9',
    title: 'GitHub Universe 2026',
    summary: 'Join developers worldwide for product announcements, live demos, and hands-on workshops.',
    startTime: '2026-01-27T00:00:00Z',
    endTime: '2026-01-28T23:59:59Z',
    timezone: 'America/Los_Angeles',
    isAllDay: true,
    format: 'hybrid',
    location: {
      country: 'USA',
      city: 'San Francisco',
      address: 'Yerba Buena Center'
    },
    tags: ['Git', 'DevTools', 'Open Source'],
    language: ['English'],
    links: {
      officialSite: 'https://githubuniverse.com',
      source: 'GitHub Official'
    },
    organizer: {
      name: 'GitHub',
    },
    price: {
      type: 'paid',
      range: '$399 - $1,299'
    },
    status: 'upcoming'
  },
  {
    id: '10',
    title: 'TypeScript Deep Dive Workshop',
    summary: 'Advanced TypeScript patterns, generics, and type system tricks for production apps.',
    startTime: '2026-01-27T14:00:00Z',
    endTime: '2026-01-27T17:00:00Z',
    timezone: 'UTC',
    format: 'online',
    tags: ['TypeScript', 'JavaScript', 'Programming'],
    language: ['English'],
    links: {
      officialSite: 'https://typescript-workshop.dev',
      source: 'TypeScript Community'
    },
    organizer: {
      name: 'TypeScript Community',
    },
    price: {
      type: 'free'
    },
    status: 'upcoming'
  },
  {
    id: '11',
    title: 'AWS Re:Invent Recap',
    summary: 'Live stream covering the major announcements and new services from AWS Re:Invent.',
    startTime: '2026-01-28T18:00:00Z',
    endTime: '2026-01-28T20:00:00Z',
    timezone: 'UTC',
    format: 'online',
    tags: ['AWS', 'Cloud', 'Serverless'],
    language: ['English'],
    links: {
      officialSite: 'https://aws.amazon.com/events',
      source: 'AWS'
    },
    organizer: {
      name: 'Amazon Web Services',
    },
    price: {
      type: 'free'
    },
    status: 'upcoming'
  },
  {
    id: '12',
    title: 'Python Data Science Bootcamp',
    summary: 'Intensive hands-on training in pandas, NumPy, and scikit-learn for data analysis.',
    startTime: '2026-01-29T09:00:00Z',
    endTime: '2026-01-29T17:00:00Z',
    timezone: 'Europe/London',
    format: 'offline',
    location: {
      country: 'UK',
      city: 'London',
      address: 'CodeNode, Skills Matter'
    },
    tags: ['Python', 'Data Science', 'ML'],
    language: ['English'],
    links: {
      officialSite: 'https://python-bootcamp.io',
      source: 'Python Training'
    },
    organizer: {
      name: 'DataCamp',
    },
    price: {
      type: 'paid',
      range: '£299'
    },
    status: 'upcoming'
  },
  {
    id: '13',
    title: 'Rust for Systems Programming',
    summary: 'Learn memory safety, concurrency, and performance optimization with Rust.',
    startTime: '2026-01-29T15:00:00Z',
    endTime: '2026-01-29T16:30:00Z',
    timezone: 'UTC',
    format: 'online',
    tags: ['Rust', 'Systems', 'Performance'],
    language: ['English'],
    links: {
      officialSite: 'https://rust-lang.org/events',
      source: 'Rust Foundation'
    },
    organizer: {
      name: 'Rust Foundation',
    },
    price: {
      type: 'free'
    },
    status: 'upcoming'
  },
  {
    id: '14',
    title: 'Mobile Dev Summit',
    summary: 'Cross-platform mobile development with React Native, Flutter, and native technologies.',
    startTime: '2026-01-30T00:00:00Z',
    endTime: '2026-01-30T23:59:59Z',
    timezone: 'America/New_York',
    isAllDay: true,
    format: 'offline',
    location: {
      country: 'USA',
      city: 'New York',
      address: 'Manhattan Center'
    },
    tags: ['Mobile', 'React Native', 'Flutter'],
    language: ['English'],
    links: {
      officialSite: 'https://mobiledevsummit.com',
      source: 'Mobile Dev Community'
    },
    organizer: {
      name: 'Mobile Dev Collective',
    },
    price: {
      type: 'paid',
      range: '$199 - $499'
    },
    status: 'upcoming'
  },
  {
    id: '15',
    title: 'GraphQL API Design Patterns',
    summary: 'Best practices for schema design, resolvers, and performance optimization.',
    startTime: '2026-01-31T13:00:00Z',
    endTime: '2026-01-31T15:00:00Z',
    timezone: 'UTC',
    format: 'online',
    tags: ['GraphQL', 'API', 'Backend'],
    language: ['English'],
    links: {
      officialSite: 'https://graphql-workshop.io',
      source: 'GraphQL Foundation'
    },
    organizer: {
      name: 'GraphQL Foundation',
    },
    price: {
      type: 'free'
    },
    status: 'upcoming'
  },
  {
    id: '16',
    title: 'Cybersecurity Hackathon',
    summary: '24-hour security challenge focused on vulnerability discovery and ethical hacking.',
    startTime: '2026-02-01T00:00:00Z',
    endTime: '2026-02-01T23:59:59Z',
    timezone: 'Europe/Berlin',
    isAllDay: true,
    format: 'offline',
    location: {
      country: 'Germany',
      city: 'Berlin',
      address: 'TU Berlin'
    },
    tags: ['Security', 'Hackathon', 'CTF'],
    language: ['English', 'German'],
    links: {
      officialSite: 'https://cyber-hackathon.de',
      source: 'Security Community'
    },
    organizer: {
      name: 'CyberSec Berlin',
    },
    price: {
      type: 'free'
    },
    status: 'upcoming'
  }
];
