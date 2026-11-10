import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { TechEvent } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Globe, User, ArrowUpRight, ChevronDown, Download, Link2 } from 'lucide-react';
import { format } from 'date-fns';
import { 
  downloadICS, 
  getGoogleCalendarUrl, 
  getOutlookUrl,
  addToAppleCalendar 
} from '../utils/calendar';
import { identifyTags, getTagColorClasses } from '../utils/tags';
import { createEventSlug, trackAddToCalendar, trackOutboundClick } from '../utils/analytics';

interface EventDetailProps {
  event: TechEvent | null;
  onClose: () => void;
  onToast?: (message: string) => void;
}

const CALENDAR_MENU_HEIGHT = 232;

function calendarMenuStyle(button: HTMLElement, menuHeight = CALENDAR_MENU_HEIGHT): React.CSSProperties {
  const rect = button.getBoundingClientRect();
  const gap = 8;
  const spaceBelow = window.innerHeight - rect.bottom - gap - 12;
  const spaceAbove = rect.top - gap - 12;
  const openUp = spaceAbove > spaceBelow;
  const available = Math.max(openUp ? spaceAbove : spaceBelow, 120);
  const height = Math.min(menuHeight, available);
  const top = openUp ? Math.max(12, rect.top - gap - height) : rect.bottom + gap;
  const width = rect.width;
  const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12));
  return {
    position: 'fixed',
    top,
    left,
    width,
    maxHeight: available,
    zIndex: 200,
    overflowY: 'auto',
  };
}

