import React from 'react';
import { TechEvent } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Globe, ExternalLink, Tag, User, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';

interface EventDetailProps {
  event: TechEvent | null;
  onClose: () => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ event, onClose }) => {
  if (!event) return null;

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
            className="absolute top-8 right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all z-20"
          >
            <X size={20} />
          </button>

          <div className="p-10 pt-16 overflow-y-auto max-h-[85vh]">
            <div className="flex flex-wrap gap-3 mb-8">
               {event.format === 'online' ? (
                <span className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] bg-emerald-400/10 px-4 py-1.5 rounded-full border border-emerald-400/20">
                  <Globe size={14} /> Online
                </span>
              ) : (
                <span className="flex items-center gap-2 text-[10px] font-bold text-primary-light uppercase tracking-[0.2em] bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                  <MapPin size={14} /> {event.location?.city}, {event.location?.country}
                </span>
              )}
              <span className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] bg-white/[0.03] px-4 py-1.5 rounded-full border border-white/[0.05]">
                <User size={14} /> {event.organizer.name}
              </span>
            </div>

            <h2 className="text-5xl font-serif italic text-white mb-8 leading-[1.1]">
              {event.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05]">
                <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">Date & Time</h4>
                <div className="flex items-center gap-4 text-white">
                  <Calendar size={20} className="text-primary" />
                  <div>
                    <p className="text-lg font-medium">{format(new Date(event.startTime), 'MMMM do, yyyy')}</p>
                    <p className="text-xs text-white/40">{format(new Date(event.startTime), 'HH:mm')} ({event.timezone})</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05]">
                <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">Investment</h4>
                <div className="flex items-center gap-4 text-white">
                  <ShieldCheck size={20} className="text-accent" />
                  <div>
                    <p className="text-lg font-medium capitalize">{event.price.type === 'free' ? 'Complementary' : 'Paid Event'}</p>
                    {event.price.range && <p className="text-xs text-white/40">{event.price.range}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">Manifesto</h4>
              <p className="text-white/60 leading-relaxed font-sans text-lg">
                {event.summary}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-12">
              {event.tags.map(tag => (
                <span key={tag} className="flex items-center gap-2 text-xs font-medium text-white/40 bg-white/[0.02] px-4 py-2 rounded-2xl border border-white/[0.05]">
                  <Tag size={14} /> {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={() => window.open(event.links.officialSite, '_blank')}
                className="flex-1 btn-primary flex items-center justify-center gap-3 !py-5"
              >
                Official Website <ArrowUpRight size={20} />
              </button>
              {event.links.registration && (
                <button 
                  onClick={() => window.open(event.links.registration, '_blank')}
                  className="flex-1 btn-secondary flex items-center justify-center gap-3 !py-5"
                >
                  Register Now <ShieldCheck size={20} />
                </button>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-white/[0.05] flex items-center justify-between text-[9px] text-white/20 font-bold uppercase tracking-[0.3em]">
              <span>Index: {event.links.source}</span>
              <span>Updated: 2026</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EventDetail;
