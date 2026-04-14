import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Mail, Send, Sparkles } from 'lucide-react';
import { submitEventSubmission, submitNewsletterSignup } from '../api/leadForms';
import { SEO_EVENT_PAGES } from '../data/seoEventPages';
import { createEventSlug, trackCustomEvent, trackOutboundClick } from '../utils/analytics';
import { WHATSAPP_GROUP_URL } from '../config/constants';

interface EventsHubPageProps {
  onToast?: (message: string) => void;
}

const inputClassName =
  'w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:border-primary/60';

const EventsHubPage: React.FC<EventsHubPageProps> = ({ onToast }) => {
  const featuredEvents = useMemo(() => SEO_EVENT_PAGES, []);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [newsletterError, setNewsletterError] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');
  const [submitForm, setSubmitForm] = useState({
    name: '',
    email: '',
    eventName: '',
    eventUrl: '',
    notes: '',
  });

  const sourcePage = window.location.pathname;

  const handleWhatsAppClick = () => {
    trackOutboundClick({
      sourcePage,
      pageType: 'events_hub',
      targetUrl: WHATSAPP_GROUP_URL,
      ctaLabel: 'Join WhatsApp',
    });
    window.open(WHATSAPP_GROUP_URL, '_blank', 'noopener,noreferrer');
  };

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterStatus('submitting');
    setNewsletterError('');

    try {
      const result = await submitNewsletterSignup({
        email: newsletterEmail,
        sourcePage,
        pageType: 'events_hub',
      });

      trackCustomEvent('newsletter_signup', {
        source_page: sourcePage,
        page_type: 'events_hub',
        cta_label: 'Events Hub Newsletter Form',
      });

      setNewsletterStatus('success');
      setNewsletterEmail('');
      onToast?.(result.duplicate ? 'You are already on the list.' : 'Newsletter signup saved.');
    } catch (error) {
      setNewsletterStatus('error');
      setNewsletterError(error instanceof Error ? error.message : 'Failed to save newsletter signup.');
    }
  };

  const handleSubmitEvent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitStatus('submitting');
    setSubmitError('');

    try {
      await submitEventSubmission({
        ...submitForm,
        sourcePage,
        pageType: 'events_hub',
      });

      trackCustomEvent('submit_event', {
        source_page: sourcePage,
        page_type: 'events_hub',
        cta_label: 'Events Hub Submit Event Form',
        event_slug: createEventSlug(submitForm.eventName),
      });

      setSubmitStatus('success');
      setSubmitForm({
        name: '',
        email: '',
        eventName: '',
        eventUrl: '',
        notes: '',
      });
      onToast?.('Event submission saved.');
    } catch (error) {
      setSubmitStatus('error');
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit event.');
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-28 pb-20">
      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        <section className="mb-12 glass-panel p-8 sm:p-10">
          <p className="text-primary-light text-xs uppercase tracking-[0.2em] mb-3">Events Hub</p>
          <h1 className="text-4xl sm:text-5xl font-serif italic mb-4 leading-tight">Track top global tech events and join the fastest feedback loop.</h1>
          <p className="text-white/75 text-lg leading-relaxed max-w-3xl mb-8">
            This page now doubles as the minimal conversion hub: real newsletter signups, real event submissions, and outbound clicks tracked to official destinations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleWhatsAppClick} className="btn-primary inline-flex items-center justify-center gap-2">
              Join WhatsApp <ArrowUpRight size={18} />
            </button>
            <a href="#submit-event-form" className="btn-secondary inline-flex items-center justify-center gap-2">
              Submit Event <Send size={18} />
            </a>
            <a href="#newsletter-form" className="btn-secondary inline-flex items-center justify-center gap-2">
              Join Newsletter <Mail size={18} />
            </a>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5 text-white/70 uppercase tracking-[0.2em] text-xs">
            <Sparkles size={14} /> Top 10 SEO Event Guides
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {featuredEvents.map((eventItem) => (
              <article key={eventItem.slug} className="glass-panel p-5 flex flex-col gap-4">
                <div>
                  <p className="text-white/45 text-xs uppercase tracking-[0.18em] mb-2">
                    {eventItem.city} · {eventItem.format}
                  </p>
                  <h2 className="text-xl font-semibold text-white mb-2">{eventItem.eventName}</h2>
                  <p className="text-white/65 text-sm leading-relaxed">{eventItem.metaDescription}</p>
                </div>
                <div className="mt-auto flex flex-col sm:flex-row gap-3">
                  <a
                    href={`/events/${eventItem.slug}`}
                    className="btn-primary inline-flex items-center justify-center gap-2"
                  >
                    View Event Guide <ArrowUpRight size={16} />
                  </a>
                  <button
                    onClick={() => {
                      trackOutboundClick({
                        sourcePage,
                        pageType: 'events_hub',
                        targetUrl: eventItem.officialUrl,
                        eventSlug: eventItem.slug,
                        ctaLabel: 'Top Event Official Website',
                      });
                      window.open(eventItem.officialUrl, '_blank', 'noopener,noreferrer');
                    }}
                    className="btn-secondary inline-flex items-center justify-center gap-2"
                  >
                    Official Website <ArrowUpRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div id="newsletter-form" className="glass-panel p-6 sm:p-8">
            <p className="text-primary-light text-xs uppercase tracking-[0.2em] mb-3">Newsletter Signup</p>
            <h2 className="text-3xl font-serif italic mb-3">Get the weekly signal, not the noise.</h2>
            <p className="text-white/70 leading-relaxed mb-6">Successful submit writes to Supabase through a Vercel Function, then emits the newsletter_signup conversion event.</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                placeholder="you@company.com"
                className={inputClassName}
              />
              <button type="submit" disabled={newsletterStatus === 'submitting'} className="btn-primary w-full disabled:opacity-60">
                {newsletterStatus === 'submitting' ? 'Saving…' : 'Join Newsletter'}
              </button>
            </form>
            {newsletterStatus === 'success' && <p className="mt-4 text-sm text-emerald-300">Saved successfully. This counts as a real conversion event.</p>}
            {newsletterStatus === 'error' && <p className="mt-4 text-sm text-red-300">{newsletterError}</p>}
          </div>

          <div id="submit-event-form" className="glass-panel p-6 sm:p-8">
            <p className="text-primary-light text-xs uppercase tracking-[0.2em] mb-3">Submit Event</p>
            <h2 className="text-3xl font-serif italic mb-3">Add a conference we should track.</h2>
            <p className="text-white/70 leading-relaxed mb-6">This form writes to Supabase through a Vercel Function. Only successful saves emit submit_event.</p>
            <form onSubmit={handleSubmitEvent} className="space-y-4">
              <input type="text" required value={submitForm.name} onChange={(event) => setSubmitForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Your name" className={inputClassName} />
              <input type="email" required value={submitForm.email} onChange={(event) => setSubmitForm((prev) => ({ ...prev, email: event.target.value }))} placeholder="Your email" className={inputClassName} />
              <input type="text" required value={submitForm.eventName} onChange={(event) => setSubmitForm((prev) => ({ ...prev, eventName: event.target.value }))} placeholder="Event name" className={inputClassName} />
              <input type="url" required value={submitForm.eventUrl} onChange={(event) => setSubmitForm((prev) => ({ ...prev, eventUrl: event.target.value }))} placeholder="https://event-site.com" className={inputClassName} />
              <textarea value={submitForm.notes} onChange={(event) => setSubmitForm((prev) => ({ ...prev, notes: event.target.value }))} placeholder="Why this event matters (optional)" rows={4} className={inputClassName} />
              <button type="submit" disabled={submitStatus === 'submitting'} className="btn-primary w-full disabled:opacity-60">
                {submitStatus === 'submitting' ? 'Saving…' : 'Submit Event'}
              </button>
            </form>
            {submitStatus === 'success' && <p className="mt-4 text-sm text-emerald-300">Saved successfully. This counts as a real conversion event.</p>}
            {submitStatus === 'error' && <p className="mt-4 text-sm text-red-300">{submitError}</p>}
          </div>
        </section>
      </main>
    </div>
  );
};

export default EventsHubPage;
