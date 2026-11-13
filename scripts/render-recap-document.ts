import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { WHATSAPP_GROUP_URL } from '../src/config/constants.ts';
import type { RecapPage } from '../src/content/recaps/pages.ts';

const SITE_ORIGIN = 'https://www.globaltechevents.xyz';
const guideCss = readFileSync(fileURLToPath(new URL('../src/seo/eventGuide.css', import.meta.url)), 'utf8');

const RECAP_CSS = `
.event-guide-root .page {
  width: min(42rem, calc(100% - 2.5rem));
}
.event-guide-root .as-of {
  margin: 0.9rem 0 0;
  color: rgba(244, 241, 236, 0.5);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.event-guide-root .callout {
  margin: 1.35rem 0 0;
  padding: 0.95rem 1.05rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.03);
  color: rgba(244, 241, 236, 0.86);
  font-size: 0.98rem;
  line-height: 1.55;
}
.event-guide-root .intro {
  margin-top: 1.75rem;
}
.event-guide-root .start-list,
.event-guide-root .link-list,
.event-guide-root .bullets,
.event-guide-root .sources {
  max-width: 40rem;
}
.event-guide-root .start-list,
.event-guide-root .link-list {
  list-style: none;
  margin: 0.4rem 0 0;
  padding: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.event-guide-root .start-list li,
.event-guide-root .link-list li {
  padding: 0.85rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(244, 241, 236, 0.84);
  line-height: 1.5;
}
.event-guide-root .start-list a,
.event-guide-root .link-list a {
  color: #fff;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 0.16em;
}
.event-guide-root .link-list a {
  text-decoration: none;
}
.event-guide-root .link-list a:hover,
.event-guide-root .start-list a:hover {
  text-decoration: underline;
}
.event-guide-root .bullets {
  margin: 0.35rem 0 1.1rem;
  padding: 0 0 0 1.15rem;
}
.event-guide-root .bullets li {
  margin: 0.65rem 0;
  color: rgba(244, 241, 236, 0.84);
  line-height: 1.6;
}
.event-guide-root .bullets li::marker {
  color: rgba(255, 255, 255, 0.45);
}
.event-guide-root .entry {
  margin-top: 2.35rem;
  max-width: 40rem;
}
.event-guide-root .entry h3 {
  margin: 0;
  font-family: "Instrument Serif", Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: clamp(1.45rem, 2.5vw, 1.9rem);
  line-height: 1.18;
  letter-spacing: -0.02em;
  color: #fff;
  text-wrap: balance;
}
.event-guide-root .entry-note {
  margin: 0.55rem 0 0;
  color: rgba(255, 216, 168, 0.92);
  font-size: 0.95rem;
  line-height: 1.45;
}
.event-guide-root .source-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
  margin: 0.6rem 0 0.9rem;
}
.event-guide-root .source-row a,
.event-guide-root .prose a,
.event-guide-root .bullets a,
.event-guide-root .sources a,
.event-guide-root .fine a {
  color: #ffd8a8;
  text-decoration: underline;
  text-underline-offset: 0.16em;
  overflow-wrap: anywhere;
}
.event-guide-root .group-label {
  margin: 1.35rem 0 0.3rem;
  color: #fff;
  font-weight: 600;
}
.event-guide-root .prose > .group-label:first-child {
  margin-top: 0.15rem;
}
.event-guide-root .sources {
  list-style: none;
  margin: 0.2rem 0 1rem;
  padding: 0;
}
.event-guide-root .sources li {
  display: grid;
  grid-template-columns: 4.75rem minmax(0, 1fr);
  gap: 0.35rem 0.75rem;
  margin: 0.55rem 0;
  padding: 0;
  color: rgba(244, 241, 236, 0.84);
  line-height: 1.45;
}
.event-guide-root .sources .marker {
  color: rgba(255, 255, 255, 0.46);
  font-variant-numeric: tabular-nums;
}
.event-guide-root .jump {
  margin-top: 2rem;
}
.event-guide-root .jump-label {
  margin: 0 0 0.5rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.event-guide-root .jump-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem 1.05rem;
}
.event-guide-root .jump-links a {
  color: rgba(255, 255, 255, 0.84);
  font-size: 0.95rem;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.28);
  padding-bottom: 0.08rem;
}
.event-guide-root .jump-links a:hover {
  color: #fff;
}
.event-guide-root .prose p,
.event-guide-root .entry .prose p,
.event-guide-root .intro p {
  overflow-wrap: anywhere;
}
.event-guide-root .intro p {
  max-width: 40rem;
  color: rgba(244, 241, 236, 0.78);
  font-size: 1.05rem;
  line-height: 1.7;
}
.event-guide-root .prose .link-list a {
  color: #fff;
  font-weight: 600;
  text-decoration: none;
}
.event-guide-root .prose .link-list a:hover {
  text-decoration: underline;
}
@media (max-width: 520px) {
  .event-guide-root .page {
    width: min(42rem, calc(100% - 1.5rem));
  }
}
`;

