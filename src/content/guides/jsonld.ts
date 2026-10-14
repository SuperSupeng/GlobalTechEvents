import type { Guide } from './types';
import { GUIDE_SITE_ORIGIN, guideCanonicalUrl } from './site';

export interface GuideJsonLd {
  article: Record<string, unknown>;
  faqPage: Record<string, unknown> | null;
}

export function buildGuideJsonLd(guide: Guide): GuideJsonLd {
  const canonical = guideCanonicalUrl(guide.slug);
  const author: Record<string, unknown> = {
    '@type': 'Person',
    name: guide.author.name,
    description: guide.author.bio,
  };
  if (guide.author.avatar?.src) {
    author.image = guide.author.avatar.src;
  }
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

  if (guide.coverImage?.src) {
    article.image = [guide.coverImage.src];
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
