import React, { useState } from 'react';
import { Zap, Menu, X } from 'lucide-react';

interface NavbarProps {
  onExploreClick: () => void;
  onResourcesClick: () => void;
  onSubmitClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onExploreClick,
  onResourcesClick,
  onSubmitClick
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 glass-panel !rounded-full relative">
        <button 
          onClick={scrollToTop}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
            <Zap className="text-white fill-current" size={18} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-sans">
            GlobalTech<span className="text-primary-light">Events</span>
          </span>
        </button>
        
        <div className="hidden md:flex items-center gap-10 text-[13px] font-medium tracking-wide uppercase text-white/60">
          <button onClick={onExploreClick} className="text-white hover:text-white transition-colors">Explore</button>
          <button onClick={onResourcesClick} className="hover:text-white transition-colors">Resources</button>
          <button onClick={onSubmitClick} className="hover:text-white transition-colors">Submit Event</button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-4 right-4 mt-2 glass-panel rounded-3xl p-6 animate-in fade-in slide-in-from-top-5">
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => { onExploreClick(); setMobileMenuOpen(false); }} 
              className="text-white hover:text-primary transition-colors py-2 font-medium text-left"
            >
              Explore
            </button>
            <button 
              onClick={() => { onResourcesClick(); setMobileMenuOpen(false); }} 
              className="text-white/60 hover:text-white transition-colors py-2 text-left"
            >
              Resources
            </button>
            <button 
              onClick={() => { onSubmitClick(); setMobileMenuOpen(false); }} 
              className="text-white/60 hover:text-white transition-colors py-2 text-left"
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