type Inline =
  | { kind: 'text'; text: string }
  | { kind: 'link'; text: string; href: string }
  | { kind: 'strong'; text: string };

interface OrderedItem {
  marker: string;
  text: string;
}

type Block =
  | { type: 'h1'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: OrderedItem[] };

interface Entry {
  title: string;
  source: string | null;
  note?: string;
  blocks: Block[];
}

type FlowBlock = Block | { type: 'entry'; entry: Entry };

interface Section {
  id: string;
  heading: string | null;
  blocks: FlowBlock[];
}

const OL_RE = /^(\d+(?:[\u2013-]\d+)?)\.\s+(.*)$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function linkify(text: string): string {
  const trailing = text.match(/^(.*\S)\s+[\u2014\u2013]\s+(https?:\/\/\S+)$/);
  if (trailing && !trailing[1].includes('[')) {
    return `[${trailing[1]}](${trailing[2]})`;
  }
  let out = '';
  const re = /https?:\/\/[^\s)]+/g;
  let last = 0;
  for (const match of text.matchAll(re)) {
    const start = match.index ?? 0;
    const url = match[0];
    out += text.slice(last, start);
    const before = text.slice(Math.max(0, start - 2), start);
    out += before === '](' ? url : `[${url}](${url})`;
    last = start + url.length;
  }
  out += text.slice(last);
  return out;
}

