import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Button,
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { Modal, Button as BootstrapButton } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { shallowEqual } from 'react-redux';
import { createEventAction, fetchAllEventsById, fetchAllEvents, updateEvent, updateEventStatus, deleteEvent, adminUpdateEventStatus } from '~/redux/actions/events/Event-actionCreators';
import { EventStatus, type CreateEventBody, type UserEvent } from '~/features/events/types';
import { CreateEvent } from './operationOnEvents/CreateNewEvent';
import { EventDetailsModal } from './operationOnEvents/ViewEventDetailsModal';
import { toast } from 'react-toastify';

export const ROLE_BLOCKS = {
  ADMIN: [
    { title: 'Pending Events', status: EventStatus.Pending },
    { title: 'Approved Events', status: EventStatus.Approved },
    { title: 'Rejected Events', status: EventStatus.Rejected },
  ],
  ORGANIZER: [
    { title: 'Confirmed Events', status: EventStatus.Confirmed },
    { title: 'Pending Events', status: EventStatus.Pending },
    { title: 'Cancelled Events', status: EventStatus.Cancelled },
  ],
  USER: [
    { title: 'Booked Events', status: EventStatus.Booked },
    { title: 'Wait-listed', status: EventStatus.Waitlisted },
    { title: 'Cancelled Events', status: EventStatus.Cancelled },
  ],
} as const;


