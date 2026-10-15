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
  { ok: true, at_least: 200, label: 'people_added_this_calendar' },
  'measured row public body',
);
assertWall(measuredBody, '200+', '200+ people added this calendar');

const floors = [
  { unique: 1, downloads: 1336, atLeast: 0, figure: null, joined: null },
  { unique: 9, downloads: 99, atLeast: 0, figure: null, joined: null },
  { unique: 13, downloads: 205, atLeast: 10, figure: '10+', joined: '10+ people added this calendar' },
  { unique: 99, downloads: 205, atLeast: 90, figure: '90+', joined: '90+ people added this calendar' },
  { unique: 205, downloads: 1336, atLeast: 200, figure: '200+', joined: '200+ people added this calendar' },
  { unique: 1336, downloads: 12345, atLeast: 1300, figure: '1,300+', joined: '1,300+ people added this calendar' },
  { unique: 12345, downloads: 99999, atLeast: 12000, figure: '12,000+', joined: '12,000+ people added this calendar' },
];

for (const { unique, downloads, atLeast, figure, joined } of floors) {
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
    `unique ${unique} publishes ${atLeast}`,
  );
  if (figure === null) {
    assert.equal(wall(body), null, `unique ${unique} hides the wall`);
  } else {
    assertWall(body, figure, joined);
  }
}

const zeroUnique = await loadCalendarDownloadsBody(
  rowClient({
    all_time_downloads: 1336,
    all_time_distinct_ip_hashes: 0,
    recent_downloads: 45,
    recent_distinct_ip_hashes: 13,
  }),
);
assert.deepEqual(
  zeroUnique,
  { ok: true, at_least: 0, label: 'people_added_this_calendar' },
  'zero unique IPs still ok',
);
assert.equal(wall(zeroUnique), null, 'zero unique IPs hides the wall');

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

for (const bad of ['1336', '205', '01336', '1336.0', ' ', '', '-1', -1]) {
  assert.deepEqual(
    await loadCalendarDownloadsBody(rowClient({ ...measured, all_time_downloads: bad })),
    FAILURE,
    `rejected count ${JSON.stringify(bad)}`,
  );
}

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
