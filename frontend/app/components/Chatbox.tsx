import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface QuickReply {
  id: number;
  text: string;
  response: string;
}

const Chatbox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm here to help you with Event Flow. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const quickReplies: QuickReply[] = [
    {
      id: 1,
      text: "How do I create an account?",
      response: "To create an account, click the 'Login' button in the top navigation and then select 'Sign Up'. You'll need to provide your email and create a password. Once registered, you can start browsing and booking events!"
    },
    {
      id: 2,
      text: "How do I search for events?",
      response: "Use the search bar at the top of the page to search for events by keyword. You can also use the location filter to find events in specific areas. Click the location dropdown to switch between Nova Scotia, Toronto, New York, and Vancouver."
    },
    {
      id: 3,
      text: "How do I book an event?",
      response: "To book an event, find the event you're interested in and click 'View Details'. Then click the booking button and follow the checkout process. You'll receive an e-ticket with a QR code."
    },
    {
      id: 4,
      text: "I'm having technical issues",
      response: "I'm sorry to hear you're having technical issues. Try refreshing the page or clearing your browser cache. If the problem persists, please describe the issue and I'll help you troubleshoot."
    },
    {
      id: 5,
      text: "View Help Center",
      response: "I'll take you to our comprehensive Help Center where you can find detailed answers to all common questions."
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowQuickReplies(true);
    }
  };

  const handleQuickReply = (quickReply: QuickReply) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: quickReply.text,
      isUser: true,
      timestamp: new Date()
    };

    // Add bot response
    const botMessage: Message = {
      id: Date.now() + 1,
      text: quickReply.response,
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setShowQuickReplies(false);

    // Special handling for Help Center redirect
    if (quickReply.id === 5) {
      setTimeout(() => {
        navigate('/help-center');
        setIsOpen(false);
      }, 1500);
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    // Simple auto-response logic
    let responseText = "Thank you for your message. Our support team will get back to you soon. In the meantime, you can check our Help Center for immediate answers to common questions.";
    
    const lowerInput = inputValue.toLowerCase();
    if (lowerInput.includes('account') || lowerInput.includes('sign up') || lowerInput.includes('register')) {
      responseText = "To create an account, click the 'Login' button in the navigation and then select 'Sign Up'. You'll need an email and password to get started.";
    } else if (lowerInput.includes('search') || lowerInput.includes('find') || lowerInput.includes('event')) {
      responseText = "Use the search bar at the top of the page to find events by keyword. You can also use the location filter to find events in your area.";
    } else if (lowerInput.includes('book') || lowerInput.includes('ticket') || lowerInput.includes('buy')) {
      responseText = "To book an event, find the event you want and click 'View Details', then follow the booking process. You'll receive an e-ticket with QR code.";
    } else if (lowerInput.includes('cancel') || lowerInput.includes('refund')) {
      responseText = "You can cancel bookings from your account page. Refund policies vary by event - check the event details for specific terms.";
    } else if (lowerInput.includes('organizer') || lowerInput.includes('create event')) {
      responseText = "To become an organizer and create events, you need admin approval. Contact our support team with your event planning details.";
    }

    const botMessage: Message = {
      id: Date.now() + 1,
      text: responseText,
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInputValue('');
    setShowQuickReplies(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={toggleChat} 
        className="fixed bottom-6 right-6 w-16 h-16 bg-white hover:bg-gray-50 text-orange-500 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 hover:scale-110 border border-gray-200"
        aria-label="Open chat support"
        style={{ 
          zIndex: 1000,
          borderRadius: '50%'
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10h5c1.1 0 2-.9 2-2v-7c0-5.52-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8v7h-8z"/>
          <circle cx="15.5" cy="9.5" r="1.5" fill="currentColor"/>
          <circle cx="8.5" cy="9.5" r="1.5" fill="currentColor"/>
          <path d="M12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" fill="currentColor"/>
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50" style={{ zIndex: 1000 }}>
      {/* Chat Window */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 h-96 flex flex-col overflow-hidden animate-slideUp">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-semibold text-sm">Event Flow Support</span>
          </div>
          <button 
            onClick={toggleChat} 
            className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                message.isUser 
                  ? 'bg-orange-500 text-white rounded-br-sm' 
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
              }`}>
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${message.isUser ? 'text-orange-100' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {showQuickReplies && (
            <div className="space-y-2">
              <p className="text-xs text-gray-600 font-medium">Quick questions:</p>
              {quickReplies.map((reply) => (
                <button
                  key={reply.id}
                  onClick={() => handleQuickReply(reply)}
                  className="block w-full text-left text-sm p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-orange-300 transition-colors"
                >
                  {reply.text}
                </button>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
            />
            <button 
              onClick={handleSendMessage}
              className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-xl transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Chatbox;