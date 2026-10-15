import fs from 'node:fs';
import assert from 'node:assert/strict';
import { INDEXABLE_SHELLS, relatedEventsForShell } from '../src/content/shells/registry.ts';

const SPA_CATCHALL = /^\/((?!events\/[^/]+\/?$)(?!events\/[^/]+\/index\.html$).*)$/;

function catchAllMatches(pathname) {
  return SPA_CATCHALL.test(pathname);
}

const pages = JSON.parse(fs.readFileSync('src/data/generatedSEOEventPages.json', 'utf8'));
const city = INDEXABLE_SHELLS.find((shell) => shell.path === '/cities/san-francisco');
const track = INDEXABLE_SHELLS.find((shell) => shell.path === '/tracks/ai');
assert.ok(city);
assert.ok(track);

const cityEvents = relatedEventsForShell(city, pages);
const trackEvents = relatedEventsForShell(track, pages);
assert.deepEqual(
  cityEvents.map((event) => event.slug).sort(),
  [
    'databricks-data-ai-summit-2026',
    'dreamforce-2026',
    'github-universe-2026',
    'microsoft-build-2026',
    'openai-devday-2026',
    'rsa-conference-2026',
    'tech-week-sf-2026',
    'techcrunch-disrupt-2026',
  ].sort(),
);
assert.ok(trackEvents.some((event) => event.slug === 'ai-summit-tokyo'));
assert.ok(trackEvents.every((event) => /(?:^|[^a-z0-9])(ai|agent)(?:[^a-z0-9]|$)/i.test(`${event.eventName} ${event.topics.join(' ')}`)));

for (const shell of INDEXABLE_SHELLS) {
  const file = `public${shell.path}/index.html`;
  const html = fs.readFileSync(file, 'utf8');
  assert.match(html, new RegExp(`<h1>${shell.h1}</h1>`));
  assert.match(html, /lang="en"/);
  assert.match(html, /index, follow/);
  const related = relatedEventsForShell(shell, pages);
  for (const event of related) {
    assert.match(html, new RegExp(`href="/events/${event.slug}"`));
  }
}

const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
assert.match(sitemap, /<loc>https:\/\/www\.globaltechevents\.xyz\/cities\/san-francisco<\/loc>/);
assert.match(sitemap, /<loc>https:\/\/www\.globaltechevents\.xyz\/tracks\/ai<\/loc>/);

const ces = fs.readFileSync('public/events/ces-2026/index.html', 'utf8');
assert.match(ces, /<h1>CES 2026/);

assert.equal(catchAllMatches('/'), true);
assert.equal(catchAllMatches('/privacy'), true);
assert.equal(catchAllMatches('/events'), true);
assert.equal(catchAllMatches('/guides/best-ai-conferences-2026'), true);
assert.equal(catchAllMatches('/cities/san-francisco'), true);
assert.equal(catchAllMatches('/events/ces-2026'), false);
assert.equal(catchAllMatches('/events/ces-2026/'), false);
assert.equal(catchAllMatches('/events/not-a-real-event'), false);
assert.equal(catchAllMatches('/events/not-a-real-event/'), false);
assert.equal(catchAllMatches('/events/not-a-real-event/index.html'), false);

const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const catchAll = vercel.rewrites.find((rule) => rule.destination === '/index.html' && rule.source.includes('?!events/'));
assert.ok(catchAll, 'SPA catch-all must exclude /events/{slug}');
assert.equal(
  catchAll.source,
  '/((?!events/[^/]+/?$)(?!events/[^/]+/index\\.html$).*)',
);
for (const shell of INDEXABLE_SHELLS) {
  assert.ok(
    vercel.rewrites.some((rule) => rule.source === shell.path && rule.destination === `${shell.path}/index.html`),
    shell.path,
  );
}

console.log(`shells ok: city ${cityEvents.length}, track ${trackEvents.length}`);
