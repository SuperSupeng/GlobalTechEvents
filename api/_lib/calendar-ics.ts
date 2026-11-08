// Statuses published on the subscription feed. Canceled events stay excluded.
export const ICS_FEED_STATUSES = ['upcoming', 'live', 'ended'] as const;

export interface IcsFeedEvent {
  id: string;
  title: string;
  summary: string;
  start_time: string;
  end_time: string;
  timezone: string;
  is_all_day: boolean;
  format: string;
  location: {
    country?: string;
    city?: string;
    address?: string;
  } | null;
  links: {
    officialSite?: string;
    registration?: string;
    source?: string;
  };
  organizer: {
    name: string;
    logo?: string;
  };
  tags: string[];
  status?: string;
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function formatIcsDate(dateStr: string, isAllDay: boolean): string {
  const date = new Date(dateStr);
  if (isAllDay) {
    // Format: YYYYMMDD
    return date.toISOString().slice(0, 10).replace(/-/g, '');
  }
  // Format: YYYYMMDDTHHMMSSZ
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function generateIcs(events: IcsFeedEvent[]): string {
  const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//GlobalTechEvents//Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:GlobalTechEvents
X-WR-CALDESC:Global Tech Events Calendar - Conferences, Hackathons, Meetups
X-WR-TIMEZONE:UTC
REFRESH-INTERVAL;VALUE=DURATION:P1D
X-PUBLISHED-TTL:P1D
`;

  for (const event of events) {
    const uid = `${event.id}@globaltechevents.com`;
    const dtStart = formatIcsDate(event.start_time, event.is_all_day);
    const dtEnd = formatIcsDate(event.end_time, event.is_all_day);

    let location = '';
    if (event.location) {
      const parts = [event.location.address, event.location.city, event.location.country].filter(Boolean);
      location = parts.join(', ');
    }

    let description = event.summary || '';
    if (event.links?.officialSite) {
      description += `\\n\\nOfficial Site: ${event.links.officialSite}`;
    }
    if (event.links?.registration) {
      description += `\\nRegistration: ${event.links.registration}`;
    }
    if (event.format) {
      description += `\\n\\nFormat: ${event.format}`;
    }
    if (event.tags?.length) {
      description += `\\nTags: ${event.tags.join(', ')}`;
    }
    description += `\\n\\n---\\nPowered by GlobalTechEvents.com`;

    // RFC 5545 VEVENT STATUS is only TENTATIVE, CONFIRMED, or CANCELLED.
    // CANCELLED makes calendar apps drop or strike the row, so an ended event
    // stays CONFIRMED on its real DTSTART/DTEND and is labeled in the text.
    const ended = event.status === 'ended';
    if (ended) {
      description = `This event has ended.\n\n${description}`;
    }
    const summary = ended ? `(Ended) ${event.title}` : event.title;

    ics += `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${now}
`;

    if (event.is_all_day) {
      ics += `DTSTART;VALUE=DATE:${dtStart}
DTEND;VALUE=DATE:${dtEnd}
`;
    } else {
      ics += `DTSTART:${dtStart}
DTEND:${dtEnd}
`;
    }

    ics += `SUMMARY:${escapeIcsText(summary)}
DESCRIPTION:${escapeIcsText(description)}
`;

    if (location) {
      ics += `LOCATION:${escapeIcsText(location)}
`;
    }

    if (event.links?.officialSite) {
      ics += `URL:${event.links.officialSite}
`;
    }

    ics += `STATUS:CONFIRMED
TRANSP:OPAQUE
END:VEVENT
`;
  }

  ics += 'END:VCALENDAR';
  return ics;
}
