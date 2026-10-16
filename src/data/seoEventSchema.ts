import type { SEOEventPageData, SEOEventStop } from './seoEventPages';

const SITE_ORIGIN = 'https://www.globaltechevents.xyz';

export function isSeoCollection(page: Pick<SEOEventPageData, 'stops'>): boolean {
  return Array.isArray(page.stops) && page.stops.length > 0;
}

function attendanceMode(format: SEOEventPageData['format']): string {
  if (format === 'online') return 'https://schema.org/OnlineEventAttendanceMode';
  if (format === 'hybrid') return 'https://schema.org/MixedEventAttendanceMode';
  return 'https://schema.org/OfflineEventAttendanceMode';
}

function formatLongDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${iso}T00:00:00Z`));
}

function nextIsoDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

function sortedStops(page: SEOEventPageData): SEOEventStop[] {
  return [...(page.stops ?? [])].sort((left, right) => left.startDate.localeCompare(right.startDate) || left.name.localeCompare(right.name));
}

export function collectionDateLabel(page: SEOEventPageData): string {
  const stops = sortedStops(page);
  const first = formatLongDate(stops[0].startDate);
  const last = formatLongDate(stops[stops.length - 1].endDate);
  return `Separate city days from ${first} through ${last}`;
}

export function collectionLocationLabel(page: SEOEventPageData): string {
  const cities: string[] = [];
  for (const stop of sortedStops(page)) {
    if (!cities.includes(stop.city)) cities.push(stop.city);
  }
  if (cities.length === 1) return `${cities[0]}`;
  if (cities.length === 2) return `${cities[0]} and ${cities[1]}`;
  return `${cities.slice(0, -1).join(', ')}, and ${cities[cities.length - 1]}`;
}

export function collectionCalendarNote(page: SEOEventPageData): string {
  const stop = sortedStops(page)[0];
  return `The .ics file lists each printed stop as its own all-day event. Google Calendar opens ${stop.name} on ${formatLongDate(stop.startDate)}. Always confirm details on the official site.`;
}

export function formatStopDate(stop: SEOEventStop): string {
  if (stop.startDate === stop.endDate) return formatLongDate(stop.startDate);
  return `${formatLongDate(stop.startDate)} - ${formatLongDate(stop.endDate)}`;
}

function buildSingleEventJsonLd(page: SEOEventPageData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: page.eventName,
    startDate: `${page.startDate}T09:00:00Z`,
    endDate: `${page.endDate}T18:00:00Z`,
    eventAttendanceMode: attendanceMode(page.format),
    eventStatus: 'https://schema.org/EventScheduled',
    location:
      page.format === 'online'
        ? { '@type': 'VirtualLocation', url: page.officialUrl }
        : {
            '@type': 'Place',
            name: `${page.city}, ${page.country}`,
            address: {
              '@type': 'PostalAddress',
              addressLocality: page.city,
              addressCountry: page.country,
            },
          },
    organizer: {
      '@type': 'Organization',
      name: page.shortName,
      url: page.officialUrl,
    },
    url: `${SITE_ORIGIN}/events/${page.slug}`,
    description: page.metaDescription,
    keywords: [page.primaryKeyword, ...page.secondaryKeywords].join(', '),
  };
}

function buildCollectionJsonLd(page: SEOEventPageData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: page.eventName,
    url: `${SITE_ORIGIN}/events/${page.slug}`,
    description: page.metaDescription,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: sortedStops(page).map((stop, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Event',
          name: stop.name,
          startDate: stop.startDate,
          endDate: stop.endDate,
          eventAttendanceMode: attendanceMode(stop.format),
          eventStatus: 'https://schema.org/EventScheduled',
          location: {
            '@type': 'Place',
            name: `${stop.city}, ${stop.country}`,
            address: {
              '@type': 'PostalAddress',
              addressLocality: stop.city,
              addressCountry: stop.country,
            },
          },
          organizer: {
            '@type': 'Organization',
            name: page.shortName,
            url: page.officialUrl,
          },
          url: stop.officialUrl,
        },
      })),
    },
  };
}

export function buildSeoEventJsonLd(page: SEOEventPageData) {
  return isSeoCollection(page) ? buildCollectionJsonLd(page) : buildSingleEventJsonLd(page);
}

export function buildSeoCollectionIcs(page: SEOEventPageData): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const events = sortedStops(page).map((stop) => {
    const start = stop.startDate.replace(/-/g, '');
    const end = nextIsoDate(stop.endDate).replace(/-/g, '');
    const cityKey = stop.city.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return [
      'BEGIN:VEVENT',
      `UID:${page.slug}-${start}-${cityKey}@globaltechevents.com`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${end}`,
      `SUMMARY:${stop.name}`,
      `DESCRIPTION:${stop.detail}\\n\\nMore info: ${stop.officialUrl}`,
      `LOCATION:${stop.city}, ${stop.country}`,
      `URL:${stop.officialUrl}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
    ].join('\r\n');
  });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GlobalTechEvents//SEO Event Page//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n');
}

export function collectionGoogleCalendarUrl(page: SEOEventPageData): string {
  const stop = sortedStops(page)[0];
  const start = stop.startDate.replace(/-/g, '');
  const end = nextIsoDate(stop.endDate).replace(/-/g, '');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: stop.name,
    dates: `${start}/${end}`,
    details: `${stop.detail}\n\nSeries: ${page.officialUrl}`,
    location: `${stop.city}, ${stop.country}`,
    sprop: 'website:globaltechevents.com',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
