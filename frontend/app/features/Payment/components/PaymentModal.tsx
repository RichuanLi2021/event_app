import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    paypal?: any;
  }
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventData?: {
    name: string;
    date: string;
    time?: string;
    location: string;
    price: number;
  };
}

const formatEventData = (eventData: any) => {
  let formattedDate = 'TBA';
  let formattedTime = 'TBA';
  
  if (eventData.date) {
    try {
      const dateObj = new Date(eventData.date);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        formattedTime = dateObj.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      formattedDate = eventData.date;
    }
  }
  
  // Use provided time if available, otherwise use extracted time
  if (eventData.time && eventData.time !== formattedTime) {
    formattedTime = eventData.time;
  }
  
  return {
    name: eventData.name,
    date: formattedDate,
    time: formattedTime,
    location: eventData.location || 'Venue TBA'
  };
};

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  eventData = {
    name: "NYC Music Fest",
    date: "10th March, 2025",
    time: "10:00 AM", 
    location: "Central Park, NYC",
    price: 89.99
  }
}) => {
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState('select');
  const [loadingError, setLoadingError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const formattedEvent = formatEventData(eventData);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (window.paypal) {
      console.log('PayPal SDK already loaded');
      setPaypalLoaded(true);
      return;
    }

    console.log('Loading PayPal SDK...');
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=sb&currency=USD&intent=capture&disable-funding=credit,card`;
    script.async = true;
    
    script.onload = () => {
      console.log('PayPal SDK loaded successfully');
      setPaypalLoaded(true);
      setLoadingError('');
    };
    
    script.onerror = () => {
      console.error('PayPal SDK failed to load');
      setLoadingError('Failed to load PayPal SDK. Please check your internet connection.');
    };
    
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector(`script[src*="paypal.com/sdk/js"]`);
      if (existingScript && document.head.contains(existingScript)) {
        document.head.removeChild(existingScript);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!paypalLoaded || !window.paypal || paymentStep !== 'paypal') return;

    const paypalContainer = document.getElementById('modal-paypal-container');
    if (!paypalContainer) {
      console.error('PayPal container not found');
      return;
    }

    console.log('Initializing PayPal buttons...');
    paypalContainer.innerHTML = '';

    try {
      window.paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          console.log('Creating PayPal order...');
          setIsProcessing(true);
          return actions.order.create({
            purchase_units: [{
              description: `Event Ticket: ${eventData.name}`,
              amount: {
                currency_code: 'USD',
                value: eventData.price.toString()
              }
            }]
          });
        },
        onApprove: async (data: any, actions: any) => {
          try {
            console.log('Payment approved, capturing...');
            const details = await actions.order.capture();
            console.log('Payment completed:', details);
            setPaymentStep('success');
          } catch (error) {
            console.error('Payment capture error:', error);
            alert('Payment failed. Please try again.');
          } finally {
            setIsProcessing(false);
          }
        },
        onError: (err: any) => {
          console.error('PayPal error:', err);
          setIsProcessing(false);
          alert('PayPal error occurred. Please try again.');
        },
        onCancel: () => {
          console.log('Payment cancelled');
          setIsProcessing(false);
          setPaymentStep('select');
        }
      }).render('#modal-paypal-container');
    } catch (error) {
      console.error('Error initializing PayPal buttons:', error);
      setLoadingError('Error initializing PayPal. Please try again.');
    }

  }, [paypalLoaded, paymentStep, eventData]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setPaymentStep('select');
      setIsProcessing(false);
      setLoadingError('');
      onClose();
    }, 300);
  };

  const handlePayWithPayPal = () => {
    if (!paypalLoaded) {
      setLoadingError('PayPal is still loading. Please wait...');
      return;
    }
    console.log('Switching to PayPal payment step');
    setPaymentStep('paypal');
  };

  const handleQuickPay = () => {
    setIsProcessing(true);
    console.log('Processing quick payment...');
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStep('success');
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '1rem',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onClick={handleClose}
    >
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% {
              transform: translateY(0);
            }
            40%, 43% {
              transform: translateY(-15px);
            }
            70% {
              transform: translateY(-7px);
            }
            90% {
              transform: translateY(-3px);
            }
          }
          
          .payment-button:hover {
            transform: translateY(-2px) !important;
          }
          
          .close-button:hover {
            background-color: #f5f5f5 !important;
            color: #333 !important;
          }
        `}
      </style>
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: '2rem 2rem 1rem',
          borderBottom: '1px solid #f0f0f0',
          position: 'relative'
        }}>
          <h2 style={{
            fontSize: '1.6rem',
            fontWeight: '700',
            margin: 0,
            color: '#2d3748'
          }}>Purchase Event Ticket</h2>
          <button 
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              fontSize: '1.8rem',
              cursor: 'pointer',
              color: '#999',
              padding: '0.5rem',
              borderRadius: '50%',
              transition: 'all 0.2s ease'
            }}
            className="close-button"
            onClick={handleClose}
          >
            ×
          </button>
        </div>
        
        <div style={{ padding: '2rem' }}>
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              color: '#2d3748',
              marginBottom: '1rem'
            }}>{formattedEvent.name}</div>
            <div style={{
              color: '#718096',
              marginBottom: '1.5rem',
              lineHeight: '1.6',
              fontSize: '1rem'
            }}>
              📅 {formattedEvent.date}<br/>
              🕐 {formattedEvent.time}<br/>
              📍 {formattedEvent.location}
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: '#ff7b54',
              textAlign: 'center'
            }}>
              ${eventData.price}
            </div>
          </div>

          {loadingError && (
            <div style={{
              backgroundColor: '#fed7d7',
              color: '#c53030',
              padding: '1rem 1.2rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              border: '1px solid #feb2b2',
              fontSize: '0.95rem'
            }}>
              {loadingError}
            </div>
          )}

          {paymentStep === 'select' && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <button 
                style={{
                  padding: '1.2rem 2rem',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.8rem',
                  transform: 'translateY(0)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  backgroundColor: paypalLoaded ? '#0070ba' : '#cbd5e0',
                  color: 'white'
                }}
                className="payment-button"
                onClick={handlePayWithPayPal}
                disabled={!paypalLoaded && !loadingError}
              >
                💳 {paypalLoaded ? 'Pay with PayPal' : 'Loading PayPal...'}
              </button>
              
              <button 
                style={{
                  padding: '1.2rem 2rem',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.8rem',
                  transform: 'translateY(0)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#ff7b54',
                  color: 'white'
                }}
                className="payment-button"
                onClick={handleQuickPay}
                disabled={isProcessing}
              >
                ⚡ Quick Pay (Demo)
              </button>
              
              <div style={{
                fontSize: '0.9rem',
                color: '#718096',
                textAlign: 'center',
                marginTop: '1.5rem',
                lineHeight: '1.5',
                padding: '1rem',
                backgroundColor: '#f7fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                💡 This is a payment simulation for demonstration<br/>
                🔧 Check browser console for debugging info
              </div>
            </div>
          )}

          {paymentStep === 'paypal' && (
            <div>
              <div style={{ marginTop: '1.5rem', minHeight: '50px' }}>
                {!paypalLoaded ? (
                  <div style={{textAlign: 'center', color: '#718096'}}>
                    Loading PayPal...<br/>
                    <small>If this takes too long, please check your internet connection</small>
                  </div>
                ) : (
                  <div id="modal-paypal-container"></div>
                )}
              </div>
              <button 
                style={{
                  backgroundColor: '#718096',
                  color: 'white',
                  padding: '0.8rem 1.8rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
                onClick={() => setPaymentStep('select')}
              >
                ← Back to Payment Options
              </button>
            </div>
          )}

          {isProcessing && (
            <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                border: '4px solid #f1f5f9',
                borderTop: '4px solid #ff7b54',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1.5rem'
              }}></div>
              <h3 style={{color: '#2d3748', marginBottom: '1rem'}}>Processing Payment...</h3>
              <p style={{color: '#718096'}}>Please wait while we process your payment securely.</p>
            </div>
          )}

          {paymentStep === 'success' && (
            <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{
                fontSize: '5rem',
                marginBottom: '1.5rem',
                animation: 'bounce 0.6s ease-in-out'
              }}>🎉</div>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: '#ff7b54',
                marginBottom: '1rem'
              }}>Payment Successful!</h3>
              <p style={{color: '#4a5568', fontSize: '1.1rem', marginBottom: '0.5rem'}}>
                Your ticket for <strong>{formattedEvent.name}</strong> has been confirmed.
              </p>
              <p style={{color: '#718096'}}>A confirmation email will be sent to you shortly.</p>
              <button 
                style={{
                  backgroundColor: '#ff7b54',
                  color: 'white',
                  padding: '0.8rem 1.8rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '2rem'
                }}
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
