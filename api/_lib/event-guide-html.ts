import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  buildSeoCollectionIcs,
  buildSeoEventJsonLd,
  collectionCalendarNote,
  collectionGoogleCalendarUrl,
  isSeoCollection,
} from '../../src/data/seoEventSchema.js';
import type { SEOEventPageData } from '../../src/data/seoEventPages.js';
import { recapPathForEvent } from '../../src/content/recaps/pages.js';
import {
  calendarAction,
  eventFacts,
  eventHeadline,
  eventLede,
  formatEventDateRange,
  formatPlace,
  relatedLinks,
  secondaryLinks,
} from '../../src/seo/eventPageDisplay.js';

const SITE_URL = 'https://www.globaltechevents.xyz';
const guideCss = readFileSync(fileURLToPath(new URL('../../src/seo/eventGuide.css', import.meta.url)), 'utf8');

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function calendarLocation(page: SEOEventPageData): string {
  if (page.format === 'online') return 'Online Event';
  const place = formatPlace(page.city, page.country, page.format);
  return place.secondary ? `${place.primary}, ${place.secondary}` : place.primary;
}

function buildGoogleCalendarUrl(page: SEOEventPageData): string {
  const startDate = String(page.startDate || '').replace(/-/g, '');
  const endDate = String(page.endDate || page.startDate || '').replace(/-/g, '');
  const location = calendarLocation(page);
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

function buildIcsContent(page: SEOEventPageData): string {
  const location = calendarLocation(page);
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

function linkAttrs(external: boolean): string {
  return external ? ' target="_blank" rel="noopener noreferrer"' : '';
}

function renderPrimary(page: SEOEventPageData, googleCalendarUrl: string): string {
  const action = calendarAction(page, googleCalendarUrl);
  const external = action.provider === 'google';
  return `<div class="primary-block">
        <a class="primary" href="${escapeHtml(action.href)}"${linkAttrs(external)} data-track-event="add_to_calendar" data-track-label="${escapeHtml(action.trackLabel)}" data-track-provider="${action.provider}">${escapeHtml(action.label)}</a>
        <p class="hint">${escapeHtml(action.hint)}</p>
      </div>`;
}

function renderSecondary(page: SEOEventPageData, whatsappUrl: string): string {
  const items = secondaryLinks(page, whatsappUrl)
    .map((link) => {
      if (link.downloadIcs) {
        return `<li><button type="button" class="text-link" data-download-ics="true">Download .ics</button></li>`;
      }
      return `<li><a href="${escapeHtml(link.href)}"${linkAttrs(link.external)} data-track-event="outbound_click" data-track-label="${escapeHtml(link.trackLabel)}" data-track-target="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></li>`;
    })
    .join('');
  return `<ul class="link-row">${items}</ul>`;
}

function renderRecapLink(page: SEOEventPageData): string {
  const href = recapPathForEvent(page.slug);
  if (!href) return '';
  return `<p class="recap-link"><a href="${escapeHtml(href)}">Public notes and recap posts</a> from this meeting.</p>`;
}

function renderFacts(page: SEOEventPageData): string {
  const facts = eventFacts(page);
  const items = facts
    .map((fact) => {
      const spoken = [fact.primary, fact.secondary, fact.note].filter(Boolean).join(', ');
      return `<div class="fact">
          <dt>${escapeHtml(fact.label)}</dt>
          <dd>
            <span class="sr-only">${escapeHtml(spoken)}</span>
            <span aria-hidden="true">${fact.lines ? fact.lines.map((line) => `<span class="line">${escapeHtml(line)}</span>`).join('') : escapeHtml(fact.primary)}</span>
            ${fact.secondary ? `<span class="sub" aria-hidden="true">${escapeHtml(fact.secondary)}</span>` : ''}
            ${fact.note ? `<span class="note" aria-hidden="true">${escapeHtml(fact.note)}</span>` : ''}
          </dd>
        </div>`;
    })
    .join('');
  return `<dl class="facts facts-${facts.length}">${items}</dl>`;
}

function renderPlanningSections(page: SEOEventPageData): string {
  if (!page.planning) return '';
  return page.planning.sections
    .map((section) => {
      const paragraphs = section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');
      const links = (section.links ?? [])
        .map(
          (link) =>
            `<li><a href="${escapeHtml(link.href)}" target="_blank" rel="noopener noreferrer" data-track-event="outbound_click" data-track-label="${escapeHtml(link.label)}" data-track-target="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></li>`,
        )
        .join('');
      return `<section class="block prose">
        <h2>${escapeHtml(section.heading)}</h2>
        ${paragraphs}
        ${links ? `<ul class="link-row">${links}</ul>` : ''}
      </section>`;
    })
    .join('\n');
}

function renderStops(page: SEOEventPageData): string {
  if (!isSeoCollection(page)) return '';
  const items = (page.stops ?? [])
    .map((stop) => {
      const date = formatEventDateRange(stop.startDate, stop.endDate);
      const place = formatPlace(stop.city, stop.country, stop.format);
      const where = place.secondary ? `${place.primary}, ${place.secondary}` : place.primary;
      return `<li><a href="${escapeHtml(stop.officialUrl)}">${escapeHtml(stop.name)}</a> — ${escapeHtml(date.spoken)}. ${escapeHtml(where)}. ${escapeHtml(stop.detail)}</li>`;
    })
    .join('');
  const sources = (page.sources ?? [])
    .map(
      (source) =>
        `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.label)}</a></li>`,
    )
    .join('');
  const sourceSection = sources
    ? `<section class="block"><h2>Official pages</h2><ul class="stack stops">${sources}</ul></section>`
    : '';
  return `<section class="block"><h2>Cities</h2><ul class="stack stops">${items}</ul></section>${sourceSection}`;
}

function renderStandardSections(page: SEOEventPageData): string {
  if (page.planning) return renderPlanningSections(page);
  const people = page.whoShouldAttend.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const topics = page.topics.map((topic) => `<li class="topic">${escapeHtml(topic)}</li>`).join('');
  return `${renderStops(page)}
      <section class="block">
        <h2>Who it’s for</h2>
        <ul class="stack">${people}</ul>
      </section>
      <section class="block">
        <h2>Topics</h2>
        <ul class="topics">${topics}</ul>
      </section>`;
}

function renderTopicsForPlanning(page: SEOEventPageData): string {
  if (!page.planning || page.topics.length === 0) return '';
  const topics = page.topics.map((topic) => `<li class="topic">${escapeHtml(topic)}</li>`).join('');
  return `<section class="block">
        <h2>Topics</h2>
        <ul class="topics">${topics}</ul>
      </section>`;
}

function renderRelated(page: SEOEventPageData): string {
  const links = relatedLinks(page);
  if (links.length === 0) return '';
  const items = links
    .map((link) => {
      const note = link.note ? `<p>${escapeHtml(link.note)}</p>` : '';
      const name = link.href
        ? `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`
        : `<span class="name">${escapeHtml(link.label)}</span>`;
      return `<li>${name}${note}</li>`;
    })
    .join('');
  return `<section class="block">
        <h2>Also on this calendar</h2>
        <ul class="related-list">${items}</ul>
      </section>`;
}

function renderFaq(page: SEOEventPageData): string {
  const items = page.faq
    .map(
      (item) => `<article>
          <h3>${escapeHtml(item.q)}</h3>
          <p>${escapeHtml(item.a)}</p>
        </article>`,
    )
    .join('');
  return `<section class="block faq">
        <h2>Common questions</h2>
        ${items}
      </section>`;
}

function chromeHeader(): string {
  return `<a class="skip" href="#content">Skip to content</a>
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="/">
          <img src="/logo-v1.svg" alt="" width="28" height="28" />
          GlobalTech<em>Events</em>
        </a>
        <nav class="site-nav" aria-label="Primary">
          <a href="/">Calendar</a>
          <a href="/events">Events</a>
          <a href="/guides">Guides</a>
          <a href="/resources">Resources</a>
        </nav>
      </div>
    </header>`;
}

function chromeFooter(whatsappUrl: string): string {
  return `<footer class="site-footer">
      <div class="footer-inner">
        <div>
          <a class="footer-brand" href="/">
            <img src="/logo-v1.svg" alt="" width="26" height="26" />
            GlobalTech<em>Events</em>
          </a>
          <p>One calendar for the major tech events the industry actually tracks.</p>
        </div>
        <nav class="footer-nav" aria-label="Footer">
          <a href="/">Calendar</a>
          <a href="/events">Events</a>
          <a href="/guides">Guides</a>
          <a href="/resources">Resources</a>
          <a href="${escapeHtml(whatsappUrl)}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </nav>
        <p class="legal">© 2026 GlobalTechEvents</p>
      </div>
    </footer>`;
}

export function renderEventGuideDocument(page: SEOEventPageData, whatsappUrl: string): string {
  const canonical = `${SITE_URL}/events/${page.slug}`;
  const jsonLd = JSON.stringify(buildSeoEventJsonLd(page));
  const googleCalendarUrl = isSeoCollection(page) ? collectionGoogleCalendarUrl(page) : buildGoogleCalendarUrl(page);
  const icsContent = isSeoCollection(page) ? buildSeoCollectionIcs(page) : buildIcsContent(page);
  const confirmNote = isSeoCollection(page) ? collectionCalendarNote(page) : 'Confirm the details on the official site before you travel.';
  const headline = eventHeadline(page);
  const lede = eventLede(page);
  const calendarHeading = page.calendarHeading ?? `Add ${page.shortName} to your calendar`;
  const calendarLead = page.calendarLead ?? 'Save the dates, then confirm them on the official site.';
  const keywords = [page.primaryKeyword, ...page.secondaryKeywords, ...page.topics].join(', ');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(page.seoTitle)}</title>
    <meta name="description" content="${escapeHtml(page.metaDescription)}" />
    <meta name="keywords" content="${escapeHtml(keywords)}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(page.seoTitle)}" />
    <meta property="og:description" content="${escapeHtml(page.metaDescription)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:site_name" content="GlobalTechEvents" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(page.seoTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(page.metaDescription)}" />
    <meta name="theme-color" content="#090807" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <script type="application/ld+json">${jsonLd}</script>
    <style>${guideCss}</style>
  </head>
  <body class="event-guide-root">
    ${chromeHeader()}
    <div class="page-scroll">
    <main class="page" id="content">
      <nav class="crumb" aria-label="Breadcrumb">
        <a href="/">Calendar</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">${escapeHtml(page.eventName)}</span>
      </nav>
      <h1>${escapeHtml(headline)}</h1>
      <p class="lede">${escapeHtml(lede)}</p>
      ${renderRecapLink(page)}
      ${renderFacts(page)}
      <div class="hero-actions">
        ${renderPrimary(page, googleCalendarUrl)}
        ${renderSecondary(page, whatsappUrl)}
      </div>
      ${renderStandardSections(page)}
      ${renderTopicsForPlanning(page)}
      ${renderRelated(page)}
      ${renderFaq(page)}
      <section class="close">
        <h2>${escapeHtml(calendarHeading)}</h2>
        <p>${escapeHtml(calendarLead)}</p>
        ${renderPrimary(page, googleCalendarUrl)}
        <p class="fine">${escapeHtml(confirmNote)}</p>
      </section>
    </main>
    ${chromeFooter(whatsappUrl)}
    </div>
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

        document.querySelectorAll('[data-download-ics="true"]').forEach((downloadButton) => {
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
        });
      })();
    </script>
  </body>
</html>`;
}
