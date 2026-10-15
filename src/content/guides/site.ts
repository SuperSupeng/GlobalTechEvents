export const GUIDE_SITE_ORIGIN = 'https://www.globaltechevents.xyz';

export function guidesIndexCanonicalUrl(): string {
  return `${GUIDE_SITE_ORIGIN}/guides`;
}

export function guideCanonicalUrl(slug: string): string {
  return `${GUIDE_SITE_ORIGIN}/guides/${slug}`;
}

export function absoluteSiteUrl(src: string): string {
  return new URL(src, GUIDE_SITE_ORIGIN).href;
}
