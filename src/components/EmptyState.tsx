import React from 'react';
import { Calendar, Search, Filter } from 'lucide-react';

interface EmptyStateProps {
  type?: 'search' | 'filter' | 'calendar';
  searchQuery?: string;
  onReset?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  type = 'search', 
  searchQuery,
  onReset 
}) => {
  const configs = {
    search: {
      icon: Search,
      title: 'No events found',
      description: searchQuery 
        ? `No results for "${searchQuery}"`
        : 'Try adjusting your search terms',
    },
    filter: {
      icon: Filter,
      title: 'No matching events',
      description: 'Try changing your filters to see more events',
    },
    calendar: {
      icon: Calendar,
      title: 'No events this month',
      description: 'Try navigating to a different month or clearing filters',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="glass-panel p-16 sm:p-24 text-center border-dashed border-white/10">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white/30">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl sm:text-2xl font-serif italic mb-3 text-white/90">
        {config.title}
      </h3>
      <p className="text-sm sm:text-base text-white/50 mb-6 max-w-md mx-auto leading-relaxed">
        {config.description}
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-sm text-white/70 hover:text-white transition-all font-medium"
        >
          Clear filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;
