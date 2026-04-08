import fs from 'node:fs';
import path from 'node:path';

const SOURCE = path.resolve('src/data/seoEventPages.ts');
const PUBLIC_DIR = path.resolve('public');
const EVENTS_DIR = path.join(PUBLIC_DIR, 'events');
const SITE_URL = 'https://www.globaltechevents.xyz';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function loadPages() {
  const raw = fs.readFileSync(SOURCE, 'utf8');
  const match = raw.match(/export const SEO_EVENT_PAGES:[\s\S]*?=\s*(\[[\s\S]*?\n\]);/);
  if (!match) throw new Error('Failed to locate SEO_EVENT_PAGES array');
  const arrayLiteral = match[1];
  const factory = new Function(`return ${arrayLiteral};`);
  return factory();
}

function formatDateRange(start, end) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
  return `${fmt.format(new Date(start))} - ${fmt.format(new Date(end))}`;
}

function buildJsonLd(page) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: page.eventName,
    startDate: `${page.startDate}T09:00:00Z`,
    endDate: `${page.endDate}T18:00:00Z`,
    eventAttendanceMode:
      page.format === 'online'
        ? 'https://schema.org/OnlineEventAttendanceMode'
        : page.format === 'hybrid'
          ? 'https://schema.org/MixedEventAttendanceMode'
          : 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location:
      page.format === 'online'
        ? { '@type': 'VirtualLocation', url: page.officialUrl }
        : {
            '@type': 'Place',
            name: `${page.city}, ${page.country}`,
            address: {
              '@type': 'PostalAddress',
              addressLocality: page.city,
              addressCountry: page.country,
            },
          },
    organizer: {
      '@type': 'Organization',
      name: page.shortName,
      url: page.officialUrl,
    },
    url: `${SITE_URL}/events/${page.slug}`,
    description: page.metaDescription,
    keywords: [page.primaryKeyword, ...page.secondaryKeywords].join(', '),
  };
}

function renderPage(page) {
  const canonical = `${SITE_URL}/events/${page.slug}`;
  const jsonLd = JSON.stringify(buildJsonLd(page));
  const faqHtml = page.faq
    .map(
      (item) => `
        <article class="card faq-item">
          <h3>${escapeHtml(item.q)}</h3>
          <p>${escapeHtml(item.a)}</p>
        </article>`,
    )
    .join('');

  const whoHtml = page.whoShouldAttend
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');

  const topicsHtml = page.topics
    .map((item) => `<span class="topic">${escapeHtml(item)}</span>`)
    .join('');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(page.seoTitle)}</title>
    <meta name="description" content="${escapeHtml(page.metaDescription)}" />
    <meta name="keywords" content="${escapeHtml([page.primaryKeyword, ...page.secondaryKeywords, ...page.topics].join(', '))}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(page.seoTitle)}" />
    <meta property="og:description" content="${escapeHtml(page.metaDescription)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:site_name" content="GlobalTechEvents" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(page.seoTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(page.metaDescription)}" />
    <script type="application/ld+json">${jsonLd}</script>
    <style>
      :root { color-scheme: dark; }
      body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #050505; color: #f5f5f5; line-height: 1.7; }
      .wrap { max-width: 860px; margin: 0 auto; padding: 40px 20px 80px; }
      .eyebrow { color: #f59e0b; text-transform: uppercase; letter-spacing: .16em; font-size: 12px; margin-bottom: 16px; }
      h1 { font-size: 42px; line-height: 1.1; margin: 0 0 20px; }
      h2 { font-size: 26px; margin: 40px 0 16px; }
      h3 { font-size: 18px; margin: 0 0 10px; }
      p, li { color: rgba(255,255,255,.85); }
      .grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap: 16px; }
      .card { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1); border-radius: 16px; padding: 18px; }
      .meta-label { color: rgba(255,255,255,.55); font-size: 12px; text-transform: uppercase; letter-spacing: .14em; margin-bottom: 8px; }
      ul { padding-left: 22px; }
      .topics { display: flex; flex-wrap: wrap; gap: 10px; }
      .topic { display: inline-block; padding: 6px 12px; border-radius: 999px; border: 1px solid rgba(255,255,255,.14); background: rgba(255,255,255,.05); font-size: 14px; }
      a.btn { display: inline-block; padding: 12px 18px; border-radius: 12px; background: #f59e0b; color: #111; text-decoration: none; font-weight: 700; }
      .muted { color: rgba(255,255,255,.55); font-size: 13px; }
      .faq-item + .faq-item { margin-top: 14px; }
    </style>
  </head>
  <body>
    <main class="wrap">
      <p class="eyebrow">Tech Event Guide</p>
      <h1>${escapeHtml(page.eventName)}: Dates, Location & Event Guide</h1>
      <p>${escapeHtml(page.whyItMatters)}</p>

      <section class="grid">
        <div class="card">
          <div class="meta-label">Date</div>
          <div>${escapeHtml(formatDateRange(page.startDate, page.endDate))}</div>
        </div>
        <div class="card">
          <div class="meta-label">Location</div>
          <div>${escapeHtml(page.city)}, ${escapeHtml(page.country)}</div>
        </div>
        <div class="card">
          <div class="meta-label">Format</div>
          <div>${escapeHtml(page.format)}</div>
        </div>
      </section>

      <section>
        <h2>Who should attend</h2>
        <ul>${whoHtml}</ul>
      </section>

      <section>
        <h2>Topics to watch</h2>
        <div class="topics">${topicsHtml}</div>
      </section>

      <section>
        <h2>Why this event matters</h2>
        <p>${escapeHtml(page.metaDescription)}</p>
        <p>${escapeHtml(page.whyItMatters)}</p>
      </section>

      <section>
        <h2>FAQ</h2>
        ${faqHtml}
      </section>

      <section class="card">
        <h2>Official links</h2>
        <p><a class="btn" href="${escapeHtml(page.officialUrl)}" target="_blank" rel="noreferrer">Official Website</a></p>
        <p class="muted">Canonical URL: ${canonical}</p>
      </section>
    </main>
  </body>
</html>`;
}

function generateSitemap(pages) {
  const staticUrls = ['/', '/privacy', '/terms', '/resources'];
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    ...staticUrls.map((p) => `${SITE_URL}${p}`),
    ...pages.map((page) => `${SITE_URL}/events/${page.slug}`),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url, idx) => `  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${idx === 0 ? 'daily' : 'weekly'}</changefreq>\n    <priority>${idx === 0 ? '1.0' : url.includes('/events/') ? '0.8' : '0.3'}</priority>\n  </url>`,
  )
  .join('\n')}
</urlset>`;
}

const pages = loadPages();
fs.rmSync(EVENTS_DIR, { recursive: true, force: true });
fs.mkdirSync(EVENTS_DIR, { recursive: true });

for (const page of pages) {
  const outDir = path.join(EVENTS_DIR, page.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), renderPage(page));
}

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), generateSitemap(pages));
console.log(`Generated ${pages.length} crawlable SEO pages into public/events/*`);
