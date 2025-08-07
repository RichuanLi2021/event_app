import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import SeatMap from '../features/events/components/SeatMap';
import PaymentModal from '../features/Payment/components/PaymentModal';
import { useAppSelector } from '../redux/hooks';
import { api } from '../api/central-axios';
import type { TheEvent } from '../features/events/types';

export default function SeatSelectionPage() {
  const location = useLocation();
  const { eventTitle } = useParams<{ eventTitle: string }>();
  const events = useAppSelector((state) => state.events.events);
  const [eventInfo, setEventInfo] = useState<TheEvent | undefined>(
    location.state?.eventInfo as TheEvent | undefined
  );
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventInfo && eventTitle) {
        try {
          // First try to find in Redux by title
          const foundEvent = events.find((ev) => {
            const eventTitleSlug = ev.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '');
            
            return eventTitleSlug === eventTitle;
          });
          
          if (foundEvent) {
            setEventInfo(foundEvent);
          } else {
            // If not in Redux, try to find by title in all events
          }
        } catch (error) {
          console.error('Error fetching event:', error);
        }
      }
    };
    
    fetchEvent();
  }, [eventTitle, eventInfo, events]);
  
  const handleSeatsChange = (seats: string[], price: number) => {
    setSelectedSeats(seats);
    setTotalPrice(price);
  };

  const paymentEventData = {
    name: eventInfo?.title || 'Event',
    date: eventInfo?.date ? new Date(eventInfo.date).toLocaleDateString() : 'TBA',
    time: eventInfo?.date ? new Date(eventInfo.date).toLocaleTimeString() : 'TBA',
    location: eventInfo?.location || 'TBA',
    price: totalPrice
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <SeatMap eventInfo={eventInfo} onSeatsChange={handleSeatsChange} />
      
      {/* Dynamic payment button - only show if seats are selected */}
      {selectedSeats.length > 0 && (
        <div className="mt-6 text-center">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded transition"
            onClick={() => setShowPaymentModal(true)}
          >
            {totalPrice === 0 ? 'Proceed to Free Booking' : `Proceed to Payment ($${totalPrice})`}
          </button>
        </div>
      )}
      
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        eventData={paymentEventData}
      />
    </div>
  );
}