const EventDetail: React.FC<EventDetailProps> = ({ event, onClose, onToast }) => {
  const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const calendarButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!showCalendarDropdown) return;
    const place = () => {
      const button = calendarButtonRef.current;
      if (!button) return;
      setMenuStyle(calendarMenuStyle(button));
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [showCalendarDropdown]);

  if (!event) return null;
  
  const smartTags = identifyTags(event);
  const pricePrimary = event.price.type === 'free'
    ? 'Free'
    : event.price.range || (event.price.type === 'paid' ? 'Paid' : 'See the official site');
  const priceNote = event.price.range && event.price.type === 'paid' ? 'Paid' : undefined;
  const city = event.location?.city?.trim();
  const country = event.location?.country?.trim();
  const placeLabel = !city ? country : !country || city.toLowerCase() === country.toLowerCase() ? city : `${city}, ${country}`;

  const handleAddToCalendar = (type: 'google' | 'apple' | 'outlook' | 'ics') => {
    trackAddToCalendar({
      sourcePage: window.location.pathname,
      pageType: 'event_detail_modal',
      calendarProvider: type,
      eventSlug: createEventSlug(event.title),
      ctaLabel: `Add to Calendar - ${type}`,
    });

    let message = '';
    switch (type) {
      case 'google':
        window.open(getGoogleCalendarUrl(event), '_blank');
        message = 'Opening Google Calendar...';
        break;
      case 'apple':
        addToAppleCalendar(event);
        message = 'Calendar file downloaded!';
        break;
      case 'outlook':
        window.open(getOutlookUrl(event), '_blank');
        message = 'Opening Outlook Calendar...';
        break;
      case 'ics':
        downloadICS(event);
        message = 'Calendar file downloaded!';
        break;
    }
    setShowCalendarDropdown(false);
    if (onToast) {
      onToast(message);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(event.links.officialSite);
      if (onToast) {
        onToast('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleOfficialWebsiteClick = () => {
    trackOutboundClick({
      sourcePage: window.location.pathname,
      pageType: 'event_detail_modal',
      targetUrl: event.links.officialSite,
      eventSlug: createEventSlug(event.title),
      ctaLabel: 'Official Website',
    });
    window.open(event.links.officialSite, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/[0.08] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Decorative Gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-8 sm:right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all z-20"
          >
            <X size={20} />
          </button>

          <div className="px-5 pt-16 pb-8 sm:p-10 sm:pt-16 overflow-y-auto max-h-[85vh]">
            {/* Smart Tags */}
            {smartTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {smartTags.map((tag, idx) => {
                  const colors = getTagColorClasses(tag.color);
                  return (
                    <span
                      key={idx}
                      className={`flex items-center gap-2 text-xs font-medium ${colors.text} ${colors.bg} px-3 py-1.5 rounded-lg border ${colors.border}`}
                    >
                      <span>{tag.icon}</span>
                      {tag.label}
                    </span>
                  );
                })}
              </div>
            )}
            
            <div className="flex flex-wrap gap-3 mb-6">
               {event.format === 'online' ? (
                <span className="flex items-center gap-2 text-xs font-medium text-emerald-300 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
                  <Globe size={14} /> Online
                </span>
              ) : (
                <span className="flex items-center gap-2 text-xs font-medium text-primary-light bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                  <MapPin size={14} /> {placeLabel}
                </span>
              )}
              <span className="flex items-center gap-2 text-xs font-medium text-white/70 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/10">
                <User size={14} /> {event.organizer.name}
              </span>
            </div>

            <h2 className="text-[2.15rem] sm:text-5xl font-serif italic text-white mb-8 leading-[1.08] text-balance">
              {event.title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                <h4 className="text-xs font-medium text-white/55 mb-2">When</h4>
                <div className="flex items-start gap-3 text-white">
                  <Calendar size={18} className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-lg font-medium leading-snug">{format(new Date(event.startTime), 'MMMM d, yyyy')}</p>
                    <p className="text-sm text-white/70 mt-1">{format(new Date(event.startTime), 'HH:mm')} your local time</p>
                    <p className="text-sm text-white/50 mt-1">Timezone: {event.timezone}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                <h4 className="text-xs font-medium text-white/55 mb-2">Price</h4>
                <p className="text-lg font-medium text-white">{pricePrimary}</p>
                {priceNote ? <p className="text-sm text-white/60 mt-1">{priceNote}</p> : null}
              </div>
            </div>

            <div className="mb-10">
              <h4 className="text-xs font-medium text-white/55 mb-2">About</h4>
              <p className="text-white/75 leading-relaxed font-sans text-base sm:text-lg">
                {event.summary}
              </p>
            </div>

            <div className="mb-10">
              <h4 className="text-xs font-medium text-white/55 mb-3">Topics</h4>
              <div className="flex flex-wrap gap-2">
                {event.tags.map(tag => (
                  <span key={tag} className="text-xs text-white/50 bg-white/[0.02] px-3 py-1.5 rounded-lg border border-white/[0.05]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleOfficialWebsiteClick}
                  className="flex-1 btn-primary flex items-center justify-center gap-3 !py-5"
                >
                  Official Website <ArrowUpRight size={20} />
                </button>
                
                <button
                  onClick={handleCopyLink}
                  className="flex-1 sm:flex-none btn-secondary flex items-center justify-center gap-3 !py-5 sm:px-8"
                >
                  <Link2 size={20} /> Copy Link
                </button>
              </div>
              
              <div>
                <button
                  ref={calendarButtonRef}
                  type="button"
                  aria-expanded={showCalendarDropdown}
                  aria-haspopup="menu"
                  onClick={() => {
                    const button = calendarButtonRef.current;
                    if (button) setMenuStyle(calendarMenuStyle(button));
                    setShowCalendarDropdown((open) => !open);
                  }}
                  className="w-full btn-secondary flex items-center justify-center gap-3 !py-5"
                >
                  <Calendar size={20} /> Add to Calendar <ChevronDown size={18} />
                </button>

                {showCalendarDropdown && createPortal(
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={menuStyle}
                    className="bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleAddToCalendar('google')}
                      className="w-full px-6 py-4 text-left text-white/80 hover:bg-white/5 hover:text-white transition-all flex items-center gap-3 text-sm"
                    >
                      <Globe size={16} className="text-blue-400" />
                      Google Calendar
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleAddToCalendar('apple')}
                      className="w-full px-6 py-4 text-left text-white/80 hover:bg-white/5 hover:text-white transition-all flex items-center gap-3 text-sm border-t border-white/5"
                    >
                      <Calendar size={16} className="text-white/60" />
                      Apple Calendar
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleAddToCalendar('outlook')}
                      className="w-full px-6 py-4 text-left text-white/80 hover:bg-white/5 hover:text-white transition-all flex items-center gap-3 text-sm border-t border-white/5"
                    >
                      <Globe size={16} className="text-cyan-400" />
                      Outlook
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleAddToCalendar('ics')}
                      className="w-full px-6 py-4 text-left text-white/80 hover:bg-white/5 hover:text-white transition-all flex items-center gap-3 text-sm border-t border-white/5"
                    >
                      <Download size={16} className="text-white/60" />
                      Download .ics
                    </button>
                  </motion.div>,
                  document.body,
                )}
              </div>
            </div>
            
            <p className="mt-10 pt-6 border-t border-white/10 text-sm text-white/50 leading-relaxed">
              Confirm the details on the official site.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EventDetail;
