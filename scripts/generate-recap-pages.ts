import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { RECAP_PAGES, indexableRecapUrls, recapPublicPath } from '../src/content/recaps/pages.ts';
import { assertRecapFidelity, renderRecapDocument } from './render-recap-document.ts';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const CONTENT_DIR = path.join(ROOT, 'src/content/recaps');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');

const RECAP_LINK_CSS = `
.event-guide-root .recap-link {
  margin: 1rem 0 0;
  max-width: 40rem;
  color: rgba(244, 241, 236, 0.72);
  font-size: 1.02rem;
  line-height: 1.5;
}

.event-guide-root .recap-link a {
  color: #fff;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 0.18em;
}
`;

function writePages(): void {
  for (const page of RECAP_PAGES) {
    const markdown = readFileSync(path.join(CONTENT_DIR, `${page.slug}.md`), 'utf8');
    const html = renderRecapDocument(page, markdown);
    assertRecapFidelity(page, markdown, html);
    const outDir = path.join(PUBLIC_DIR, 'recaps', page.slug);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(path.join(outDir, 'index.html'), html);
    console.log(`Wrote ${recapPublicPath(page.slug)}`);
  }
}

function ensureSitemap(): void {
  let xml = readFileSync(SITEMAP_PATH, 'utf8');
  const today = new Date().toISOString().slice(0, 10);
  for (const loc of indexableRecapUrls()) {
    if (xml.includes(`<loc>${loc}</loc>`)) continue;
    const block = `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    if (!xml.includes('</urlset>')) throw new Error('sitemap.xml is missing </urlset>');
    xml = xml.replace('</urlset>', `${block}</urlset>`);
  }
  writeFileSync(SITEMAP_PATH, xml);
}

function ensureEventLinks(): void {
  for (const page of RECAP_PAGES) {
    const file = path.join(PUBLIC_DIR, 'events', page.eventSlug, 'index.html');
    let html = readFileSync(file, 'utf8');
    const href = recapPublicPath(page.slug);
    if (!html.includes('class="recap-link"')) {
      const next = html.replace(
        /(<p class="lede">[\s\S]*?<\/p>)/,
        `$1\n      <p class="recap-link"><a href="${href}">Public notes and recap posts</a> from this meeting.</p>`,
      );
      if (next === html) throw new Error(`Could not insert recap link into ${file}`);
      html = next;
    }
    if (!html.includes('.event-guide-root .recap-link')) {
      const next = html.replace('</style>', `${RECAP_LINK_CSS}</style>`);
      if (next === html) throw new Error(`Could not insert recap link CSS into ${file}`);
      html = next;
    }
    if (!html.includes(`href="${href}"`)) throw new Error(`Event page ${page.eventSlug} is missing ${href}`);
    writeFileSync(file, html);
    console.log(`Linked /events/${page.eventSlug} -> ${href}`);
  }
}

writePages();
ensureSitemap();
ensureEventLinks();
