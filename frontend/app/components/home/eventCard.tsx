import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import type { EventCardProps } from '~/features/events/types';

export const EventCard = ({ id, title, date, time, location, imageUrl, onClick }: Omit<EventCardProps, 'id'> & { id?: string }) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    if (onClick) {
      onClick(title);
    } else {
      const eventIdentifier = id || encodeURIComponent(title);
      navigate(`/events/${eventIdentifier}`);
    }
  };

  return (
    <Card
      className="mb-4 border-0 shadow-sm h-100"
      style={{
        borderRadius: '18px',
        background: '#fff',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        width: '100%',
        maxWidth: '100%'
      }}
    >
      <Card.Img
        variant="top"
        src={imageUrl}
        alt={title}
        style={{ 
          borderTopLeftRadius: '18px', 
          borderTopRightRadius: '18px', 
          height: '170px', 
          objectFit: 'cover',
          width: '100%'
        }}
      />
      <Card.Body className="d-flex flex-column justify-content-between" style={{ minHeight: '180px', padding: '1.5rem' }}>
        <div>
          <Card.Title className="fw-semibold mb-2" style={{ fontSize: '1.15rem' }}>{title}</Card.Title>
          <div className="mb-1" style={{ color: '#555', fontWeight: 500 }}>{date}</div>
          <div className="mb-2" style={{ color: '#555', fontWeight: 500 }}>{time}</div>
          <div className="mb-3" style={{ color: '#888', fontSize: '0.98rem' }}>{location}</div>
        </div>
        <Button
          variant="outline-dark"
          className="w-100 rounded-pill fw-semibold mt-auto"
          style={{ borderWidth: 1.5 }}
          onClick={handleViewDetails}
        >
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
}
