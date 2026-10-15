import assert from 'node:assert/strict';
import { loadCalendarDownloadsBody, proofSentenceFromBody } from '../src/data/calendarDownloads.ts';

const FAILURE = { ok: false };
const calls = [];
const rowClient = (data, error = null) => ({
  rpc: (fn, args) => {
    calls.push([fn, args]);
    return { single: async () => ({ data, error }) };
  },
});

const wall = (body) => proofSentenceFromBody(JSON.parse(JSON.stringify(body)));

const assertWall = (body, figure, joined) => {
  const sentence = wall(body);
  assert.deepEqual(sentence, [{ figure }, ' people added this calendar'], joined);
  assert.equal(sentence.map((part) => (typeof part === 'string' ? part : part.figure)).join(''), joined);
};

const measured = {
  all_time_downloads: 1336,
  all_time_distinct_ip_hashes: 205,
  recent_downloads: 45,
  recent_distinct_ip_hashes: 13,
};

const measuredBody = await loadCalendarDownloadsBody(rowClient(measured));
assert.deepEqual(calls, [['count_ics_downloads', { p_window_days: 7 }]], 'count_ics_downloads with a 7 day window');
assert.deepEqual(
  measuredBody,
  { ok: true, at_least: 1300, label: 'people_added_this_calendar' },
  'measured row public body',
);
assertWall(measuredBody, '1,300+', '1,300+ people added this calendar');

const floors = [
  { downloads: 0, unique: 0, atLeast: 0, figure: null },
  { downloads: 9, unique: 9, atLeast: 0, figure: null },
  { downloads: 13, unique: 1, atLeast: 10, figure: '10+' },
  { downloads: 99, unique: 0, atLeast: 90, figure: '90+' },
  { downloads: 205, unique: 205, atLeast: 200, figure: '200+' },
  { downloads: 300, unique: 205, atLeast: 300, figure: '300+' },
  { downloads: 1336, unique: 0, atLeast: 1300, figure: '1,300+' },
  { downloads: 1336, unique: 1336, atLeast: 1300, figure: '1,300+' },
  { downloads: 1399, unique: 205, atLeast: 1300, figure: '1,300+' },
  { downloads: 1400, unique: 205, atLeast: 1400, figure: '1,400+' },
  { downloads: 12345, unique: 205, atLeast: 12000, figure: '12,000+' },
];

for (const { downloads, unique, atLeast, figure } of floors) {
  const body = await loadCalendarDownloadsBody(
    rowClient({
      all_time_downloads: downloads,
      all_time_distinct_ip_hashes: unique,
      recent_downloads: 100000,
      recent_distinct_ip_hashes: 100000,
    }),
  );
  assert.deepEqual(
    body,
    { ok: true, at_least: atLeast, label: 'people_added_this_calendar' },
    `downloads ${downloads} publishes ${atLeast}`,
  );
  if (figure === null) {
    assert.equal(wall(body), null, `downloads ${downloads} hides the wall`);
  } else {
    assertWall(body, figure, `${figure} people added this calendar`);
  }
}

assert.deepEqual(
  await loadCalendarDownloadsBody(
    rowClient({
      all_time_downloads: 1336,
      all_time_distinct_ip_hashes: 2000,
      recent_downloads: 45,
      recent_distinct_ip_hashes: 13,
    }),
  ),
  FAILURE,
  'unique above downloads',
);
assert.deepEqual(
  await loadCalendarDownloadsBody(
    rowClient({
      ...measured,
      all_time_distinct_ip_hashes: 1337,
    }),
  ),
  FAILURE,
  'unique 1337 above downloads 1336',
);

for (const column of ['all_time_downloads', 'all_time_distinct_ip_hashes']) {
  for (const bad of ['1336', '205', '01336', '1336.0', ' ', '', '-1', -1]) {
    assert.deepEqual(
      await loadCalendarDownloadsBody(rowClient({ ...measured, [column]: bad })),
      FAILURE,
      `rejected ${column} ${JSON.stringify(bad)}`,
    );
  }
}

const missingUnique = { ...measured };
delete missingUnique.all_time_distinct_ip_hashes;
assert.deepEqual(
  await loadCalendarDownloadsBody(rowClient(missingUnique)),
  FAILURE,
  'omitted all_time_distinct_ip_hashes',
);

assert.deepEqual(await loadCalendarDownloadsBody(null), FAILURE, 'missing client');
assert.deepEqual(
  await loadCalendarDownloadsBody(rowClient(null, { message: 'function count_ics_downloads does not exist' })),
  FAILURE,
  'RPC error',
);

const arrayRow = [];
arrayRow.all_time_downloads = 1336;
arrayRow.all_time_distinct_ip_hashes = 205;
arrayRow.recent_downloads = 45;
arrayRow.recent_distinct_ip_hashes = 13;
assert.deepEqual(await loadCalendarDownloadsBody(rowClient(arrayRow)), FAILURE, 'array row');

assert.equal(
  wall({
    ok: true,
    followers: 1336,
    label: 'calendar_downloads',
    source: 'ics_downloads_count',
    all_time: { downloads: 1336, approx_unique_ips: 205 },
    recent: { days: 7, downloads: 45, approx_unique_ips: 13 },
    generated_at: '2026-10-15T05:18:34.126Z',
  }),
  null,
  'dual-window body hides the wall',
);
assert.equal(
  wall({
    ok: true,
    followers: 1336,
    label: 'calendar_subscribers',
    source: 'ics_downloads_count',
    generated_at: '2026-10-15T05:18:34.126Z',
  }),
  null,
  'subscribers body hides the wall',
);
assert.equal(
  wall({ ok: true, at_least: 200, label: 'calendar_downloads' }),
  null,
  'wrong label hides the wall',
);
assert.equal(
  wall({ ok: true, at_least: '200', label: 'people_added_this_calendar' }),
  null,
  'string at_least hides the wall',
);
assert.equal(
  wall({ ok: true, at_least: 200.5, label: 'people_added_this_calendar' }),
  null,
  'fractional at_least hides the wall',
);
assert.equal(wall(FAILURE), null, 'ok false hides the wall');

assertWall(
  { ok: true, at_least: 1336, label: 'people_added_this_calendar' },
  '1,336+',
  '1,336+ people added this calendar',
);

for (const call of calls) {
  assert.deepEqual(call, ['count_ics_downloads', { p_window_days: 7 }]);
}

console.log('calendar download checks passed');
