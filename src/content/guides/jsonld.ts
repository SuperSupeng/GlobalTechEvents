import type { Guide } from './types';
import { GUIDE_SITE_ORIGIN, absoluteSiteUrl, guideCanonicalUrl } from './site';

export interface GuideJsonLd {
  article: Record<string, unknown>;
  faqPage: Record<string, unknown> | null;
}

function articleAuthor(guide: Guide): Record<string, unknown> {
  if (guide.author.slug && guide.author.url) {
    const person: Record<string, unknown> = {
      '@type': 'Person',
      '@id': `${guide.author.url}#person`,
      name: guide.author.name,
      url: guide.author.url,
      description: guide.author.bio,
    };
    if (guide.author.image) person.image = absoluteSiteUrl(guide.author.image);
    if (guide.author.sameAs && guide.author.sameAs.length > 0) person.sameAs = guide.author.sameAs;
    return person;
  }

  return {
    '@type': 'Organization',
    name: guide.author.name,
    description: guide.author.bio,
  };
}

export function buildGuideJsonLd(guide: Guide): GuideJsonLd {
  const canonical = guideCanonicalUrl(guide.slug);
  const author = articleAuthor(guide);
  const article: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    inLanguage: guide.language,
    dateModified: guide.asOf,
    author,
    publisher: {
      '@type': 'Organization',
      name: 'GlobalTechEvents',
      url: GUIDE_SITE_ORIGIN,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
  };

  if (guide.status === 'published') {
    article.datePublished = guide.asOf;
  }

  const images = [
    ...(guide.coverImage?.src ? [guide.coverImage.src] : []),
    ...(guide.bodyImages ?? []).map((image) => image.src).filter(Boolean),
  ];
  if (images.length > 0) {
    article.image = images.map((src) => absoluteSiteUrl(src));
  }

  const faqPage =
    guide.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: guide.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }
      : null;

  return { article, faqPage };
}

export function mountGuideJsonLd(guide: Guide): void {
  document.querySelectorAll('script[data-gte-guide-schema]').forEach((node) => node.remove());
  const { article, faqPage } = buildGuideJsonLd(guide);
  for (const schema of [article, faqPage]) {
    if (!schema) continue;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.gteGuideSchema = 'true';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }
}

export function setGuideRobots(content: string): void {
  let element = document.querySelector('meta[name="robots"][data-gte-guide-meta]') as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.name = 'robots';
    element.dataset.gteGuideMeta = 'true';
    document.head.appendChild(element);
  }
  element.content = content;
}

export function clearGuideDocumentHooks(): void {
  document.querySelectorAll('script[data-gte-guide-schema]').forEach((node) => node.remove());
  document.querySelector('meta[name="robots"][data-gte-guide-meta]')?.remove();
  const ogType = document.querySelector('meta[property="og:type"]');
  if (ogType) ogType.setAttribute('content', 'website');
}
