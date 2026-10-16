import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Calendar, ChevronDown, Download, Globe, MapPin, MessageCircle, Tag } from 'lucide-react';
import Logo from '../components/Logo';
import { WHATSAPP_GROUP_URL } from '../config/constants';
import type { SEOEventPageData } from '../data/seoEventPages';
import {
  buildSeoCollectionIcs,
  buildSeoEventJsonLd,
  collectionCalendarNote,
  collectionDateLabel,
  collectionGoogleCalendarUrl,
  collectionLocationLabel,
  formatStopDate,
  isSeoCollection,
} from '../data/seoEventSchema';
import { injectSchema, updateMetaTags } from '../utils/seo';
import { trackAddToCalendar, trackLandingPageView, trackOutboundClick } from '../utils/analytics';
import { downloadICS, getGoogleCalendarUrl } from '../utils/calendar';
import type { TechEvent } from '../types';

interface SEOEventPageProps {
  page: SEOEventPageData;
  onBackHome: () => void;
  onToast?: (message: string) => void;
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return `${fmt(s)} - ${fmt(e)}`;
}

const SEOEventPage: React.FC<SEOEventPageProps> = ({ page, onBackHome, onToast }) => {
  const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);

  const calendarEvent = useMemo<TechEvent>(() => ({
    id: page.slug,
    title: page.eventName,
    summary: page.whyItMatters,
    startTime: `${page.startDate}T09:00:00Z`,
    endTime: `${page.endDate}T18:00:00Z`,
    timezone: 'UTC',
    format: page.format,
    location:
      page.format === 'online'
        ? undefined
        : {
            city: page.city,
            country: page.country,
          },
    tags: page.topics,
    language: ['English'],
    links: {
      officialSite: page.officialUrl,
      registration: page.registrationUrl,
      source: 'seo-event-page',
    },
    organizer: {
      name: page.shortName,
    },
    price: {
      type: 'unknown',
    },
    status: 'upcoming',
  }), [page]);
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

    injectSchema(JSON.stringify(buildSeoEventJsonLd(page)));
  }, [page]);

  useEffect(() => {
    void trackLandingPageView({
      sourcePage: window.location.pathname,
      pageType: 'seo_event_page',
      eventSlug: page.slug,
    });
  }, [page.slug]);

  const handleOfficialClick = (targetUrl: string, ctaLabel: string) => {
    trackOutboundClick({
      sourcePage: window.location.pathname,
      pageType: 'seo_event_page',
      targetUrl,
      eventSlug: page.slug,
      ctaLabel,
    });
  };

  const handleAddToCalendar = (provider: 'google' | 'ics') => {
    trackAddToCalendar({
      sourcePage: window.location.pathname,
      pageType: 'seo_event_page',
      calendarProvider: provider,
      eventSlug: page.slug,
      ctaLabel: `Add to Calendar - ${provider}`,
    });

    if (provider === 'google') {
      const url = isSeoCollection(page) ? collectionGoogleCalendarUrl(page) : getGoogleCalendarUrl(calendarEvent);
      window.open(url, '_blank', 'noopener,noreferrer');
      onToast?.('Opening Google Calendar...');
    } else if (isSeoCollection(page)) {
      const icsContent = buildSeoCollectionIcs(page);
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${page.slug}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      onToast?.('Calendar file downloaded!');
    } else {
      downloadICS(calendarEvent);
      onToast?.('Calendar file downloaded!');
    }

    setShowCalendarDropdown(false);
  };

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

        <section className="glass-panel p-6 sm:p-7 mb-10 border border-primary/20 shadow-[0_0_0_1px_rgba(212,175,55,0.08)]">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-serif italic mb-3">Save this event before you forget it</h2>
              <p className="text-white/70 leading-relaxed">
                Put {page.shortName} on your calendar first, then choose whether to register now or review the official event site.
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-3 mt-6">
            <div className="relative flex-[1.25]">
              <button
                type="button"
                onClick={() => setShowCalendarDropdown((current) => !current)}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Calendar size={18} />
                Add to Calendar
                <ChevronDown size={16} />
              </button>

              {showCalendarDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10">
                  <button
                    type="button"
                    onClick={() => handleAddToCalendar('google')}
                    className="w-full px-4 py-3 text-left text-white/80 hover:bg-white/5 hover:text-white transition-all flex items-center gap-3 text-sm"
                  >
                    <Globe size={16} className="text-blue-400" />
                    Google Calendar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddToCalendar('ics')}
                    className="w-full px-4 py-3 text-left text-white/80 hover:bg-white/5 hover:text-white transition-all flex items-center gap-3 text-sm border-t border-white/5"
                  >
                    <Download size={16} className="text-white/60" />
                    Download .ics
                  </button>
                </div>
              )}
            </div>
            <a
              href={WHATSAPP_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackOutboundClick({
                  sourcePage: window.location.pathname,
                  pageType: 'seo_event_page',
                  targetUrl: WHATSAPP_GROUP_URL,
                  eventSlug: page.slug,
                  ctaLabel: 'Join WhatsApp',
                })
              }
              className="btn-secondary text-center flex-1 inline-flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              Join WhatsApp
            </a>
            {page.registrationUrl && (
              <a
                href={page.registrationUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleOfficialClick(page.registrationUrl!, 'Registration')}
                className="btn-secondary text-center flex-1"
              >
                Registration
              </a>
            )}
            <a
              href={page.officialUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => handleOfficialClick(page.officialUrl, 'Official Website')}
              className="btn-secondary text-center flex-1"
            >
              Official Website
            </a>
          </div>

          <p className="mt-4 text-sm text-white/55">
            {isSeoCollection(page) ? collectionCalendarNote(page) : 'Always confirm details on the official site.'}
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="glass-panel p-5">
            <p className="text-white/50 text-xs uppercase tracking-[0.2em] mb-2">Date</p>
            <p className="flex items-center gap-2 text-white/90">
              <Calendar size={16} /> {isSeoCollection(page) ? collectionDateLabel(page) : formatDateRange(page.startDate, page.endDate)}
            </p>
          </div>
          <div className="glass-panel p-5">
            <p className="text-white/50 text-xs uppercase tracking-[0.2em] mb-2">Location</p>
            <p className="flex items-center gap-2 text-white/90">
              <MapPin size={16} /> {isSeoCollection(page) ? collectionLocationLabel(page) : `${page.city}, ${page.country}`}
            </p>
          </div>
          <div className="glass-panel p-5">
            <p className="text-white/50 text-xs uppercase tracking-[0.2em] mb-2">Format</p>
            <p className="flex items-center gap-2 text-white/90"><Globe size={16} /> {page.format}</p>
          </div>
        </section>

        {isSeoCollection(page) && (
          <section className="mb-10">
            <h2 className="text-2xl font-serif italic mb-4">Printed stops</h2>
            <ul className="list-disc pl-6 text-white/80 space-y-3">
              {page.stops?.map((stop) => (
                <li key={stop.officialUrl}>
                  <a href={stop.officialUrl} className="underline" target="_blank" rel="noreferrer">
                    {stop.name}
                  </a>
                  . {formatStopDate(stop)}. {stop.city}, {stop.country}. {stop.detail}
                </li>
              ))}
            </ul>
            {page.sources && page.sources.length > 0 && (
              <>
                <h2 className="text-2xl font-serif italic mb-4 mt-8">Official pages</h2>
                <ul className="list-disc pl-6 text-white/80 space-y-2">
                  {page.sources.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} className="underline" target="_blank" rel="noreferrer">
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        )}

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
          <h2 className="text-2xl font-serif italic mb-3">Ready?</h2>
          <p className="text-white/70 leading-relaxed">
            Add it to your calendar, then register on the official site.
          </p>
          <p className="text-xs text-white/50 mt-3">
            Last updated: {new Date().toLocaleDateString('en-US')}
          </p>
        </section>
      </main>
    </div>
  );
};

export default SEOEventPage;
