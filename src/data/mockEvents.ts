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
  }
];
