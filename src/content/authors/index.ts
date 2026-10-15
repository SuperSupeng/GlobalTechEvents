import type { AuthorProfile } from './types';

const authorModules = import.meta.glob('./*.json', {
  eager: true,
  import: 'default',
}) as Record<string, AuthorProfile>;

function fileSlug(modulePath: string): string {
  const fileName = modulePath.split('/').pop() ?? modulePath;
  return fileName.replace(/\.json$/, '');
}

export const AUTHORS: AuthorProfile[] = Object.entries(authorModules)
  .map(([modulePath, author]) => {
    const expected = fileSlug(modulePath);
    if (author.slug !== expected && import.meta.env.DEV) {
      console.warn(`Author slug "${author.slug}" does not match ${modulePath}`);
    }
    return author;
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));

export function listAuthors(): AuthorProfile[] {
  return AUTHORS;
}

export function getAuthorBySlug(slug: string): AuthorProfile | undefined {
  const normalized = slug.toLowerCase();
  return AUTHORS.find((author) => author.slug === normalized);
}

export type { AuthorProfile } from './types';
