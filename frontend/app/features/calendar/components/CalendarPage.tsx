import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import type { TheEvent } from '../../events/types';
import { fetchAllEvents } from '../../events/services/eventApi';
import { useNavigate } from 'react-router-dom';

interface RootState {
  events: {
    events: TheEvent[];
    loading: boolean;
    error: string | null;
  };
}

export default function CalendarPage() {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state: RootState) => state.events);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [localEvents, setLocalEvents] = useState<TheEvent[]>([]);
  const [localLoading, setLocalLoading] = useState(true);
  const navigate = useNavigate();

  // Load events on component mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLocalLoading(true);
        const eventsData = await fetchAllEvents();
        setLocalEvents(eventsData);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLocalLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Use local events if Redux events are empty (for testing)
  const displayEvents = events.length > 0 ? events : localEvents;
  const displayLoading = loading || localLoading;

  // Get current month's first day and last day
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  // Generate calendar days
  const calendarDays = [];
  const currentDay = new Date(startDate);
  
  while (currentDay <= lastDayOfMonth || currentDay.getDay() !== 0) {
    calendarDays.push(new Date(currentDay));
    currentDay.setDate(currentDay.getDate() + 1);
  }

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return displayEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const years = Array.from({ length: 11 }, (_, i) => 2020 + i); // 2020-2030
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Event Calendar</h1>
              <p className="mt-2 text-gray-600">View and manage your events</p>
            </div>
            <button
              onClick={goToToday}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Today
            </button>
          </div>
        </div>

        {/* Year/Month Picker */}
        <div className="flex gap-4 mb-6 items-center">
          <select
            value={currentDate.getFullYear()}
            onChange={e => setCurrentDate(new Date(Number(e.target.value), currentDate.getMonth(), 1))}
            className="border rounded px-4 py-2 text-lg font-semibold min-w-[110px]"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <select
            value={currentDate.getMonth()}
            onChange={e => setCurrentDate(new Date(currentDate.getFullYear(), Number(e.target.value), 1))}
            className="border rounded px-4 py-2 text-lg font-semibold min-w-[140px]"
          >
            {months.map((month, idx) => (
              <option key={month} value={idx}>{month}</option>
            ))}
          </select>
        </div>

        {/* Calendar Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between gap-8">
              <button
                onClick={goToPreviousMonth}
                className="p-4 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <ChevronLeft className="h-8 w-8 text-gray-600" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 whitespace-nowrap">
                {formatDate(currentDate)}
              </h2>
              <button
                onClick={goToNextMonth}
                className="p-4 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <ChevronRight className="h-8 w-8 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-8">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="bg-gray-50 px-4 py-4 text-center text-lg font-bold text-gray-700">
                  {day}
                </div>
              ))}
              {/* Calendar Days */}
              {calendarDays.map((date, index) => {
                const dayEvents = getEventsForDate(date);
                const hasEvents = dayEvents.length > 0;
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      min-h-[160px] p-4 bg-white hover:bg-gray-50 cursor-pointer border border-gray-100
                      ${!isCurrentMonth(date) ? 'text-gray-400' : 'text-gray-900'}
                      ${isToday(date) ? 'bg-blue-50 border-blue-200' : ''}
                      ${isSelected(date) ? 'ring-2 ring-blue-500' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`
                        text-lg font-bold
                        ${isToday(date) ? 'text-blue-600' : ''}
                      `}>
                        {date.getDate()}
                      </span>
                      {hasEvents && (
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      )}
                    </div>
                    {/* Event Indicators */}
                    <div className="space-y-2">
                      {dayEvents.slice(0, 2).map((event, eventIndex) => (
                        <div
                          key={eventIndex}
                          className="text-sm p-2 bg-blue-100 text-blue-800 rounded truncate"
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-sm text-gray-500">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Date Events */}
        {selectedDate && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Events for {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
            </div>
            
            <div className="p-6">
              {displayLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading events...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">Error loading events: {error}</p>
                </div>
              ) : getEventsForDate(selectedDate).length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No events scheduled for this date</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getEventsForDate(selectedDate).map((event) => (
                    <div key={event._id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex-shrink-0">
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-gray-900 truncate">
                          {event.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {/* Show date and location */}
                          {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {event.location}
                        </p>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {event.description}
                        </p>
                        <div className="mt-3 flex items-center space-x-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {event.category || event.status}
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            {event.costs}
                          </span>
                        </div>
                      </div>
                      <button
onClick={() => {
  localStorage.setItem('selectedEventId', event._id as string);
  navigate('/event-details');
}}

>
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}        
      </div>
    </div>
  );
} 