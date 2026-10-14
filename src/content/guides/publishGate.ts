import type { Guide } from './types';

export interface GuideGateCheck {
  id: string;
  label: string;
  ok: boolean;
}

const STUB_ANSWER = /^not published\b/i;

function hasText(value: string | undefined): boolean {
  return Boolean(value && value.trim());
}

function faqIsPublishable(guide: Guide): boolean {
  if (guide.faq.length < 3) return false;
  return guide.faq.every((item) => {
    const answer = item.answer.trim();
    return hasText(item.question) && answer.length > 0 && !STUB_ANSWER.test(answer);
  });
}

/**
 * SEO publish gate from the 2026-10-14 Guides spec.
 * A guide can render as a shell while this fails. It is indexable only when every check passes.
 */
export function evaluateGuidePublishGate(guide: Guide): { indexable: boolean; checks: GuideGateCheck[] } {
  const checks: GuideGateCheck[] = [
    {
      id: 'status',
      label: 'Marked published',
      ok: guide.status === 'published',
    },
    {
      id: 'author',
      label: 'Real author and bio (not a placeholder)',
      ok: !guide.author.placeholder && hasText(guide.author.name) && hasText(guide.author.bio),
    },
    {
      id: 'cover',
      label: 'Cover image with alt text',
      ok: Boolean(guide.coverImage?.src && guide.coverImage?.alt),
    },
    {
      id: 'bodyImage',
      label: 'At least one body image with alt text',
      ok:
        (guide.bodyImages?.length ?? 0) >= 1 &&
        (guide.bodyImages ?? []).every((image) => hasText(image.src) && hasText(image.alt)),
    },
    {
      id: 'h1',
      label: 'Unique H1',
      ok: hasText(guide.title),
    },
    {
      id: 'h2',
      label: 'H2 sections',
      ok: guide.sections.length > 0 && guide.sections.every((section) => hasText(section.heading)),
    },
    {
      id: 'faq',
      label: 'FAQ with at least 3 publishable answers',
      ok: faqIsPublishable(guide),
    },
    {
      id: 'jsonld',
      label: 'Article and FAQPage JSON-LD (emitted when an H1 and 3 FAQ entries exist)',
      ok: hasText(guide.title) && guide.faq.length >= 3,
    },
    {
      id: 'lead',
      label: 'Opening lead answers search intent',
      ok: guide.intentAnswered === true && hasText(guide.description),
    },
    {
      id: 'links',
      label: 'At least 2 internal links',
      ok: guide.internalLinks.filter((link) => link.href.startsWith('/') && hasText(link.label)).length >= 2,
    },
    {
      id: 'asof',
      label: 'Explicit as-of date',
      ok: /^\d{4}-\d{2}-\d{2}$/.test(guide.asOf),
    },
  ];

  return {
    indexable: checks.every((check) => check.ok),
    checks,
  };
}
