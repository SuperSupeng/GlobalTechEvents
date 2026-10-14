import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';
import { Zap, ChevronDown, Loader2, MessageCircle, Rss } from 'lucide-react';
import { TechEvent, ViewMode } from './types';
import { useEvents, useLocations } from './hooks/useEvents';
import Calendar from './components/Calendar';
import WeekView from './components/WeekView';
import ListView from './components/ListView';
import EventDetail from './components/EventDetail';
import FilterPanel from './components/FilterPanel';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ComingSoon from './components/ComingSoon';
import Toast from './components/Toast';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Resources from './pages/Resources';
import SEOEventPage from './pages/SEOEventPage';
import EventsHubPage from './pages/EventsHubPage';
import { getSEOEventPageByPath, type SEOEventPageData } from './data/seoEventPages';
import QuickFilters from './components/QuickFilters';
import FeaturedEvents from './components/FeaturedEvents';
import SubscribeModal from './components/SubscribeModal';
import { useToast } from './hooks/useToast';
import { formatCalendarFollowers, useCalendarFollowers } from './hooks/useCalendarFollowers';
import { CALENDAR_SUBSCRIBERS_LABEL, WHATSAPP_GROUP_URL } from './config/constants';
import { trackOutboundClick } from './utils/analytics';

const App: React.FC = () => {
  const getInitialRoute = (): {
    page: 'home' | 'privacy' | 'terms' | 'resources' | 'seoEvent' | 'eventsHub';
    seoEventPage: SEOEventPageData | null;
  } => {
    const path = window.location.pathname;
    if (path === '/privacy') return { page: 'privacy', seoEventPage: null };
    if (path === '/terms') return { page: 'terms', seoEventPage: null };
    if (path === '/resources') return { page: 'resources', seoEventPage: null };
    if (path === '/events' || path === '/events/') return { page: 'eventsHub', seoEventPage: null };

    const seoEventPage = getSEOEventPageByPath(path);
    if (seoEventPage) return { page: 'seoEvent', seoEventPage };

    return { page: 'home', seoEventPage: null };
  };

  const initialRoute = getInitialRoute();

  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState<string>('');
  const [formatFilter, setFormatFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<TechEvent | null>(null);
  const [comingSoonFeature, setComingSoonFeature] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'privacy' | 'terms' | 'resources' | 'seoEvent' | 'eventsHub'>(initialRoute.page);
  const [seoEventPage, setSeoEventPage] = useState<SEOEventPageData | null>(initialRoute.seoEventPage);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  const { toasts, removeToast, success } = useToast();
  const calendarRef = useRef<HTMLDivElement>(null);

  const scrollToCalendar = () => {
    calendarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setViewMode('month');
  };

  const navigateToPrivacy = () => {
    setCurrentPage('privacy');
    window.history.pushState({}, '', '/privacy');
    window.scrollTo(0, 0);
    document.title = 'Privacy Policy - GlobalTechEvents';
  };

  const navigateToTerms = () => {
    setCurrentPage('terms');
    window.history.pushState({}, '', '/terms');
    window.scrollTo(0, 0);
    document.title = 'Terms of Service - GlobalTechEvents';
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    setSeoEventPage(null);
    window.history.pushState({}, '', '/');
    window.scrollTo(0, 0);
    document.title = 'GlobalTechEvents - Your Gateway to Tech Events Worldwide';
  };

  const navigateToHomeAndScrollToCalendar = () => {
    navigateToHome();
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(scrollToCalendar);
    });
  };

  const navigateToResources = () => {
    setCurrentPage('resources');
    setSeoEventPage(null);
    window.history.pushState({}, '', '/resources');
    window.scrollTo(0, 0);
    document.title = 'Resources - GlobalTechEvents';
  };

  const navigateToEventsHub = () => {
    setCurrentPage('eventsHub');
    setSeoEventPage(null);
    window.history.pushState({}, '', '/events');
    window.scrollTo(0, 0);
    document.title = 'Tech Events Directory | GlobalTechEvents';
  };

  const openWhatsApp = (ctaLabel: string, pageType: string) => {
    trackOutboundClick({
      sourcePage: window.location.pathname,
      pageType,
      targetUrl: WHATSAPP_GROUP_URL,
      ctaLabel,
    });
    window.open(WHATSAPP_GROUP_URL, '_blank', 'noopener,noreferrer');
  };

  const {
    data: events = [],
    isLoading: eventsLoading,
    isFetching: eventsFetching,
    error: eventsError,
  } = useEvents({
    search: searchQuery,
    tag: tagFilter || undefined,
    format: formatFilter as any,
    location: locationFilter,
  });

  const { data: allLocations = [] } = useLocations();
  const calendarFollowers = useCalendarFollowers(currentPage === 'home');

  const calendarSubscriberProof = (className: string) => {
    if (calendarFollowers === null) return null;

    return (
      <p className={className}>
        <span className="font-medium text-white/90 tabular-nums">{formatCalendarFollowers(calendarFollowers)}</span>
        {' '}
        {CALENDAR_SUBSCRIBERS_LABEL}
      </p>
    );
  };

  const filteredEvents = useMemo(() => events, [events]);

  React.useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/privacy') {
        setCurrentPage('privacy');
        setSeoEventPage(null);
      } else if (path === '/terms') {
        setCurrentPage('terms');
        setSeoEventPage(null);
      } else if (path === '/resources') {
        setCurrentPage('resources');
        setSeoEventPage(null);
      } else if (path === '/events' || path === '/events/') {
        setCurrentPage('eventsHub');
        setSeoEventPage(null);
      } else {
        const nextSEOEventPage = getSEOEventPageByPath(path);
        if (nextSEOEventPage) {
          setCurrentPage('seoEvent');
          setSeoEventPage(nextSEOEventPage);
        } else {
          setCurrentPage('home');
          setSeoEventPage(null);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const splitText = (text: string) => {
    return text.split(' ').map((word, wordIndex) => (
      <span key={`word-${wordIndex}`} className="inline-block mr-3 last:mr-0">
        {word.split('').map((char, charIndex) => (
          <span key={`char-${wordIndex}-${charIndex}`} className="char-hover">
            {char}
          </span>
        ))}
      </span>
    ));
  };

  if (currentPage === 'privacy') {
    return <PrivacyPolicy onBack={navigateToHome} />;
  }

  if (currentPage === 'terms') {
    return <TermsOfService onBack={navigateToHome} />;
  }

  if (currentPage === 'resources') {
    return <Resources onBack={navigateToHome} />;
  }

  if (currentPage === 'eventsHub') {
    return (
      <>
        <Navbar
          onExploreClick={navigateToHomeAndScrollToCalendar}
          onResourcesClick={navigateToResources}
          onSubmitClick={navigateToEventsHub}
          onEventsHubClick={navigateToEventsHub}
        />
        <EventsHubPage onToast={success} />
        <Footer
          onCalendarClick={navigateToHomeAndScrollToCalendar}
          onEventsClick={navigateToEventsHub}
          onNewsletterClick={navigateToEventsHub}
          onAPIClick={() => setComingSoonFeature('API Access')}
          onSubmitClick={navigateToEventsHub}
          onSponsorshipsClick={() => setComingSoonFeature('Sponsorships')}
          onWhatsAppClick={() => openWhatsApp('Footer WhatsApp', 'events_hub')}
          onPrivacyClick={navigateToPrivacy}
          onTermsClick={navigateToTerms}
        />
        <ComingSoon
          isOpen={comingSoonFeature !== null}
          onClose={() => setComingSoonFeature(null)}
          feature={comingSoonFeature || undefined}
        />
        <Toast toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  if (currentPage === 'seoEvent' && seoEventPage) {
    return <SEOEventPage page={seoEventPage} onBackHome={navigateToHome} onToast={success} />;
  }

  return (
    <div className="min-h-screen relative" style={{ overflow: 'visible' }}>
      <div className="shader-bg-container" style={{ pointerEvents: 'none', touchAction: 'none' }}>
        <ShaderGradientCanvas
          style={{
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            touchAction: 'none',
            userSelect: 'none',
          } as React.CSSProperties}
        >
          <ShaderGradient
            control="query"
            urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.55&cAzimuthAngle=180&cDistance=3.6&cPolarAngle=90&cameraZoom=1&color1=%23ff7a18&color2=%23ffd8a8&color3=%23f2e7ff&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=24&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=0.9&positionX=-1.4&positionY=0&positionZ=0&range=disabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=10&rotationZ=50&shader=defaults&type=plane&uAmplitude=1&uDensity=1.3&uFrequency=5.5&uSpeed=0.28&uStrength=4&uTime=0&wireframe=false"
          />
        </ShaderGradientCanvas>
        <div className="absolute inset-0 bg-black/15 pointer-events-none" style={{ touchAction: 'none' }} />
      </div>

      <Navbar
        onExploreClick={scrollToCalendar}
        onResourcesClick={navigateToResources}
        onSubmitClick={navigateToEventsHub}
        onEventsHubClick={navigateToEventsHub}
      />

      <main className="relative z-10">
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-24 pb-12 relative z-10 w-full">
          <div className="text-center max-w-4xl mx-auto w-full px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-medium mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              2026 Global tech events now open for subscription
            </motion.div>

            <h1
              className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-serif italic mb-6 sm:mb-8 leading-[1.05] text-white relative z-10"
              onMouseMove={(event) => {
                const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
                const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
                event.currentTarget.style.setProperty('--glow-x', `${x * 30}px`);
                event.currentTarget.style.setProperty('--glow-y', `${y * 30}px`);
                event.currentTarget.style.setProperty('--tilt-x', `${y * -2}deg`);
                event.currentTarget.style.setProperty('--tilt-y', `${x * 2}deg`);
                event.currentTarget.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
                event.currentTarget.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.setProperty('--glow-x', '0px');
                event.currentTarget.style.setProperty('--glow-y', '0px');
                event.currentTarget.style.setProperty('--tilt-x', '0deg');
                event.currentTarget.style.setProperty('--tilt-y', '0deg');
                event.currentTarget.style.setProperty('--mx', '50%');
                event.currentTarget.style.setProperty('--my', '50%');
              }}
            >
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}>
                {splitText("The World's")}
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }} className="hero-accent block">
                {splitText('Tech Events')} <span className="font-sans italic">{splitText('Matrix')}</span>
              </motion.div>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-12 font-sans px-4 [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]"
            >
              Your gateway to the world's tech events. Conferences, hackathons, meetups—all in one calendar, across every timezone.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col items-center mb-16 sm:mb-0"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full">
                <button onClick={scrollToCalendar} className="btn-primary flex items-center gap-2 w-full sm:w-auto">
                  View Calendar <Zap size={18} />
                </button>
                <button
                  onClick={() => openWhatsApp('Hero Join WhatsApp', 'home')}
                  className="btn-secondary flex items-center gap-2 w-full sm:w-auto group"
                >
                  <MessageCircle size={18} className="group-hover:rotate-12 transition-transform" />
                  Join WhatsApp
                </button>
              </div>
              {calendarSubscriberProof('mt-5 text-sm text-white/70 [text-shadow:0_2px_12px_rgba(0,0,0,0.45)]')}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute bottom-4 sm:bottom-12 left-0 right-0 mx-auto flex flex-col items-center gap-1 sm:gap-2 text-white/70 hover:text-white transition-colors cursor-pointer w-fit"
            onClick={scrollToCalendar}
          >
            <span className="text-xs font-medium uppercase tracking-widest mb-1 whitespace-nowrap">View Calendar</span>
            <ChevronDown size={20} className="sm:w-6 sm:h-6 animate-bounce" />
          </motion.div>
        </section>

        <div ref={calendarRef} className="relative z-20 content-section max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-32 sm:pb-40">
          <QuickFilters
            onFilterClick={(searchTerm) => {
              setSearchQuery(searchTerm);
              setTagFilter('');
            }}
            onTagFilterClick={(tag) => {
              setTagFilter(tag);
              setSearchQuery('');
            }}
          />

          <FilterPanel
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              setTagFilter('');
            }}
            formatFilter={formatFilter}
            onFormatChange={setFormatFilter}
            locationFilter={locationFilter}
            onLocationChange={setLocationFilter}
            allLocations={allLocations}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onClearFilters={() => {
              setSearchQuery('');
              setTagFilter('');
              setFormatFilter('all');
              setLocationFilter('all');
            }}
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-10">
            <div className="text-white/70 text-sm">
              {filteredEvents.length > 0 && <span>{filteredEvents.length} events found</span>}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {calendarSubscriberProof('text-sm text-white/70')}
              <button
                onClick={() => setShowSubscribeModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 rounded-full text-primary-light hover:text-white transition-all text-sm font-medium"
              >
                <Rss size={16} />
                Subscribe to Calendar
              </button>
              <button
                type="button"
                onClick={() => openWhatsApp('Calendar row Join WhatsApp', 'home')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all text-sm font-medium"
              >
                <MessageCircle size={16} />
                Join WhatsApp
              </button>
            </div>
          </div>

          {!searchQuery && !tagFilter && !locationFilter && formatFilter === 'all' && events.length > 0 && (
            <FeaturedEvents events={filteredEvents.slice(0, 6)} onEventClick={setSelectedEvent} />
          )}

          <div className="min-h-[300px] sm:min-h-[500px] relative">
            {eventsLoading && !events.length ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 size={48} className="animate-spin text-primary mb-4" />
                <p className="text-white/75 text-sm">Loading events...</p>
              </div>
            ) : eventsError ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="text-red-400 mb-4">⚠️ Failed to load events</div>
                <p className="text-white/75 text-sm">Please check your internet connection and try again.</p>
              </div>
            ) : (
              <>
                {eventsFetching && events.length > 0 && (
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-[#0a0a0a]/90 border border-white/10 rounded-full px-4 py-2 backdrop-blur-xl">
                    <Loader2 size={16} className="animate-spin text-primary" />
                    <span className="text-white/80 text-xs font-medium">Updating...</span>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {viewMode === 'month' ? (
                    <motion.div key="month-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                      <Calendar events={filteredEvents} onEventClick={setSelectedEvent} />
                    </motion.div>
                  ) : viewMode === 'week' ? (
                    <motion.div key="week-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                      <WeekView events={filteredEvents} />
                    </motion.div>
                  ) : (
                    <motion.div key="list-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                      <ListView
                        events={filteredEvents}
                        onEventClick={setSelectedEvent}
                        searchQuery={searchQuery}
                        onReset={() => {
                          setSearchQuery('');
                          setFormatFilter('all');
                          setLocationFilter('all');
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer
        onCalendarClick={scrollToCalendar}
        onEventsClick={navigateToEventsHub}
        onNewsletterClick={navigateToEventsHub}
        onAPIClick={() => setComingSoonFeature('API Access')}
        onSubmitClick={navigateToEventsHub}
        onSponsorshipsClick={() => setComingSoonFeature('Sponsorships')}
        onWhatsAppClick={() => openWhatsApp('Footer WhatsApp', 'home')}
        onPrivacyClick={navigateToPrivacy}
        onTermsClick={navigateToTerms}
      />

      <ComingSoon
        isOpen={comingSoonFeature !== null}
        onClose={() => setComingSoonFeature(null)}
        feature={comingSoonFeature || undefined}
      />

      <EventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} onToast={success} />

      <SubscribeModal
        isOpen={showSubscribeModal}
        onClose={() => setShowSubscribeModal(false)}
        onToast={success}
        formatFilter={formatFilter}
        locationFilter={locationFilter}
      />

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default App;
