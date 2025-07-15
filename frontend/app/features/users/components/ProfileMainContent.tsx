import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Button, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { type SideBarSection } from '../types';

interface ProfileMainContentProps {
  section: SideBarSection;
}

export default function ProfileMainContent({ section }: ProfileMainContentProps) {
  const currentUser = useAppSelector(state => state.auth.currentUser);
  const user = {
    name: currentUser?.name,
    email: currentUser?.email,
    joined: currentUser?.signupAt,
    profilePhoto: '',
  };

  if (section === 'Personal Calendar') {
    return (
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6">Personal Calendar</Typography>
          <Typography variant="body2" color="text.secondary">Calendar integration coming soon...</Typography>
        </CardContent>
      </Card>
    );
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Profile Photo Card */}
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Profile Photo</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 72, height: 72 }} src={user.profilePhoto} />
            <Button variant="outlined" component="label">Add a Profile Image
              <input type="file" hidden />
            </Button>
          </Box>
        </CardContent>
      </Card>
      {/* Contact Info Card */}
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Contact Information</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="First Name" value={user.name} fullWidth disabled />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Last Name" value="xxx" fullWidth disabled />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Email" value={user.email} fullWidth disabled />
            </Grid> 
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Joined" value={user.joined} fullWidth disabled />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6">Other Information</Typography>
          <Typography variant="body2" color="text.secondary">Add more profile details here...</Typography>
        </CardContent>
      </Card>
    </Box>
  );
} 