import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';
import { Zap, ChevronDown, Loader2, MessageCircle } from 'lucide-react';
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
import { useToast } from './hooks/useToast';

const App: React.FC = () => {
  // 根据 URL 路径确定初始页面
  const getInitialPage = (): 'home' | 'privacy' | 'terms' => {
    const path = window.location.pathname;
    if (path === '/privacy') return 'privacy';
    if (path === '/terms') return 'terms';
    return 'home';
  };

  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<TechEvent | null>(null);
  const [comingSoonFeature, setComingSoonFeature] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'privacy' | 'terms'>(getInitialPage());
  
  // Toast notifications
  const { toasts, removeToast, success } = useToast();
  
  // Refs for smooth scrolling
  const calendarRef = useRef<HTMLDivElement>(null);
  
  // Smooth scroll to calendar
  const scrollToCalendar = () => {
    calendarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setViewMode('month'); // 确保显示日历视图
  };

  // Open Discord community
  const openDiscord = () => {
    window.open('https://discord.gg/Cj7s7nt7', '_blank');
  };

  // 🆕 使用 API 获取数据
  const { data: events = [], isLoading: eventsLoading, error: eventsError } = useEvents({
    search: searchQuery,
    format: formatFilter as any,
    location: locationFilter,
  });

  const { data: allLocations = [] } = useLocations();

  // 过滤逻辑已由 API 处理，直接使用返回的数据
  const filteredEvents = useMemo(() => {
    return events;
  }, [events]);

  // 处理页面导航（更新 URL 和状态）
  const navigateToPrivacy = () => {
    setCurrentPage('privacy');
    window.history.pushState({}, '', '/privacy');
    window.scrollTo(0, 0);
    // 更新页面 meta 标签
    document.title = 'Privacy Policy - GlobalTechEvents';
  };

  const navigateToTerms = () => {
    setCurrentPage('terms');
    window.history.pushState({}, '', '/terms');
    window.scrollTo(0, 0);
    // 更新页面 meta 标签
    document.title = 'Terms of Service - GlobalTechEvents';
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    window.history.pushState({}, '', '/');
    window.scrollTo(0, 0);
    // 恢复主页 title
    document.title = 'GlobalTechEvents - Your Gateway to Tech Events Worldwide';
  };

  // 处理浏览器前进/后退按钮
  React.useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/privacy') setCurrentPage('privacy');
      else if (path === '/terms') setCurrentPage('terms');
      else setCurrentPage('home');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const splitText = (text: string) => {
    return text.split(" ").map((word, wordIndex) => (
      <span key={`word-${wordIndex}`} className="inline-block mr-3 last:mr-0">
        {word.split("").map((char, charIndex) => (
          <span key={`char-${wordIndex}-${charIndex}`} className="char-hover">
            {char}
          </span>
        ))}
      </span>
    ));
  };

  // 如果在法律页面，只显示该页面
  if (currentPage === 'privacy') {
    return <PrivacyPolicy onBack={navigateToHome} />;
  }

  if (currentPage === 'terms') {
    return <TermsOfService onBack={navigateToHome} />;
  }

  return (
    <div className="min-h-screen relative">
      {/* Shader Background */}
      <div className="shader-bg-container" style={{ pointerEvents: 'none' }}>
        <ShaderGradientCanvas style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <ShaderGradient
            control="query"
            urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.55&cAzimuthAngle=180&cDistance=3.6&cPolarAngle=90&cameraZoom=1&color1=%23ff7a18&color2=%23ffd8a8&color3=%23f2e7ff&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=24&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=0.9&positionX=-1.4&positionY=0&positionZ=0&range=disabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=10&rotationZ=50&shader=defaults&type=plane&uAmplitude=1&uDensity=1.3&uFrequency=5.5&uSpeed=0.28&uStrength=4&uTime=0&wireframe=false"
          />
        </ShaderGradientCanvas>
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />
      </div>

      {/* Navigation */}
      <Navbar 
        onExploreClick={scrollToCalendar}
        onResourcesClick={() => setComingSoonFeature('Resources')}
        onSubmitClick={() => setComingSoonFeature('Submit Event')}
      />

      <main className="relative z-10">
        {/* Hero Section - 占满首屏 */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-24 pb-12 relative z-10">
          <div className="text-center max-w-4xl mx-auto w-full px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-medium mb-8"
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
              event.currentTarget.style.setProperty('--glow-x', `0px`);
              event.currentTarget.style.setProperty('--glow-y', `0px`);
              event.currentTarget.style.setProperty('--tilt-x', `0deg`);
              event.currentTarget.style.setProperty('--tilt-y', `0deg`);
              event.currentTarget.style.setProperty('--mx', `50%`);
              event.currentTarget.style.setProperty('--my', `50%`);
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              {splitText("The World's")}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="hero-accent block"
            >
              {splitText("Tech Events")} <span className="font-sans italic">{splitText("Matrix")}</span>
            </motion.div>
          </h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-12 font-sans px-4"
          >
            Your gateway to the world's tech events. Conferences, hackathons, meetups—all in one calendar, across every timezone.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <button 
              onClick={scrollToCalendar}
              className="btn-primary flex items-center gap-2 w-full sm:w-auto"
            >
              Start Exploring <Zap size={18} />
            </button>
            <button 
              onClick={openDiscord}
              className="btn-secondary flex items-center gap-2 w-full sm:w-auto group"
            >
              <MessageCircle size={18} className="group-hover:rotate-12 transition-transform" />
              Join Discord
            </button>
          </motion.div>
          </div>

          {/* 滚动指示器 */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2, repeat: Infinity, repeatType: "reverse" }}
            className="absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 hover:text-white/60 transition-colors cursor-pointer"
            onClick={scrollToCalendar}
          >
            <span className="text-xs font-medium uppercase tracking-widest mb-2">Explore Events</span>
            <ChevronDown size={24} className="animate-bounce" />
          </motion.div>
        </section>

        {/* Filter & Search */}
        <div ref={calendarRef} className="relative z-20 content-section max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-32 sm:pb-40">
          <FilterPanel 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            formatFilter={formatFilter}
            onFormatChange={setFormatFilter}
            locationFilter={locationFilter}
            onLocationChange={setLocationFilter}
            allLocations={allLocations}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Main Content with View Transitions */}
          <div className="min-h-[300px] sm:min-h-[500px]">
            {/* Loading State */}
            {eventsLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 size={48} className="animate-spin text-primary mb-4" />
                <p className="text-white/50 text-sm">Loading events...</p>
              </div>
            ) : eventsError ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="text-red-400 mb-4">⚠️ Failed to load events</div>
                <p className="text-white/50 text-sm">Please check your internet connection and try again.</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
              {viewMode === 'month' ? (
                <motion.div
                  key="month-view"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Calendar 
                    events={filteredEvents} 
                    onEventClick={setSelectedEvent} 
                  />
                </motion.div>
              ) : viewMode === 'week' ? (
                <motion.div
                  key="week-view"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <WeekView 
                    events={filteredEvents} 
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="list-view"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
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
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer 
        onCalendarClick={scrollToCalendar}
        onNewsletterClick={() => setComingSoonFeature('Newsletter')}
        onAPIClick={() => setComingSoonFeature('API Access')}
        onSubmitClick={() => setComingSoonFeature('Submit Event')}
        onSponsorshipsClick={() => setComingSoonFeature('Sponsorships')}
        onDiscordClick={openDiscord}
        onPrivacyClick={navigateToPrivacy}
        onTermsClick={navigateToTerms}
      />
      
      {/* Coming Soon Modal */}
      <ComingSoon 
        isOpen={comingSoonFeature !== null}
        onClose={() => setComingSoonFeature(null)}
        feature={comingSoonFeature || undefined}
      />

      {/* Event Details Modal */}
      <EventDetail 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)}
        onToast={success}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default App;
