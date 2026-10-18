import fs from 'node:fs';
import assert from 'node:assert/strict';
import { INDEXABLE_SHELLS, relatedEventsForShell } from '../src/content/shells/registry.ts';

const SPA_CATCHALL = /^\/((?!events\/[^/]+\/?$)(?!events\/[^/]+\/index\.html$)(?![^/]+\.txt$).*)$/;

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

const WHATSAPP_URL = 'https://chat.whatsapp.com/InsPPq4NBSh82cOe6ZzZya?mode=gi_t';
const whatsappPattern = new RegExp(WHATSAPP_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
for (const shell of INDEXABLE_SHELLS) {
  const html = fs.readFileSync(`public${shell.path}/index.html`, 'utf8');
  assert.match(html, /Join WhatsApp/);
  assert.match(html, whatsappPattern);
  assert.match(html, /href="\/api\/calendar"/);
  assert.match(html, /ICS subscribe/);
  assert.doesNotMatch(html, /noindex/);
}

const cityHtml = fs.readFileSync('public/cities/san-francisco/index.html', 'utf8');
for (const slug of [
  'microsoft-build-2026',
  'dreamforce-2026',
  'openai-devday-2026',
  'databricks-data-ai-summit-2026',
  'techcrunch-disrupt-2026',
  'nvidia-gtc-2026',
]) {
  assert.match(cityHtml, new RegExp(`href="/events/${slug}"`));
}
assert.match(cityHtml, /href="\/guides\/ai-conferences-san-francisco-2026"/);
assert.match(cityHtml, /San Jose, not in San Francisco/);

const AI_TOPIC_SLUGS = [
  'nvidia-gtc-2026',
  'openai-devday-2026',
  'databricks-data-ai-summit-2026',
  'microsoft-build-2026',
  'google-cloud-next-2026',
  'kubecon-na-2026',
  'dreamforce-2026',
  'superai-singapore-2026',
  'aws-reinvent-2026',
  'techcrunch-disrupt-2026',
];
const AGENT_TOPIC_SLUGS = [
  'openai-devday-2026',
  'microsoft-build-2026',
  'google-cloud-next-2026',
  'google-io-2026',
  'databricks-data-ai-summit-2026',
  'aws-reinvent-2026',
  'nvidia-gtc-2026',
  'kubecon-na-2026',
  'dreamforce-2026',
  'superai-singapore-2026',
];

function linkedEventSlugs(html) {
  return [...new Set([...html.matchAll(/href="\/events\/([a-z0-9-]+)"/g)].map((match) => match[1]))];
}

const aiHtml = fs.readFileSync('public/topics/ai/index.html', 'utf8');
const agentsHtml = fs.readFileSync('public/topics/ai-agents/index.html', 'utf8');
assert.match(aiHtml, /<h1>AI conferences<\/h1>/);
assert.match(agentsHtml, /<h1>AI agent conferences<\/h1>/);
assert.match(agentsHtml, /<h2>Agents<\/h2>/);
assert.ok(aiHtml.includes('As of 16 October 2026'));
assert.ok(agentsHtml.includes('As of 16 October 2026'));
for (const html of [aiHtml, agentsHtml]) {
  assert.doesNotMatch(html, /neurips|icml|cvpr/i);
  assert.match(html, /href="\/guides\/ai-conferences-san-francisco-2026"/);
  assert.match(html, /href="\/guides\/best-ai-conferences-2026"/);
  assert.match(html, /href="\/tracks\/ai"/);
  assert.match(html, /href="\/cities\/san-francisco"/);
  assert.ok(linkedEventSlugs(html).length >= 5);
}
for (const slug of AI_TOPIC_SLUGS) {
  assert.ok(pages.some((page) => page.slug === slug), slug);
  assert.match(aiHtml, new RegExp(`href="/events/${slug}"`));
}
for (const slug of AGENT_TOPIC_SLUGS) {
  assert.ok(pages.some((page) => page.slug === slug), slug);
  assert.match(agentsHtml, new RegExp(`href="/events/${slug}"`));
}
assert.match(aiHtml, /href="\/topics\/ai-agents"/);
assert.match(agentsHtml, /href="\/topics\/ai"/);

function wordCount(value) {
  return String(value).trim().split(/\s+/).filter(Boolean).length;
}
for (const slug of [
  'superai-singapore-2026',
  'google-cloud-next-2026',
  'microsoft-build-2026',
  'computex-2026',
  'dreamforce-2026',
  'kubecon-na-2026',
]) {
  const page = pages.find((item) => item.slug === slug);
  assert.ok(page, slug);
  const definition = wordCount(page.whyItMatters);
  const section = definition + wordCount(page.metaDescription);
  assert.ok(definition >= 40 && definition <= 80, `${slug} definition ${definition}`);
  assert.ok(section >= 40 && section <= 80, `${slug} section ${section}`);
  const html = fs.readFileSync(`public/events/${slug}/index.html`, 'utf8');
  assert.match(html, /Join WhatsApp/);
  assert.match(html, /Download \.ics/);
  assert.match(html, whatsappPattern);
}

const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
assert.match(sitemap, /<loc>https:\/\/www\.globaltechevents\.xyz\/cities\/san-francisco<\/loc>/);
assert.match(sitemap, /<loc>https:\/\/www\.globaltechevents\.xyz\/tracks\/ai<\/loc>/);
assert.match(sitemap, /<loc>https:\/\/www\.globaltechevents\.xyz\/topics\/ai<\/loc>/);
assert.match(sitemap, /<loc>https:\/\/www\.globaltechevents\.xyz\/topics\/ai-agents<\/loc>/);

const llms = fs.readFileSync('public/llms.txt', 'utf8');
assert.match(llms, /https:\/\/www\.globaltechevents\.xyz\/topics\/ai\)/);
assert.match(llms, /https:\/\/www\.globaltechevents\.xyz\/topics\/ai-agents\)/);
assert.doesNotMatch(llms, /neurips|icml|cvpr/i);

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
assert.equal(catchAllMatches('/robots.txt'), false);
assert.equal(catchAllMatches('/llms.txt'), false);
assert.equal(catchAllMatches('/7b3e8e8c-65fb-4d06-9a5e-9de3232ce1a6.txt'), false);
assert.equal(catchAllMatches('/indexnow-key.txt'), false);
assert.equal(catchAllMatches('/sitemap.xml'), true);
assert.equal(catchAllMatches('/guides/foo.txt'), true);

