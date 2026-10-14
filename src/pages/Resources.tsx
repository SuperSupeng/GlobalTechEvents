import React from 'react';
import { ArrowLeft, Calendar, Globe2 } from 'lucide-react';
import { WHATSAPP_GROUP_URL } from '../config/constants';

interface ResourcesProps {
  onBack: () => void;
}

const Resources: React.FC<ResourcesProps> = ({ onBack }) => {
  const optionalSignals = [
    {
      region: 'China',
      title: 'China milestone feed',
      description:
        'Optional regional signal for major launches and policy notes. The source list is published in Chinese; this page does not reprint those items. Subscribe to the ICS if you want the original feed.',
      subscribeUrl: 'https://www.zhihu.com/api/v4/brand_influence/api/ai-calendar/subscription.ics',
      sourceName: 'Zhihu AI Calendar',
      sourceUrl: 'https://www.zhihu.com/ailab/app/calendar',
    },
    {
      region: 'Global',
      title: 'Global highlights',
      description: 'Cross-border industry moments. A subscribe link will be added when this feed is ready.',
      subscribeUrl: '',
    },
  ];

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
            Industry resources
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-4">
            Resources for tracking major tech events
          </h1>
          <p className="text-white/60 text-base md:text-lg max-w-3xl">
            Follow the unified calendar of globally known tech conferences and industry events.
            Subscribe once, use the Agent-friendly feed, or join WhatsApp. Optional signals below
            are narrower than the calendar and stay in English on this page.
          </p>
        </header>

        <section className="mb-14">
          <h2 className="text-2xl font-semibold mb-4">How to follow</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold">Calendar subscribe</h3>
              <p className="text-white/60 text-sm mt-2">
                Use Subscribe to Calendar on the home page. Your calendar syncs when we add or update listings.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold">Agent feed</h3>
              <p className="text-white/60 text-sm mt-2">
                Structured event data your Agent can read. Open Agent feed in the navigation; the feed URL is not live yet.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
              <h3 className="text-lg font-semibold">WhatsApp</h3>
              <p className="text-white/60 text-sm mt-2">
                Short updates for people who want the calendar in a group chat.
              </p>
              <a
                href={WHATSAPP_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 hover:text-white hover:border-white/30 transition-colors mt-4"
              >
                Join WhatsApp
              </a>
            </div>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl font-semibold mb-4">AI signals (optional)</h2>
          <p className="text-white/55 text-sm mb-6">
            One topic among many. These feeds are not the product, and public notes here are English only.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {optionalSignals.map((calendar) => (
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

        <section className="mb-14">
          <h2 className="text-2xl font-semibold mb-4">References</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold">Reports and benchmarks</h3>
              <p className="text-white/60 text-sm mt-2">
                A growing list of industry reports and evaluations. English notes only.
              </p>
              <p className="text-white/40 text-xs mt-4">Coming soon.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold">Tools and open source</h3>
              <p className="text-white/60 text-sm mt-2">
                Curated tools and repositories tied to events on the calendar.
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
