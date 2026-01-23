import React from 'react';
import { Zap, Twitter, Github } from 'lucide-react';
import Logo from './Logo';

interface FooterProps {
  onCalendarClick: () => void;
  onNewsletterClick: () => void;
  onAPIClick: () => void;
  onSubmitClick: () => void;
  onSponsorshipsClick: () => void;
  onDiscordClick: () => void;
}

const Footer: React.FC<FooterProps> = ({
  onCalendarClick,
  onNewsletterClick,
  onAPIClick,
  onSubmitClick,
  onSponsorshipsClick,
  onDiscordClick
}) => {
  return (
    <footer className="py-12 sm:py-20 relative z-10 footer-section">
      {/* Footer Transition Overlay - 从上方逐渐淡出黑色遮罩，让shader显现 */}
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
              <p className="text-white/60 max-w-sm leading-relaxed font-sans text-sm sm:text-[15px]">
                Your gateway to the world's most influential tech events. From AI summits to developer conferences, discover, track, and never miss the moments that shape technology's future.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6 text-sm">Product</h4>
              <ul className="space-y-4 text-white/55 text-sm">
                <li><button onClick={onCalendarClick} className="hover:text-white transition-colors">Calendar</button></li>
                <li><button onClick={onNewsletterClick} className="hover:text-white transition-colors">Newsletter</button></li>
                <li><button onClick={onAPIClick} className="hover:text-white transition-colors">API Access</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6 text-sm">Community</h4>
              <ul className="space-y-4 text-white/55 text-sm">
                <li><button onClick={onSubmitClick} className="hover:text-white transition-colors">Submit Event</button></li>
                <li><button onClick={onSponsorshipsClick} className="hover:text-white transition-colors">Sponsorships</button></li>
                <li><button onClick={onDiscordClick} className="hover:text-white transition-colors">Discord</button></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8 pt-6 sm:pt-10 border-t border-white/10 text-white/45 text-[10px] sm:text-[12px] uppercase tracking-widest font-sans">
            <div className="flex items-center gap-2">
              <span>© 2026 Global Tech Events. Indexing the future.</span>
            </div>
            <div className="flex items-center gap-6 sm:gap-8">
              <button className="hover:text-white transition-colors opacity-50 cursor-not-allowed" disabled>Privacy</button>
              <button className="hover:text-white transition-colors opacity-50 cursor-not-allowed" disabled>Terms</button>
              <button className="hover:text-white transition-colors opacity-50 cursor-not-allowed" disabled>Legal</button>
              <div className="h-4 w-px bg-white/20"></div>
              <button className="p-1.5 hover:text-white transition-colors opacity-50 cursor-not-allowed" aria-label="Twitter" disabled>
                <Twitter size={16} />
              </button>
              <button className="p-1.5 hover:text-white transition-colors opacity-50 cursor-not-allowed" aria-label="GitHub" disabled>
                <Github size={16} />
              </button>
            </div>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
