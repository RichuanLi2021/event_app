import { useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { EventCard } from "~/components/home/eventCard";
import { api } from "~/api/central-axios";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const location = searchParams.get("location") || "";
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Search events when query or location changes
  useEffect(() => {
    if (query.trim() || location) {
      searchEvents(query, location);
    } else {
      // Show all events when no search parameters
      fetchAllEvents();
    }
  }, [query, location]);

  const fetchAllEvents = async () => {
    setLoading(true);
    try {
      const response = await api.get("/events");
      setSearchResults(response.data);
    } catch (error) {
      console.error("Failed to fetch all events:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const searchEvents = async (searchQuery: string, searchLocation: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.append('q', searchQuery.trim());
      }
      if (searchLocation) {
        params.append('location', searchLocation);
      }
      
      const response = await api.get(`/events/search?${params.toString()}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Convert backend event format to frontend format
  const formatEventForCard = (event: any) => ({
    id: event._id,
    title: event.title,
    date: new Date(event.date).toLocaleDateString('en-US', { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }),
    time: new Date(event.date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    }),
    location: event.location,
    imageUrl: event.imageUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80" // Use actual imageUrl from database, fallback to default
  });

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-5 py-4">
      <h2 className="text-2xl font-semibold mb-6">
        {query.trim() || location ? (
          <>
            Search Results
            {query.trim() && (
              <> for: <span className="text-orange-600">"{query}"</span></>
            )}
            {location && (
              <> in: <span className="text-blue-600">"{location}"</span></>
            )}
          </>
        ) : (
          ""
        )}
      </h2>

      {loading && (
        <div className="text-center py-8">
          <p>Searching...</p>
        </div>
      )}

      {!loading && searchResults.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {query.trim() || location 
              ? `No events found${query.trim() ? ` matching "${query}"` : ''}${location ? ` in ${location}` : ''}.`
              : "No events available at the moment."
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.map((event) => (
            <EventCard
              key={event._id}
              {...formatEventForCard(event)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
