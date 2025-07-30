import React, { useEffect, useState } from 'react';
import { EventCard } from './eventCard';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { fetchAllEvents } from '~/redux/actions/events/Event-actionCreators';
import { api } from "~/api/central-axios";

interface EventListProps {
  selectedCategory: string;
}

export const EventList = ({ selectedCategory }: EventListProps) => {
  const dispatch = useAppDispatch();
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Select pieces of state
  const { events, loading: reduxLoading, error } = useAppSelector((state) => ({
   events: state.events.events,
   loading: state.events.loading,
   error: state.events.error
  }));

  // Fetch events by category when category changes
  useEffect(() => {
    const fetchEventsByCategory = async () => {
      setLoading(true);
      try {
        if (selectedCategory === "All") {
          const approvedEvents = events.filter(event => event.status === 'APPROVED');
          setFilteredEvents(approvedEvents);
        } else {
          const response = await api.get(`/events/categories/${selectedCategory}`);
          const approvedEvents = response.data.filter((event: any) => event.status === 'APPROVED');
          setFilteredEvents(approvedEvents);
        }
      } catch (error) {
        console.error("Failed to fetch events by category:", error);
        setFilteredEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEventsByCategory();
  }, [selectedCategory, events]);

  // Fetch all events on mount
  useEffect(() => {
    dispatch(fetchAllEvents());
  }, [dispatch]);

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-5 py-4">
      {(loading || reduxLoading) && <p className="text-center">Loading events…</p>}
      {error && (
        <p className="text-center text-red-600">
          Failed to load events: {error}
        </p>
      )}

      {!loading && !reduxLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              id={event._id} 
              title={event.title}
              date={new Date(event.date).toLocaleDateString('en-US', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
              time={new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              location={event.location}
              imageUrl={(event as any).imageUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'}
            />
          ))}
        </div>
      )}
    </div>
  );
};