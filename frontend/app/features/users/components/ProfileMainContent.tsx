import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { type ProfileMainContentProps } from '../types';
import AboutMe from './Account_Info';
import EventBookings from '~/features/events/components/EventBookings';
import CalendarPage from '~/features/calendar/components/CalendarPage';
import PaymentModal from '~/features/Payment/components/PaymentModal';

export default function ProfileMainContent({ section }: ProfileMainContentProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  if (section === 'Calendar') {
    return <CalendarPage />;
  }
  
  if (section === 'Chat Room') {
    return (
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6">Event Group Chat Room</Typography>
          <Typography variant="body2" color="text.secondary">Live chat coming soon...</Typography>
        </CardContent>
      </Card>
    );
  }
  
  if (section === 'Event Bookings') {
    return (
      <EventBookings/>
    );
  }
  
  if (section === 'Payment') {
    return (
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Payment Management</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Manage your event payments and view transaction history.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setShowPaymentModal(true)}
              sx={{ borderRadius: 2 }}
            >
              Make a Payment
            </Button>
            <Button 
              variant="outlined" 
              color="secondary"
              sx={{ borderRadius: 2 }}
            >
              View Payment History
            </Button>
          </Box>
          
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            eventData={{
              name: "Sample Event Payment",
              date: "March 15, 2025",
              time: "7:00 PM",
              location: "Demo Location", 
              price: 99.99
            }}
          />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <AboutMe/>
  );
}
