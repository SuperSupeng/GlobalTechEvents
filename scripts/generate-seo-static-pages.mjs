import fs from 'node:fs';
import path from 'node:path';
import {
  buildSeoCollectionIcs,
  buildSeoEventJsonLd,
  collectionCalendarNote,
  collectionDateLabel,
  collectionGoogleCalendarUrl,
  collectionLocationLabel,
  formatStopDate,
  isSeoCollection,
} from '../src/data/seoEventSchema.ts';
import { ensureGuidesInExistingSitemap, indexableAuthorUrls, indexableGuideUrls, writeGuideStaticPages } from './generate-guide-static.mjs';
import { writeHubStaticPages } from './generate-hub-static.mjs';
import { ensureShellsInExistingSitemap, indexableShellUrls, writeIndexableShells } from './generate-indexable-shells.mjs';

const SOURCE = path.resolve('src/data/seoEventPages.ts');
const GENERATED_SOURCE = path.resolve('src/data/generatedSEOEventPages.json');
const PUBLIC_DIR = path.resolve('public');
const EVENTS_DIR = path.join(PUBLIC_DIR, 'events');
const SITE_URL = 'https://www.globaltechevents.xyz';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://qtxtekomhkybxkvgyscf.supabase.co';
const SUPABASE_PUBLISHABLE_KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_A9r7qjV8gKfMrdcX7YadpA_oy_JoZwn';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function loadManualPages() {
  const raw = fs.readFileSync(SOURCE, 'utf8');
  const match = raw.match(/export const SEO_EVENT_PAGES:[\s\S]*?=\s*(\[[\s\S]*?\n\]);/);
  if (!match) throw new Error('Failed to locate SEO_EVENT_PAGES array');
  const arrayLiteral = match[1];
  const factory = new Function(`return ${arrayLiteral};`);
  return factory();
}

