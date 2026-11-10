import fs from 'node:fs';
import path from 'node:path';
import { INDEXABLE_SHELLS, relatedEventsForShell } from '../src/content/shells/registry.ts';
import { GUIDE_SITE_ORIGIN as SITE_URL } from '../src/content/guides/site.ts';
import { loadAuthors } from './generate-guide-static.mjs';

const PUBLIC_DIR = path.resolve('public');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function readWhatsAppUrl() {
  const raw = fs.readFileSync(path.resolve('src/config/constants.ts'), 'utf8');
  const match = raw.match(/WHATSAPP_GROUP_URL = '([^']+)'/);
  if (!match) throw new Error('WHATSAPP_GROUP_URL missing from src/config/constants.ts');
  return match[1];
}

const ACADEMIC_LINK = /neurips|icml|cvpr/i;

function listedEventSlugs(events) {
  return new Set(events.map((event) => String(event.slug || '').toLowerCase()).filter(Boolean));
}

function keepShellLink(link, knownSlugs) {
  const href = String(link.href || '');
  const label = String(link.label || '');
  if (ACADEMIC_LINK.test(`${href} ${label}`)) return false;
  const match = href.match(/^\/events\/([a-z0-9-]+)\/?$/i);
  if (!match) return true;
  return knownSlugs.has(match[1].toLowerCase());
}

function renderLinkItems(links, knownSlugs) {
  return (links || [])
    .filter((link) => keepShellLink(link, knownSlugs))
    .map((link) => {
      const note = link.note ? ` <span class="meta">${escapeHtml(link.note)}</span>` : '';
      return `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>${note}</li>`;
    })
    .join('');
}

function shellEyebrow(kind) {
  if (kind === 'city') return 'City';
  if (kind === 'track') return 'Track';
  return 'Topic';
}

