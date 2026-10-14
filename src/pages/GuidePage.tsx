import React, { useEffect } from 'react';
import { evaluateGuidePublishGate } from '../content/guides/publishGate';
import { clearGuideDocumentHooks, mountGuideJsonLd, setGuideRobots } from '../content/guides/jsonld';
import { guideCanonicalUrl } from '../content/guides/site';
import type { Guide, GuideAuthor } from '../content/guides/types';
import { updateMetaTags } from '../utils/seo';

interface GuidePageProps {
  guide: Guide | null;
  slug: string;
  onNavigate: (href: string) => void;
}

const DEFAULT_DRAFT_NOTICE =
  'Draft shell — not a published guide. This page does not rank conferences and does not state dates, prices, or speakers.';

function GuideAuthorByline({ author }: { author: GuideAuthor }) {
  const profileUrl = author.url?.trim() ?? '';
  const portraitClass = 'h-10 w-10 shrink-0 rounded-full object-cover border border-white/15';

  const identity = (
    <>
      {author.avatar?.src ? (
        <img src={author.avatar.src} alt="" width={40} height={40} className={portraitClass} />
      ) : null}
      <span className="min-w-0">
        <span className="block text-[15px] font-medium leading-tight text-white group-hover:text-primary-light">
          {author.name}
          {profileUrl ? <span className="sr-only"> (opens in a new tab)</span> : null}
        </span>
        <span className="mt-0.5 block text-sm font-normal leading-snug text-white/60">{author.bio}</span>
      </span>
    </>
  );

  return (
    <section className="mb-8" aria-label="Author">
      {author.placeholder && (
        <p className="text-xs uppercase tracking-[0.14em] text-amber-200/90 mb-2">
          Placeholder author — not a published byline
        </p>
      )}
      {profileUrl ? (
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex max-w-full items-center gap-3 rounded-2xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {identity}
        </a>
      ) : (
        <div className="flex max-w-full items-center gap-3">
          {author.avatar?.src ? (
            <img
              src={author.avatar.src}
              alt={author.avatar.alt || author.name}
              width={40}
              height={40}
              className={portraitClass}
            />
          ) : null}
          <div className="min-w-0">
            <p className="text-[15px] font-medium leading-tight text-white">{author.name}</p>
            <p className="mt-0.5 text-sm leading-snug text-white/60">{author.bio}</p>
          </div>
        </div>
      )}
    </section>
  );
}

