import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, MapPin, Globe, ChevronDown, X } from 'lucide-react';
import { ViewMode } from '../types';

interface FilterPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  formatFilter: string;
  onFormatChange: (format: string) => void;
  locationFilter: string;
  onLocationChange: (location: string) => void;
  allLocations: string[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onClearFilters: () => void;
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
  onViewModeChange,
  onClearFilters
}) => {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const locationButtonRef = useRef<HTMLButtonElement>(null);
  
  // 筛选地点列表
  const filteredLocations = allLocations.filter(location =>
    location.toLowerCase().includes(locationSearchQuery.toLowerCase())
  );

  // 计算下拉菜单位置
  useEffect(() => {
    if (showLocationDropdown && locationButtonRef.current) {
      const rect = locationButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left
      });
    }
  }, [showLocationDropdown]);

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

  // 检查是否有激活的筛选条件
  const hasActiveFilters = searchQuery || formatFilter !== 'all' || locationFilter !== 'all';

  return (
    <>
      <div className="space-y-5 mb-8 sm:mb-12">
        {/* Search Bar + Location + Clear Button on Desktop */}
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
          {/* Search Bar */}
          <div className="relative group flex-1">
            <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-4 sm:py-5 bg-[#0a0a0a]/70 border border-white/[0.15] rounded-[2rem] text-white text-sm sm:text-base placeholder:text-white/40 focus:outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10 backdrop-blur-2xl transition-all font-sans shadow-lg shadow-black/30"
            />
          </div>

          {/* Location Filter - Desktop: 旁边, Mobile: 下方 */}
          <div className="relative lg:w-auto w-full">
            <button
              ref={locationButtonRef}
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="flex items-center justify-between gap-2 px-5 sm:px-6 h-[52px] sm:h-[64px] bg-[#0a0a0a]/70 border border-white/[0.15] rounded-full text-white/70 hover:text-white hover:border-white/25 active:scale-[0.98] transition-all backdrop-blur-2xl shadow-lg shadow-black/30 w-full lg:min-w-[220px]"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <MapPin size={18} className="text-white/50 flex-shrink-0" />
                <span className="text-sm font-medium truncate">
                  {locationFilter === 'all' ? 'All Locations' : 
                   locationFilter === 'online' ? 'Online Events' : 
                   locationFilter}
                </span>
              </div>
              <ChevronDown size={16} className={`text-white/40 flex-shrink-0 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-2 px-4 sm:px-5 h-[52px] sm:h-[64px] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-white/60 hover:text-white transition-all backdrop-blur-2xl shadow-lg shadow-black/30 active:scale-95"
            >
              <X size={16} />
              <span className="text-sm font-medium">Clear</span>
            </button>
          )}
        </div>

        {/* Filters Row - Format + View 在一行 */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4">
          {/* Format Select */}
          <div className="flex bg-[#0a0a0a]/70 border border-white/[0.15] rounded-full p-1.5 h-[52px] sm:h-[56px] items-center backdrop-blur-2xl shadow-lg shadow-black/30 flex-1 sm:flex-none sm:min-w-[280px]">
            <button 
              onClick={() => onFormatChange('all')}
              className={`px-5 sm:px-6 py-2.5 rounded-full text-xs font-semibold transition-all uppercase tracking-wider flex-1 active:scale-95 ${formatFilter === 'all' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white'}`}
            >
              All
            </button>
            <button 
              onClick={() => onFormatChange('online')}
              className={`px-4 sm:px-6 py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider flex-1 active:scale-95 ${formatFilter === 'online' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white'}`}
            >
              <Globe size={14} />
              <span>Online</span>
            </button>
            <button 
              onClick={() => onFormatChange('offline')}
              className={`px-4 sm:px-6 py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider flex-1 active:scale-95 ${formatFilter === 'offline' ? 'bg-white text-black shadow-lg' : 'text-white/60 hover:text-white'}`}
            >
              <MapPin size={14} />
              <span>Offline</span>
            </button>
          </div>

          {/* View Switcher */}
          <div className="flex bg-[#0a0a0a]/70 border border-white/[0.15] rounded-full p-1.5 h-[52px] sm:h-[56px] items-center backdrop-blur-2xl shadow-lg shadow-black/30 flex-1 sm:flex-none sm:min-w-[240px]">
            <button 
              onClick={() => onViewModeChange('month')}
              className={`px-5 sm:px-6 py-2.5 rounded-full text-xs font-semibold transition-all uppercase tracking-wider flex-1 active:scale-95 ${viewMode === 'month' ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white'}`}
            >
              Month
            </button>
            <button 
              onClick={() => onViewModeChange('week')}
              className={`px-5 sm:px-6 py-2.5 rounded-full text-xs font-semibold transition-all uppercase tracking-wider flex-1 active:scale-95 ${viewMode === 'week' ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white'}`}
            >
              Week
            </button>
            <button 
              onClick={() => onViewModeChange('list')}
              className={`px-5 sm:px-6 py-2.5 rounded-full text-xs font-semibold transition-all uppercase tracking-wider flex-1 active:scale-95 ${viewMode === 'list' ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white'}`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Location Dropdown - Rendered with Portal to document.body */}
      {showLocationDropdown && createPortal(
        <div 
          ref={locationDropdownRef}
          className="fixed w-[calc(100%-2rem)] max-w-[400px] sm:w-[360px] bg-[#0a0a0a]/98 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200" 
          style={{ 
            zIndex: 99999,
            top: `${dropdownPosition.top}px`,
            left: window.innerWidth < 640 ? '1rem' : `${dropdownPosition.left}px`
          }}
        >
          {/* Search Input */}
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search location..."
                value={locationSearchQuery}
                onChange={(e) => setLocationSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          </div>
          
          {/* Location List */}
          <div className="max-h-80 overflow-y-auto overscroll-contain">
            <button
              onClick={() => { onLocationChange('all'); setShowLocationDropdown(false); setLocationSearchQuery(''); }}
              className={`w-full px-5 py-3.5 text-left text-sm hover:bg-white/5 active:bg-white/10 transition-colors font-medium ${locationFilter === 'all' ? 'bg-white/10 text-white' : 'text-white/70'}`}
            >
              All Locations
            </button>
            <button
              onClick={() => { onLocationChange('online'); setShowLocationDropdown(false); setLocationSearchQuery(''); }}
              className={`w-full px-5 py-3.5 text-left text-sm hover:bg-white/5 active:bg-white/10 transition-colors border-t border-white/5 flex items-center gap-2.5 font-medium ${locationFilter === 'online' ? 'bg-white/10 text-white' : 'text-white/70'}`}
            >
              <Globe size={16} className="text-emerald-400 flex-shrink-0" />
              <span>Online Events</span>
            </button>
            
            {filteredLocations.length > 0 ? (
              <>
                <div className="border-t border-white/10 my-1"></div>
                {filteredLocations.map(location => (
                  <button
                    key={location}
                    onClick={() => { onLocationChange(location); setShowLocationDropdown(false); setLocationSearchQuery(''); }}
                    className={`w-full px-5 py-3.5 text-left text-sm hover:bg-white/5 active:bg-white/10 transition-colors font-medium ${locationFilter === location ? 'bg-white/10 text-white' : 'text-white/70'}`}
                  >
                    <MapPin size={14} className="inline mr-2 text-white/40" />
                    {location}
                  </button>
                ))}
              </>
            ) : locationSearchQuery && (
              <div className="px-5 py-12 text-center text-white/40 text-sm">
                <Search size={24} className="mx-auto mb-2 opacity-30" />
                <p>No locations found</p>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default FilterPanel;
