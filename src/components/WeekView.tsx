import React, { useState, useMemo } from 'react';
import { TechEvent } from '../types';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay,
  addWeeks,
  subWeeks,
  parseISO,
  isWithinInterval,
  startOfDay,
  endOfDay
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Globe } from 'lucide-react';
import EventDetail from './EventDetail';
import EmptyState from './EmptyState';

interface WeekViewProps {
  events: TechEvent[];
}

const WeekView: React.FC<WeekViewProps> = ({ events }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 })); // Monday
  const [selectedEvent, setSelectedEvent] = useState<TechEvent | null>(null);

  const weekDays = useMemo(() => {
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: currentWeekStart, end: weekEnd });
  }, [currentWeekStart]);

  // Get user's timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Filter events for current week
  const weekEvents = useMemo(() => {
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    return events.filter(event => {
      const eventStart = parseISO(event.startTime);
      const eventEnd = parseISO(event.endTime);
      return isWithinInterval(eventStart, { start: startOfDay(currentWeekStart), end: endOfDay(weekEnd) }) ||
             isWithinInterval(eventEnd, { start: startOfDay(currentWeekStart), end: endOfDay(weekEnd) });
    });
  }, [events, currentWeekStart]);

  // Separate all-day and timed events
  const { allDayEvents, timedEvents } = useMemo(() => {
    const allDay: TechEvent[] = [];
    const timed: TechEvent[] = [];
    
    weekEvents.forEach(event => {
      if (event.isAllDay) {
        allDay.push(event);
      } else {
        timed.push(event);
      }
    });
    
    return { allDayEvents: allDay, timedEvents: timed };
  }, [weekEvents]);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const goToPreviousWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  const goToNextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  const goToToday = () => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Get events for specific day and hour
  const getEventsForDayAndHour = (day: Date, hour: number) => {
    return timedEvents.filter(event => {
      const eventStart = parseISO(event.startTime);
      const eventEnd = parseISO(event.endTime);
      
      if (!isSameDay(eventStart, day)) return false;
      
      const startHour = eventStart.getHours();
      const endHour = eventEnd.getHours();
      const endMinute = eventEnd.getMinutes();
      
      return hour >= startHour && (hour < endHour || (hour === endHour && endMinute > 0));
    });
  };

  // Calculate event position and height
  const getEventStyle = (event: TechEvent, day: Date) => {
    const eventStart = parseISO(event.startTime);
    const eventEnd = parseISO(event.endTime);
    
    if (!isSameDay(eventStart, day)) return null;
    
    const startHour = eventStart.getHours();
    const startMinute = eventStart.getMinutes();
    const durationMinutes = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60);
    
    const top = (startHour * 60 + startMinute) / 60; // in hours
    const height = durationMinutes / 60; // in hours
    
    return {
      top: `${top * 60}px`, // 60px per hour
      height: `${Math.max(height * 60, 30)}px`, // minimum 30px
    };
  };

  const isToday = (day: Date) => isSameDay(day, new Date());

  if (weekEvents.length === 0) {
    return (
      <div className="space-y-6">
        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            Week of {format(currentWeekStart, 'MMM d')} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'MMM d, yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousWeek}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Previous week"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
            >
              Today
            </button>
            <button
              onClick={goToNextWeek}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Next week"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <EmptyState type="calendar" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Week of {format(currentWeekStart, 'MMM d')} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'MMM d, yyyy')}
          </h2>
          <p className="text-sm text-white/50 mt-1">Showing times in {userTimezone}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousWeek}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Previous week"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
          >
            Today
          </button>
          <button
            onClick={goToNextWeek}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Next week"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* All-Day Events Section */}
      {allDayEvents.length > 0 && (
        <div className="bg-[#0a0a0a]/70 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
          <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
            <CalendarIcon size={16} />
            All-Day Events
          </h3>
          <div className="grid gap-2">
            {allDayEvents.map(event => {
              const eventStart = parseISO(event.startTime);
              const eventEnd = parseISO(event.endTime);
              const isMultiDay = !isSameDay(eventStart, eventEnd);
              
              return (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 transition-all text-left group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-white group-hover:text-primary transition-colors line-clamp-1">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-white/50 flex-shrink-0">
                        {event.format === 'online' ? (
                          <><Globe size={12} /> Online</>
                        ) : event.location ? (
                          <><MapPin size={12} /> {event.location.city}</>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <Clock size={12} />
                      {isMultiDay ? (
                        <span>{format(eventStart, 'MMM d')} - {format(eventEnd, 'MMM d')}</span>
                      ) : (
                        <span>{format(eventStart, 'EEEE, MMM d')}</span>
                      )}
                      <span className="text-white/30">•</span>
                      <span>All Day</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Week Grid */}
      <div className="bg-[#0a0a0a]/70 border border-white/10 rounded-2xl backdrop-blur-xl overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Days Header */}
          <div 
            className="grid border-b border-white/10 bg-white/5"
            style={{ gridTemplateColumns: '100px repeat(7, 1fr)' }}
          >
          <div className="py-3 text-xs font-semibold text-white/50 border-r border-white/10 flex items-center justify-center">Time</div>
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={`p-3 text-center border-r border-white/10 last:border-r-0 ${
                isToday(day) ? 'bg-primary/10' : ''
              }`}
            >
              <div className="text-xs font-semibold text-white/70">{format(day, 'EEE')}</div>
              <div className={`text-lg font-bold ${isToday(day) ? 'text-primary' : 'text-white'}`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
          </div>

          {/* Time Grid */}
          <div>
            {hours.map(hour => (
              <div 
                key={hour} 
                className="grid border-b border-white/5 last:border-b-0" 
                style={{ height: '60px', gridTemplateColumns: '100px repeat(7, 1fr)' }}
              >
                {/* Hour Label */}
                <div className="py-3 text-xs text-white/40 border-r border-white/10 flex items-start justify-center">
                  {format(new Date().setHours(hour, 0, 0, 0), 'HH:mm')}
                </div>
                
                {/* Day Cells */}
                {weekDays.map((day, dayIndex) => {
                  const dayEvents = getEventsForDayAndHour(day, hour);
                  const isFirstHourOfEvent = dayEvents.filter(event => {
                    const eventStart = parseISO(event.startTime);
                    return eventStart.getHours() === hour;
                  });

                  return (
                    <div
                      key={dayIndex}
                      className={`relative p-3 border-r border-white/10 last:border-r-0 ${
                        isToday(day) ? 'bg-primary/5' : 'bg-transparent'
                      }`}
                    >
                      {/* Render events at their start hour */}
                      {isFirstHourOfEvent.map(event => {
                        const style = getEventStyle(event, day);
                        if (!style) return null;

                        return (
                          <button
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className="absolute left-1 right-1 bg-primary/20 border border-primary/40 rounded-lg p-1.5 text-left hover:bg-primary/30 hover:border-primary/60 transition-all overflow-hidden group z-10"
                            style={style}
                          >
                            <div className="text-xs font-semibold text-white line-clamp-1 group-hover:text-primary transition-colors">
                              {event.title}
                            </div>
                            <div className="text-[10px] text-white/50 line-clamp-1">
                              {format(parseISO(event.startTime), 'HH:mm')} - {format(parseISO(event.endTime), 'HH:mm')}
                            </div>
                            {event.format === 'online' && (
                              <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-0.5">
                                <Globe size={10} />
                                Online
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetail
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default WeekView;
