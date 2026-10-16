import fs from 'node:fs';
import path from 'node:path';
import { INDEXABLE_SHELLS, relatedEventsForShell } from '../src/content/shells/registry.ts';
import { GUIDE_SITE_ORIGIN as SITE_URL } from '../src/content/guides/site.ts';

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
  const ctas = `<div class="btn-row">
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
      <p>${escapeHtml(shell.intro)}</p>
      ${ctas}
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

export function writeIndexableShells(events) {
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
  for (const loc of indexableShellUrls()) {
    if (xml.includes(`<loc>${loc}</loc>`)) continue;
    const block = `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    xml = xml.replace('</urlset>', `${block}</urlset>`);
  }
  fs.writeFileSync(sitemapPath, xml);
}