function EventBookings() {
  const dispatch = useAppDispatch();
  const [selectedEvent, setSelectedEvent] = useState<UserEvent | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [cancelEventId, setCancelEventId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [approveEventId, setApproveEventId] = useState<string | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [rejectEventId, setRejectEventId] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  
  const { currentUserId, userRole, currentUserEvents, events, loading, error } = useAppSelector((state) => ({
    currentUserId: state.auth.currentUser?._id,
    userRole: state.auth.currentUser?.role,
    currentUserEvents: state.events.currentUserEvents,
    events: state.events.events,
    loading: state.events.loading,
    error: state.events.error,  
}), shallowEqual);

  const blocks = ROLE_BLOCKS[(userRole ?? 'USER') as keyof typeof ROLE_BLOCKS];

  // CheckPoint: DO NOT DELETE
  console.log(` user: ${currentUserId}; loading: ${loading}`);

  const fetchedRef = useRef(false);

  const handleCreateEvent = async (newEvent: CreateEventBody) => {
    try {
      await dispatch(createEventAction(newEvent));
      fetchedRef.current = false;
      if (currentUserId) {
        await dispatch(fetchAllEventsById(currentUserId));
      }
      toast.success('Event created successfully!');
    } catch (error) {
      console.error('Failed to create event:', error);
      toast.error('Failed to create event. Please try again.');
    }
  }

  const handleViewDetails = (event: UserEvent) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  const handleUpdateEvent = async (eventId: string, updateEventDetails: CreateEventBody) => {
    try {
      await dispatch(updateEvent({ _id: eventId, updateFields: updateEventDetails }));
      if (currentUserId) {
        await dispatch(fetchAllEventsById(currentUserId));
      }
      toast.success('Event updated successfully!');
    } catch (error) {
      console.error('Failed to update event:', error);
      toast.error('Failed to update event. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await dispatch(deleteEvent(eventId));
      if (currentUserId) {
        await dispatch(fetchAllEventsById(currentUserId));
      }
      toast.success('Event deleted successfully!');
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error('Failed to delete event. Please try again.');
    }
  };

  const handleCancelEvent = async (eventId: string) => {
    try {
      const currentEvent = currentUserEvents.find(event => event._id === eventId);
      if (!currentEvent) {
        toast.error('Event not found');
        return;
      }

      await dispatch(updateEventStatus({ 
        _id: eventId,
        status: 'CANCELLED' as const
      }));
      if (currentUserId) {
        await dispatch(fetchAllEventsById(currentUserId));
      }
      toast.success('Event cancelled successfully!');
      setShowCancelModal(false);
      setCancelEventId(null);
    } catch (error) {
      console.error('Failed to cancel event:', error);
      toast.error('Failed to cancel event. Please try again.');
    }
  };

  const handleCancelClick = (eventId: string) => {
    setCancelEventId(eventId);
    setShowCancelModal(true);
  };

  const handleApproveEvent = async (eventId: string) => {
    try {
      await dispatch(adminUpdateEventStatus(eventId, 'APPROVED'));
      if (userRole === 'ADMIN') {
        await dispatch(fetchAllEvents());
      } else if (currentUserId) {
        await dispatch(fetchAllEventsById(currentUserId));
      }
      toast.success('Event approved successfully!');
      setShowApproveModal(false);
      setApproveEventId(null);
    } catch (error) {
      console.error('Failed to approve event:', error);
      toast.error('Failed to approve event. Please try again.');
    }
  };

  const handleRejectEvent = async (eventId: string) => {
    try {
      await dispatch(adminUpdateEventStatus(eventId, 'REJECTED'));
      if (userRole === 'ADMIN') {
        await dispatch(fetchAllEvents());
      } else if (currentUserId) {
        await dispatch(fetchAllEventsById(currentUserId));
      }
      toast.success('Event rejected successfully!');
      setShowRejectModal(false);
      setRejectEventId(null);
    } catch (error) {
      console.error('Failed to reject event:', error);
      toast.error('Failed to reject event. Please try again.');
    }
  };

  const handleApproveClick = (eventId: string) => {
    setApproveEventId(eventId);
    setShowApproveModal(true);
  };

  const handleRejectClick = (eventId: string) => {
    setRejectEventId(eventId);
    setShowRejectModal(true);
  };

  useEffect(() => {
    if (fetchedRef.current || loading) {
      return;
    }
    if (userRole === 'ADMIN') {
      console.log("Dispatching fetchAllEvents for ADMIN");
      (async () => {
        try {
          await dispatch(fetchAllEvents());
        } catch (err) {
          console.log(`Failed to fetch all events for admin: ${err}`);
        } finally {
          fetchedRef.current = true;
        }
      })();
    }
    else {
      if (!currentUserId) {
        console.log("No user ID available");
        return;
      }
      
      console.log("Dispatching fetchAllEventsById for user:", currentUserId);
      (async () => {
        try {
          await dispatch(fetchAllEventsById(currentUserId!));
        } catch (err) {
          console.log(`Failed to fetch user events: ${err}`);
        } finally {
          fetchedRef.current = true;
        }
      })();
    }
  }, [currentUserId, userRole, currentUserEvents, loading, dispatch]);

  if (loading) {
    return (
      <Typography variant="body2" textAlign="center">
        Loading your events…
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="body2" color="error" textAlign="center">
        {error}
      </Typography>
    );
  }

  // Determine which events to use based on user role
  const eventsToDisplay = userRole === 'ADMIN' ? events : currentUserEvents;
  
  if (!eventsToDisplay || eventsToDisplay.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {userRole === 'ADMIN' ? 'No events found.' : 'Your events history is empty.'}
      </Typography>
    );
  }

  return (
    <>
      {userRole === 'ORGANIZER' && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <CreateEvent onAdd={handleCreateEvent} />
        </div>
      )}
      <Box display="flex" flexDirection="column" gap={4}>
        {blocks.map(({ title, status }) => {
          const filteredEvents = eventsToDisplay.filter((event: any) => 
            event.status === status);
          return (
            <Card key={status} variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  {title}
                </Typography>
              
                {filteredEvents.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    No {title.toLowerCase()}.
                  </Typography>
                ) : (
                  <List disablePadding>
                    {filteredEvents.map((event, idx) => (
                      <ListItem
                        key={event._id || idx}
                        sx={{ 
                          py: 2.5,
                          '&:not(:last-child)': {
                            borderBottom: '1px solid #e0e0e0'
                          }
                        }}
                          secondaryAction={
                            <Stack direction="column" spacing={2} sx={{ minWidth: 120 }}>
                              {userRole === 'ADMIN' && status === 'PENDING' && (
                                <>
                                  <Button 
                                    variant="outlined" 
                                    color="success" 
                                    size="small"
                                    onClick={() => handleApproveClick(event._id)}
                                    sx={{ 
                                      fontSize: '0.75rem',
                                      py: 0.5,
                                      px: 1.5,
                                      minWidth: 'auto'
                                    }}
                                  >
                                    Approve
                                  </Button>
                                  <Button 
                                    variant="outlined" 
                                    color="error" 
                                    size="small"
                                    onClick={() => handleRejectClick(event._id)}
                                    sx={{ 
                                      fontSize: '0.75rem',
                                      py: 0.5,
                                      px: 1.5,
                                      minWidth: 'auto'
                                    }}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              
                              {/* Non-admin buttons */}
                              {userRole !== 'ADMIN' && (
                                <>
                                  <Button 
                                    variant="outlined" 
                                    size="small"
                                    onClick={() => handleViewDetails(event as unknown as UserEvent)}
                                    sx={{ 
                                      fontSize: '0.75rem',
                                      py: 0.5,
                                      px: 1.5,
                                      minWidth: 'auto'
                                    }}
                                  >
                                    View Details
                                  </Button>
                                  
                                  {status !== 'CANCELLED' && (
                                    <Button 
                                      variant="outlined" 
                                      color="error" 
                                      size="small"
                                      onClick={() => handleCancelClick(event._id)}
                                      sx={{ 
                                        fontSize: '0.75rem',
                                        py: 0.5,
                                        px: 1.5,
                                        minWidth: 'auto'
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  )}
                                </>
                              )}
                            </Stack>
                          }
                      >
                        <ListItemAvatar sx={{ mr: 3 }}>
                          <Avatar
                            variant="rounded"
                            src={event.imageUrl ?? "/placeholder.jpg"}
                            sx={{ width: 56, height: 56 }}
                          />
                        </ListItemAvatar>
                          <ListItemText
                            primary={
                                <Typography
                                  component="span"
                                  sx={{
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    color: 'primary.main',
                                    '&:hover': {
                                      textDecoration: 'underline'
                                    }
                                  }}
                                  onClick={() => handleViewDetails(event as unknown as UserEvent)}
                                >
                                  {event.title || 'Untitled Event'}
                                </Typography>
                            }
                            secondary={`${event.date ? new Date(event.date).toLocaleDateString() : 'No date'} · ${event.location || 'No location'}`}
                            sx={{ 
                              '& .MuiListItemText-primary': {
                                fontSize: '1rem',
                                fontWeight: 500
                              },
                              '& .MuiListItemText-secondary': {
                                fontSize: '0.875rem',
                                color: 'text.secondary'
                              }
                            }}
                          />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <EventDetailsModal
        show={showDetailsModal}
        onHide={() => {
          setShowDetailsModal(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onUpdate={handleUpdateEvent}
        onDelete={handleDeleteEvent}
        isAdmin={userRole === 'ADMIN'}
      />

      {/* Cancel Confirmation Modal */}
      {showCancelModal && cancelEventId && (
        <Modal show={showCancelModal} onHide={() => { setShowCancelModal(false); setCancelEventId(null); }}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Cancel</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to cancel this event? This action cannot be undone.
          </Modal.Body>
          <Modal.Footer>
            <BootstrapButton variant="secondary" onClick={() => { setShowCancelModal(false); setCancelEventId(null); }}>
              No, Keep Event
            </BootstrapButton>
            <BootstrapButton variant="danger" onClick={() => handleCancelEvent(cancelEventId)}>
              Yes, Cancel Event
            </BootstrapButton>
          </Modal.Footer>
        </Modal>
      )}

      {/* Approve Confirmation Modal */}
      {showApproveModal && approveEventId && (
        <Modal show={showApproveModal} onHide={() => { setShowApproveModal(false); setApproveEventId(null); }}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Approve</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to approve this event? This will move it to the "Approved Events" section.
          </Modal.Body>
          <Modal.Footer>
            <BootstrapButton variant="secondary" onClick={() => { setShowApproveModal(false); setApproveEventId(null); }}>
              No, Keep Pending
            </BootstrapButton>
            <BootstrapButton variant="success" onClick={() => handleApproveEvent(approveEventId)}>
              Yes, Approve Event
            </BootstrapButton>
          </Modal.Footer>
        </Modal>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectModal && rejectEventId && (
        <Modal show={showRejectModal} onHide={() => { setShowRejectModal(false); setRejectEventId(null); }}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Reject</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to reject this event? This will move it to the "Rejected Events" section.
          </Modal.Body>
          <Modal.Footer>
            <BootstrapButton variant="secondary" onClick={() => { setShowRejectModal(false); setRejectEventId(null); }}>
              No, Keep Pending
            </BootstrapButton>
            <BootstrapButton variant="danger" onClick={() => handleRejectEvent(rejectEventId)}>
              Yes, Reject Event
            </BootstrapButton>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default EventBookings;