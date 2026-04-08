import React, { useEffect } from 'react';
import { ArrowLeft, Calendar, Globe, MapPin, Tag } from 'lucide-react';
import Logo from '../components/Logo';
import type { SEOEventPageData } from '../data/seoEventPages';
import { injectSchema, updateMetaTags } from '../utils/seo';

interface SEOEventPageProps {
  page: SEOEventPageData;
  onBackHome: () => void;
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return `${fmt(s)} - ${fmt(e)}`;
}

const SEOEventPage: React.FC<SEOEventPageProps> = ({ page, onBackHome }) => {
  useEffect(() => {
    updateMetaTags({
      title: page.seoTitle,
      description: page.metaDescription,
      keywords: [page.primaryKeyword, ...page.secondaryKeywords, ...page.topics].join(', '),
      ogTitle: page.seoTitle,
      ogDescription: page.metaDescription,
      twitterCard: 'summary',
      canonicalUrl: `https://www.globaltechevents.xyz/events/${page.slug}`,
    });

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: page.eventName,
      startDate: `${page.startDate}T09:00:00Z`,
      endDate: `${page.endDate}T18:00:00Z`,
      eventAttendanceMode:
        page.format === 'online'
          ? 'https://schema.org/OnlineEventAttendanceMode'
          : page.format === 'hybrid'
          ? 'https://schema.org/MixedEventAttendanceMode'
          : 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location:
        page.format === 'online'
          ? {
              '@type': 'VirtualLocation',
              url: page.officialUrl,
            }
          : {
              '@type': 'Place',
              name: `${page.city}, ${page.country}`,
              address: {
                '@type': 'PostalAddress',
                addressLocality: page.city,
                addressCountry: page.country,
              },
            },
      organizer: {
        '@type': 'Organization',
        name: page.shortName,
        url: page.officialUrl,
      },
      url: `https://www.globaltechevents.xyz/events/${page.slug}`,
      description: page.metaDescription,
      keywords: [page.primaryKeyword, ...page.secondaryKeywords].join(', '),
    };

    injectSchema(JSON.stringify(schema));
  }, [page]);

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <button onClick={onBackHome} className="inline-flex items-center gap-2 text-white/80 hover:text-white">
            <ArrowLeft size={16} />
            Back to Calendar
          </button>
          <div className="flex items-center gap-2 text-white/80">
            <Logo size={24} />
            <span className="text-sm">GlobalTechEvents</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <p className="text-primary-light text-xs uppercase tracking-[0.2em] mb-3">Tech Event Guide</p>
        <h1 className="text-4xl sm:text-5xl font-serif italic mb-5 leading-tight">{page.eventName}: Dates, Location & Event Guide</h1>
        <p className="text-white/75 text-lg leading-relaxed mb-8">{page.whyItMatters}</p>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="glass-panel p-5">
            <p className="text-white/50 text-xs uppercase tracking-[0.2em] mb-2">Date</p>
            <p className="flex items-center gap-2 text-white/90"><Calendar size={16} /> {formatDateRange(page.startDate, page.endDate)}</p>
          </div>
          <div className="glass-panel p-5">
            <p className="text-white/50 text-xs uppercase tracking-[0.2em] mb-2">Location</p>
            <p className="flex items-center gap-2 text-white/90"><MapPin size={16} /> {page.city}, {page.country}</p>
          </div>
          <div className="glass-panel p-5">
            <p className="text-white/50 text-xs uppercase tracking-[0.2em] mb-2">Format</p>
            <p className="flex items-center gap-2 text-white/90"><Globe size={16} /> {page.format}</p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-serif italic mb-4">Who should attend</h2>
          <ul className="list-disc pl-6 text-white/80 space-y-2">
            {page.whoShouldAttend.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-serif italic mb-4">Topics to watch</h2>
          <div className="flex flex-wrap gap-2">
            {page.topics.map((topic) => (
              <span key={topic} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/80">
                <Tag size={14} />
                {topic}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-serif italic mb-4">FAQ</h2>
          <div className="space-y-4">
            {page.faq.map((item) => (
              <div key={item.q} className="glass-panel p-5">
                <h3 className="text-lg font-semibold mb-2 not-italic font-sans">{item.q}</h3>
                <p className="text-white/75 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel p-6">
          <h2 className="text-2xl font-serif italic mb-3">Official links</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={page.officialUrl} target="_blank" rel="noreferrer" className="btn-primary text-center">
              Official Website
            </a>
            {page.registrationUrl && (
              <a href={page.registrationUrl} target="_blank" rel="noreferrer" className="btn-secondary text-center">
                Registration
              </a>
            )}
          </div>
          <p className="text-xs text-white/50 mt-3">
            Last updated: {new Date().toLocaleDateString('en-US')}
          </p>
        </section>
      </main>
    </div>
  );
};

export default SEOEventPage;
