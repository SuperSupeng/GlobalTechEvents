import { TechEvent } from '../types';

export const mockEvents: TechEvent[] = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
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
