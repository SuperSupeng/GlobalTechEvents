import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';
import Calendar from './components/Calendar';
import EventCard from './components/EventCard';
import EventDetail from './components/EventDetail';
import FilterPanel from './components/FilterPanel';
import { mockEvents } from './data/mockEvents';
import { TechEvent } from './types';
import { Calendar as CalendarIcon, Zap, Github, Twitter } from 'lucide-react';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<TechEvent | null>(null);

  const filteredEvents = useMemo(() => {
    return mockEvents.filter(event => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFormat = 
        formatFilter === 'all' || 
        event.format === formatFilter || 
        (formatFilter === 'offline' && event.format === 'hybrid');

      return matchesSearch && matchesFormat;
    });
  }, [searchQuery, formatFilter]);

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

  return (
    <div className="min-h-screen relative">
      {/* Shader Background */}
      <div className="shader-bg-container">
        <ShaderGradientCanvas style={{ position: 'fixed', inset: 0, width: '100%', height: '100%' }}>
          <ShaderGradient
            control="query"
            urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.55&cAzimuthAngle=180&cDistance=3.6&cPolarAngle=90&cameraZoom=1&color1=%23ff7a18&color2=%23ffd8a8&color3=%23f2e7ff&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=24&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=0.9&positionX=-1.4&positionY=0&positionZ=0&range=disabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=10&rotationZ=50&shader=defaults&type=plane&uAmplitude=1&uDensity=1.3&uFrequency=5.5&uSpeed=0.28&uStrength=4&uTime=0&wireframe=false"
          />
        </ShaderGradientCanvas>
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4 glass-panel !rounded-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
              <Zap className="text-white fill-current" size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-sans">
              GlobalTech<span className="text-primary-light">Events</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-[13px] font-medium tracking-wide uppercase text-white/60">
            <a href="#" className="text-white hover:text-white transition-colors">Explore</a>
            <a href="#" className="hover:text-white transition-colors">Resources</a>
            <a href="#" className="hover:text-white transition-colors">Submit Event</a>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="p-2 text-white/40 hover:text-white transition-colors">
              <Twitter size={18} />
            </a>
            <a href="#" className="p-2 text-white/40 hover:text-white transition-colors">
              <Github size={18} />
            </a>
            <button className="ml-2 px-6 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-slate-200 transition-all">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-40 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
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
            className="hero-title text-5xl sm:text-6xl md:text-8xl font-serif italic mb-8 leading-[1.05] text-white relative z-10"
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
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-12 font-sans"
          >
            Aggregate the world's top developer conferences, hackathons, and tech salons.
            Across time zones, pinpoint your next technical gathering.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button className="btn-primary flex items-center gap-2">
              Start Exploring <Zap size={18} />
            </button>
            <button className="btn-secondary flex items-center gap-2">
              View Calendar <CalendarIcon size={18} />
            </button>
          </motion.div>
        </div>

        {/* Filter & Search */}
        <div className="relative z-10">
          <FilterPanel 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            formatFilter={formatFilter}
            onFormatChange={setFormatFilter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Main Content */}
          <div className="min-h-[500px] mb-20">
            {viewMode === 'month' ? (
              <Calendar 
                events={filteredEvents} 
                onEventClick={setSelectedEvent} 
              />
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onClick={setSelectedEvent} 
                    />
                  ))
                ) : (
                  <div className="glass-panel p-32 text-center border-dashed border-white/10">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-white/20">
                      <CalendarIcon size={40} />
                    </div>
                    <h3 className="text-2xl font-serif italic mb-2 text-white">No events found</h3>
                    <p className="text-white/40">Try adjusting your filters or search terms.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
                  <Zap className="text-white fill-current" size={18} />
                </div>
                <span className="text-xl font-bold tracking-tight text-white font-sans">
                  GlobalTech<span className="text-primary-light">Events</span>
                </span>
              </div>
              <p className="text-white/40 max-w-sm leading-relaxed font-sans">
                Connecting technology leaders and enthusiasts through a unified global event index.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Product</h4>
              <ul className="space-y-4 text-white/40 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Calendar</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Newsletter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Access</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Community</h4>
              <ul className="space-y-4 text-white/40 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Submit Event</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sponsorships</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-white/5 text-white/30 text-[12px] uppercase tracking-widest font-sans">
            <div className="flex items-center gap-2">
              <span>© 2026 Global Tech Events. Indexing the future.</span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Legal</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Event Details Modal */}
      <EventDetail 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
      />
    </div>
  );
};

export default App;
