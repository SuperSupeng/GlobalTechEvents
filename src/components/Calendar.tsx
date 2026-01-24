import React, { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import { TechEvent } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import EmptyState from './EmptyState';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CalendarProps {
  events: TechEvent[];
  onEventClick: (event: TechEvent) => void;
}

const Calendar: React.FC<CalendarProps> = ({ events, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [userTimezone, setUserTimezone] = useState<string>('');
  const [timezoneOffset, setTimezoneOffset] = useState<string>('');
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  useEffect(() => {
    // 获取用户的浏览器时区
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(timezone);
    
    // 计算 UTC 偏移量
    const offset = -new Date().getTimezoneOffset();
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const sign = offset >= 0 ? '+' : '-';
    const offsetStr = `UTC${sign}${hours}${minutes > 0 ? ':' + minutes.toString().padStart(2, '0') : ''}`;
    setTimezoneOffset(offsetStr);
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
    setExpandedDays(new Set()); // 切换月份时重置展开状态
  };
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
    setExpandedDays(new Set()); // 切换月份时重置展开状态
  };
  const goToToday = () => setCurrentDate(new Date());

  const toggleDayExpanded = (dayKey: string) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dayKey)) {
        newSet.delete(dayKey);
      } else {
        newSet.add(dayKey);
      }
      return newSet;
    });
  };

  // 检查当前月份是否有活动
  const hasEventsThisMonth = events.some(event => 
    isSameMonth(new Date(event.startTime), currentDate)
  );

  return (
    <div className="glass-panel overflow-hidden border border-white/[0.05]">
      {/* Calendar Header */}
      <div className="p-8 border-b border-white/[0.05] bg-white/[0.02]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-serif italic text-white">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-3 sm:gap-6">
            <button 
              onClick={goToToday}
              className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all border border-white/10 hover:border-white/20"
            >
              Today
            </button>
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
              <button 
                onClick={prevMonth}
                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-md transition-all"
                aria-label="Previous month"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextMonth}
                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-md transition-all"
                aria-label="Next month"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
        {/* Timezone Indicator */}
        {userTimezone && (
          <div className="flex items-center gap-2 text-xs text-white/50">
            <Globe size={14} className="text-white/40" />
            <span>All times shown in your local timezone: <span className="text-white/70 font-medium">{userTimezone}</span> <span className="text-primary/70">({timezoneOffset})</span></span>
          </div>
        )}
      </div>

      {/* Weekdays Header */}
      <div className="calendar-grid bg-white/[0.01] border-b border-white/[0.05]">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-4 text-center text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
            {day}
          </div>
        ))}
      </div>

      {/* Empty State or Days Grid */}
      {!hasEventsThisMonth ? (
        <div className="p-8">
          <EmptyState type="calendar" onReset={goToToday} />
        </div>
      ) : (
        <div className="calendar-grid">
          {days.map((day, idx) => {
          const dayEvents = events.filter(event => isSameDay(new Date(event.startTime), day));
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());
          const isLastRow = idx >= days.length - 7; // 检查是否是最后一行
          const dayKey = day.toISOString();
          const isExpanded = expandedDays.has(dayKey);
          const displayLimit = isExpanded ? dayEvents.length : 3;

          return (
            <div 
              key={day.toString()} 
              className={cn(
                "min-h-[140px] p-4 border-r border-white/[0.05] transition-all group",
                !isLastRow && "border-b", // 最后一行不显示底部边框
                !isCurrentMonth ? "bg-black/20" : "bg-transparent hover:bg-white/[0.02]",
                idx % 7 === 6 && "border-r-0"
              )}
            >
              <div className="flex justify-between items-center mb-3">
                <span className={cn(
                  "text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full transition-all",
                  isToday ? "bg-white text-black font-bold shadow-xl shadow-white/10" : 
                  isCurrentMonth ? "text-white/80" : "text-white/20"
                )}>
                  {format(day, 'd')}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-[10px] text-white/40 font-medium">
                    {dayEvents.length}
                  </span>
                )}
              </div>
              
              <div className="space-y-1.5">
                {dayEvents.slice(0, displayLimit).map(event => (
                  <button
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="w-full text-left px-2.5 py-1.5 text-[10px] leading-tight rounded-lg bg-primary/15 border border-primary/30 text-white hover:bg-primary/25 hover:border-primary/40 transition-all truncate shadow-sm"
                  >
                    <span className="font-medium">{event.title}</span>
                  </button>
                ))}
                {dayEvents.length > 3 && (
                  <button
                    onClick={() => toggleDayExpanded(dayKey)}
                    className="w-full text-left px-2.5 py-1 text-[10px] text-white/50 hover:text-white/80 hover:bg-white/5 rounded-lg transition-all font-medium"
                  >
                    {isExpanded ? '− Show less' : `+ ${dayEvents.length - 3} more`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};

export default Calendar;
