import React from 'react';
import { Sparkles, Cpu, Link as LinkIcon, DollarSign, Calendar as CalendarIcon } from 'lucide-react';

interface QuickFilter {
  id: string;
  label: string;
  icon: React.ReactNode;
  searchTerm?: string;
  badge?: string;
}

interface QuickFiltersProps {
  onFilterClick: (searchTerm: string) => void;
}

const QuickFilters: React.FC<QuickFiltersProps> = ({ onFilterClick }) => {
  const filters: QuickFilter[] = [
    { 
      id: 'hot', 
      label: 'Hot', 
      icon: <Sparkles size={14} />, 
      searchTerm: '',
      badge: '🔥'
    },
    { 
      id: 'ai', 
      label: 'AI', 
      icon: <Cpu size={14} />, 
      searchTerm: 'AI' 
    },
    { 
      id: 'web3', 
      label: 'Web3', 
      icon: <LinkIcon size={14} />, 
      searchTerm: 'Web3' 
    },
    { 
      id: 'blockchain', 
      label: 'Blockchain', 
      icon: <LinkIcon size={14} />, 
      searchTerm: 'Blockchain' 
    },
    { 
      id: 'free', 
      label: 'Free', 
      icon: <DollarSign size={14} />, 
      searchTerm: 'Free' 
    },
    { 
      id: 'this-week', 
      label: 'This Week', 
      icon: <CalendarIcon size={14} />, 
      searchTerm: '',
      badge: '📅'
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterClick(filter.searchTerm || filter.label)}
          className="group flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 rounded-full text-white/60 hover:text-white transition-all text-xs font-medium active:scale-95"
        >
          {filter.badge ? (
            <span className="text-sm">{filter.badge}</span>
          ) : (
            <span className="text-white/40 group-hover:text-primary/70 transition-colors">
              {filter.icon}
            </span>
          )}
          <span>{filter.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickFilters;
