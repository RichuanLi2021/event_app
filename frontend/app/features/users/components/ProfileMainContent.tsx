import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { type ProfileMainContentProps } from '../types';
import AboutMe from './Account_Info';
import EventBookings from '~/features/events/components/EventBookings';
import CalendarPage from '~/features/calendar/components/CalendarPage';

export default function ProfileMainContent({ section }: ProfileMainContentProps) {
  
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

  return (
    <AboutMe/>
  );
} 