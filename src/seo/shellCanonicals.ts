export const SITE_ORIGIN = 'https://www.globaltechevents.xyz';

export const HOME_CANONICAL_HREF = `${SITE_ORIGIN}/`;

export type SpaShellRoute = {
  path: '/privacy' | '/terms' | '/resources';
  href: string;
  title: string;
  description: string;
};

export const SPA_SHELL_ROUTES: readonly SpaShellRoute[] = [
  {
    path: '/privacy',
    href: `${SITE_ORIGIN}/privacy`,
    title: 'Privacy Policy - GlobalTechEvents',
    description:
      'This Privacy Policy explains how we collect, use, and safeguard your information when you use our website.',
  },
  {
    path: '/terms',
    href: `${SITE_ORIGIN}/terms`,
    title: 'Terms of Service - GlobalTechEvents',
    description:
      'By accessing and using GlobalTechEvents ("the Service"), you accept and agree to be bound by these Terms of Service.',
  },
  {
    path: '/resources',
    href: `${SITE_ORIGIN}/resources`,
    title: 'Resources for tracking major tech events | GlobalTechEvents',
    description: 'Follow the unified calendar of globally known tech conferences and industry events.',
  },
];

export function canonicalHrefForPath(pathname: string): string | null {
  const path = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  if (path === '/' || path === '') return HOME_CANONICAL_HREF;
  const route = SPA_SHELL_ROUTES.find((item) => item.path === path);
  return route?.href ?? null;
}