function normalizeTitle(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildUniqueSlug(baseSlug, usedSlugs, fallbackId) {
  let slug = baseSlug || `event-${fallbackId}`;
  if (!usedSlugs.has(slug)) {
    usedSlugs.add(slug);
    return slug;
  }

  let counter = 2;
  while (usedSlugs.has(`${slug}-${counter}`)) {
    counter += 1;
  }

  const unique = `${slug}-${counter}`;
  usedSlugs.add(unique);
  return unique;
}

function truncate(value, maxLength = 155) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
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

function buildGoogleCalendarUrl(page) {
  const startDate = String(page.startDate || '').replace(/-/g, '');
  const endDate = String(page.endDate || page.startDate || '').replace(/-/g, '');
  const location = page.format === 'online' ? 'Online Event' : `${page.city}, ${page.country}`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: page.eventName,
    dates: `${startDate}T090000Z/${endDate}T180000Z`,
    details: `${page.whyItMatters}\n\nOrganizer: ${page.shortName}\n\nMore info: ${page.officialUrl}`,
    location,
    sprop: 'website:globaltechevents.com',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildIcsContent(page) {
  const location = page.format === 'online' ? 'Online Event' : `${page.city}, ${page.country}`;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GlobalTechEvents//SEO Event Page//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${page.slug}@globaltechevents.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
    `DTSTART:${String(page.startDate).replace(/-/g, '')}T090000Z`,
    `DTEND:${String(page.endDate).replace(/-/g, '')}T180000Z`,
    `SUMMARY:${page.eventName}`,
    `DESCRIPTION:${page.whyItMatters.replace(/\n/g, '\\n')}\\n\\nOrganizer: ${page.shortName}\\n\\nMore info: ${page.officialUrl}`,
    `LOCATION:${location}`,
    `URL:${page.officialUrl}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

function readWhatsAppUrl() {
  const raw = fs.readFileSync(path.resolve('src/config/constants.ts'), 'utf8');
  const match = raw.match(/WHATSAPP_GROUP_URL = '([^']+)'/);
  if (!match) throw new Error('WHATSAPP_GROUP_URL missing from src/config/constants.ts');
  return match[1];
}

function renderStops(page) {
  if (!isSeoCollection(page)) return '';
  const items = page.stops
    .map(
      (stop) => `
        <li>
          <a href="${escapeHtml(stop.officialUrl)}">${escapeHtml(stop.name)}</a>.
          ${escapeHtml(formatStopDate(stop))}.
          ${escapeHtml(stop.city)}, ${escapeHtml(stop.country)}.
          ${escapeHtml(stop.detail)}
        </li>`,
    )
    .join('');
  const sources = (page.sources || [])
    .map(
      (source) => `
        <li><a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a></li>`,
    )
    .join('');
  const sourceSection = sources
    ? `<section><h2>Official pages</h2><ul>${sources}</ul></section>`
    : '';
  return `<section><h2>Printed stops</h2><ul>${items}</ul></section>${sourceSection}`;
}

function renderPage(page, whatsappUrl) {
  const collection = isSeoCollection(page);
  const canonical = `${SITE_URL}/events/${page.slug}`;
  const jsonLd = JSON.stringify(buildSeoEventJsonLd(page));
  const googleCalendarUrl = collection ? collectionGoogleCalendarUrl(page) : buildGoogleCalendarUrl(page);
  const icsContent = collection ? buildSeoCollectionIcs(page) : buildIcsContent(page);
  const dateLabel = collection ? collectionDateLabel(page) : formatDateRange(page.startDate, page.endDate);
  const locationLabel = collection ? collectionLocationLabel(page) : `${page.city}, ${page.country}`;
  const confirmNote = collection ? collectionCalendarNote(page) : 'Always confirm details on the official site.';
  const registrationButton = page.registrationUrl
    ? `<a class="btn btn-secondary" href="${escapeHtml(page.registrationUrl)}" target="_blank" rel="noreferrer" data-track-event="outbound_click" data-track-label="Registration" data-track-target="${escapeHtml(page.registrationUrl)}">Registration</a>`
    : '';
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
      .btn-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 22px; }
      a.btn, button.btn { display: inline-flex; align-items: center; justify-content: center; padding: 12px 18px; border-radius: 12px; background: #f59e0b; color: #111; text-decoration: none; font-weight: 700; border: 0; cursor: pointer; font-size: 15px; }
      .btn-secondary { background: rgba(255,255,255,.06); color: #fff; border: 1px solid rgba(255,255,255,.12); }
      .btn-tertiary { background: transparent; color: #fff; border: 1px dashed rgba(255,255,255,.18); }
      .muted { color: rgba(255,255,255,.55); font-size: 13px; }
      .faq-item + .faq-item { margin-top: 14px; }
      .cta-card { background: linear-gradient(135deg, rgba(245,158,11,.12), rgba(255,255,255,.04)); border-color: rgba(245,158,11,.22); }
      .cta-kicker { color: #f59e0b; text-transform: uppercase; letter-spacing: .16em; font-size: 12px; margin: 0 0 10px; }
      .cta-note-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); gap: 12px; margin-top: 16px; }
      .cta-note { padding: 14px; border-radius: 14px; background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); color: rgba(255,255,255,.75); font-size: 14px; }
      @media (max-width: 640px) {
        h1 { font-size: 34px; }
        .wrap { padding-top: 28px; }
        .btn-row { flex-direction: column; }
        a.btn, button.btn { width: 100%; }
      }
    </style>
  </head>
  <body>
    <main class="wrap">
      <p class="eyebrow">Tech Event Guide</p>
      <h1>${escapeHtml(page.eventName)}: Dates, Location & Event Guide</h1>
      <p>${escapeHtml(page.whyItMatters)}</p>

      <section class="card cta-card">
        <h2 style="margin-top:0;">Save this event before you forget it</h2>
        <p>Put ${escapeHtml(page.shortName)} on your calendar first, then choose whether to register now or review the official event site.</p>
        <div class="btn-row">
          <a class="btn" href="${escapeHtml(googleCalendarUrl)}" target="_blank" rel="noreferrer" data-track-event="add_to_calendar" data-track-label="Add to Calendar" data-track-provider="google">Add to Calendar</a>
          ${registrationButton}
          <a class="btn btn-secondary" href="${escapeHtml(page.officialUrl)}" target="_blank" rel="noreferrer" data-track-event="outbound_click" data-track-label="Official Website" data-track-target="${escapeHtml(page.officialUrl)}">Official Website</a>
          <button class="btn btn-tertiary" type="button" data-download-ics="true">Download .ics</button>
          <a class="btn btn-secondary" href="${escapeHtml(whatsappUrl)}" target="_blank" rel="noopener noreferrer" data-track-event="outbound_click" data-track-label="Join WhatsApp" data-track-target="${escapeHtml(whatsappUrl)}">Join WhatsApp</a>
        </div>
        <p class="muted">${escapeHtml(confirmNote)}</p>
      </section>

      <section class="grid">
        <div class="card">
          <div class="meta-label">Date</div>
          <div>${escapeHtml(dateLabel)}</div>
        </div>
        <div class="card">
          <div class="meta-label">Location</div>
          <div>${escapeHtml(locationLabel)}</div>
        </div>
        <div class="card">
          <div class="meta-label">Format</div>
          <div>${escapeHtml(page.format)}</div>
        </div>
      </section>

      ${renderStops(page)}
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
        <h2>Ready?</h2>
        <p>Add it to your calendar, then register on the official site.</p>
      </section>
    </main>
    <script>
      (() => {
        const payloadBase = ${JSON.stringify({ page_type: 'seo_event_page', event_slug: page.slug, source_page: `/events/${page.slug}` })};
        const icsContent = ${JSON.stringify(icsContent)};
        const fileName = ${JSON.stringify(`${page.slug}.ics`)};

        const sendTrack = async (eventName, payload) => {
          try {
            const body = JSON.stringify({ eventName, payload: { ...payloadBase, ...payload } });
            if (navigator.sendBeacon) {
              const blob = new Blob([body], { type: 'application/json' });
              navigator.sendBeacon('/api/track-cta', blob);
              return;
            }
            await fetch('/api/track-cta', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body,
              keepalive: true,
            });
          } catch (error) {
            console.warn('Failed to track CTA event', error);
          }
        };

        document.querySelectorAll('[data-track-event]').forEach((element) => {
          element.addEventListener('click', () => {
            const target = element.getAttribute('data-track-target');
            const provider = element.getAttribute('data-track-provider');
            sendTrack(element.getAttribute('data-track-event'), {
              cta_label: element.getAttribute('data-track-label') || '',
              target_url: target || '',
              calendar_provider: provider || '',
            });
          });
        });

        const downloadButton = document.querySelector('[data-download-ics="true"]');
        if (downloadButton) {
          downloadButton.addEventListener('click', async () => {
            await sendTrack('add_to_calendar', {
              cta_label: 'Download .ics',
              calendar_provider: 'ics',
            });
            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(link.href), 0);
          });
        }
      })();
    </script>
  </body>
</html>`;
}

function generateSitemap(pages, guides = []) {
  const staticUrls = ['/', '/privacy', '/terms', '/resources', '/events', '/guides', '/for-agents'];
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    ...staticUrls.map((p) => `${SITE_URL}${p}`),
    ...pages.map((page) => `${SITE_URL}/events/${page.slug}`),
    ...indexableGuideUrls(guides),
    ...indexableAuthorUrls(),
    ...indexableShellUrls(),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((url, idx) => {
    const isHome = idx === 0;
    const isEventPage = url.includes('/events/');
    const isEventsHub = url.endsWith('/events');
    const isGuidePage = url.includes('/guides/');
    const isGuidesHub = url.endsWith('/guides');
    const isAuthorPage = url.includes('/authors/');
    const isIndexableShell = url.includes('/cities/') || url.includes('/tracks/') || url.includes('/topics/');
    const changefreq = isHome ? 'daily' : isEventPage || isGuidePage || isGuidesHub || isAuthorPage || isIndexableShell ? 'weekly' : 'monthly';
    const priority = isHome
      ? '1.0'
      : isEventPage || isGuidePage
        ? '0.8'
        : isAuthorPage
          ? '0.6'
        : isEventsHub
          ? '0.9'
          : isGuidesHub || isIndexableShell
            ? '0.7'
            : '0.3';
    return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join('\n')}
</urlset>`;
}

async function fetchEvents() {
  const params = new URLSearchParams({
    select: 'id,title,summary,start_time,end_time,format,location,links,tags,organizer,status',
    status: 'in.(upcoming,live)',
    order: 'start_time.asc',
  });

  const response = await fetch(`${SUPABASE_URL}/rest/v1/events?${params.toString()}`, {
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      Range: '0-999',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch events from Supabase: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function buildGenericPage(event, usedSlugs) {
  const startDate = String(event.start_time || '').slice(0, 10);
  const endDate = String(event.end_time || event.start_time || '').slice(0, 10);
  const slug = buildUniqueSlug(slugify(event.title), usedSlugs, event.id.slice(0, 8));
  const location = event.location || {};
  const city = event.format === 'online' ? 'Online' : location.city || 'TBA';
  const country = event.format === 'online' ? 'Global' : location.country || 'TBA';
  const officialUrl = event.links?.officialSite || event.links?.source || `${SITE_URL}/events/${slug}`;
  const tags = Array.isArray(event.tags) && event.tags.length ? event.tags : ['Technology'];
  const summary = truncate(event.summary || `${event.title} is listed on GlobalTechEvents for teams tracking important tech conferences and industry gatherings.`);
  const shortName = String(event.title || '').replace(/\s+20\d{2}\b/g, '').trim() || event.title;

  return {
    slug,
    eventName: event.title,
    shortName,
    startDate,
    endDate,
    city,
    country,
    format: event.format || 'offline',
    officialUrl,
    registrationUrl: event.links?.registration,
    primaryKeyword: `${event.title} dates`,
    secondaryKeywords: [`${event.title} location`, `${event.title} registration`, `${event.title} agenda`],
    seoTitle: `${event.title} Dates, Location & Event Guide | GlobalTechEvents`,
    metaDescription: truncate(`${event.title} dates, location, format, and registration info. ${summary}`),
    whyItMatters: summary,
    whoShouldAttend: [
      `Teams tracking ${tags.slice(0, 2).join(' and ')} trends`,
      event.format === 'online'
        ? 'Remote attendees looking for accessible global tech events'
        : `Professionals attending in or around ${city}`,
      'Founders, operators, and investors scanning the market',
    ],
    topics: tags.slice(0, 5),
    faq: [
      {
        q: `When is ${event.title}?`,
        a: `${event.title} is scheduled for ${formatDateRange(event.start_time, event.end_time || event.start_time)}.`,
      },
      {
        q: `Where is ${event.title} held?`,
        a:
          event.format === 'online'
            ? `${event.title} is listed as an online event.`
            : `${event.title} is listed in ${city}, ${country}.`,
      },
      {
        q: `Where can I find ${event.title} registration details?`,
        a: `Use the official event website for the latest registration, agenda, and ticket updates.`,
      },
    ],
  };
}

function mergePages(manualPages, events) {
  const manualByTitle = new Map(manualPages.map((page) => [normalizeTitle(page.eventName), page]));
  const usedSlugs = new Set();
  const consumedManualSlugs = new Set();

  const fromEvents = events.map((event) => {
    const manual = manualByTitle.get(normalizeTitle(event.title));
    if (manual) {
      usedSlugs.add(manual.slug);
      consumedManualSlugs.add(manual.slug);
      return manual;
    }
    return buildGenericPage(event, usedSlugs);
  });

  const unmatchedManualPages = [];
  for (const page of manualPages) {
    if (consumedManualSlugs.has(page.slug) || usedSlugs.has(page.slug)) continue;
    usedSlugs.add(page.slug);
    unmatchedManualPages.push(page);
  }

  return [...fromEvents, ...unmatchedManualPages];
}

function writeGeneratedSource(allPages) {
  fs.writeFileSync(GENERATED_SOURCE, `${JSON.stringify(allPages, null, 2)}\n`);
}

async function main() {
  const manualPages = loadManualPages();
  const whatsappUrl = readWhatsAppUrl();
  const events = await fetchEvents();
  const allPages = mergePages(manualPages, events).filter(
    (page) => !/neurips|icml|cvpr/i.test(`${page.slug} ${page.eventName}`),
  );

  fs.rmSync(EVENTS_DIR, { recursive: true, force: true });
  fs.mkdirSync(EVENTS_DIR, { recursive: true });

  for (const page of allPages) {
    const outDir = path.join(EVENTS_DIR, page.slug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), renderPage(page, whatsappUrl));
  }

  const guides = writeGuideStaticPages();
  const shells = writeIndexableShells(allPages);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), generateSitemap(allPages, guides));
  writeGeneratedSource(allPages);
  writeHubStaticPages();
  console.log(`Generated ${allPages.length} crawlable SEO pages and sitemap entries into public/events/*`);
  console.log(`Generated ${guides.length} guide shell pages into public/guides/*`);
  console.log(`Generated ${shells.length} indexable city, track, and topic shells`);
}

if (process.argv.includes('--hubs-only')) {
  try {
    writeHubStaticPages();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
} else if (process.argv.includes('--guides-only')) {
  try {
    const guides = writeGuideStaticPages();
    ensureGuidesInExistingSitemap(guides);
    writeHubStaticPages();
    console.log(`Generated ${guides.length} guide shell pages into public/guides/*`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
} else if (process.argv.includes('--shells-only')) {
  const pages = JSON.parse(fs.readFileSync(GENERATED_SOURCE, 'utf8'));
  const shells = writeIndexableShells(pages);
  ensureShellsInExistingSitemap();
  console.log(`Generated ${shells.length} indexable city, track, and topic shells`);
} else {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
