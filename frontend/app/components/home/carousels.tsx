import Carousel from 'react-bootstrap/Carousel';
import type { TheEvent } from '~/features/events/types';

interface CarouselsHomeProps {
  events: TheEvent[];
}

export const CarouselsHome = ({ events }: CarouselsHomeProps) => {
  const carouselEvents = events
    .filter(event => event.status === 'APPROVED')
    .slice(0, 5);

  if (carouselEvents.length === 0) {
    return (
      <div className="max-w-6xl mx-auto my-9 rounded-2xl overflow-hidden shadow-md">
        <Carousel data-bs-theme="dark">
          <Carousel.Item>
            <img
              className="w-full h-[400px] object-cover"
              src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80"
              alt="Default event image"
              width={1600}
              height={400}
              loading="lazy"
              decoding="async"
            />
            <Carousel.Caption>
              <h3>Welcome to EventFlow</h3>
              <p>Discover amazing events happening around you</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-9 rounded-2xl overflow-hidden shadow-md">
      <Carousel data-bs-theme="dark">
        {carouselEvents.map((event, index) => (
          <Carousel.Item key={event._id}>
            <img
              className="w-full h-[400px] object-cover"
              src={event.imageUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80"}
              alt={event.title}
              width={1600}
              height={400}
              loading="lazy"
              decoding="async"
            />
            <Carousel.Caption>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p className="text-sm opacity-75">
                {new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} • {event.location}
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}