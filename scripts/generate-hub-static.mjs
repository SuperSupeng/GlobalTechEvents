import fs from 'node:fs';
import path from 'node:path';
import { loadGuides } from './generate-guide-static.mjs';
import { evaluateGuidePublishGate } from '../src/content/guides/publishGate.ts';

const PUBLIC_DIR = path.resolve('public');
const EVENTS_DIR = path.join(PUBLIC_DIR, 'events');
const INDEX_HTML = path.resolve('index.html');
const EVENTS_JSON = path.resolve('src/data/generatedSEOEventPages.json');
const SITE_URL = 'https://www.globaltechevents.xyz';
const HOME_START = '<!-- gte:home-shell:start -->';
const HOME_END = '<!-- gte:home-shell:end -->';
const CJK = /[\u3400-\u9fff\uf900-\ufaff]/;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function assertEnglish(label, text) {
  if (CJK.test(text)) {
    throw new Error(`${label} contains CJK characters. Production copy must stay English.`);
  }
}

function readWhatsAppUrl() {
  const raw = fs.readFileSync(path.resolve('src/config/constants.ts'), 'utf8');
  const match = raw.match(/WHATSAPP_GROUP_URL = '([^']+)'/);
  return match?.[1] || `${SITE_URL}/`;
}

function loadEventPages() {
  if (!fs.existsSync(EVENTS_JSON)) return [];
  const pages = JSON.parse(fs.readFileSync(EVENTS_JSON, 'utf8'));
  if (!Array.isArray(pages)) return [];
  return pages
    .filter((page) => page && /^[a-z0-9-]+$/i.test(String(page.slug || '')))
    .map((page) => ({ ...page, slug: String(page.slug).toLowerCase() }))
    .sort((a, b) => {
      const byDate = String(a.startDate || '').localeCompare(String(b.startDate || ''));
      if (byDate !== 0) return byDate;
      return String(a.eventName || '').localeCompare(String(b.eventName || ''));
    });
}

function liveGuides(guides) {
  return guides.filter((guide) => evaluateGuidePublishGate(guide).indexable);
}

