import React, { useEffect } from 'react';
import { clearAuthorDocumentHooks, mountAuthorJsonLd } from '../content/authors/jsonld';
import type { AuthorProfile } from '../content/authors/types';
import { absoluteSiteUrl } from '../content/guides/site';
import { updateMetaTags } from '../utils/seo';

interface AuthorPageProps {
  author: AuthorProfile | null;
  slug: string;
  onNavigate: (href: string) => void;
}

function sameAsLabel(href: string): string {
  try {
    const host = new URL(href).hostname.replace(/^www\./, '');
    if (host === 'darren-su.com') return 'darren-su.com';
    if (host === 'x.com') return 'X';
    if (host.endsWith('substack.com')) return 'Substack';
    if (host.endsWith('linkedin.com')) return 'LinkedIn';
    if (host === 'github.com') return 'GitHub';
    return host;
  } catch {
    return href;
  }
}

const AuthorPage: React.FC<AuthorPageProps> = ({ author, slug, onNavigate }) => {
  useEffect(() => {
    if (!author) {
      document.title = 'Author not found | GlobalTechEvents';
      return () => {
        clearAuthorDocumentHooks();
      };
    }

    updateMetaTags({
      title: `${author.name} | GlobalTechEvents`,
      description: `${author.headline} ${author.bio}`,
      keywords: author.knowsAbout.join(', '),
      ogTitle: author.name,
      ogDescription: author.headline,
      ogImage: absoluteSiteUrl(author.avatar.src),
      twitterCard: 'summary',
      canonicalUrl: author.url,
    });
    const ogType = document.querySelector('meta[property="og:type"]');
    if (ogType) ogType.setAttribute('content', 'profile');
    mountAuthorJsonLd(author);

    return () => {
      clearAuthorDocumentHooks();
    };
  }, [author]);

  if (!author) {
    return (
      <div className="min-h-screen bg-[#030303] text-white pt-28 pb-20">
        <main className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-primary-light text-xs uppercase tracking-[0.2em] mb-3">Authors</p>
          <h1 className="text-4xl font-serif italic mb-4">Author not found</h1>
          <p className="text-white/70 mb-8">No author page is published at /authors/{slug}.</p>
          <button type="button" onClick={() => onNavigate('/guides')} className="btn-secondary !px-5 !py-2.5 text-sm">
            Back to Guides
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-28 pb-20">
      <main className="max-w-3xl mx-auto px-4 sm:px-6">
        <p className="text-primary-light text-xs uppercase tracking-[0.2em] mb-3">Author</p>
        <div className="flex items-center gap-4 mb-6">
          <img
            src={author.avatar.src}
            alt={author.avatar.alt}
            className="h-20 w-20 rounded-full object-cover border border-white/10"
          />
          <div>
            <h1 className="text-4xl sm:text-5xl font-serif italic leading-tight">{author.name}</h1>
            <p className="text-white/80 mt-2">{author.headline}</p>
          </div>
        </div>
        <p className="text-lg text-white/80 leading-relaxed mb-8">{author.bio}</p>

        <section className="mb-10" aria-labelledby="author-about">
          <h2 id="author-about" className="text-2xl font-semibold mb-3">
            About
          </h2>
          {author.about.map((paragraph) => (
            <p key={paragraph} className="text-white/75 leading-relaxed mb-3">
              {paragraph}
            </p>
          ))}
        </section>

        <section className="mb-10" aria-labelledby="author-affiliations">
          <h2 id="author-affiliations" className="text-2xl font-semibold mb-3">
            Affiliations
          </h2>
          <ul className="space-y-2 text-white/80">
            {author.affiliations.map((affiliation) => (
              <li key={affiliation.name}>
                {affiliation.url ? (
                  <a href={affiliation.url} className="text-primary-light hover:text-white underline underline-offset-4">
                    {affiliation.name}
                  </a>
                ) : (
                  affiliation.name
                )}
                {affiliation.role ? <span className="text-white/60"> — {affiliation.role}</span> : null}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10" aria-labelledby="author-knows">
          <h2 id="author-knows" className="text-2xl font-semibold mb-3">
            Knows about
          </h2>
          <p className="text-white/75">{author.knowsAbout.join(', ')}</p>
        </section>

        <section className="mb-10" aria-labelledby="author-sameas">
          <h2 id="author-sameas" className="text-2xl font-semibold mb-3">
            Elsewhere
          </h2>
          <ul className="space-y-2">
            {author.sameAs.map((href) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-primary-light hover:text-white underline underline-offset-4"
                  rel="noopener noreferrer"
                >
                  {sameAsLabel(href)}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10" aria-labelledby="author-evidence">
          <h2 id="author-evidence" className="text-2xl font-semibold mb-3">
            Why I write about which week to attend
          </h2>
          <div className="space-y-4">
            {author.evidence.map((item) => (
              <article key={item.href} className="glass-panel p-5">
                <h3 className="text-lg font-medium mb-2">
                  <a
                    href={item.href}
                    className="text-primary-light hover:text-white underline underline-offset-4"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                </h3>
                {item.note ? <p className="text-white/75 leading-relaxed">{item.note}</p> : null}
              </article>
            ))}
          </div>
        </section>

        <section className="mb-10" aria-labelledby="author-guides">
          <h2 id="author-guides" className="text-2xl font-semibold mb-3">
            Guides
          </h2>
          <ul className="space-y-2">
            {author.guides.map((guide) => (
              <li key={guide.href}>
                <a
                  href={guide.href}
                  className="text-primary-light hover:text-white underline underline-offset-4"
                  onClick={(event) => {
                    if (guide.href.startsWith('/')) {
                      event.preventDefault();
                      onNavigate(guide.href);
                    }
                  }}
                >
                  {guide.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default AuthorPage;
