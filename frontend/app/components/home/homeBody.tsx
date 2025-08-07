import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { fetchAllEvents } from '~/redux/actions/events/Event-actionCreators';
import { CarouselsHome } from "./carousels";
import { CategoryBar } from "./categoryBar";
import { EventList } from "./eventList";

export default function HomeBody() {
  const dispatch = useAppDispatch();
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const { events, loading } = useAppSelector((state) => ({
    events: state.events.events,
    loading: state.events.loading
  }));

  // Fetch events on mount
  useEffect(() => {
    dispatch(fetchAllEvents());
  }, [dispatch]);

  return (
    <div className="home-body-container">
      <CarouselsHome events={events} />
      <CategoryBar 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <EventList selectedCategory={selectedCategory} />
    </div>
  );
}