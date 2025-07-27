import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SeatMap from '../features/events/components/SeatMap';
import PaymentModal from '../features/Payment/components/PaymentModal';

export default function SeatSelectionPage() {
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
      
      {/* Add payment button below SeatMap */}
      <div className="mt-6 text-center">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
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
    </div>
  );
}
