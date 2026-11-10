import fs from 'node:fs';
import path from 'node:path';
import { renderEventGuideDocument } from '../api/_lib/event-guide-html.ts';
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

function readWhatsAppUrl() {
  const raw = fs.readFileSync(path.resolve('src/config/constants.ts'), 'utf8');
  const match = raw.match(/WHATSAPP_GROUP_URL = '([^']+)'/);
  if (!match) throw new Error('WHATSAPP_GROUP_URL missing from src/config/constants.ts');
  return match[1];
}

function renderPage(page, whatsappUrl) {
  return renderEventGuideDocument(page, whatsappUrl);
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

function writeOneEventPage(slug) {
  const manualPages = loadManualPages();
  const manual = manualPages.find((page) => page.slug === slug);
  if (!manual) throw new Error(`No manual page for ${slug}`);
  const pages = JSON.parse(fs.readFileSync(GENERATED_SOURCE, 'utf8'));
  const index = pages.findIndex((page) => page.slug === slug);
  if (index < 0) throw new Error(`Slug ${slug} is not in ${GENERATED_SOURCE}`);
  pages[index] = manual;
  fs.writeFileSync(GENERATED_SOURCE, `${JSON.stringify(pages, null, 2)}\n`);
  const outDir = path.join(EVENTS_DIR, slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), renderPage(manual, readWhatsAppUrl()));
  console.log(`Updated /events/${slug} from the manual page`);
}

const onlySlugFlag = process.argv.indexOf('--slug');
if (onlySlugFlag !== -1) {
  const slug = process.argv[onlySlugFlag + 1];
  if (!slug || slug.startsWith('--')) {
    console.error('Usage: node scripts/generate-seo-static-pages.mjs --slug <event-slug>');
    process.exit(1);
  }
  try {
    writeOneEventPage(slug);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
} else if (process.argv.includes('--hubs-only')) {
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
} else if (process.argv.includes('--rerender')) {
  try {
    const manualPages = loadManualPages();
    const manualBySlug = new Map(manualPages.map((page) => [page.slug, page]));
    const pages = JSON.parse(fs.readFileSync(GENERATED_SOURCE, 'utf8'));
    const merged = pages.map((page) => manualBySlug.get(page.slug) ?? page);
    const known = new Set(merged.map((page) => page.slug));
    for (const page of manualPages) {
      if (!known.has(page.slug)) merged.push(page);
    }
    fs.writeFileSync(GENERATED_SOURCE, `${JSON.stringify(merged, null, 2)}\n`);
    const whatsappUrl = readWhatsAppUrl();
    for (const page of merged) {
      const outDir = path.join(EVENTS_DIR, page.slug);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, 'index.html'), renderPage(page, whatsappUrl));
    }
    console.log(`Rerendered ${merged.length} event pages from the saved catalog`);
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
