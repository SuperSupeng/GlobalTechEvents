import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

interface NavbarProps {
  onExploreClick: () => void;
  onResourcesClick: () => void;
  onSubmitClick: () => void;
  onEventsHubClick: () => void;
  onGuidesClick: () => void;
  onAgentFeedClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onExploreClick,
  onResourcesClick,
  onSubmitClick,
  onEventsHubClick,
  onGuidesClick,
  onAgentFeedClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 glass-panel !rounded-full relative">
        <button onClick={scrollToTop} className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
          <Logo size={32} className="group-hover:scale-110 transition-transform duration-300" />
          <span className="text-xl font-bold tracking-tight text-white font-sans">
            GlobalTech<span className="text-primary-light">Events</span>
          </span>
        </button>

        <div className="hidden lg:flex items-center gap-4 xl:gap-8 text-[13px] font-medium tracking-wide uppercase text-white/80">
          <button onClick={onExploreClick} className="shrink-0 whitespace-nowrap text-white hover:text-white transition-colors">View Calendar</button>
          <button onClick={onEventsHubClick} className="shrink-0 whitespace-nowrap hover:text-white transition-colors">Events Hub</button>
          <button onClick={onGuidesClick} className="shrink-0 whitespace-nowrap hover:text-white transition-colors">Guides</button>
          <button onClick={onAgentFeedClick} className="shrink-0 whitespace-nowrap hover:text-white transition-colors">Agent feed</button>
          <button onClick={onResourcesClick} className="shrink-0 whitespace-nowrap hover:text-white transition-colors">Resources</button>
          <button onClick={onSubmitClick} className="shrink-0 whitespace-nowrap hover:text-white transition-colors">Submit Event</button>
        </div>

        <button
          className="lg:hidden p-2 text-white/80 hover:text-white transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-4 right-4 mt-2 glass-panel rounded-3xl p-6 animate-in fade-in slide-in-from-top-5">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                onExploreClick();
                setMobileMenuOpen(false);
              }}
              className="text-white hover:text-primary transition-colors py-2 font-medium text-left"
            >
              View Calendar
            </button>
            <button
              onClick={() => {
                onEventsHubClick();
                setMobileMenuOpen(false);
              }}
              className="text-white/80 hover:text-white transition-colors py-2 text-left"
            >
              Events Hub
            </button>
            <button
              onClick={() => {
                onGuidesClick();
                setMobileMenuOpen(false);
              }}
              className="text-white/80 hover:text-white transition-colors py-2 text-left"
            >
              Guides
            </button>
            <button
              onClick={() => {
                onAgentFeedClick();
                setMobileMenuOpen(false);
              }}
              className="text-white/80 hover:text-white transition-colors py-2 text-left"
            >
              Agent feed
            </button>
            <button
              onClick={() => {
                onResourcesClick();
                setMobileMenuOpen(false);
              }}
              className="text-white/80 hover:text-white transition-colors py-2 text-left"
            >
              Resources
            </button>
            <button
              onClick={() => {
                onSubmitClick();
                setMobileMenuOpen(false);
              }}
              className="text-white/80 hover:text-white transition-colors py-2 text-left"
            >
              Submit Event
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
