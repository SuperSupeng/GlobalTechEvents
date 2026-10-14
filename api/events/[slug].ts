import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSEOEventPageBySlug } from '../../src/data/seoEventPages.js';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });

  return `${fmt(s)} - ${fmt(e)}`;
}

function renderEventHtml(slug: string) {
  const page = getSEOEventPageBySlug(slug);
  if (!page) return null;

  const canonicalUrl = `https://www.globaltechevents.xyz/events/${page.slug}`;
  const title = escapeHtml(page.seoTitle);
  const description = escapeHtml(page.metaDescription);
  const keywords = escapeHtml(
    [page.primaryKeyword, ...page.secondaryKeywords, ...page.topics].join(', '),
  );
  const whyItMatters = escapeHtml(page.whyItMatters);
  const dateRange = escapeHtml(formatDateRange(page.startDate, page.endDate));
  const location = escapeHtml(`${page.city}, ${page.country}`);
  const format = escapeHtml(page.format);
  const officialUrl = escapeHtml(page.officialUrl);
  const registrationUrl = page.registrationUrl ? escapeHtml(page.registrationUrl) : null;

  const schema = escapeHtml(
    JSON.stringify({
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
          ? {
              '@type': 'VirtualLocation',
              url: page.officialUrl,
            }
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
      url: canonicalUrl,
      description: page.metaDescription,
      keywords: [page.primaryKeyword, ...page.secondaryKeywords].join(', '),
    }),
  );

  const topicTags = page.topics
    .map(
      (topic) =>
        `<span class="tag">${escapeHtml(topic)}</span>`,
    )
    .join('');

  const attendees = page.whoShouldAttend
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');

  const faqItems = page.faq
    .map(
      (item) => `
        <div class="card faq-item">
          <h3>${escapeHtml(item.q)}</h3>
          <p>${escapeHtml(item.a)}</p>
        </div>
      `,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${keywords}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <link rel="canonical" href="${canonicalUrl}" />

    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:site_name" content="GlobalTechEvents" />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />

    <script type="application/ld+json">${schema}</script>

    <style>
      :root {
        color-scheme: dark;
        --bg: #050505;
        --panel: rgba(255,255,255,0.04);
        --border: rgba(255,255,255,0.1);
        --text: rgba(255,255,255,0.92);
        --muted: rgba(255,255,255,0.72);
        --subtle: rgba(255,255,255,0.5);
        --accent: #f59e0b;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: radial-gradient(circle at top, rgba(245,158,11,0.16), transparent 28%), var(--bg);
        color: var(--text);
        line-height: 1.6;
      }
      a { color: inherit; }
      .container {
        max-width: 960px;
        margin: 0 auto;
        padding: 32px 20px 80px;
      }
      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 32px;
      }
      .brand {
        font-weight: 700;
        letter-spacing: 0.02em;
      }
      .back {
        color: var(--muted);
        text-decoration: none;
      }
      .eyebrow {
        color: var(--accent);
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 12px;
        margin-bottom: 12px;
      }
      h1 {
        font-family: Georgia, "Times New Roman", serif;
        font-style: italic;
        font-size: clamp(2.2rem, 5vw, 4rem);
        line-height: 1.08;
        margin: 0 0 16px;
      }
      h2 {
        font-family: Georgia, "Times New Roman", serif;
        font-style: italic;
        font-size: 1.8rem;
        margin: 0 0 16px;
      }
      p.lead {
        color: var(--muted);
        font-size: 1.125rem;
        margin: 0 0 28px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
        margin: 28px 0 40px;
      }
      .card {
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 18px;
        padding: 20px;
        backdrop-filter: blur(10px);
      }
      .label {
        color: var(--subtle);
        text-transform: uppercase;
        letter-spacing: 0.16em;
        font-size: 12px;
        margin-bottom: 10px;
      }
      section { margin: 0 0 36px; }
      ul { padding-left: 20px; color: var(--muted); }
      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .tag {
        display: inline-flex;
        align-items: center;
        padding: 8px 12px;
        border-radius: 999px;
        border: 1px solid var(--border);
        background: rgba(255,255,255,0.03);
        color: var(--muted);
        font-size: 14px;
      }
      .faq-item h3 {
        margin: 0 0 10px;
        font-size: 1.05rem;
      }
      .faq-item p { margin: 0; color: var(--muted); }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 18px;
      }
      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 12px 18px;
        border-radius: 999px;
        text-decoration: none;
        font-weight: 600;
      }
      .button-primary {
        background: var(--accent);
        color: #111;
      }
      .button-secondary {
        border: 1px solid var(--border);
        color: var(--text);
      }
      .footer-note {
        font-size: 12px;
        color: var(--subtle);
        margin-top: 12px;
      }
      @media (max-width: 640px) {
        .container { padding-top: 24px; }
        .topbar { align-items: flex-start; flex-direction: column; }
      }
    </style>
  </head>
  <body>
    <main class="container">
      <div class="topbar">
        <a class="back" href="/">← Back to GlobalTechEvents</a>
        <div class="brand">GlobalTechEvents</div>
      </div>

      <p class="eyebrow">Tech Event Guide</p>
      <h1>${escapeHtml(page.eventName)}: Dates, Location & Event Guide</h1>
      <p class="lead">${whyItMatters}</p>

      <section class="grid">
        <div class="card">
          <div class="label">Date</div>
          <div>${dateRange}</div>
        </div>
        <div class="card">
          <div class="label">Location</div>
          <div>${location}</div>
        </div>
        <div class="card">
          <div class="label">Format</div>
          <div>${format}</div>
        </div>
      </section>

      <section>
        <h2>Who should attend</h2>
        <ul>${attendees}</ul>
      </section>

      <section>
        <h2>Topics to watch</h2>
        <div class="tags">${topicTags}</div>
      </section>

      <section>
        <h2>FAQ</h2>
        ${faqItems}
      </section>

      <section class="card">
        <h2>Official links</h2>
        <p>${description}</p>
        <div class="actions">
          <a class="button button-primary" href="${officialUrl}" target="_blank" rel="noreferrer">Official Website</a>
          ${registrationUrl ? `<a class="button button-secondary" href="${registrationUrl}" target="_blank" rel="noreferrer">Registration</a>` : ''}
        </div>
        <div class="footer-note">Last updated: ${escapeHtml(new Date().toLocaleDateString('en-US', { timeZone: 'UTC' }))}</div>
      </section>
    </main>
  </body>
</html>`;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const slug = req.query.slug;
  const normalizedSlug = Array.isArray(slug) ? slug[0] : slug;

  if (!normalizedSlug) {
    return res.status(400).send('Missing event slug');
  }

  const html = renderEventHtml(normalizedSlug);
  if (!html) {
    return res.status(404).send('Event page not found');
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).send(html);
}