function parseInline(text: string): Inline[] {
  const source = linkify(text);
  const parts: Inline[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  for (const match of source.matchAll(re)) {
    const start = match.index ?? 0;
    if (start > last) parts.push({ kind: 'text', text: source.slice(last, start) });
    if (match[1] !== undefined && match[2] !== undefined) {
      parts.push({ kind: 'link', text: match[1], href: match[2] });
    } else if (match[3] !== undefined) {
      parts.push({ kind: 'strong', text: match[3] });
    }
    last = start + match[0].length;
  }
  if (last < source.length) parts.push({ kind: 'text', text: source.slice(last) });
  return parts;
}

function isUrlLikeLabel(text: string): boolean {
  return /^https?:\/\//i.test(text) || /^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(text);
}

function hostOf(href: string, fallback: string): string {
  try {
    return new URL(href).host.replace(/^www\./, '');
  } catch {
    return fallback;
  }
}

function baseLinkLabel(text: string, href: string): string {
  if (!isUrlLikeLabel(text)) return text;
  if (/\/status\/\d+/.test(href)) return 'View post';
  if (text.length <= 48) return text;
  return hostOf(href, text);
}

function numberDuplicateLabels(labels: string[]): string[] {
  const counts = new Map<string, number>();
  for (const label of labels) counts.set(label, (counts.get(label) ?? 0) + 1);
  const seen = new Map<string, number>();
  return labels.map((label) => {
    if ((counts.get(label) ?? 0) < 2) return label;
    const next = (seen.get(label) ?? 0) + 1;
    seen.set(label, next);
    return `${label} ${next}`;
  });
}

function isSafeHref(href: string): boolean {
  return href.startsWith('/') || href.startsWith('https://') || href.startsWith('http://');
}

function renderAnchor(href: string, visible: string, original: string): string {
  if (!isSafeHref(href)) return escapeHtml(original);
  const external = /^https?:/i.test(href);
  const title = visible === original ? '' : ` title="${escapeHtml(href)}"`;
  const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<a href="${escapeHtml(href)}"${title}${attrs}>${escapeHtml(visible)}</a>`;
}

function renderInlines(text: string): string {
  const parts = parseInline(text);
  const labels = numberDuplicateLabels(
    parts.filter((part): part is Extract<Inline, { kind: 'link' }> => part.kind === 'link').map((link) => baseLinkLabel(link.text, link.href)),
  );
  let linkIndex = 0;
  return parts
    .map((part) => {
      if (part.kind === 'text') return escapeHtml(part.text);
      if (part.kind === 'strong') return `<strong>${escapeHtml(part.text)}</strong>`;
      const visible = labels[linkIndex] ?? part.text;
      linkIndex += 1;
      return renderAnchor(part.href, visible, part.text);
    })
    .join('');
}

function isLinkOnly(text: string): boolean {
  const parts = parseInline(text.trim());
  if (!parts.some((part) => part.kind === 'link')) return false;
  return parts.every(
    (part) => part.kind === 'link' || (part.kind === 'text' && /^[\s·•|,-]+$/.test(part.text)),
  );
}

function strongTitle(text: string): string | null {
  const match = text.trim().match(/^\*\*([^*]+)\*\*$/);
  return match ? match[1].trim() : null;
}

function isLinkFirst(items: string[]): boolean {
  return items.length > 0 && items.every((item) => item.trim().startsWith('['));
}

function preprocess(markdown: string): string {
  return markdown
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => !/^Related event page \(header link only\):/.test(line.trim()))
    .join('\n')
    .replaceAll('https://www.globaltechevents.xyz', '');
}

function parseBlocks(markdown: string): Block[] {
  const lines = preprocess(markdown).split('\n');
  const blocks: Block[] = [];
  let index = 0;

  while (index < lines.length) {
    const raw = lines[index];
    const line = raw.trim();
    if (!line) {
      index += 1;
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', text: line.slice(3).trim() });
      index += 1;
      continue;
    }
    if (line.startsWith('# ')) {
      blocks.push({ type: 'h1', text: line.slice(2).trim() });
      index += 1;
      continue;
    }
    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (index < lines.length) {
        const current = lines[index];
        if (current.trim().startsWith('- ')) {
          items.push(current.trim().slice(2).trim());
          index += 1;
          continue;
        }
        if (/^\s{2,}\S/.test(current) && items.length > 0) {
          items[items.length - 1] += ` ${current.trim()}`;
          index += 1;
          continue;
        }
        break;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }
    const ordered = line.match(OL_RE);
    if (ordered) {
      const items: OrderedItem[] = [];
      while (index < lines.length) {
        const match = lines[index].trim().match(OL_RE);
        if (!match) break;
        items.push({ marker: match[1], text: match[2].trim() });
        index += 1;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (index < lines.length) {
      const next = lines[index].trim();
      if (!next || next.startsWith('#') || next.startsWith('- ') || OL_RE.test(next) || strongTitle(next) || isLinkOnly(next)) {
        break;
      }
      paragraph.push(next);
      index += 1;
    }
    blocks.push({ type: 'p', text: paragraph.join(' ') });
  }

  const merged: Block[] = [];
  for (const block of blocks) {
    const prev = merged[merged.length - 1];
    if (block.type === 'ul' && prev?.type === 'ul') {
      prev.items.push(...block.items);
      continue;
    }
    merged.push(block);
  }
  return merged;
}

function groupSections(blocks: Block[], page: RecapPage): { lede: string; intro: FlowBlock[]; sections: Section[] } {
  let skippedDate = false;
  let lede = '';
  const intro: FlowBlock[] = [];
  const sections: Section[] = [];
  let current: Section | null = null;
  let entry: Entry | null = null;

  const flow = (): FlowBlock[] => (current ? current.blocks : intro);

  const closeEntry = () => {
    if (!entry) return;
    flow().push({ type: 'entry', entry });
    entry = null;
  };

  for (const block of blocks) {
    if (block.type === 'h1') continue;
    if (block.type === 'p' && !skippedDate && strongTitle(block.text) && /20\d{2}/.test(block.text)) {
      skippedDate = true;
      continue;
    }
    if (block.type === 'h2') {
      closeEntry();
      current = { id: slugify(block.text), heading: block.text, blocks: [] };
      sections.push(current);
      continue;
    }
    if (block.type === 'p') {
      const title = strongTitle(block.text);
      if (title) {
        closeEntry();
        const note = page.entryNotes?.find((item) => title.includes(item.titleIncludes))?.note;
        entry = { title, source: null, note, blocks: [] };
        continue;
      }
      if (!lede && !current && !entry) {
        lede = block.text;
        continue;
      }
      if (entry && entry.blocks.length === 0 && entry.source === null && isLinkOnly(block.text)) {
        entry.source = block.text;
        continue;
      }
    }
    if (entry) entry.blocks.push(block);
    else flow().push(block);
  }
  closeEntry();
  return { lede, intro, sections };
}

function renderBlocks(blocks: FlowBlock[], introList: boolean): string {
  return blocks
    .map((block) => {
      if (block.type === 'entry') return renderEntry(block.entry);
      if (block.type === 'p') {
        const label = block.text.endsWith(':') && block.text.length < 90 && !block.text.includes('](');
        const className = label ? ' class="group-label"' : '';
        return `<p${className}>${renderInlines(block.text)}</p>`;
      }
      if (block.type === 'ul') {
        const kind = introList ? 'start-list' : isLinkFirst(block.items) ? 'link-list' : 'bullets';
        const items = block.items.map((item) => `<li>${renderInlines(item)}</li>`).join('');
        return `<ul class="${kind}">${items}</ul>`;
      }
      if (block.type === 'ol') {
        const items = block.items
          .map(
            (item) =>
              `<li><span class="marker">${escapeHtml(item.marker)}.</span><span>${renderInlines(item.text)}</span></li>`,
          )
          .join('');
        return `<ol class="sources">${items}</ol>`;
      }
      return '';
    })
    .join('\n');
}

function renderSourceRow(text: string): string {
  const links = parseInline(text).filter((part): part is Extract<Inline, { kind: 'link' }> => part.kind === 'link');
  const labels = numberDuplicateLabels(links.map((link) => baseLinkLabel(link.text, link.href)));
  return `<div class="source-row">${links
    .map((link, index) => renderAnchor(link.href, labels[index] ?? link.text, link.text))
    .join('')}</div>`;
}

function renderEntry(entry: Entry): string {
  const note = entry.note ? `<p class="entry-note">${escapeHtml(entry.note)}</p>` : '';
  const source = entry.source ? renderSourceRow(entry.source) : '';
  const body = entry.blocks.length ? `<div class="prose">${renderBlocks(entry.blocks, false)}</div>` : '';
  return `<article class="entry"><h3>${escapeHtml(entry.title)}</h3>${note}${source}${body}</article>`;
}

function renderFacts(page: RecapPage): string {
  const items = page.facts
    .map((fact) => {
      const spoken = [fact.primary, fact.secondary, fact.note].filter(Boolean).join(', ');
      return `<div class="fact">
          <dt>${escapeHtml(fact.label)}</dt>
          <dd>
            <span class="sr-only">${escapeHtml(spoken)}</span>
            <span aria-hidden="true">${escapeHtml(fact.primary)}</span>
            ${fact.secondary ? `<span class="sub" aria-hidden="true">${escapeHtml(fact.secondary)}</span>` : ''}
            ${fact.note ? `<span class="note" aria-hidden="true">${escapeHtml(fact.note)}</span>` : ''}
          </dd>
        </div>`;
    })
    .join('');
  return `<dl class="facts facts-${page.facts.length}">${items}</dl>`;
}

function jsonLd(page: RecapPage): string {
  const canonical = `${SITE_ORIGIN}/recaps/${page.slug}`;
  const eventUrl = `${SITE_ORIGIN}/events/${page.eventSlug}`;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: page.title,
        url: canonical,
        description: page.description,
        isPartOf: {
          '@type': 'WebSite',
          name: 'GlobalTechEvents',
          url: `${SITE_ORIGIN}/`,
        },
        about: {
          '@type': 'Event',
          name: page.eventName,
          url: eventUrl,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Calendar', item: `${SITE_ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: page.eventName, item: eventUrl },
          { '@type': 'ListItem', position: 3, name: 'Public notes', item: canonical },
        ],
      },
    ],
  });
}