const GuidePage: React.FC<GuidePageProps> = ({ guide, slug, onNavigate }) => {
  const gate = guide ? evaluateGuidePublishGate(guide) : null;

  useEffect(() => {
    if (!guide) {
      document.title = 'Guide not found | GlobalTechEvents';
      setGuideRobots('noindex, nofollow');
      return () => {
        clearGuideDocumentHooks();
      };
    }

    updateMetaTags({
      title: guide.seoTitle,
      description: guide.description,
      keywords: guide.primaryKeyword ?? 'tech event guides',
      ogTitle: guide.title,
      ogDescription: guide.description,
      ogImage: guide.coverImage?.src,
      twitterCard: guide.coverImage?.src ? 'summary_large_image' : 'summary',
      canonicalUrl: guideCanonicalUrl(guide.slug),
    });
    const ogType = document.querySelector('meta[property="og:type"]');
    if (ogType) ogType.setAttribute('content', 'article');
    setGuideRobots(gate?.indexable ? 'index, follow' : 'noindex, nofollow');
    mountGuideJsonLd(guide);

    return () => {
      clearGuideDocumentHooks();
    };
  }, [guide, gate?.indexable]);

  if (!guide || !gate) {
    return (
      <div className="min-h-screen bg-[#030303] text-white pt-28 pb-20">
        <main className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-primary-light text-xs uppercase tracking-[0.2em] mb-3">Guides</p>
          <h1 className="text-4xl font-serif italic mb-4">Guide not found</h1>
          <p className="text-white/70 mb-8">No guide is published at /guides/{slug}.</p>
          <button type="button" onClick={() => onNavigate('/guides')} className="btn-secondary !px-5 !py-2.5 text-sm">
            Back to Guides
          </button>
        </main>
      </div>
    );
  }

  const notice = guide.shellNotice || (guide.status === 'draft' ? DEFAULT_DRAFT_NOTICE : '');

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-28 pb-20">
      <main className="max-w-3xl mx-auto px-4 sm:px-6">
        <article>
          {notice && (
            <p className="mb-6 rounded-2xl border border-amber-200/30 bg-amber-200/10 px-4 py-3 text-sm text-amber-50">
              {notice}
            </p>
          )}

          <p className="text-primary-light text-xs uppercase tracking-[0.2em] mb-3">
            {guide.template === 'compare' ? 'Compare guide' : 'Roundup guide'}
            {gate.indexable ? '' : ' · draft shell'}
          </p>
          <h1 className="text-4xl sm:text-5xl font-serif italic leading-tight mb-4">{guide.title}</h1>
          <p className="text-white/80 mb-8">
            <span className="font-medium text-white">As of {guide.asOf}</span>
          </p>

          <GuideAuthorByline author={guide.author} />

          <p className="text-lg text-white/80 leading-relaxed mb-8">{guide.description}</p>

          {guide.coverImage?.src ? (
            <img
              src={guide.coverImage.src}
              alt={guide.coverImage.alt}
              className="w-full rounded-2xl mb-10 border border-white/10"
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 px-5 py-8 mb-10 text-sm text-white/55">
              Cover image slot. A cover with alt text is required before this guide can be published.
            </div>
          )}

          {guide.sections.map((section) => (
            <section key={section.id} className="mb-10" aria-labelledby={`section-${section.id}`}>
              <h2 id={`section-${section.id}`} className="text-2xl font-semibold mb-3">
                {section.heading}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="text-white/75 leading-relaxed mb-3">
                  {paragraph}
                </p>
              ))}
              {section.id === 'comparison-table' && guide.comparisonTable && (
                <div className="overflow-x-auto rounded-2xl border border-white/10">
                  <table className="w-full text-sm text-left">
                    <caption className="text-left text-white/55 px-4 py-3">{guide.comparisonTable.caption}</caption>
                    <thead className="bg-white/5 text-white/80">
                      <tr>
                        {guide.comparisonTable.columns.map((column) => (
                          <th key={column} scope="col" className="px-3 py-2 font-medium whitespace-nowrap">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {guide.comparisonTable.rows.length === 0 ? (
                        <tr>
                          <td className="px-3 py-4 text-white/55" colSpan={guide.comparisonTable.columns.length}>
                            No rows yet. This table is a column template, not a published comparison.
                          </td>
                        </tr>
                      ) : (
                        guide.comparisonTable.rows.map((row, rowIndex) => (
                          <tr key={`${section.id}-row-${rowIndex}`} className="border-t border-white/10">
                            {guide.comparisonTable?.columns.map((column, columnIndex) => (
                              <td key={`${column}-${rowIndex}`} className="px-3 py-3 text-white/80 align-top">
                                {row[columnIndex] ?? ''}
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              {section.subsections && section.subsections.length > 0 && (
                <div className="mt-4 space-y-4">
                  {section.subsections.map((subsection) => (
                    <div key={subsection.heading}>
                      <h3 className="text-lg font-medium mb-1">{subsection.heading}</h3>
                      {subsection.paragraphs?.map((paragraph) => (
                        <p key={paragraph} className="text-white/70 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}

          {(guide.bodyImages?.length ?? 0) > 0 ? (
            <section className="mb-10" aria-labelledby="guide-figures">
              <h2 id="guide-figures" className="text-2xl font-semibold mb-4">
                Figures
              </h2>
              <div className="space-y-6">
                {guide.bodyImages?.map((image) => (
                  <figure key={image.src}>
                    <img src={image.src} alt={image.alt} className="w-full rounded-2xl border border-white/10" />
                  </figure>
                ))}
              </div>
            </section>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 px-5 py-6 mb-10 text-sm text-white/55">
              Body image slot. At least one in-body image with alt text is required before publish.
            </div>
          )}

          <section className="mb-10" aria-labelledby="guide-faq">
            <h2 id="guide-faq" className="text-2xl font-semibold mb-4">
              FAQ
            </h2>
            <div className="space-y-4">
              {guide.faq.map((item) => (
                <article key={item.question} className="glass-panel p-5">
                  <h3 className="text-lg font-medium mb-2">{item.question}</h3>
                  <p className="text-white/75 leading-relaxed">{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mb-10" aria-labelledby="guide-related">
            <h2 id="guide-related" className="text-2xl font-semibold mb-4">
              Related guides and calendar
            </h2>
            <ul className="space-y-2">
              {guide.internalLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-primary-light hover:text-white underline underline-offset-4"
                    onClick={(event) => {
                      if (link.href.startsWith('/')) {
                        event.preventDefault();
                        onNavigate(link.href);
                      }
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {!gate.indexable && (
            <section className="glass-panel p-6" aria-labelledby="guide-gate">
              <h2 id="guide-gate" className="text-xl font-semibold mb-2">
                Publish gate
              </h2>
              <p className="text-white/65 text-sm mb-4">
                This URL stays noindex until every item passes. The list is the publishing checklist, not article copy.
              </p>
              <ul className="space-y-2 text-sm">
                {gate.checks.map((check) => (
                  <li key={check.id} className="flex gap-3">
                    <span className={check.ok ? 'text-emerald-300' : 'text-amber-200'}>{check.ok ? 'Ready' : 'Needed'}</span>
                    <span className="text-white/80">{check.label}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </main>
    </div>
  );
};

export default GuidePage;
