import React, { useEffect } from 'react';
import { evaluateGuidePublishGate } from '../content/guides/publishGate';
import { clearGuideDocumentHooks, setGuideRobots } from '../content/guides/jsonld';
import { guidesIndexCanonicalUrl } from '../content/guides/site';
import type { Guide } from '../content/guides/types';
import { updateMetaTags } from '../utils/seo';

interface GuidesIndexPageProps {
  guides: Guide[];
  onOpenGuide: (slug: string) => void;
}

const GuidesIndexPage: React.FC<GuidesIndexPageProps> = ({ guides, onOpenGuide }) => {
  useEffect(() => {
    updateMetaTags({
      title: 'Guides | GlobalTechEvents',
      description:
        'Evergreen compare and best-of guides for major tech events. Draft shells are labeled and are not published rankings.',
      keywords: 'tech event guides, conference comparison guides, GlobalTechEvents',
      ogTitle: 'Guides | GlobalTechEvents',
      ogDescription:
        'Evergreen compare and best-of guides for major tech events. Draft shells are labeled and are not published rankings.',
      twitterCard: 'summary',
      canonicalUrl: guidesIndexCanonicalUrl(),
    });
    setGuideRobots('index, follow');
    return () => {
      clearGuideDocumentHooks();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-28 pb-20">
      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        <header className="mb-10 max-w-3xl">
          <p className="text-primary-light text-xs uppercase tracking-[0.2em] mb-3">Guides</p>
          <h1 className="text-4xl sm:text-5xl font-serif italic mb-4 leading-tight">Guides</h1>
          <p className="text-white/75 text-lg leading-relaxed">
            Evergreen compare and best-of pages for major tech events. A draft shell can sit here while the article is still being written. Drafts are not published rankings.
          </p>
        </header>

        {guides.length === 0 ? (
          <section className="glass-panel p-8">
            <h2 className="text-2xl font-semibold mb-2">No guides yet</h2>
            <p className="text-white/70">
              New guides show up here after a content file is added. Nothing on this page is a ranking.
            </p>
          </section>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((guide) => {
              const gate = evaluateGuidePublishGate(guide);
              const isDraft = !gate.indexable;
              return (
                <li key={guide.slug}>
                  <article className="glass-panel p-6 h-full flex flex-col">
                    <p className="text-xs uppercase tracking-[0.16em] text-amber-200/90 mb-3">
                      {isDraft ? 'Draft shell · not a published ranking' : 'Published guide'}
                    </p>
                    <h2 className="text-2xl font-serif italic leading-snug mb-3">{guide.title}</h2>
                    <p className="text-white/60 text-sm mb-3">As of {guide.asOf}</p>
                    <p className="text-white/75 leading-relaxed mb-6 flex-1">{guide.description}</p>
                    <button
                      type="button"
                      onClick={() => onOpenGuide(guide.slug)}
                      className="btn-secondary !px-5 !py-2.5 text-sm self-start"
                    >
                      {isDraft ? 'Open draft shell' : 'Read guide'}
                    </button>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
};

export default GuidesIndexPage;