export function renderRecapDocument(page: RecapPage, markdown: string): string {
  const grouped = groupSections(parseBlocks(markdown), page);
  const canonical = `${SITE_ORIGIN}/recaps/${page.slug}`;
  const eventHref = `/events/${page.eventSlug}`;
  const jump = grouped.sections
    .map((section) => `<a href="#${escapeHtml(section.id)}">${escapeHtml(section.heading ?? '')}</a>`)
    .join('');
  const sections = grouped.sections
    .map(
      (section) => `<section class="block" id="${escapeHtml(section.id)}">
        <h2>${escapeHtml(section.heading ?? '')}</h2>
        ${renderBlocks(section.blocks, false)}
      </section>`,
    )
    .join('\n');
  const callout = page.callout ? `<p class="callout">${escapeHtml(page.callout)}</p>` : '';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(page.seoTitle)}</title>
    <meta name="description" content="${escapeHtml(page.description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(page.seoTitle)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:site_name" content="GlobalTechEvents" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(page.seoTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(page.description)}" />
    <meta name="theme-color" content="#090807" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <script type="application/ld+json">${jsonLd(page)}</script>
    <style>${guideCss}${RECAP_CSS}</style>
  </head>
  <body class="event-guide-root">
    <a class="skip" href="#content">Skip to content</a>
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
    </header>
    <div class="page-scroll">
    <main class="page" id="content">
      <nav class="crumb" aria-label="Breadcrumb">
        <a href="/">Calendar</a>
        <span aria-hidden="true">/</span>
        <a href="${eventHref}">${escapeHtml(page.eventName)}</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Public notes</span>
      </nav>
      <h1>${escapeHtml(page.title)}</h1>
      <p class="as-of">Updated ${escapeHtml(page.updated)}</p>
      <p class="lede">${renderInlines(grouped.lede)}</p>
      ${renderFacts(page)}
      ${callout}
      <div class="intro">${renderBlocks(grouped.intro, true)}</div>
      <div class="hero-actions">
        <div class="primary-block">
          <a class="primary" href="/api/calendar">Subscribe to the calendar</a>
          <p class="hint">One calendar for the major tech events, including this one.</p>
        </div>
      </div>
      <nav class="jump" aria-label="On this page">
        <p class="jump-label">On this page</p>
        <div class="jump-links">${jump}</div>
      </nav>
      ${sections}
      <section class="close" id="subscribe">
        <h2>Keep the next dates on your calendar</h2>
        <p>Subscribe once for the major tech events on this site. The event page has the dates and the official site.</p>
        <a class="primary" href="/api/calendar">Subscribe to the calendar</a>
        <p class="fine"><a href="${eventHref}">Back to the ${escapeHtml(page.eventName)} event page</a></p>
      </section>
    </main>
    <footer class="site-footer">
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
          <a href="${escapeHtml(WHATSAPP_GROUP_URL)}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </nav>
        <p class="legal">© 2026 GlobalTechEvents</p>
      </div>
    </footer>
    </div>
  </body>