const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const catchAll = vercel.rewrites.find((rule) => rule.destination === '/index.html' && rule.source.includes('?!events/'));
assert.ok(catchAll, 'SPA catch-all must exclude /events/{slug}');
assert.equal(
  catchAll.source,
  '/((?!events/[^/]+/?$)(?!events/[^/]+/index\\.html$)(?![^/]+\\.txt$).*)',
);
const rootTxt = vercel.rewrites.find((rule) => rule.source === '/:file([^/]+\\.txt)');
assert.ok(rootTxt, 'root *.txt must be rewritten to the static file before the SPA catch-all');
assert.equal(rootTxt.destination, '/:file');
assert.ok(vercel.rewrites.indexOf(rootTxt) < vercel.rewrites.indexOf(catchAll));
const indexNowKey = '7b3e8e8c-65fb-4d06-9a5e-9de3232ce1a6';
const indexNowBody = fs.readFileSync(`public/${indexNowKey}.txt`, 'utf8');
assert.equal(indexNowBody, `${indexNowKey}\n`);
assert.ok(
  vercel.headers.some(
    (rule) =>
      rule.source === `/${indexNowKey}.txt` &&
      rule.headers.some((header) => header.key === 'Content-Type' && header.value.startsWith('text/plain')),
  ),
);
for (const shell of INDEXABLE_SHELLS) {
  assert.ok(
    vercel.rewrites.some((rule) => rule.source === shell.path && rule.destination === `${shell.path}/index.html`),
    shell.path,
  );
}

const aiShell = INDEXABLE_SHELLS.find((shell) => shell.path === '/topics/ai');
const agentsShell = INDEXABLE_SHELLS.find((shell) => shell.path === '/topics/ai-agents');
assert.equal(relatedEventsForShell(aiShell, pages).length, AI_TOPIC_SLUGS.length);
assert.equal(relatedEventsForShell(agentsShell, pages).length, AGENT_TOPIC_SLUGS.length);
console.log(`shells ok: city ${cityEvents.length}, track ${trackEvents.length}, ai ${AI_TOPIC_SLUGS.length}, agents ${AGENT_TOPIC_SLUGS.length}`);
