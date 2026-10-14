import fs from 'node:fs';
import path from 'node:path';

const GUIDE_CONTENT_DIR = path.resolve('src/content/guides');
const PUBLIC_DIR = path.resolve('public');
const GUIDES_OUTPUT_DIR = path.join(PUBLIC_DIR, 'guides');
const SITE_URL = 'https://www.globaltechevents.xyz';

const STUB_ANSWER = /^not published\b/i;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function hasText(value) {
  return Boolean(value && String(value).trim());
}

export function loadGuides() {
  if (!fs.existsSync(GUIDE_CONTENT_DIR)) return [];
  return fs
    .readdirSync(GUIDE_CONTENT_DIR)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => {
      const guide = JSON.parse(fs.readFileSync(path.join(GUIDE_CONTENT_DIR, name), 'utf8'));
      const expected = name.replace(/\.json$/, '');
      if (guide.slug !== expected) {
        console.warn(`Guide slug "${guide.slug}" does not match filename ${name}`);
      }
      return guide;
    });
}

/** Keep in sync with src/content/guides/publishGate.ts */
export function isGuideIndexable(guide) {
  if (!guide || guide.status !== 'published') return false;
  if (!guide.author || guide.author.placeholder) return false;
  if (!hasText(guide.author.name) || !hasText(guide.author.bio)) return false;
  if (!guide.coverImage?.src || !guide.coverImage?.alt) return false;
  if (!Array.isArray(guide.bodyImages) || guide.bodyImages.length < 1) return false;
  if (guide.bodyImages.some((image) => !hasText(image?.src) || !hasText(image?.alt))) return false;
  if (!hasText(guide.title) || !/^\d{4}-\d{2}-\d{2}$/.test(guide.asOf || '')) return false;
  if (guide.intentAnswered !== true || !hasText(guide.description)) return false;
  if (!Array.isArray(guide.sections) || guide.sections.length < 1) return false;
  if (guide.sections.some((section) => !hasText(section?.heading))) return false;
  if (!Array.isArray(guide.faq) || guide.faq.length < 3) return false;
  if (
    guide.faq.some((item) => {
      const answer = String(item?.answer || '').trim();
      return !hasText(item?.question) || !answer || STUB_ANSWER.test(answer);
    })
  ) {
    return false;
  }
  const internal = (guide.internalLinks || []).filter((link) => String(link?.href || '').startsWith('/') && hasText(link?.label));
  return internal.length >= 2;
}

function readWhatsAppUrl() {
  const raw = fs.readFileSync(path.resolve('src/config/constants.ts'), 'utf8');
  const match = raw.match(/WHATSAPP_GROUP_URL = '([^']+)'/);
  return match?.[1] || `${SITE_URL}/`;
}

function buildGuideJsonLd(guide) {
  const canonical = `${SITE_URL}/guides/${guide.slug}`;
  const author = {
    '@type': 'Person',
    name: guide.author?.name || '',
    description: guide.author?.bio || '',
  };
  if (guide.author?.avatar?.src) author.image = guide.author.avatar.src;
  const profileUrl = String(guide.author?.url || '').trim();
  if (profileUrl) {
    author.url = profileUrl;
    author.sameAs = [profileUrl];
  }
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    inLanguage: guide.language || 'en',
    dateModified: guide.asOf,
    author,
    publisher: {
      '@type': 'Organization',
      name: 'GlobalTechEvents',
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
  };
  if (guide.status === 'published') article.datePublished = guide.asOf;
  if (guide.coverImage?.src) article.image = [guide.coverImage.src];

  const faqPage =
    Array.isArray(guide.faq) && guide.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: guide.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        }
      : null;

  return { article, faqPage };
}

