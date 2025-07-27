import React, { useEffect } from 'react';
import { EventCard } from './eventCard';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { fetchAllEvents } from '~/redux/actions/events/Event-actionCreators';

export const EventList = () => {
  const dispatch = useAppDispatch();

  // Select pieces of state
  const { 
    events: events, 
    loading, 
    error 
  } = useAppSelector(
    (state) => state.events
  );

  // Fetch on mount
  useEffect(() => {
    dispatch(fetchAllEvents());
  }, [dispatch]);

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-5 py-4">
      {loading && <p className="text-center">Loading events…</p>}
      {error && (
        <p className="text-center text-red-600">
          Failed to load events: {error}
        </p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              id={event._id} 
              title={event.title}
              date={event.date.toString()}
              time={new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              location={event.location}
              imageUrl={(event as any).imageUrl || '/placeholder/event.png'}
            />
          ))}
        </div>
      )}
    </div>
  );
};