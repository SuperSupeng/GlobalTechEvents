import React from 'react';
import Logo from './Logo';

interface FooterProps {
  onCalendarClick: () => void;
  onEventsClick: () => void;
  onNewsletterClick: () => void;
  onAPIClick: () => void;
  onAgentFeedClick: () => void;
  onSubmitClick: () => void;
  onSponsorshipsClick: () => void;
  onWhatsAppClick: () => void;
  onPrivacyClick: () => void;
  onTermsClick: () => void;
}

const Footer: React.FC<FooterProps> = ({
  onCalendarClick,
  onEventsClick,
  onNewsletterClick,
  onAPIClick,
  onAgentFeedClick,
  onSubmitClick,
  onSponsorshipsClick,
  onWhatsAppClick,
  onPrivacyClick,
  onTermsClick,
}) => {
  return (
    <footer className="py-12 sm:py-20 relative z-10 footer-section">
      <div className="footer-transition-overlay" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10 mb-12 sm:mb-20">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Logo size={32} />
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                GlobalTech<span className="text-primary-light">Events</span>
              </span>
            </div>
            <p className="text-white/80 max-w-sm leading-relaxed font-sans text-sm sm:text-[15px]">
              One calendar for the major tech events the industry actually tracks—subscribe, share with your Agent, or follow on WhatsApp.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm">Product</h4>
            <ul className="space-y-4 text-white/75 text-sm">
              <li><button onClick={onCalendarClick} className="hover:text-white transition-colors">Calendar</button></li>
              <li><button onClick={onEventsClick} className="hover:text-white transition-colors">Events Hub</button></li>
              <li><button onClick={onAgentFeedClick} className="hover:text-white transition-colors">Agent feed</button></li>
              <li><button onClick={onNewsletterClick} className="hover:text-white transition-colors">Newsletter</button></li>
              <li><button onClick={onAPIClick} className="hover:text-white transition-colors">API Access</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm">Community</h4>
            <ul className="space-y-4 text-white/75 text-sm">
              <li><button onClick={onSubmitClick} className="hover:text-white transition-colors">Submit Event</button></li>
              <li><button onClick={onSponsorshipsClick} className="hover:text-white transition-colors">Sponsorships</button></li>
              <li><button onClick={onWhatsAppClick} className="hover:text-white transition-colors">WhatsApp</button></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 pt-6 sm:pt-10 border-t border-white/10 text-white/65 text-xs sm:text-sm font-sans text-center">
          <p>© 2026 GlobalTechEvents. Indexing the future of technology.</p>
          <div className="flex items-center gap-4 text-white/65 text-xs">
            <button onClick={onPrivacyClick} className="hover:text-white transition-colors">Privacy Policy</button>
            <span>·</span>
            <button onClick={onTermsClick} className="hover:text-white transition-colors">Terms of Service</button>
          </div>
          <p className="text-white/55 text-[10px] sm:text-xs">Made with ❤️ for the global tech community</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
