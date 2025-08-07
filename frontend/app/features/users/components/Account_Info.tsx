import React, { useState, useEffect, type ChangeEvent } from 'react';
import { Card, CardContent, Typography, Box, Avatar, Button, TextField, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import type { UpdateAccountInfo } from '../types';
import { updateAccount } from '~/redux/actions/account/Account-actionCreators';
import { persistor } from '~/redux/store';

export default function AboutMe() {
  const currentUser = useAppSelector(state => state.auth.currentUser);
  const dispatch = useAppDispatch();

  const baseUser = {
    id: (currentUser?._id || '') as string,
    name: currentUser?.name ?? '',
    email: currentUser?.email ?? '',
    phone: currentUser?.phone ?? '',
    joined: currentUser?.createdAt ?? '',
    access: currentUser?.role ?? '',
    status: currentUser?.status ?? '',
    profilePhoto: '',
  };

  const [formUser, setFormUser] = useState(baseUser);
  const [isEditMode, setEditMode] = useState(false);

  useEffect(() => {
    setFormUser(baseUser);
  }, [currentUser]);

  const handleChange =
    (key: keyof typeof formUser) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setFormUser(prev => ({ ...prev, [key]: e.target.value }));
    };

  const buildUpdatePayload = (
    original: typeof baseUser,
    edited: typeof formUser
  ): UpdateAccountInfo => {
    const updateFields: UpdateAccountInfo['updateFields'] = {};
    if (edited.name !== original.name)   updateFields.name  = edited.name;
    if (edited.email !== original.email) updateFields.email = edited.email;
    if (edited.phone !== original.phone) updateFields.phone = edited.phone;
    return { _id: edited.id || (edited as any)._id, updateFields };
  };

  const handleSave = async () => {
    try {
      const payload = buildUpdatePayload(baseUser, formUser);
      await dispatch(updateAccount(payload));
      await persistor.flush(); 
      setEditMode(false);
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const handleCancel = () => {
    setFormUser(baseUser);
    setEditMode(false);
  };

  const joinedDisplay =
    typeof formUser.joined === 'string' || formUser.joined instanceof Date
      ? new Date(formUser.joined as any).toLocaleString()
      : '';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Profile Photo Card */}
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {formUser.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{ width: 72, height: 72 }}
              src={formUser.profilePhoto}
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}         
            >
              {formUser.profilePhoto ? 'Change Image' : 'Add a Profile Image'}
              <input type="file" hidden/>
            </Button>
          </Box>
        </CardContent>

      {/* Personal Info Card */}
      <Card variant="outlined" sx={{ borderRadius: 2, position: 'relative' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{xs: 12, sm: 6}}>
              <TextField
                label="Name"
                value={formUser.name}
                fullWidth
                disabled={!isEditMode}
                onChange={handleChange('name')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
              <TextField
                label="Joined"
                value={joinedDisplay}
                fullWidth
                disabled
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
              <TextField
                label="Email"
                value={formUser.email}
                fullWidth
                disabled={!isEditMode}
                onChange={handleChange('email')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
              <TextField
                label="Phone"
                value={formUser.phone}
                fullWidth
                disabled={!isEditMode}
                onChange={handleChange('phone')}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
              <TextField
                label="Account Type"
                value={formUser.access}
                fullWidth
                disabled
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
              <TextField
                label="User Status"
                value={formUser.status}
                fullWidth
                disabled
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
          </Grid>

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            {!isEditMode ? (
              <Button
                variant="text"
                color="warning"
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button variant="outlined" color="inherit" onClick={handleCancel}>
                  Cancel
                </Button>
              </Stack>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Other Info Card */}
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6">Other Information</Typography>
          <Typography variant="body2" color="text.secondary">
            Add more profile details here...
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}