import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Globe, ChevronDown } from 'lucide-react';

interface FilterPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  formatFilter: string;
  onFormatChange: (format: string) => void;
  locationFilter: string;
  onLocationChange: (location: string) => void;
  allLocations: string[];
  viewMode: 'month' | 'list';
  onViewModeChange: (mode: 'month' | 'list') => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  searchQuery,
  onSearchChange,
  formatFilter,
  onFormatChange,
  locationFilter,
  onLocationChange,
  allLocations,
  viewMode,
  onViewModeChange
}) => {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  
  // 筛选地点列表
  const filteredLocations = allLocations.filter(location =>
    location.toLowerCase().includes(locationSearchQuery.toLowerCase())
  );

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
        setLocationSearchQuery('');
      }
    };

    if (showLocationDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLocationDropdown]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mb-8 sm:mb-12">
      {/* Search Bar */}
      <div className="flex-grow relative group w-full">
        <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors" size={20} />
        <input 
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-4 sm:py-5 bg-[#0a0a0a]/70 border border-white/[0.15] rounded-[2rem] text-white text-sm sm:text-base placeholder:text-white/40 focus:outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10 backdrop-blur-2xl transition-all font-sans shadow-lg shadow-black/30"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto relative z-40">
        {/* Location Filter */}
        <div className="relative" ref={locationDropdownRef}>
          <button
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            className="flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-[#0a0a0a]/70 border border-white/[0.15] rounded-full text-white/70 hover:text-white hover:border-white/25 transition-all backdrop-blur-2xl shadow-lg shadow-black/30 w-full sm:w-auto text-sm min-w-[160px]"
          >
            <MapPin size={16} className="text-white/50 flex-shrink-0" />
            <span className="text-xs sm:text-sm whitespace-nowrap flex-1 text-left">
              {locationFilter === 'all' ? 'All Locations' : 
               locationFilter === 'online' ? 'Online Events' : 
               locationFilter.length > 20 ? locationFilter.substring(0, 20) + '...' : locationFilter}
            </span>
            <ChevronDown size={16} className="text-white/40 flex-shrink-0" />
          </button>
          
          {showLocationDropdown && (
            <div className="absolute top-full left-0 sm:left-auto sm:right-0 sm:min-w-[320px] mt-2 bg-[#0a0a0a]/98 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl z-[100]">
              {/* Search Input */}
              <div className="p-3 border-b border-white/5">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search location..."
                    value={locationSearchQuery}
                    onChange={(e) => setLocationSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              
              {/* Location List */}
              <div className="max-h-64 overflow-y-auto">
                <button
                  onClick={() => { onLocationChange('all'); setShowLocationDropdown(false); setLocationSearchQuery(''); }}
                  className={`w-full px-6 py-3 text-left text-sm hover:bg-white/5 transition-all whitespace-nowrap ${locationFilter === 'all' ? 'bg-white/10 text-white' : 'text-white/70'}`}
                >
                  All Locations
                </button>
                <button
                  onClick={() => { onLocationChange('online'); setShowLocationDropdown(false); setLocationSearchQuery(''); }}
                  className={`w-full px-6 py-3 text-left text-sm hover:bg-white/5 transition-all border-t border-white/5 flex items-center gap-2 whitespace-nowrap ${locationFilter === 'online' ? 'bg-white/10 text-white' : 'text-white/70'}`}
                >
                  <Globe size={14} className="text-emerald-400" />
                  Online Events
                </button>
                
                {filteredLocations.length > 0 ? (
                  <>
                    <div className="border-t border-white/10 my-2"></div>
                    {filteredLocations.map(location => (
                      <button
                        key={location}
                        onClick={() => { onLocationChange(location); setShowLocationDropdown(false); setLocationSearchQuery(''); }}
                        className={`w-full px-6 py-3 text-left text-sm hover:bg-white/5 transition-all whitespace-nowrap ${locationFilter === location ? 'bg-white/10 text-white' : 'text-white/70'}`}
                      >
                        {location}
                      </button>
                    ))}
                  </>
                ) : locationSearchQuery && (
                  <div className="px-6 py-8 text-center text-white/40 text-sm">
                    No locations found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Format Select */}
        <div className="flex bg-[#0a0a0a]/70 border border-white/[0.15] rounded-full p-1.5 h-[56px] sm:h-[64px] items-center backdrop-blur-2xl shadow-lg shadow-black/30 w-full sm:w-auto justify-between sm:justify-start">
          <button 
            onClick={() => onFormatChange('all')}
            className={`px-4 sm:px-6 py-2 rounded-full text-[10px] sm:text-xs font-bold transition-all uppercase tracking-widest flex-1 sm:flex-none ${formatFilter === 'all' ? 'bg-white text-black shadow-lg' : 'text-white/50 hover:text-white'}`}
          >
            All
          </button>
          <button 
            onClick={() => onFormatChange('online')}
            className={`px-3 sm:px-6 py-2 rounded-full text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all uppercase tracking-widest flex-1 sm:flex-none ${formatFilter === 'online' ? 'bg-white text-black shadow-lg' : 'text-white/50 hover:text-white'}`}
          >
            <Globe size={12} className="sm:w-3.5 sm:h-3.5" /> <span className="hidden xs:inline">Online</span>
          </button>
          <button 
            onClick={() => onFormatChange('offline')}
            className={`px-3 sm:px-6 py-2 rounded-full text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all uppercase tracking-widest flex-1 sm:flex-none ${formatFilter === 'offline' ? 'bg-white text-black shadow-lg' : 'text-white/50 hover:text-white'}`}
          >
            <MapPin size={12} className="sm:w-3.5 sm:h-3.5" /> <span className="hidden xs:inline">Offline</span>
          </button>
        </div>

        {/* View Switcher */}
        <div className="flex bg-[#0a0a0a]/70 border border-white/[0.15] rounded-full p-1.5 h-[56px] sm:h-[64px] items-center backdrop-blur-2xl shadow-lg shadow-black/30 w-full sm:w-auto">
          <button 
            onClick={() => onViewModeChange('month')}
            className={`px-6 sm:px-8 py-2 rounded-full text-[10px] sm:text-xs font-bold transition-all uppercase tracking-widest flex-1 sm:flex-none ${viewMode === 'month' ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white'}`}
          >
            Calendar
          </button>
          <button 
            onClick={() => onViewModeChange('list')}
            className={`px-6 sm:px-8 py-2 rounded-full text-[10px] sm:text-xs font-bold transition-all uppercase tracking-widest flex-1 sm:flex-none ${viewMode === 'list' ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white'}`}
          >
            List
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
