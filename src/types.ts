export interface TechEvent {
  id: string;
  title: string;
  summary: string;
  coverImage?: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  timezone: string;
  isAllDay?: boolean; // 是否为全天活动
  format: 'online' | 'offline' | 'hybrid';
  location?: {
    country: string;
    city: string;
    address?: string;
  };
  tags: string[];
  language: string[];
  links: {
    officialSite: string;
    registration?: string;
    source: string;
  };
  organizer: {
    name: string;
    logo?: string;
  };
  price: {
    type: 'free' | 'paid' | 'unknown';
    range?: string;
  };
  status: 'upcoming' | 'live' | 'ended' | 'canceled';
}

export type ViewMode = 'month' | 'week' | 'list';
