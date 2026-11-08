import assert from 'node:assert/strict';
import fs from 'node:fs';
import { generateIcs, ICS_FEED_STATUSES } from '../api/_lib/calendar-ics.ts';

assert.deepEqual([...ICS_FEED_STATUSES], ['upcoming', 'live', 'ended']);

const calendarSource = fs.readFileSync(new URL('../api/calendar.ts', import.meta.url), 'utf8');
assert.match(calendarSource, /\.in\('status', \[\.\.\.ICS_FEED_STATUSES\]\)/);
assert.doesNotMatch(calendarSource, /\.in\('status', \['upcoming', 'live'\]\)/);

const event = {
  id: '11111111-2222-3333-4444-555555555555',
  title: 'AI Summit, SF; Day 1',
  summary: 'Talks and workshops',
  start_time: '2026-01-15T18:00:00.000Z',
  end_time: '2026-01-16T02:00:00.000Z',
  timezone: 'America/Los_Angeles',
  is_all_day: false,
  format: 'offline',
  location: { address: 'Moscone', city: 'San Francisco', country: 'USA' },
  links: {
    officialSite: 'https://example.com/summit',
    registration: 'https://example.com/reg',
  },
  organizer: { name: 'GlobalTechEvents' },
  tags: ['ai', 'devtools'],
};

const vevent = (ics) => {
  const match = ics.match(/BEGIN:VEVENT[\s\S]*END:VEVENT/);
  assert.ok(match, 'missing VEVENT');
  return match[0];
};

const line = (block, name) => {
  const match = block.match(new RegExp(`^${name}:(.*)$`, 'm'));
  assert.ok(match, `missing ${name}`);
  return match[1];
};

const upcoming = vevent(generateIcs([{ ...event, status: 'upcoming' }]));
const live = vevent(generateIcs([{ ...event, status: 'live' }]));
const ended = vevent(generateIcs([{ ...event, status: 'ended' }]));
const canceled = vevent(generateIcs([{ ...event, status: 'canceled' }]));

const uid = 'UID:11111111-2222-3333-4444-555555555555@globaltechevents.com';
for (const block of [upcoming, live, ended, canceled]) {
  assert.match(block, new RegExp(uid));
  assert.match(block, /^DTSTART:20260115T180000Z$/m);
  assert.match(block, /^DTEND:20260116T020000Z$/m);
  assert.match(block, /^STATUS:CONFIRMED$/m);
  assert.doesNotMatch(block, /STATUS:CANCELLED/);
  assert.match(block, /END:VEVENT/);
}

assert.equal(line(upcoming, 'SUMMARY'), 'AI Summit\\, SF\\; Day 1');
assert.equal(line(live, 'SUMMARY'), line(upcoming, 'SUMMARY'));
assert.equal(line(canceled, 'SUMMARY'), line(upcoming, 'SUMMARY'));
assert.equal(line(ended, 'SUMMARY'), '(Ended) AI Summit\\, SF\\; Day 1');

assert.doesNotMatch(line(upcoming, 'DESCRIPTION'), /This event has ended/);
assert.doesNotMatch(line(live, 'DESCRIPTION'), /This event has ended/);
assert.doesNotMatch(line(canceled, 'DESCRIPTION'), /This event has ended/);
assert.match(line(ended, 'DESCRIPTION'), /^This event has ended\.\\n\\nTalks and workshops/);
assert.match(line(ended, 'DESCRIPTION'), /Powered by GlobalTechEvents.com$/);
assert.match(ended, /^LOCATION:Moscone\\, San Francisco\\, USA$/m);
assert.match(ended, /^URL:https:\/\/example\.com\/summit$/m);

const allDay = vevent(generateIcs([{
  ...event,
  status: 'ended',
  is_all_day: true,
  start_time: '2026-03-01T00:00:00.000Z',
  end_time: '2026-03-03T00:00:00.000Z',
  summary: '',
  links: {},
  location: null,
  tags: [],
  format: '',
}]));
assert.match(allDay, /^DTSTART;VALUE=DATE:20260301$/m);
assert.match(allDay, /^DTEND;VALUE=DATE:20260303$/m);
assert.equal(line(allDay, 'SUMMARY'), '(Ended) AI Summit\\, SF\\; Day 1');
assert.match(line(allDay, 'DESCRIPTION'), /^This event has ended\.\\n\\n/);
assert.match(allDay, /^STATUS:CONFIRMED$/m);
assert.doesNotMatch(allDay, /^URL:/m);
assert.doesNotMatch(allDay, /^LOCATION:/m);

const mixed = generateIcs([
  { ...event, id: 'past-id', status: 'ended', title: 'Past Conf' },
  { ...event, id: 'next-id', status: 'upcoming', title: 'Next Conf' },
]);
assert.equal(mixed.match(/BEGIN:VEVENT/g).length, 2);
assert.match(mixed, /UID:past-id@globaltechevents.com/);
assert.match(mixed, /UID:next-id@globaltechevents.com/);
assert.match(mixed, /SUMMARY:\(Ended\) Past Conf/);
assert.match(mixed, /SUMMARY:Next Conf/);
assert.match(mixed, /END:VCALENDAR\s*$/);