function renderSections(guide) {
  return (guide.sections || [])
    .map((section) => {
      const paragraphs = (section.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');
      const subsections = (section.subsections || [])
        .map(
          (subsection) => `
            <h3>${escapeHtml(subsection.heading)}</h3>
            ${(subsection.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}`,
        )
        .join('');
      const table =
        section.id === 'comparison-table' && guide.comparisonTable
          ? renderTable(guide.comparisonTable)
          : '';
      return `<section><h2>${escapeHtml(section.heading)}</h2>${paragraphs}${table}${subsections}</section>`;
    })
    .join('');
}

function renderTable(table) {
  const head = (table.columns || []).map((column) => `<th>${escapeHtml(column)}</th>`).join('');
  const rows =
    Array.isArray(table.rows) && table.rows.length > 0
      ? table.rows
          .map(
            (row) =>
              `<tr>${(table.columns || []).map((_, index) => `<td>${escapeHtml(row[index] || '')}</td>`).join('')}</tr>`,
          )
          .join('')
      : `<tr><td colspan="${(table.columns || []).length}">No rows yet. This table is a column template, not a published comparison.</td></tr>`;
  return `<table><caption>${escapeHtml(table.caption || '')}</caption><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`;
}

function renderGuidePage(guide) {
  const canonical = `${SITE_URL}/guides/${guide.slug}`;
  const indexable = isGuideIndexable(guide);
  const { article, faqPage } = buildGuideJsonLd(guide);
  const jsonForScript = (value) => JSON.stringify(value).replace(/</g, '\\u003c');
  const schemas = [article, faqPage]
    .filter(Boolean)
    .map((schema) => `<script type="application/ld+json">${jsonForScript(schema)}</script>`)
    .join('\n    ');
  const notice = guide.shellNotice || (guide.status === 'draft'
    ? 'Draft shell — not a published guide. This page does not rank conferences and does not state dates, prices, or speakers.'
    : '');
  const authorLabel = guide.author?.placeholder
    ? '<p class="eyebrow">Placeholder author — not a published byline</p>'
    : '';
  const authorName = guide.author?.name || '';
  const authorBio = guide.author?.bio || '';
  const authorUrl = String(guide.author?.url || '').trim();
  const avatarSrc = guide.author?.avatar?.src || '';
  const avatarAlt = guide.author?.avatar?.alt || authorName;
  const avatarHtml = avatarSrc
    ? `<img class="avatar" src="${escapeHtml(avatarSrc)}" alt="${authorUrl ? '' : escapeHtml(avatarAlt)}" width="40" height="40" />`
    : '';
  const authorIdentity = authorUrl
    ? `<a class="identity" href="${escapeHtml(authorUrl)}" target="_blank" rel="noopener noreferrer">${avatarHtml}<span class="copy"><span class="name">${escapeHtml(authorName)}<span class="sr-only"> (opens in a new tab)</span></span><span class="bio">${escapeHtml(authorBio)}</span></span></a>`
    : `<div class="identity">${avatarSrc ? `<img class="avatar" src="${escapeHtml(avatarSrc)}" alt="${escapeHtml(avatarAlt)}" width="40" height="40" />` : ''}<span class="copy"><span class="name">${escapeHtml(authorName)}</span><span class="bio">${escapeHtml(authorBio)}</span></span></div>`;
  const faq = (guide.faq || [])
    .map(
      (item) => `<article class="card"><h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p></article>`,
    )
    .join('');
  const links = (guide.internalLinks || [])
    .map((link) => `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></li>`)
    .join('');
  const cover = guide.coverImage?.src
    ? `<img src="${escapeHtml(guide.coverImage.src)}" alt="${escapeHtml(guide.coverImage.alt || '')}" />`
    : '<div class="slot">Cover image slot. A cover with alt text is required before this guide can be published.</div>';
  const figures =
    Array.isArray(guide.bodyImages) && guide.bodyImages.length > 0
      ? guide.bodyImages
          .map((image) => `<figure><img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt || '')}" /></figure>`)
          .join('')
      : '<div class="slot">Body image slot. At least one in-body image with alt text is required before publish.</div>';
  const whatsapp = readWhatsAppUrl();

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(guide.seoTitle || guide.title)}</title>
    <meta name="description" content="${escapeHtml(guide.description || '')}" />
    <meta name="robots" content="${indexable ? 'index, follow' : 'noindex, nofollow'}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(guide.title)}" />
    <meta property="og:description" content="${escapeHtml(guide.description || '')}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:site_name" content="GlobalTechEvents" />
    ${schemas}
    <style>
      :root { color-scheme: dark; }
      body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #050505; color: #f5f5f5; line-height: 1.7; }
      a { color: #fdba74; }
      nav { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; padding: 20px; border-bottom: 1px solid rgba(255,255,255,.08); }
      nav a { color: #fff; text-decoration: none; font-size: 13px; letter-spacing: .08em; text-transform: uppercase; }
      .brand { font-weight: 700; letter-spacing: 0; text-transform: none; font-size: 18px; margin-right: auto; }
      .wrap { max-width: 860px; margin: 0 auto; padding: 32px 20px 80px; }
      .notice { border: 1px solid rgba(253,186,116,.35); background: rgba(253,186,116,.1); border-radius: 16px; padding: 12px 16px; }
      .eyebrow { color: #fdba74; text-transform: uppercase; letter-spacing: .14em; font-size: 12px; }
      h1 { font-size: 40px; line-height: 1.15; margin: 12px 0; }
      h2 { font-size: 26px; margin: 36px 0 12px; }
      h3 { font-size: 18px; margin: 18px 0 6px; }
      p, li, td { color: rgba(255,255,255,.84); }
      .card, .slot { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1); border-radius: 16px; padding: 16px; margin: 12px 0; }
      .slot { border-style: dashed; color: rgba(255,255,255,.6); }
      .byline { margin: 0 0 28px; }
      .byline .identity { display: flex; align-items: center; gap: 12px; max-width: 100%; color: inherit; text-decoration: none; }
      .byline a.identity:hover .name { color: #fdba74; }
      .byline .copy { min-width: 0; }
      .byline .name { display: block; font-weight: 600; font-size: 15px; line-height: 1.25; color: #fff; }
      .byline .bio { display: block; margin-top: 2px; font-size: 14px; line-height: 1.35; font-weight: 400; color: rgba(255,255,255,.62); }
      .byline .avatar { width: 40px; height: 40px; border-radius: 999px; object-fit: cover; flex: none; border: 1px solid rgba(255,255,255,.15); }
      .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
      table { width: 100%; border-collapse: collapse; margin: 12px 0 20px; }
      th, td { border-bottom: 1px solid rgba(255,255,255,.1); text-align: left; padding: 8px; vertical-align: top; }
      caption { text-align: left; color: rgba(255,255,255,.6); margin-bottom: 8px; }
      img { max-width: 100%; border-radius: 16px; }
    </style>
  </head>
  <body>
    <nav>
      <a class="brand" href="/">GlobalTechEvents</a>
      <a href="/">View Calendar</a>
      <a href="/events">Events Hub</a>
      <a href="/guides">Guides</a>
      <a href="${escapeHtml(whatsapp)}" rel="noopener noreferrer">WhatsApp</a>
    </nav>
    <main class="wrap">
      ${notice ? `<p class="notice">${escapeHtml(notice)}</p>` : ''}
      <p class="eyebrow">${indexable ? 'Guide' : 'Draft shell'}</p>
      <h1>${escapeHtml(guide.title)}</h1>
      <p><strong>As of ${escapeHtml(guide.asOf)}</strong></p>
      <section class="byline" aria-label="Author">
        ${authorLabel}
        ${authorIdentity}
      </section>
      <p>${escapeHtml(guide.description || '')}</p>
      ${cover}
      ${renderSections(guide)}
      <section><h2>Figures</h2>${figures}</section>
      <section><h2>FAQ</h2>${faq}</section>
      <section><h2>Related guides and calendar</h2><ul>${links}</ul></section>
    </main>
  </body>
</html>`;
}

function renderGuidesIndex(guides) {
  const canonical = `${SITE_URL}/guides`;
  const cards =
    guides.length === 0
      ? '<article class="card"><h2>No guides yet</h2><p>Nothing on this page is a ranking.</p></article>'
      : guides
          .map((guide) => {
            const draft = !isGuideIndexable(guide);
            return `<article class="card">
              <p class="eyebrow">${draft ? 'Draft shell · not a published ranking' : 'Published guide'}</p>
              <h2>${escapeHtml(guide.title)}</h2>
              <p>As of ${escapeHtml(guide.asOf)}</p>
              <p>${escapeHtml(guide.description || '')}</p>
              <p><a href="/guides/${escapeHtml(guide.slug)}">${draft ? 'Open draft shell' : 'Read guide'}</a></p>
            </article>`;
          })
          .join('');
  const whatsapp = readWhatsAppUrl();

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Guides | GlobalTechEvents</title>
    <meta name="description" content="Evergreen compare and best-of guides for major tech events. Draft shells are labeled and are not published rankings." />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Guides | GlobalTechEvents" />
    <meta property="og:url" content="${canonical}" />
    <style>
      :root { color-scheme: dark; }
      body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #050505; color: #f5f5f5; line-height: 1.7; }
      a { color: #fdba74; }
      nav { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; padding: 20px; border-bottom: 1px solid rgba(255,255,255,.08); }
      nav a { color: #fff; text-decoration: none; font-size: 13px; letter-spacing: .08em; text-transform: uppercase; }
      .brand { font-weight: 700; letter-spacing: 0; text-transform: none; font-size: 18px; margin-right: auto; }
      .wrap { max-width: 960px; margin: 0 auto; padding: 32px 20px 80px; }
      h1 { font-size: 42px; line-height: 1.1; }
      .card { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1); border-radius: 16px; padding: 18px; margin: 16px 0; }
      .eyebrow { color: #fdba74; text-transform: uppercase; letter-spacing: .14em; font-size: 12px; }
    </style>
  </head>
  <body>
    <nav>
      <a class="brand" href="/">GlobalTechEvents</a>
      <a href="/">View Calendar</a>
      <a href="/events">Events Hub</a>
      <a href="/guides">Guides</a>
      <a href="${escapeHtml(whatsapp)}" rel="noopener noreferrer">WhatsApp</a>
    </nav>
    <main class="wrap">
      <p class="eyebrow">Guides</p>
      <h1>Guides</h1>
      <p>Evergreen compare and best-of pages for major tech events. Draft shells are labeled and are not published rankings.</p>
      ${cards}
    </main>
  </body>
</html>`;
}

const GUIDE_MEDIA_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif']);

function collectGuideMedia(dir, root = dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectGuideMedia(full, root));
      continue;
    }
    if (GUIDE_MEDIA_EXT.has(path.extname(entry.name).toLowerCase())) {
      files.push({ rel: path.relative(root, full), data: fs.readFileSync(full) });
    }
  }
  return files;
}

export function writeGuideStaticPages() {
  const guides = loadGuides();
  // HTML is regenerated, but cover and body images live beside each guide's index.html.
  const preservedMedia = collectGuideMedia(GUIDES_OUTPUT_DIR);
  fs.rmSync(GUIDES_OUTPUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(GUIDES_OUTPUT_DIR, { recursive: true });
  for (const file of preservedMedia) {
    const dest = path.join(GUIDES_OUTPUT_DIR, file.rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, file.data);
  }
  fs.writeFileSync(path.join(GUIDES_OUTPUT_DIR, 'index.html'), renderGuidesIndex(guides));
  for (const guide of guides) {
    const outDir = path.join(GUIDES_OUTPUT_DIR, guide.slug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), renderGuidePage(guide));
  }
  return guides;
}

export function indexableGuideUrls(guides) {
  return guides.filter(isGuideIndexable).map((guide) => `${SITE_URL}/guides/${guide.slug}`);
}

export function ensureGuidesInExistingSitemap(guides) {
  const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) return;
  let xml = fs.readFileSync(sitemapPath, 'utf8');
  const today = new Date().toISOString().slice(0, 10);
  const wanted = [`${SITE_URL}/guides`, ...indexableGuideUrls(guides)];
  for (const loc of wanted) {
    if (xml.includes(`<loc>${loc}</loc>`)) continue;
    const isHub = loc.endsWith('/guides');
    const block = `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${isHub ? '0.7' : '0.8'}</priority>\n  </url>\n`;
    xml = xml.replace('</urlset>', `${block}</urlset>`);
  }
  fs.writeFileSync(sitemapPath, xml);
}
