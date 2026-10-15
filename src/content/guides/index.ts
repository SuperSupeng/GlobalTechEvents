import type { Guide } from './types';

/**
 * Guides registry. Every JSON file in this folder is a guide.
 *
 * Add a guide:
 * 1. Copy `best-ai-conferences-2026.json` to `<slug>.json`. The filename (without .json) must match `slug`.
 * 2. Set the H1 (`title`), opening lead (`description`), `asOf`, author, H2/H3 `sections`, `faq`, and `internalLinks`.
 *    Put a comparison on `section.table`. Column labels come from `readerTable.ts`, not from the JSON.
 * 3. Leave `status` as `draft`, `author.placeholder` true, and `intentAnswered` false until a real editor signs it.
 *    Drafts render at `/guides/<slug>` and on the index, with `noindex` and no sitemap URL.
 * 4. Fill cover and body images (each with alt). Replace FAQ answers that start with "Not published."
 * 5. Set `status` to `published` and `intentAnswered` to true only when every publish-gate check passes
 *    (`evaluateGuidePublishGate` in `publishGate.ts`).
 * 6. Refresh crawlable files with `npm run build:seo`, or `npx tsx scripts/generate-seo-static-pages.mjs --guides-only`
 *    when event pages do not need a rebuild. Published guides are the only guide URLs added to the sitemap.
 *    `build:seo` also writes the home shell in `index.html`, `public/events/index.html`, `public/for-agents/index.html`, and `public/llms.txt`.
 *    `--hubs-only` refreshes those files from local data without refetching events.
 */
const guideModules = import.meta.glob('./*.json', {
  eager: true,
  import: 'default',
}) as Record<string, Guide>;

function fileSlug(modulePath: string): string {
  const fileName = modulePath.split('/').pop() ?? modulePath;
  return fileName.replace(/\.json$/, '');
}

export const GUIDES: Guide[] = Object.entries(guideModules)
  .map(([modulePath, guide]) => {
    const expected = fileSlug(modulePath);
    if (guide.slug !== expected && import.meta.env.DEV) {
      console.warn(`Guide slug "${guide.slug}" does not match ${modulePath}`);
    }
    return guide;
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));

export function listGuides(): Guide[] {
  return GUIDES;
}

export function getGuideBySlug(slug: string): Guide | undefined {
  const normalized = slug.toLowerCase();
  return GUIDES.find((guide) => guide.slug === normalized);
}

export type { Guide } from './types';
export { evaluateGuidePublishGate } from './publishGate';
export { guideCanonicalUrl, guidesIndexCanonicalUrl } from './site';