function renderShell(shell, events) {
  const canonical = `${SITE_URL}${shell.path}`;
  const related = relatedEventsForShell(shell, events);
  const whatsapp = readWhatsAppUrl();
  const knownSlugs = listedEventSlugs(events);
  const startItems = renderLinkItems(shell.links, knownSlugs);
  const startHere = startItems
    ? `<section>
        <h2>Where to start</h2>
        <ul>${startItems}</ul>
      </section>`
    : '';
  const extraSections = (shell.sections || [])
    .map((section) => {
      const items = renderLinkItems(section.links, knownSlugs);
      const intro = section.intro ? `<p>${escapeHtml(section.intro)}</p>` : '';
      const list = items ? `<ul>${items}</ul>` : '';
      return `<section>
        <h2>${escapeHtml(section.heading)}</h2>
        ${intro}
        ${list}
      </section>`;
    })
    .join('');
  const extraBlock = extraSections ? `\n      ${extraSections}` : '';
  const ctas = shell.calendarHeading
    ? `<section>
        <h2>${escapeHtml(shell.calendarHeading)}</h2>
        ${shell.calendarLead ? `<p>${escapeHtml(shell.calendarLead)}</p>` : ''}
        <div class="btn-row">
          <a class="btn" href="/api/calendar">${escapeHtml(shell.calendarLabel || 'Subscribe to the ICS calendar')}</a>
          <a class="btn btn-secondary" href="${escapeHtml(whatsapp)}" target="_blank" rel="noopener noreferrer">Join WhatsApp</a>
        </div>
      </section>`
    : `<div class="btn-row">
        <a class="btn" href="${escapeHtml(whatsapp)}" target="_blank" rel="noopener noreferrer">Join WhatsApp</a>
        <a class="btn btn-secondary" href="/api/calendar">ICS subscribe</a>
      </div>`;
  const items = related
    .map((event) => {
      const place = [event.city, event.country].filter(Boolean).join(', ');
      const meta = [formatDate(event.startDate), place].filter(Boolean).join(', ');
      return `<li><a href="/events/${escapeHtml(event.slug)}">${escapeHtml(event.eventName)}</a> <span class="meta">${escapeHtml(meta)}</span></li>`;
    })
    .join('');
  const list =
    items.length > 0
      ? `<ul>${items}</ul>`
      : '<p>No related events are listed yet. Check the <a href="/events">events directory</a>.</p>';
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: shell.h1,
    url: canonical,
    description: shell.metaDescription,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: related.map((event, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: event.eventName,
        url: `${SITE_URL}/events/${event.slug}`,
      })),
    },
  };
  const jsonLd = JSON.stringify(itemList).replace(/</g, '\\u003c');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(shell.seoTitle)}</title>
    <meta name="description" content="${escapeHtml(shell.metaDescription)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(shell.seoTitle)}" />
    <meta property="og:description" content="${escapeHtml(shell.metaDescription)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:site_name" content="GlobalTechEvents" />
    <script type="application/ld+json">${jsonLd}</script>
    <style>
      :root { color-scheme: dark; }
      body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #050505; color: #f5f5f5; line-height: 1.7; }
      .wrap { max-width: 860px; margin: 0 auto; padding: 40px 20px 80px; }
      .eyebrow { color: #f59e0b; text-transform: uppercase; letter-spacing: .16em; font-size: 12px; margin-bottom: 16px; }
      h1 { font-size: 42px; line-height: 1.1; margin: 0 0 20px; }
      p, li { color: rgba(255,255,255,.85); }
      a { color: #fbbf24; }
      ul { padding-left: 22px; }
      li { margin: 10px 0; }
      .meta { color: rgba(255,255,255,.55); }
      .nav { margin-top: 36px; }
      .btn-row { display: flex; flex-wrap: wrap; gap: 12px; margin: 22px 0 8px; }
      a.btn { display: inline-flex; align-items: center; justify-content: center; padding: 12px 18px; border-radius: 12px; background: #f59e0b; color: #111; text-decoration: none; font-weight: 700; }
      a.btn-secondary { background: rgba(255,255,255,.06); color: #fff; border: 1px solid rgba(255,255,255,.12); }
      @media (max-width: 640px) {
        h1 { font-size: 34px; }
        .wrap { padding-top: 28px; }
        a.btn { width: 100%; }
      }
    </style>
  </head>
  <body>
    <main class="wrap">
      <p class="eyebrow">${shellEyebrow(shell.kind)}</p>
      <h1>${escapeHtml(shell.h1)}</h1>
      ${
        shell.calendarHeading
          ? `${ctas}
      <p>${escapeHtml(shell.intro)}</p>`
          : `<p>${escapeHtml(shell.intro)}</p>
      ${ctas}`
      }
      ${startHere}${extraBlock}
      <section>
        <h2>Related events</h2>
        ${list}
      </section>
      <p class="nav"><a href="/events">All events</a> <a href="/">Calendar</a></p>
    </main>
  </body>
</html>`;
}

const DIRECTORY_CSS = `
      :root { color-scheme: dark; }
      body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #050505; color: #f5f5f5; line-height: 1.7; }
      a { color: #fdba74; }
      nav { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; padding: 20px; border-bottom: 1px solid rgba(255,255,255,.08); }
      nav a { color: #fff; text-decoration: none; font-size: 13px; letter-spacing: .08em; text-transform: uppercase; }
      .brand { font-weight: 700; letter-spacing: 0; text-transform: none; font-size: 18px; margin-right: auto; }
      .wrap { max-width: 860px; margin: 0 auto; padding: 40px 20px 80px; }
      .eyebrow { color: #f59e0b; text-transform: uppercase; letter-spacing: .16em; font-size: 12px; margin: 0 0 16px; }
      h1 { font-size: 42px; line-height: 1.1; margin: 0 0 16px; }
      p, li { color: rgba(255,255,255,.85); }
      ul { padding-left: 22px; }
      li { margin: 10px 0; }
      .meta { color: rgba(255,255,255,.55); }
      .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
      a.btn { display: inline-flex; align-items: center; justify-content: center; padding: 12px 18px; border-radius: 12px; background: #f59e0b; color: #111; text-decoration: none; font-weight: 700; }
      a.btn-secondary { background: rgba(255,255,255,.06); color: #fff; border: 1px solid rgba(255,255,255,.12); }
      @media (max-width: 640px) {
        h1 { font-size: 34px; }
        .wrap { padding-top: 28px; }
        a.btn { width: 100%; }
      }
`;

function directoryChrome(title, description, canonical, robots, body) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="${robots}" />
    ${canonical ? `<link rel="canonical" href="${canonical}" />` : ''}
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    ${canonical ? `<meta property="og:url" content="${canonical}" />` : ''}
    <meta property="og:site_name" content="GlobalTechEvents" />
    <style>${DIRECTORY_CSS}</style>
  </head>
  <body>
    <nav>
      <a class="brand" href="/">GlobalTechEvents</a>
      <a href="/">Calendar</a>
      <a href="/events">Events</a>
      <a href="/guides">Guides</a>
    </nav>
    <main class="wrap">
      ${body}
    </main>
  </body>
</html>
`;
}

function renderLinkList(items) {
  if (!items.length) {
    return '<p>No pages are listed yet. Browse the <a href="/events">events directory</a> or return to the <a href="/">calendar</a>.</p>';
  }
  return `<ul>${items
    .map((item) => {
      const note = item.note ? ` <span class="meta">${escapeHtml(item.note)}</span>` : '';
      return `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>${note}</li>`;
    })
    .join('')}</ul>`;
}

const DIRECTORY_INDEXES = [
  {
    path: '/cities',
    title: 'Cities | GlobalTechEvents',
    description: 'City pages for tech events already listed on GlobalTechEvents.',
    eyebrow: 'Cities',
    h1: 'Cities',
    intro: 'City pages that already exist on this site. Open one for the events listed there.',
    items: () =>
      INDEXABLE_SHELLS.filter((shell) => shell.kind === 'city').map((shell) => ({
        href: shell.path,
        label: shell.h1,
      })),
  },
  {
    path: '/topics',
    title: 'Topics | GlobalTechEvents',
    description: 'Topic pages for conferences already listed on GlobalTechEvents.',
    eyebrow: 'Topics',
    h1: 'Topics',
    intro: 'Topic pages that already exist on this site.',
    items: () =>
      INDEXABLE_SHELLS.filter((shell) => shell.kind === 'topic').map((shell) => ({
        href: shell.path,
        label: shell.h1,
      })),
  },
  {
    path: '/tracks',
    title: 'Tracks | GlobalTechEvents',
    description: 'Track pages for conferences already listed on GlobalTechEvents.',
    eyebrow: 'Tracks',
    h1: 'Tracks',
    intro: 'Track pages that already exist on this site.',
    items: () =>
      INDEXABLE_SHELLS.filter((shell) => shell.kind === 'track').map((shell) => ({
        href: shell.path,
        label: shell.h1,
      })),
  },
  {
    path: '/authors',
    title: 'Authors | GlobalTechEvents',
    description: 'Authors with a page on GlobalTechEvents.',
    eyebrow: 'Authors',
    h1: 'Authors',
    intro: 'People with an author page on this site.',
    items: () =>
      loadAuthors().map((author) => ({
        href: `/authors/${author.slug}`,
        label: author.name,
        note: author.headline,
      })),
  },
];

export function directoryIndexPaths() {
  return DIRECTORY_INDEXES.map((page) => page.path);
}

export function writeDirectoryIndexes() {
  for (const page of DIRECTORY_INDEXES) {
    const canonical = `${SITE_URL}${page.path}`;
    const html = directoryChrome(
      page.title,
      page.description,
      canonical,
      'index, follow',
      `<p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
      <h1>${escapeHtml(page.h1)}</h1>
      <p>${escapeHtml(page.intro)}</p>
      ${renderLinkList(page.items())}`,
    );
    const outDir = path.join(PUBLIC_DIR, page.path.replace(/^\//, ''));
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html);
  }

  const notFound = directoryChrome(
    'Page not found | GlobalTechEvents',
    'That address is not a page on GlobalTechEvents.',
    '',
    'noindex',
    `<p class="eyebrow">GlobalTechEvents</p>
      <h1>Page not found</h1>
      <p>That address is not a page on this site.</p>
      <div class="actions">
        <a class="btn" href="/">Back to the calendar</a>
        <a class="btn btn-secondary" href="/events">Events directory</a>
      </div>`,
  );
  fs.writeFileSync(path.join(PUBLIC_DIR, '404.html'), notFound);
  return DIRECTORY_INDEXES.map((page) => page.path);
}

export function writeIndexableShells(events) {
  writeDirectoryIndexes();
  for (const shell of INDEXABLE_SHELLS) {
    const relative = shell.path.replace(/^\//, '');
    const outDir = path.join(PUBLIC_DIR, relative);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), renderShell(shell, events));
  }
  return INDEXABLE_SHELLS;
}

export function indexableShellUrls() {
  return INDEXABLE_SHELLS.map((shell) => `${SITE_URL}${shell.path}`);
}

export function ensureShellsInExistingSitemap() {
  const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) return;
  let xml = fs.readFileSync(sitemapPath, 'utf8');
  const today = new Date().toISOString().slice(0, 10);
  for (const loc of [...directoryIndexPaths().map((pagePath) => `${SITE_URL}${pagePath}`), ...indexableShellUrls()]) {
    if (xml.includes(`<loc>${loc}</loc>`)) continue;
    const block = `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    xml = xml.replace('</urlset>', `${block}</urlset>`);
  }
  fs.writeFileSync(sitemapPath, xml);
}
