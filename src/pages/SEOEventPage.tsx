import React, { useEffect, useMemo } from 'react';
import Logo from '../components/Logo';
import { WHATSAPP_GROUP_URL } from '../config/constants';
import type { SEOEventPageData } from '../data/seoEventPages';
import {
  buildSeoCollectionIcs,
  buildSeoEventJsonLd,
  collectionGoogleCalendarUrl,
  isSeoCollection,
} from '../data/seoEventSchema';
import { recapPathForEvent } from '../content/recaps/pages';
import {
  calendarAction,
  eventFacts,
  eventHeadline,
  eventLede,
  relatedLinks,
  secondaryLinks,
} from '../seo/eventPageDisplay';
import '../seo/eventGuide.css';
import { injectSchema, updateMetaTags } from '../utils/seo';
import { trackAddToCalendar, trackLandingPageView, trackOutboundClick } from '../utils/analytics';
import { downloadICS, getGoogleCalendarUrl } from '../utils/calendar';
import type { TechEvent } from '../types';

interface SEOEventPageProps {
  page: SEOEventPageData;
  onBackHome: () => void;
  onToast?: (message: string) => void;
}

const SEOEventPage: React.FC<SEOEventPageProps> = ({ page, onBackHome, onToast }) => {
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

  const googleCalendarUrl = isSeoCollection(page) ? collectionGoogleCalendarUrl(page) : getGoogleCalendarUrl(calendarEvent);
  const primary = calendarAction(page, googleCalendarUrl);
  const links = secondaryLinks(page, WHATSAPP_GROUP_URL);
  const facts = eventFacts(page);
  const lede = eventLede(page);
  const headline = eventHeadline(page);
  const related = relatedLinks(page);
  const calendarHeading = page.calendarHeading ?? `Add ${page.shortName} to your calendar`;
  const calendarLead = page.calendarLead ?? 'Save the dates, then confirm them on the official site.';
  const recapHref = recapPathForEvent(page.slug);

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

  const trackOfficial = (targetUrl: string, ctaLabel: string) => {
    trackOutboundClick({
      sourcePage: window.location.pathname,
      pageType: 'seo_event_page',
      targetUrl,
      eventSlug: page.slug,
      ctaLabel,
    });
  };

  const trackCalendar = (provider: 'google' | 'ics', ctaLabel: string) => {
    trackAddToCalendar({
      sourcePage: window.location.pathname,
      pageType: 'seo_event_page',
      calendarProvider: provider,
      eventSlug: page.slug,
      ctaLabel,
    });
  };

  const downloadCalendarFile = () => {
    trackCalendar('ics', 'Download .ics');
    if (isSeoCollection(page)) {
      const icsContent = buildSeoCollectionIcs(page);
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${page.slug}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } else {
      downloadICS(calendarEvent);
    }
    onToast?.('Calendar file downloaded!');
  };

  const renderPrimary = () => (
    <div className="primary-block">
      <a
        className="primary"
        href={primary.href}
        target={primary.provider === 'google' ? '_blank' : undefined}
        rel={primary.provider === 'google' ? 'noopener noreferrer' : undefined}
        onClick={() => trackCalendar(primary.provider, primary.trackLabel)}
      >
        {primary.label}
      </a>
      <p className="hint">{primary.hint}</p>
    </div>
  );

  return (
    <div className="event-guide-root">
      <a className="skip" href="#content">Skip to content</a>
      <header className="site-header">
        <div className="header-inner">
          <button type="button" className="brand" onClick={onBackHome}>
            <Logo size={28} />
            GlobalTech<em>Events</em>
          </button>
          <nav className="site-nav" aria-label="Primary">
            <a href="/">Calendar</a>
            <a href="/events">Events</a>
            <a href="/guides">Guides</a>
            <a href="/resources">Resources</a>
          </nav>
        </div>
      </header>
      <div className="page-scroll">
      <main className="page" id="content">
        <nav className="crumb" aria-label="Breadcrumb">
          <a href="/">Calendar</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{page.eventName}</span>
        </nav>
        <h1>{headline}</h1>
        <p className="lede">{lede}</p>
        {recapHref ? (
          <p className="recap-link">
            <a href={recapHref}>Public notes and recap posts</a> from this meeting.
          </p>
        ) : null}
        <dl className={`facts facts-${facts.length}`}>
          {facts.map((fact) => (
            <div className="fact" key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>
                <span className="sr-only">{[fact.primary, fact.secondary, fact.note].filter(Boolean).join(', ')}</span>
                <span aria-hidden="true">
                  {fact.lines ? fact.lines.map((line) => <span className="line" key={line}>{line}</span>) : fact.primary}
                </span>
                {fact.secondary ? <span className="sub" aria-hidden="true">{fact.secondary}</span> : null}
                {fact.note ? <span className="note" aria-hidden="true">{fact.note}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
        <div className="hero-actions">
          {renderPrimary()}
          <ul className="link-row">
            {links.map((link) => (
              <li key={link.label}>
                {link.downloadIcs ? (
                  <button type="button" className="text-link" onClick={downloadCalendarFile}>
                    Download .ics
                  </button>
                ) : (
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    onClick={() => trackOfficial(link.href, link.trackLabel)}
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {page.planning
          ? page.planning.sections.map((section) => (
              <section className="block prose" key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.links && section.links.length > 0 ? (
                  <ul className="link-row">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <a href={link.href} target="_blank" rel="noopener noreferrer" onClick={() => trackOfficial(link.href, link.label)}>
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))
          : null}

        {!page.planning && isSeoCollection(page) ? (
          <section className="block">
            <h2>Cities</h2>
            <ul className="stack stops">
              {page.stops?.map((stop) => (
                <li key={stop.officialUrl}>
                  <a href={stop.officialUrl}>{stop.name}</a>
                  {`. ${stop.detail}`}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {!page.planning ? (
          <section className="block">
            <h2>Who it’s for</h2>
            <ul className="stack">
              {page.whoShouldAttend.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="block">
          <h2>Topics</h2>
          <ul className="topics">
            {page.topics.map((topic) => (
              <li className="topic" key={topic}>{topic}</li>
            ))}
          </ul>
        </section>

        {related.length > 0 ? (
          <section className="block">
            <h2>Also on this calendar</h2>
            <ul className="related-list">
              {related.map((link) => (
                <li key={`${link.href ?? 'text'}:${link.label}`}>
                  {link.href ? <a href={link.href}>{link.label}</a> : <span className="name">{link.label}</span>}
                  {link.note ? <p>{link.note}</p> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="block faq">
          <h2>Common questions</h2>
          {page.faq.map((item) => (
            <article key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </article>
          ))}
        </section>

        <section className="close">
          <h2>{calendarHeading}</h2>
          <p>{calendarLead}</p>
          {renderPrimary()}
          <p className="fine">Confirm the details on the official site before you travel.</p>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <a className="footer-brand" href="/">
              <Logo size={26} />
              GlobalTech<em>Events</em>
            </a>
            <p>One calendar for the major tech events the industry actually tracks.</p>
          </div>
          <nav className="footer-nav" aria-label="Footer">
            <a href="/">Calendar</a>
            <a href="/events">Events</a>
            <a href="/guides">Guides</a>
            <a href="/resources">Resources</a>
            <a href={WHATSAPP_GROUP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </nav>
          <p className="legal">© 2026 GlobalTechEvents</p>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default SEOEventPage;
