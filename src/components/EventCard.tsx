import React from 'react';
import { TechEvent } from '../types';
import { MapPin, Globe, ExternalLink, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { identifyTags, getTagColorClasses } from '../utils/tags';

interface EventCardProps {
  event: TechEvent;
  onClick: (event: TechEvent) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const smartTags = identifyTags(event);
  
  return (
    <div 
      onClick={() => onClick(event)}
      className="glass-panel p-6 cursor-pointer group"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-8">
        {/* Date Section */}
        <div className="flex-shrink-0 flex md:flex-col items-center justify-center w-20 h-20 bg-white/[0.03] rounded-3xl border border-white/[0.05] group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500">
          <span className="text-3xl font-serif italic text-white group-hover:text-primary transition-colors">
            {format(new Date(event.startTime), 'dd')}
          </span>
          <span className="ml-2 md:ml-0 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
            {format(new Date(event.startTime), 'MMM')}
          </span>
        </div>

        {/* Content Section */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-3 mb-3">
            {event.format === 'online' ? (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                <Globe size={12} /> Online
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-primary-light uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                <MapPin size={12} /> {event.location?.city || 'Offline'}
              </span>
            )}
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest bg-white/[0.03] px-3 py-1 rounded-full border border-white/[0.05]">
              {event.organizer.name}
            </span>
          </div>
          
          <h3 className="text-2xl font-serif italic text-white mb-2 leading-tight group-hover:translate-x-1 transition-transform duration-300">
            {event.title}
          </h3>
          
          <p className="text-[14px] text-white/50 line-clamp-2 mb-4 font-sans leading-relaxed">
            {event.summary}
          </p>
          
          {/* Smart Tags */}
          {smartTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {smartTags.slice(0, 4).map((tag, idx) => {
                const colors = getTagColorClasses(tag.color);
                return (
                  <span
                    key={idx}
                    className={`flex items-center gap-1.5 text-[10px] font-medium ${colors.text} ${colors.bg} px-2.5 py-1 rounded-lg border ${colors.border}`}
                  >
                    <span>{tag.icon}</span>
                    {tag.label}
                  </span>
                );
              })}
              {smartTags.length > 4 && (
                <span className="text-[10px] text-white/40 px-2 py-1">
                  +{smartTags.length - 4}
                </span>
              )}
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            {event.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1.5 text-[10px] font-medium text-white/60 bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/[0.05]">
                <Tag size={12} /> {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Section */}
        <div className="flex-shrink-0 flex items-center justify-end">
          <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/30 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 group-hover:rotate-12">
            <ExternalLink size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
