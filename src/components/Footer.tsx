import React from 'react';
import Logo from './Logo';

interface FooterProps {
  onCalendarClick: () => void;
  onEventsClick: () => void;
  onGuidesClick: () => void;
  onNewsletterClick: () => void;
  onSubmitClick: () => void;
  onWhatsAppClick: () => void;
  onPrivacyClick: () => void;
  onTermsClick: () => void;
}

const Footer: React.FC<FooterProps> = ({
  onCalendarClick,
  onEventsClick,
  onGuidesClick,
  onNewsletterClick,
  onSubmitClick,
  onWhatsAppClick,
  onPrivacyClick,
  onTermsClick,
}) => {
  return (
    <footer className="py-12 sm:py-20 relative z-10 footer-section">
      <div className="footer-transition-overlay" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-[2]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10 mb-12 sm:mb-20">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Logo size={32} />
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                GlobalTech<span className="text-primary-light">Events</span>
              </span>
            </div>
            <p className="text-white/95 max-w-sm leading-relaxed font-sans text-sm sm:text-[15px]">
              One calendar for the major tech events the industry actually tracks. Subscribe once, or follow updates on WhatsApp.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm">Product</h4>
            <ul className="space-y-4 text-white text-sm">
              <li><button onClick={onCalendarClick} className="hover:underline underline-offset-4 transition-colors">Calendar</button></li>
              <li><button onClick={onEventsClick} className="hover:underline underline-offset-4 transition-colors">Events Hub</button></li>
              <li><button onClick={onGuidesClick} className="hover:underline underline-offset-4 transition-colors">Guides</button></li>
              <li><button onClick={onNewsletterClick} className="hover:underline underline-offset-4 transition-colors">Newsletter</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm">Community</h4>
            <ul className="space-y-4 text-white text-sm">
              <li><button onClick={onSubmitClick} className="hover:underline underline-offset-4 transition-colors">Submit Event</button></li>
              <li><button onClick={onWhatsAppClick} className="hover:underline underline-offset-4 transition-colors">WhatsApp</button></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 pt-6 sm:pt-10 border-t border-white/10 text-white/90 text-xs sm:text-sm font-sans text-center">
          <p>© 2026 GlobalTechEvents. Indexing the future of technology.</p>
          <div className="flex items-center gap-4 text-white text-xs">
            <button onClick={onPrivacyClick} className="hover:underline underline-offset-4 transition-colors">Privacy Policy</button>
            <span>·</span>
            <button onClick={onTermsClick} className="hover:underline underline-offset-4 transition-colors">Terms of Service</button>
          </div>
          <p className="text-white/90 text-[10px] sm:text-xs">Made with ❤️ for the global tech community</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
