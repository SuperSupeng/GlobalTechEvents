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

function renderShell(shell, events) {
  const canonical = `${SITE_URL}${shell.path}`;
  const related = relatedEventsForShell(shell, events);
  const guideLink = (shell.links || [])
    .map((link) => `<p><a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></p>`)
    .join('');
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
      @media (max-width: 640px) {
        h1 { font-size: 34px; }
        .wrap { padding-top: 28px; }
      }
    </style>
  </head>
  <body>
    <main class="wrap">
      <p class="eyebrow">${shell.kind === 'city' ? 'City' : 'Track'}</p>
      <h1>${escapeHtml(shell.h1)}</h1>
      <p>${escapeHtml(shell.intro)}</p>
      ${guideLink}
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
