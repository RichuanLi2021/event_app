import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip,
  Paper,
} from '@mui/material';
import { Send as SendIcon, Group as GroupIcon } from '@mui/icons-material';
import { useAppSelector } from '~/redux/hooks';
import { shallowEqual } from 'react-redux';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userRole: 'USER' | 'ORGANIZER' | 'ADMIN';
  message: string;
  timestamp: Date;
  eventId: string;
}

interface EventChatProps {
  eventId?: string;
}

export const EventChat = ({ eventId }: EventChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { currentUser, currentUserEvents } = useAppSelector((state) => ({
    currentUser: state.auth.currentUser,
    currentUserEvents: state.events.currentUserEvents,
  }), shallowEqual);

  // Mock data for demonstration - in real app, this would come from API
  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      userId: 'user1',
      userName: 'John Doe',
      userRole: 'USER',
      message: 'Hi everyone! Looking forward to this event!',
      timestamp: new Date(Date.now() - 3600000),
      eventId: eventId || 'event1',
    },
    {
      id: '2',
      userId: 'organizer1',
      userName: 'Event Organizer',
      userRole: 'ORGANIZER',
      message: 'Welcome everyone! We\'re excited to have you all join us.',
      timestamp: new Date(Date.now() - 1800000),
      eventId: eventId || 'event1',
    },
    {
      id: '3',
      userId: 'user2',
      userName: 'Jane Smith',
      userRole: 'USER',
      message: 'What time should we arrive?',
      timestamp: new Date(Date.now() - 900000),
      eventId: eventId || 'event1',
    },
    {
      id: '4',
      userId: 'organizer1',
      userName: 'Event Organizer',
      userRole: 'ORGANIZER',
      message: 'Please arrive 15 minutes before the start time for check-in.',
      timestamp: new Date(Date.now() - 300000),
      eventId: eventId || 'event1',
    },
  ];

  useEffect(() => {
    // Load messages for the specific event
    setMessages(mockMessages.filter(msg => msg.eventId === eventId));
    scrollToBottom();
  }, [eventId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !eventId) return;

    setIsLoading(true);
    
    // Create new message
    const newChatMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser._id,
      userName: currentUser.name,
      userRole: currentUser.role as 'USER' | 'ORGANIZER' | 'ADMIN',
      message: newMessage.trim(),
      timestamp: new Date(),
      eventId,
    };

    // Add to messages (in real app, this would be sent to API)
    setMessages(prev => [...prev, newChatMessage]);
    setNewMessage('');
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ORGANIZER':
        return 'primary';
      case 'ADMIN':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ORGANIZER':
        return 'Organizer';
      case 'ADMIN':
        return 'Admin';
      default:
        return 'Attendee';
    }
  };

  // Check if user has booked events
  const userBookedEvents = currentUserEvents.filter(event => 
    event.status === 'APPROVED' || event.status === 'PENDING'
  );

  if (!currentUser) {
    return (
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" color="error">
            Please log in to access event chats
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (userBookedEvents.length === 0) {
    return (
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Event Group Chats
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You don't have any booked events yet. Book an event to join its group chat!
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ borderRadius: 2, height: '600px', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
          <GroupIcon color="primary" />
          <Typography variant="h6">
            Event Group Chat
          </Typography>
          <Chip 
            label={`${messages.length} messages`} 
            size="small" 
            variant="outlined" 
            sx={{ ml: 'auto' }}
          />
        </Box>

        {/* Messages Area */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column',
          gap: 1,
          maxHeight: '400px'
        }}>
          {messages.map((message) => (
            <Paper
              key={message.id}
              elevation={1}
              sx={{
                p: 1.5,
                maxWidth: '80%',
                alignSelf: message.userId === currentUser._id ? 'flex-end' : 'flex-start',
                backgroundColor: message.userId === currentUser._id ? 'primary.light' : 'grey.50',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                  {message.userName.charAt(0)}
                </Avatar>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {message.userName}
                </Typography>
                <Chip
                  label={getRoleLabel(message.userRole)}
                  size="small"
                  color={getRoleColor(message.userRole)}
                  variant="outlined"
                />
              </Box>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                {message.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Typography>
            </Paper>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              size="small"
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isLoading}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              <SendIcon />
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventChat; 