function formatDay(iso) {
  if (!iso) return '';
  const date = new Date(`${String(iso).slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function placeLabel(event) {
  if (event.format === 'online') return 'Online';
  const clean = (value) => {
    const text = String(value || '').trim();
    if (!text || text.toUpperCase() === 'TBA') return '';
    return text;
  };
  const city = clean(event.city);
  const country = clean(event.country);
  if (city && country && country !== city) return `${city}, ${country}`;
  return city || country || 'Location to be announced';
}

function jsonForScript(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function renderNav(whatsapp) {
  return `<nav>
      <a class="brand" href="/">GlobalTechEvents</a>
      <a href="/">View Calendar</a>
      <a href="/events">Events directory</a>
      <a href="/guides">Guides</a>
      <a href="${escapeHtml(whatsapp)}" rel="noopener noreferrer">WhatsApp</a>
    </nav>`;
}

const HUB_CSS = `
      :root { color-scheme: dark; }
      body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #050505; color: #f5f5f5; line-height: 1.7; }
      a { color: #fdba74; }
      nav { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; padding: 20px; border-bottom: 1px solid rgba(255,255,255,.08); }
      nav a { color: #fff; text-decoration: none; font-size: 13px; letter-spacing: .08em; text-transform: uppercase; }
      .brand { font-weight: 700; letter-spacing: 0; text-transform: none; font-size: 18px; margin-right: auto; }
      .wrap { max-width: 960px; margin: 0 auto; padding: 32px 20px 80px; }
      h1 { font-size: 42px; line-height: 1.1; margin: 12px 0 16px; }
      h2 { font-size: 26px; margin: 36px 0 12px; }
      p, li { color: rgba(255,255,255,.84); }
      .eyebrow { color: #fdba74; text-transform: uppercase; letter-spacing: .14em; font-size: 12px; }
      .links { padding-left: 20px; }
      .links a { color: #fdba74; }
      footer { margin-top: 40px; color: rgba(255,255,255,.55); font-size: 14px; }
      footer a { color: rgba(255,255,255,.75); }
`;

function renderEventsHub(events, guides) {
  const canonical = `${SITE_URL}/events`;
  const guideLinks = guides
    .map(
      (guide) =>
        `<li><a href="/guides/${escapeHtml(guide.slug)}">${escapeHtml(guide.title)}</a></li>`,
    )
    .join('');
  const eventLinks = events
    .map((event) => {
      const when = formatDay(event.startDate);
      const where = placeLabel(event);
      const meta = [when, where].filter(Boolean).join(' · ');
      return `        <li><a href="/events/${escapeHtml(event.slug)}">${escapeHtml(event.eventName)}</a>${meta ? ` — ${escapeHtml(meta)}` : ''}</li>`;
    })
    .join('\n');
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Tech events directory',
    url: canonical,
    description:
      'Directory of major tech event guides on GlobalTechEvents. Each guide links dates and location; confirm registration on the official site.',
    isPartOf: {
      '@type': 'WebSite',
      name: 'GlobalTechEvents',
      url: `${SITE_URL}/`,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: events.length,
      itemListElement: events.map((event, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: event.eventName,
        url: `${SITE_URL}/events/${event.slug}`,
      })),
    },
  };
  const whatsapp = readWhatsAppUrl();

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tech events directory | GlobalTechEvents</title>
    <meta name="description" content="Directory of major tech event guides. Open a conference for dates and location, then confirm registration on the official site." />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Tech events directory | GlobalTechEvents" />
    <meta property="og:description" content="Directory of major tech event guides. Open a conference for dates and location, then confirm registration on the official site." />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:site_name" content="GlobalTechEvents" />
    <script type="application/ld+json">${jsonForScript(itemList)}</script>
    <style>${HUB_CSS}
    </style>
  </head>
  <body>
    ${renderNav(whatsapp)}
    <main class="wrap">
      <p class="eyebrow">Events directory</p>
      <h1>Tech events directory</h1>
      <p>Guides for the major tech conferences on the GlobalTechEvents calendar. Open an event for dates and location, then confirm registration on the official site.</p>
      <h2>Start here</h2>
      <ul class="links">
        <li><a href="/">Event calendar</a></li>
        <li><a href="/guides">Guides</a></li>
        ${guideLinks}
        <li><a href="/resources">Resources</a></li>
      </ul>
      <h2>Event guides</h2>
      ${
        eventLinks
          ? `<ul class="links">\n${eventLinks}\n      </ul>`
          : '<p>Event guides will appear here as they are published.</p>'
      }
      <footer>
        <a href="/privacy">Privacy</a>
        ·
        <a href="/terms">Terms</a>
      </footer>
    </main>
  </body>
</html>`;
}

function renderHomeShell(guides) {
  const guideLinks = guides
    .map(
      (guide) =>
        `<li><a href="/guides/${escapeHtml(guide.slug)}">${escapeHtml(guide.title)}</a></li>`,
    )
    .join('');
  return `${HOME_START}
      <main id="gte-home-shell" style="max-width:860px;margin:0 auto;padding:48px 20px 80px;font-family:Inter,system-ui,sans-serif;line-height:1.7;">
        <p style="letter-spacing:.14em;text-transform:uppercase;font-size:12px;margin:0 0 12px;">GlobalTechEvents</p>
        <h1 style="font-size:40px;line-height:1.15;margin:0 0 16px;">The world's major tech events, in one calendar</h1>
        <p style="margin:0 0 20px;">A unified calendar of globally known tech conferences and industry events. Subscribe once, sync everywhere, and follow updates on WhatsApp.</p>
        <nav aria-label="Primary">
          <ul>
            <li><a href="/events">Events directory</a></li>
            <li><a href="/guides">Guides</a></li>
            ${guideLinks}
            <li><a href="/resources">Resources</a></li>
          </ul>
        </nav>
      </main>
      <script>
        if (location.pathname !== '/' && location.pathname !== '') {
          document.getElementById('gte-home-shell')?.remove();
        }
      </script>
      ${HOME_END}`;
}

function upsertHomeShell(shell) {
  if (!fs.existsSync(INDEX_HTML)) {
    throw new Error('index.html is missing; the home shell is injected into the Vite entry.');
  }
  const html = fs.readFileSync(INDEX_HTML, 'utf8');
  if (!html.includes('<div id="root">')) {
    throw new Error('index.html is missing <div id="root">');
  }
  let next;
  if (html.includes(HOME_START) && html.includes(HOME_END)) {
    next = html.replace(new RegExp(`${HOME_START}[\\s\\S]*?${HOME_END}`), shell.trim());
  } else {
    next = html.replace('<div id="root">', `<div id="root">\n      ${shell.trim()}\n    `);
  }
  if (!next.includes('<h1') || !next.includes('href="/events"') || !next.includes('href="/guides"')) {
    throw new Error('Home shell is missing an H1 or primary internal links.');
  }
  assertEnglish('index.html home shell', next.slice(next.indexOf(HOME_START), next.indexOf(HOME_END) + HOME_END.length));
  fs.writeFileSync(INDEX_HTML, next);
}

function markdownLabel(value) {
  return String(value || '')
    .replace(/[\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function renderLlmsTxt(events, guides) {
  const lines = [
    '# GlobalTechEvents',
    '',
    '> Unified calendar of globally known major tech events, with an events directory and evergreen conference guides.',
    '',
    'GlobalTechEvents publishes English pages for the home calendar, the events directory, and conference guides. Confirm dates and registration on the organizer site.',
    '',
    'An agent feed is not published. Use the pages below.',
    '',
    '## Hubs',
    '',
    `- [Home calendar](${SITE_URL}/): Major tech events in one calendar.`,
    `- [Events directory](${SITE_URL}/events): Index of crawlable event guides.`,
    `- [Guides](${SITE_URL}/guides): Evergreen compare and best-of guides.`,
    '',
    '## Guides',
    '',
  ];

  if (guides.length === 0) {
    lines.push('No published guide is live yet. The guides index is still the index of this section.');
  } else {
    for (const guide of guides) {
      const blurb = String(guide.description || guide.title || '')
        .replace(/\s+/g, ' ')
        .trim();
      lines.push(`- [${markdownLabel(guide.title)}](${SITE_URL}/guides/${guide.slug}): ${blurb}`);
    }
  }

  lines.push(
    '',
    '## Event guides',
    '',
    'Each item below is a crawlable event guide. The events directory and the sitemap list the same set.',
    '',
  );

  if (events.length === 0) {
    lines.push('No event guides are generated yet.');
  } else {
    for (const event of events) {
      const when = formatDay(event.startDate);
      const where = placeLabel(event);
      const detail = [when, where].filter(Boolean).join(', ');
      lines.push(
        `- [${markdownLabel(event.eventName)}](${SITE_URL}/events/${event.slug}): ${detail || 'Event guide.'}`,
      );
    }
  }

  lines.push(
    '',
    '## Other crawlable pages',
    '',
    `- [Resources](${SITE_URL}/resources): How to follow the calendar.`,
    `- [Privacy](${SITE_URL}/privacy): Privacy policy.`,
    `- [Terms](${SITE_URL}/terms): Terms of service.`,
    `- [Sitemap](${SITE_URL}/sitemap.xml): Indexable URLs.`,
    '',
  );

  return `${lines.join('\n')}\n`;
}

export function writeHubStaticPages() {
  const events = loadEventPages();
  const guides = liveGuides(loadGuides());
  fs.mkdirSync(EVENTS_DIR, { recursive: true });

  const eventsHtml = renderEventsHub(events, guides);
  assertEnglish('public/events/index.html', eventsHtml);
  if (!/<h1>[^<]+<\/h1>/.test(eventsHtml)) {
    throw new Error('Events hub shell is missing a text H1.');
  }
  if (!eventsHtml.includes('href="/guides/best-ai-conferences-2026"') && guides.some((guide) => guide.slug === 'best-ai-conferences-2026')) {
    throw new Error('Events hub is missing the live Best AI conferences 2026 link.');
  }
  fs.writeFileSync(path.join(EVENTS_DIR, 'index.html'), eventsHtml);

  upsertHomeShell(renderHomeShell(guides));

  const llms = renderLlmsTxt(events, guides);
  assertEnglish('public/llms.txt', llms);
  if (!llms.includes(`${SITE_URL}/events`) || !llms.includes(`${SITE_URL}/guides`)) {
    throw new Error('llms.txt is missing hub links.');
  }
  if (guides.some((guide) => guide.slug === 'best-ai-conferences-2026') && !llms.includes(`${SITE_URL}/guides/best-ai-conferences-2026`)) {
    throw new Error('llms.txt is missing the live Best AI conferences 2026 URL.');
  }
  if (/\/feed(?:\.xml)?\b|agent-feed|\/agents?\b/i.test(llms)) {
    throw new Error('llms.txt invented an agent or feed URL.');
  }
  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), llms);

  console.log(
    `Hub shells: home + /events (${events.length} event links, ${guides.length} live guides) and public/llms.txt`,
  );
}
