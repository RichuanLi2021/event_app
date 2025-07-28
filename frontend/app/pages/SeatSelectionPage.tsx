import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SeatMap from '../features/events/components/SeatMap';
import PaymentModal from '../features/Payment/components/PaymentModal';
import { useLocation, useParams } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { useEffect, useState } from 'react';
import { api } from '../api/central-axios';
import type { TheEvent } from '../features/events/types';

export default function SeatSelectionPage() {
  const location = useLocation();
  const { eventTitle } = useParams<{ eventTitle: string }>();
  const events = useAppSelector((state) => state.events.events);
  const [eventInfo, setEventInfo] = useState<TheEvent | undefined>(
    location.state?.eventInfo as TheEvent | undefined
  );
  
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
  

  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const location = useLocation();
  
  // Get event data from navigation state
  const eventInfo = location.state?.eventInfo || {
    title: 'NYC Music Fest',
    date: '10th March, 2025',
    time: '10:00 AM',
    location: 'Central Park, NYC'
  };

  // Sample selected seats and price (in real implementation, this would come from SeatMap)
  const samplePrice = 150; // This should be calculated based on selected seats

  const paymentEventData = {
    name: eventInfo.title,
    date: eventInfo.date,
    time: eventInfo.time,
    location: eventInfo.location,
    price: samplePrice
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <SeatMap />
      
      {/* Add payment button below SeatMap - matching Confirm Booking button style */}
      <div className="mt-6 text-center">
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded transition"
          onClick={() => setShowPaymentModal(true)}
        >
          Proceed to Payment
        </button>
      </div>
      
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        eventData={paymentEventData}
      />
      <SeatMap eventInfo={eventInfo} />
    </div>
  );
}