</html>`;
}

export function assertRecapFidelity(page: RecapPage, markdown: string, html: string): void {
  const problems: string[] = [];
  if (/\p{Script=Han}/u.test(html)) problems.push('page contains Chinese characters');
  if (/noindex/i.test(html)) problems.push('page sets noindex');
  if (html.includes('header link only') || html.includes('请你看')) problems.push('process note leaked');
  if (!html.includes(`<link rel="canonical" href="${SITE_ORIGIN}/recaps/${page.slug}" />`)) {
    problems.push('canonical missing');
  }
  if (!html.includes(page.title)) problems.push('title missing');
  if (!html.includes(`/events/${page.eventSlug}`)) problems.push('event page link missing');

  const urls = new Set<string>();
  for (const match of markdown.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) urls.add(match[1]);
  for (const match of markdown.matchAll(/https?:\/\/[^\s)]+/g)) {
    urls.add(match[0].replace(/[.,;]+$/, ''));
  }
  for (const url of urls) {
    if (url.startsWith(SITE_ORIGIN)) {
      const path = url.slice(SITE_ORIGIN.length);
      if (!html.includes(path)) problems.push(`missing on-site link ${path}`);
      continue;
    }
    if (!html.includes(url)) problems.push(`missing source URL ${url}`);
  }

  const headings = [...markdown.matchAll(/^## (.+)$/gm)].map((match) => match[1].trim());
  for (const heading of headings) {
    if (!html.includes(`>${heading}<`)) problems.push(`missing heading ${heading}`);
  }
  if (!groupedLedePresent(html)) problems.push('lede missing');
  if (problems.length) {
    throw new Error(`${page.slug}:\n- ${problems.join('\n- ')}`);
  }
}

function groupedLedePresent(html: string): boolean {
  return html.includes('class="lede"') && !html.includes('class="lede"></p>');
}
