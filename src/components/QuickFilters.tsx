import React from 'react';
import { Sparkles, Cpu, Link as LinkIcon, DollarSign, Cloud, Code2, Users } from 'lucide-react';

interface QuickFilter {
  id: string;
  label: string;
  icon: React.ReactNode;
  searchTerm?: string;
  tagFilter?: string;
  badge?: string;
}

interface QuickFiltersProps {
  onFilterClick: (searchTerm: string) => void;
  onTagFilterClick?: (tag: string) => void;
}

const QuickFilters: React.FC<QuickFiltersProps> = ({ onFilterClick, onTagFilterClick }) => {
  const filters: QuickFilter[] = [
    { 
      id: 'featured', 
      label: 'Featured', 
      icon: <Sparkles size={14} />, 
      tagFilter: 'Featured',
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
      id: 'cloud', 
      label: 'Cloud', 
      icon: <Cloud size={14} />, 
      searchTerm: 'Cloud' 
    },
    { 
      id: 'devops', 
      label: 'DevOps', 
      icon: <Code2 size={14} />, 
      searchTerm: 'DevOps' 
    },
    { 
      id: 'meetup', 
      label: 'Meetup', 
      icon: <Users size={14} />, 
      searchTerm: 'Meetup' 
    },
    { 
      id: 'free', 
      label: 'Free', 
      icon: <DollarSign size={14} />, 
      searchTerm: 'Free' 
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => {
            if (filter.tagFilter && onTagFilterClick) {
              onTagFilterClick(filter.tagFilter);
            } else {
              onFilterClick(filter.searchTerm ?? filter.label);
            }
          }}
          className="group flex items-center gap-1.5 px-3 py-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/20 hover:border-primary/50 rounded-full text-white/80 hover:text-white transition-all text-xs font-medium active:scale-95 shadow-lg"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
        >
          {filter.badge ? (
            <span className="text-sm drop-shadow-lg">{filter.badge}</span>
          ) : (
            <span className="text-white/60 group-hover:text-primary transition-colors drop-shadow-lg">
              {filter.icon}
            </span>
          )}
          <span className="font-semibold">{filter.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickFilters;
