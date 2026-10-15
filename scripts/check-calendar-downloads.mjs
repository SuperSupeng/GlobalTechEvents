import assert from 'node:assert/strict';
import { loadCalendarDownloadsBody, proofSentenceFromBody } from '../src/data/calendarDownloads.ts';

const AT = '2026-10-15T05:18:34.126Z';
const UNAVAILABLE = {
  ok: false,
  followers: null,
  label: 'calendar_downloads',
  source: 'ics_downloads_count',
  generated_at: AT,
};
const measured = {
  all_time_downloads: 1336,
  all_time_distinct_ip_hashes: 205,
  recent_downloads: 45,
  recent_distinct_ip_hashes: 13,
};
const measuredBody = {
  ok: true,
  followers: 1336,
  label: 'calendar_downloads',
  source: 'ics_downloads_count',
  all_time: { downloads: 1336, approx_unique_ips: 205 },
  recent: { days: 7, downloads: 45, approx_unique_ips: 13 },
  generated_at: AT,
};

const calls = [];
const rowClient = (data, error = null) => ({
  rpc: (fn, args) => {
    calls.push([fn, args]);
    return { single: async () => ({ data, error }) };
  },
});
const text = (sentence) => sentence.map((part) => (typeof part === 'string' ? part : part.figure)).join('');
const okBody = (allTime) => ({
  ok: true,
  all_time: allTime,
  recent: { days: 7, downloads: 0, approx_unique_ips: 0 },
  generated_at: AT,
});

const body = await loadCalendarDownloadsBody(rowClient(measured), AT);
assert.deepEqual(calls, [['count_ics_downloads', { p_window_days: 7 }]], 'calls the SQL function with the window');
assert.deepEqual(body, measuredBody, 'measured row becomes the public body');
assert.equal(body.followers, body.all_time.downloads, 'followers and all_time.downloads are the same count');
assert.equal(
  text(proofSentenceFromBody(JSON.parse(JSON.stringify(body)))),
  '1,336 calendar downloads from about 205 unique IPs',
  'public body becomes the wall sentence',
);
assert.equal(
  text(proofSentenceFromBody(okBody({ downloads: 1, approx_unique_ips: 1 }))),
  '1 calendar download from about 1 unique IP',
  'singular forms',
);
assert.equal(proofSentenceFromBody(okBody({ downloads: 0, approx_unique_ips: 0 })), null, 'zero hides the wall');
assert.equal(
  proofSentenceFromBody(okBody({ downloads: 4, approx_unique_ips: 0 })),
  null,
  'zero unique IPs hides the wall',
);
assert.equal(
  text(proofSentenceFromBody({ ...measuredBody, followers: 1, label: 'calendar_subscribers', source: 'other' })),
  '1,336 calendar downloads from about 205 unique IPs',
  'followers, label, and source do not change the sentence',
);
assert.equal(
  proofSentenceFromBody({
    ok: true,
    followers: 1336,
    label: 'calendar_subscribers',
    source: 'ics_downloads_count',
    generated_at: AT,
  }),
  null,
  'retired body hides the wall',
);
assert.equal(proofSentenceFromBody(UNAVAILABLE), null, 'unavailable body hides the wall');
assert.equal(
  proofSentenceFromBody({
    ...measuredBody,
    all_time: { downloads: '1336', approx_unique_ips: 205 },
  }),
  null,
  'a string count on the public body hides the wall',
);
assert.deepEqual(await loadCalendarDownloadsBody(null, AT), UNAVAILABLE, 'missing env is unavailable');
assert.deepEqual(
  await loadCalendarDownloadsBody(rowClient(null, { message: 'function count_ics_downloads does not exist' }), AT),
  UNAVAILABLE,
  'RPC error is unavailable',
);
assert.deepEqual(
  await loadCalendarDownloadsBody(rowClient({ ...measured, all_time_distinct_ip_hashes: 2000 }), AT),
  UNAVAILABLE,
  'more unique IPs than downloads is rejected',
);
assert.deepEqual(
  await loadCalendarDownloadsBody(rowClient({ ...measured, recent_downloads: 5000 }), AT),
  UNAVAILABLE,
  'recent above all time is rejected',
);

const fromDigitStrings = await loadCalendarDownloadsBody(
  rowClient({
    all_time_downloads: '1336',
    all_time_distinct_ip_hashes: '205',
    recent_downloads: '45',
    recent_distinct_ip_hashes: '13',
  }),
  AT,
);
assert.deepEqual(fromDigitStrings, measuredBody, 'digit-string bigint counts become the same public body');
assert.equal(
  fromDigitStrings.followers,
  fromDigitStrings.all_time.downloads,
  'digit-string followers and all_time.downloads are the same count',
);

const zeroDigits = await loadCalendarDownloadsBody(
  rowClient({
    all_time_downloads: '0',
    all_time_distinct_ip_hashes: '0',
    recent_downloads: '0',
    recent_distinct_ip_hashes: '0',
  }),
  AT,
);
assert.deepEqual(
  zeroDigits,
  {
    ok: true,
    followers: 0,
    label: 'calendar_downloads',
    source: 'ics_downloads_count',
    all_time: { downloads: 0, approx_unique_ips: 0 },
    recent: { days: 7, downloads: 0, approx_unique_ips: 0 },
    generated_at: AT,
  },
  'a zero digit string is a count',
);
assert.equal(proofSentenceFromBody(zeroDigits), null, 'a zero digit-string row hides the wall');

for (const bad of ['01336', '1336.0', ' ', '', '-1', -1]) {
  assert.deepEqual(
    await loadCalendarDownloadsBody(rowClient({ ...measured, all_time_downloads: bad }), AT),
    UNAVAILABLE,
    `rejected count ${JSON.stringify(bad)}`,
  );
}

const arrayRow = [];
arrayRow.all_time_downloads = 1336;
arrayRow.all_time_distinct_ip_hashes = 205;
arrayRow.recent_downloads = 45;
arrayRow.recent_distinct_ip_hashes = 13;
assert.deepEqual(await loadCalendarDownloadsBody(rowClient(arrayRow), AT), UNAVAILABLE, 'an array row is rejected');

const arrayBody = [];
arrayBody.ok = true;
arrayBody.all_time = { downloads: 1336, approx_unique_ips: 205 };
arrayBody.recent = { days: 7, downloads: 45, approx_unique_ips: 13 };
assert.equal(proofSentenceFromBody(arrayBody), null, 'an array body hides the wall');

console.log('calendar download checks passed');
