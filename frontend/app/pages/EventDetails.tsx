import EventInfo from "../features/events/components/EventInfo";
import EventMap from "../features/events/components/EventMap";
import BookButton from "../features/events/components/BookButton";
import { useParams } from "react-router-dom";
import { useAppSelector } from '~/redux/hooks';

export default function EventDetails() {
  const events = useAppSelector((state) => state.events.events);
  const { eventTitle } = useParams<{ eventTitle: string }>();

  const event = events.find((ev) => {
    // Convert event title to URL-friendly format for comparison
    const eventTitleSlug = ev.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

    return eventTitleSlug === eventTitle;
  });

  if (events.length === 0) {
    return (
      <div className="max-w-screen-lg mx-auto p-6 text-center">
        <p className="text-gray-600">Loading event details…</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-screen-lg mx-auto p-6 text-center">
        <p className="text-gray-600">
          Event not found{eventTitle ? ` (title: ${eventTitle})` : ''}.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto">
      {/* Header Image */}
      {event.imageUrl && (
        <div className="w-full h-[300px] overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left (Event Info + Map + Book Button) */}
        <div className="md:col-span-2">
          <EventInfo
            title={event.title}
            category={event.category}
            date={event.date}
            location={event.location}
            description={event.description}
          />
          <EventMap />
          <BookButton eventInfo={event} />
        </div>

        {/* Right (Chat Box or future components) */}
        <div>{/* Add Chat Box Here Later */}</div>
      </div>
    </div>
  );
}
