import { getSEOEventPageByPath, type SEOEventPageData } from '../data/seoEventPages';

export type AppPage =
  | 'home'
  | 'privacy'
  | 'terms'
  | 'resources'
  | 'seoEvent'
  | 'eventsHub'
  | 'guidesIndex'
  | 'guide'
  | 'author';

export type ResolvedAppRoute =
  | { page: 'home' | 'privacy' | 'terms' | 'resources' | 'eventsHub' | 'guidesIndex' }
  | { page: 'guide'; slug: string }
  | { page: 'author'; slug: string }
  | { page: 'seoEvent'; seoEventPage: SEOEventPageData };

export function resolveAppRoute(pathname: string): ResolvedAppRoute {
  if (pathname === '/privacy') return { page: 'privacy' };
  if (pathname === '/terms') return { page: 'terms' };
  if (pathname === '/resources') return { page: 'resources' };
  if (pathname === '/events' || pathname === '/events/') return { page: 'eventsHub' };
  if (pathname === '/guides' || pathname === '/guides/') return { page: 'guidesIndex' };

  const guideMatch = pathname.match(/^\/guides\/([a-z0-9-]+)\/?$/i);
  if (guideMatch) return { page: 'guide', slug: guideMatch[1].toLowerCase() };

  const authorMatch = pathname.match(/^\/authors\/([a-z0-9-]+)\/?$/i);
  if (authorMatch) return { page: 'author', slug: authorMatch[1].toLowerCase() };

  const seoEventPage = getSEOEventPageByPath(pathname);
  if (seoEventPage) return { page: 'seoEvent', seoEventPage };

  return { page: 'home' };
}
