import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Calendar, Globe2 } from 'lucide-react';
import { WHATSAPP_GROUP_URL } from '../config/constants';

interface ResourcesProps {
  onBack: () => void;
}

const Resources: React.FC<ResourcesProps> = ({ onBack }) => {
  const calendars = [
    {
      region: 'China',
      title: 'China AI Milestones',
      description: 'Major AI launches, policies, funding, and breakthroughs.',
      subscribeUrl: 'https://www.zhihu.com/api/v4/brand_influence/api/ai-calendar/subscription.ics',
      sourceName: 'Zhihu AI Calendar',
      sourceUrl: 'https://www.zhihu.com/ailab/app/calendar',
    },
    {
      region: 'Global',
      title: 'Global AI Highlights',
      description: 'Cross-border AI moments and industry-wide shifts.',
      subscribeUrl: '',
    },
  ];
  const chinaCalendar = calendars.find((calendar) => calendar.region === 'China');
  const [zhihuEvents, setZhihuEvents] = useState<Array<{ date: string; title: string; url?: string }>>([]);
  const [zhihuLoading, setZhihuLoading] = useState(false);
  const [zhihuError, setZhihuError] = useState<string | null>(null);

  const parseIcsEvents = (icsText: string) => {
    const blocks = icsText.split('BEGIN:VEVENT').slice(1);
    const events = blocks.map((block) => {
      const dateMatch = block.match(/DTSTART(?:;VALUE=DATE)?:([0-9]{8})/);
      const titleMatch = block.match(/SUMMARY:(.+)/);
      const urlMatch = block.match(/DESCRIPTION:(https?:\/\/\S+)/);
      const rawDate = dateMatch?.[1] ?? '';
      const date =
        rawDate.length === 8
          ? `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`
          : '';
      return {
        date,
        title: titleMatch?.[1]?.trim() ?? '',
        url: urlMatch?.[1],
      };
    });

    return events
      .filter((event) => event.title && event.date)
      .slice(0, 8);
  };

  useEffect(() => {
    if (!chinaCalendar?.subscribeUrl) return;
    let isMounted = true;
    const loadCalendar = async () => {
      setZhihuLoading(true);
      setZhihuError(null);
      try {
        const response = await fetch(chinaCalendar.subscribeUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const text = await response.text();
        const events = parseIcsEvents(text);
        if (isMounted) {
          setZhihuEvents(events);
        }
      } catch (error) {
        if (isMounted) {
          setZhihuError('Unable to load calendar feed. Please subscribe via the link.');
        }
      } finally {
        if (isMounted) {
          setZhihuLoading(false);
        }
      }
    };

    loadCalendar();
    return () => {
      isMounted = false;
    };
  }, [chinaCalendar?.subscribeUrl]);

  const hasZhihuEvents = useMemo(() => zhihuEvents.length > 0, [zhihuEvents.length]);

  return (
    <div className="min-h-screen bg-[#030303] text-white py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-10"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>

        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-medium">
            <Globe2 size={14} />
            Global AI Resources
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-4">
            Global AI Progress, Calendars, and Signals
          </h1>
          <p className="text-white/60 text-base md:text-lg max-w-3xl">
            A curated hub for AI milestones and reliable resources across regions. Start by subscribing
            to regional calendars, and check back as we expand global coverage.
          </p>
        </header>

        <section className="mb-14">
          <h2 className="text-2xl font-semibold mb-4">AI Progress</h2>
          <p className="text-white/55 text-sm mb-6">
            Subscribe to regional AI milestone feeds. Each calendar stays lightweight and focused on
            high-signal events only.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {calendars.map((calendar) => (
              <div
                key={calendar.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-white/40">
                    {calendar.region}
                  </span>
                  <Calendar size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{calendar.title}</h3>
                  <p className="text-white/60 text-sm mt-2">{calendar.description}</p>
                </div>
                {calendar.sourceName && calendar.sourceUrl && (
                  <a
                    href={calendar.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white/50 hover:text-white transition-colors"
                  >
                    Source: {calendar.sourceName}
                  </a>
                )}
                {calendar.subscribeUrl ? (
                  <a
                    href={calendar.subscribeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 hover:text-white hover:border-white/30 transition-colors"
                  >
                    Subscribe calendar
                  </a>
                ) : (
                  <span className="text-xs text-white/40">
                    Subscription link will be added soon.
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {chinaCalendar && (
          <section className="mb-14">
            <h2 className="text-2xl font-semibold mb-4">China AI Milestones</h2>
            <p className="text-white/55 text-sm mb-6">
              We subscribe to the source feed and render recent items. Source: {chinaCalendar.sourceName}.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              {zhihuLoading && (
                <p className="text-white/50 text-sm">Loading calendar feed...</p>
              )}
              {!zhihuLoading && zhihuError && (
                <div className="text-white/50 text-sm">
                  <p>{zhihuError}</p>
                </div>
              )}
              {!zhihuLoading && !zhihuError && hasZhihuEvents && (
                <ul className="space-y-4">
                  {zhihuEvents.map((event) => (
                    <li
                      key={`${event.date}-${event.title}`}
                      className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0"
                    >
                      <p className="text-xs uppercase tracking-widest text-white/40">
                        {event.date}
                      </p>
                      <p className="text-white/80 text-sm mt-2">{event.title}</p>
                      {event.url && (
                        <a
                          href={event.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary-light hover:text-white transition-colors mt-2 inline-block"
                        >
                          View details
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {!zhihuLoading && !zhihuError && !hasZhihuEvents && (
                <p className="text-white/50 text-sm">
                  No events loaded yet. Try subscribing directly or refresh later.
                </p>
              )}
              <div className="mt-6 text-xs text-white/40 flex items-center justify-between gap-4">
                <span>Prefer your calendar app? Subscribe via the ICS link.</span>
                <a
                  href={chinaCalendar.subscribeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-light hover:text-white transition-colors"
                >
                  Open ICS
                </a>
              </div>
            </div>
          </section>
        )}

        <section className="mb-14">
          <h2 className="text-2xl font-semibold mb-4">Best AI Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold">Research & Benchmarks</h3>
              <p className="text-white/60 text-sm mt-2">
                A growing list of reports, evaluations, and trustworthy benchmarks.
              </p>
              <p className="text-white/40 text-xs mt-4">Coming soon.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold">Tools & Open Source</h3>
              <p className="text-white/60 text-sm mt-2">
                Curated tools and repositories shaping the next wave of AI.
              </p>
              <p className="text-white/40 text-xs mt-4">Coming soon.</p>
            </div>
          </div>
        </section>

        <section className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-2">Contribute a resource</h2>
          <p className="text-white/70 text-sm">
            Have a trusted regional feed or resource? Share it with the community in our WhatsApp group.
          </p>
          <a
            href={WHATSAPP_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-primary/40 px-4 py-2 text-sm text-primary-light hover:text-white hover:border-primary/80 transition-colors mt-4"
          >
            Join WhatsApp
          </a>
        </section>
      </div>
    </div>
  );
};

export default Resources;
