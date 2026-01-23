import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TechEvent } from '../types';
import EventCard from './EventCard';
import EmptyState from './EmptyState';
import { Loader2 } from 'lucide-react';

interface ListViewProps {
  events: TechEvent[];
  onEventClick: (event: TechEvent) => void;
  searchQuery: string;
  onReset: () => void;
}

const ITEMS_PER_PAGE = 20;

const ListView: React.FC<ListViewProps> = ({ events, onEventClick, searchQuery, onReset }) => {
  const [displayedItems, setDisplayedItems] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Reset displayed items when events change
  useEffect(() => {
    setDisplayedItems(ITEMS_PER_PAGE);
  }, [events]);

  // Load more items
  const loadMore = useCallback(() => {
    if (displayedItems >= events.length || isLoading) return;

    setIsLoading(true);
    // Simulate loading delay for smooth UX
    setTimeout(() => {
      setDisplayedItems(prev => Math.min(prev + ITEMS_PER_PAGE, events.length));
      setIsLoading(false);
    }, 300);
  }, [displayedItems, events.length, isLoading]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && displayedItems < events.length) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, isLoading, displayedItems, events.length]);

  if (events.length === 0) {
    return (
      <EmptyState 
        type={searchQuery ? 'search' : 'filter'}
        searchQuery={searchQuery}
        onReset={onReset}
      />
    );
  }

  const visibleEvents = events.slice(0, displayedItems);
  const hasMore = displayedItems < events.length;

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-white/50">
        <span>
          Showing {visibleEvents.length} of {events.length} events
        </span>
        {hasMore && (
          <span className="text-primary/70">
            Scroll for more...
          </span>
        )}
      </div>

      {/* Events Grid with Animation */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {visibleEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index < ITEMS_PER_PAGE ? index * 0.05 : 0 }}
            >
              <EventCard 
                event={event} 
                onClick={onEventClick} 
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Loading Indicator & Observer Target */}
      {hasMore && (
        <div ref={observerTarget} className="flex flex-col items-center justify-center py-12">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 text-white/50"
            >
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Loading more events...</span>
            </motion.div>
          ) : (
            <button
              onClick={loadMore}
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 text-white/70 hover:text-white transition-all text-sm font-medium"
            >
              Load More ({events.length - displayedItems} remaining)
            </button>
          )}
        </div>
      )}

      {/* End Indicator */}
      {!hasMore && events.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-center py-8 text-white/40 text-sm">
          <span>✓ All events loaded</span>
        </div>
      )}
    </div>
  );
};

export default ListView;
