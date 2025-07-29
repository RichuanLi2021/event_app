import React from 'react';
import { Card, Typography } from '@mui/material';
import { useAppSelector } from '~/redux/hooks';
import ProfileDashboard from '~/features/users/components/ProfileDashboard';

function AccountPage() {
  const user = useAppSelector(state => state.auth.currentUser);



  if (!user) {
    return <Typography variant="h6">You are not signed in.</Typography>;
  }

  return (
    <Card sx={{ p: 4, borderRadius: 2 }}>
      <ProfileDashboard />
    </Card>
  );
}

export default AccountPage;