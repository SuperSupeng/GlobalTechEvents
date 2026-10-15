import type { AuthorProfile } from './types';
import { absoluteSiteUrl } from '../guides/site';

export function authorPersonId(author: Pick<AuthorProfile, 'url'>): string {
  return `${author.url}#person`;
}

export function buildAuthorJsonLd(author: AuthorProfile): Record<string, unknown> {
  const jobTitle = author.affiliations
    .filter((affiliation) => affiliation.role)
    .map((affiliation) => `${affiliation.role}, ${affiliation.name}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': authorPersonId(author),
    name: author.name,
    url: author.url,
    image: absoluteSiteUrl(author.avatar.src),
    description: author.bio,
    sameAs: author.sameAs,
    ...(jobTitle.length > 0 ? { jobTitle } : {}),
    worksFor: author.affiliations.map((affiliation) => ({
      '@type': 'Organization',
      name: affiliation.name,
      ...(affiliation.url ? { url: affiliation.url } : {}),
    })),
    knowsAbout: author.knowsAbout,
  };
}

export function mountAuthorJsonLd(author: AuthorProfile): void {
  document.querySelectorAll('script[data-gte-author-schema]').forEach((node) => node.remove());
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.dataset.gteAuthorSchema = 'true';
  script.text = JSON.stringify(buildAuthorJsonLd(author));
  document.head.appendChild(script);
}

export function clearAuthorDocumentHooks(): void {
  document.querySelectorAll('script[data-gte-author-schema]').forEach((node) => node.remove());
}
