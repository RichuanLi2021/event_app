import { useNavigate } from 'react-router-dom';
import type { TheEvent } from '../types';

interface BookButtonProps {
  eventInfo?: TheEvent;
}

export default function BookButton({ eventInfo }: BookButtonProps) {
  const navigate = useNavigate();

  const handleBookTicket = () => {
    if (!eventInfo?.title) {
      return;
    }
    
    // Convert title to URL-friendly format
    const eventTitle = eventInfo.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const url = `/seat-selection/${eventTitle}`;
    
    navigate(url, {
      state: { eventInfo }
    });
  };

  return (
    <div className="mt-6">
      <button 
        className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors"
        onClick={handleBookTicket}
      >
        Book Ticket
      </button>
    </div>
  );
}
  