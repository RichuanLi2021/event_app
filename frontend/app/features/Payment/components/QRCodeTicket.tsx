import React from 'react';

interface QRCodeTicketProps {
  eventData: {
    name: string;
    date: string;
    time?: string;
    location: string;
    price: number;
  };
  selectedSeats: string[];
  ticketId: string;
  onClose: () => void;
}

const QRCodeTicket: React.FC<QRCodeTicketProps> = ({ 
  eventData, 
  selectedSeats, 
  ticketId, 
  onClose 
}) => {
  // Generate QR code data (in real app, this would be a unique ticket identifier)
  const qrData = JSON.stringify({
    ticketId,
    eventName: eventData.name,
    date: eventData.date,
    seats: selectedSeats,
    price: eventData.price
  });

  // Simple QR code generation using a service (in production, use a proper QR library)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '400px',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          animation: 'slideUp 0.5s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>
          {`
            @keyframes slideUp {
              from {
                transform: translateY(50px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
            
            @keyframes pulse {
              0%, 100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.08);
              }
            }
            
            .ticket-header {
              background: linear-gradient(135deg, #ff7b54 0%, #ff6b35 100%);
              color: white;
              padding: 1.5rem;
              border-radius: 20px 20px 0 0;
              text-align: center;
            }
            
            .qr-code {
              animation: pulse 2s infinite;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            
            .ticket-body {
              padding: 2rem;
            }
            
            .seat-tag {
              display: inline-block;
              background: #f0f9ff;
              color: #0369a1;
              padding: 0.25rem 0.75rem;
              border-radius: 20px;
              font-size: 0.875rem;
              font-weight: 600;
              margin: 0.25rem;
            }
          `}
        </style>

        {/* Ticket Header */}
        <div className="ticket-header">
          <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            🎫 Event Ticket
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Ticket ID: {ticketId}
          </div>
        </div>

        {/* Ticket Body */}
        <div className="ticket-body">
          {/* Event Details */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              {eventData.name}
            </h2>
            
            <div style={{ 
              color: '#6b7280', 
              lineHeight: '1.6',
              marginBottom: '1rem'
            }}>
              <div style={{ marginBottom: '0.5rem' }}>
                📅 {eventData.date}
              </div>
              {eventData.time && (
                <div style={{ marginBottom: '0.5rem' }}>
                  🕐 {eventData.time}
                </div>
              )}
              <div style={{ marginBottom: '0.5rem' }}>
                📍 {eventData.location}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                💰 {eventData.price === 0 ? 'Free' : `$${eventData.price}`}
              </div>
            </div>

            {/* Selected Seats */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Selected Seats:
              </div>
              <div>
                {selectedSeats.map((seat, index) => (
                  <span key={index} className="seat-tag">
                    {seat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* QR Code - Centered */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '2rem',
            padding: '1.5rem',
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            border: '2px solid #e2e8f0'
          }}>
            <div style={{ 
              fontSize: '1.1rem', 
              fontWeight: '700', 
              color: '#1f2937',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              🎫 Scan QR Code for Entry
            </div>
            <div className="qr-code" style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                style={{
                  width: '220px',
                  height: '220px',
                  border: '4px solid #3b82f6',
                  borderRadius: '16px',
                  backgroundColor: 'white',
                  boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)'
                }}
              />
            </div>
            <div style={{ 
              fontSize: '0.9rem', 
              color: '#6b7280',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              📱 Present this QR code at the event entrance
            </div>
          </div>

          {/* Instructions */}
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ 
              fontSize: '0.9rem', 
              fontWeight: '600', 
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              📋 Important Information:
            </div>
            <ul style={{ 
              fontSize: '0.8rem', 
              color: '#6b7280',
              lineHeight: '1.5',
              paddingLeft: '1rem'
            }}>
              <li>Arrive 15 minutes before the event starts</li>
              <li>Keep this ticket safe - it's your entry pass</li>
              <li>No refunds or exchanges</li>
              <li>Valid ID may be required for verification</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginTop: '2rem'
          }}>
            <button
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onClick={() => {
                // In real app, this would download or print the ticket
                window.print();
              }}
            >
              📄 Print Ticket
            </button>
            <button
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeTicket; 