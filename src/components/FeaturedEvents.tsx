import React from 'react';
import { TechEvent } from '../types';
import { format } from 'date-fns';
import { MapPin, Globe, Calendar, Sparkles } from 'lucide-react';
import { getTimeUrgency } from '../utils/timeUtils';

interface FeaturedEventsProps {
  events: TechEvent[];
  onEventClick: (event: TechEvent) => void;
}

const FeaturedEvents: React.FC<FeaturedEventsProps> = ({ events, onEventClick }) => {
  // 取前3个活动作为精选
  const featuredEvents = events.slice(0, 3);

  if (featuredEvents.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Sparkles size={24} className="text-primary" />
        <h2 className="text-2xl sm:text-3xl font-serif italic text-white">
          Featured This Week
        </h2>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {featuredEvents.map((event) => {
          const timeUrgency = getTimeUrgency(event.startTime);
          
          return (
            <div
              key={event.id}
              onClick={() => onEventClick(event)}
              className="group glass-panel p-5 sm:p-6 cursor-pointer hover:border-primary/30 transition-all active:scale-[0.99]"
            >
              {/* Time Urgency Badge */}
              {timeUrgency && (
                <div className="flex items-center justify-between mb-4">
                  <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${timeUrgency.color} ${timeUrgency.bgColor} ${timeUrgency.borderColor}`}>
                    <Calendar size={10} />
                    {timeUrgency.label}
                  </span>
                </div>
              )}

              {/* Event Title */}
              <h3 className="text-lg sm:text-xl font-serif italic text-white mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {event.title}
              </h3>

              {/* Event Meta */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Calendar size={14} className="flex-shrink-0" />
                  <span className="text-xs">{format(new Date(event.startTime), 'MMM dd, yyyy · HH:mm')}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  {event.format === 'online' ? (
                    <>
                      <Globe size={14} className="text-emerald-400 flex-shrink-0" />
                      <span className="text-xs text-emerald-400">Online Event</span>
                    </>
                  ) : (
                    <>
                      <MapPin size={14} className="text-primary flex-shrink-0" />
                      <span className="text-xs truncate">{event.location?.city || 'Location TBD'}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Event Summary */}
              {event.summary && (
                <p className="text-white/50 text-xs leading-relaxed line-clamp-2 mb-4">
                  {event.summary}
                </p>
              )}

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {event.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-white/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedEvents;
