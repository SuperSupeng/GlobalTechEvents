import React from 'react';
import { Search, MapPin, Globe } from 'lucide-react';

interface FilterPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  formatFilter: string;
  onFormatChange: (format: string) => void;
  viewMode: 'month' | 'list';
  onViewModeChange: (mode: 'month' | 'list') => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  searchQuery,
  onSearchChange,
  formatFilter,
  onFormatChange,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 mb-12">
      {/* Search Bar */}
      <div className="flex-grow relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={20} />
        <input 
          type="text"
          placeholder="Search for events, organizers, or topics..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-16 pr-6 py-5 bg-white/[0.03] border border-white/[0.08] rounded-[2rem] text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 backdrop-blur-xl transition-all font-sans"
        />
      </div>

      <div className="flex items-center gap-6">
        {/* Format Select */}
        <div className="flex bg-white/[0.03] border border-white/[0.08] rounded-full p-1.5 h-[64px] items-center backdrop-blur-xl">
          <button 
            onClick={() => onFormatChange('all')}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all uppercase tracking-widest ${formatFilter === 'all' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
          >
            All
          </button>
          <button 
            onClick={() => onFormatChange('online')}
            className={`px-6 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all uppercase tracking-widest ${formatFilter === 'online' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
          >
            <Globe size={14} /> Online
          </button>
          <button 
            onClick={() => onFormatChange('offline')}
            className={`px-6 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all uppercase tracking-widest ${formatFilter === 'offline' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
          >
            <MapPin size={14} /> Offline
          </button>
        </div>

        {/* View Switcher */}
        <div className="flex bg-white/[0.03] border border-white/[0.08] rounded-full p-1.5 h-[64px] items-center backdrop-blur-xl">
          <button 
            onClick={() => onViewModeChange('month')}
            className={`px-8 py-2 rounded-full text-xs font-bold transition-all uppercase tracking-widest ${viewMode === 'month' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
          >
            Calendar
          </button>
          <button 
            onClick={() => onViewModeChange('list')}
            className={`px-8 py-2 rounded-full text-xs font-bold transition-all uppercase tracking-widest ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
          >
            List
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
