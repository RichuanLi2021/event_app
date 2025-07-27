import { useSelector } from 'react-redux';
import type { AppState } from '../../../redux/store';
import { toast } from 'react-toastify';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const rows = [
  { label: 'A', count: 10 },
  { label: 'B', count: 12 },
  { label: 'C', count: 14 },
  { label: 'D', count: 16 },
  { label: 'E', count: 18 },
  { label: 'F', count: 20 }, // VIP
  { label: 'G', count: 20 }, // VIP 
];

const bookedSeats = ['B11', 'C4', 'D7', 'F4', 'F9', 'G2', 'G3'];

const seatStatusColors = {
  available: 'bg-orange-200',
  selected: 'bg-orange-400 text-white',
  vip: 'bg-orange-600 text-white',
  booked: 'bg-slate-400 text-white',
};

export default function SeatMap() {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: AppState) => state.auth.isAuthenticated);

  const toggleSeat = (seatId: string, isVIP: boolean) => {
    if (!isAuthenticated) {
    toast.info("You need to log in to select a seat."); 
    return;
  }

  if (bookedSeats.includes(seatId)) return;

  setSelectedSeats(prev =>
    prev.includes(seatId)
      ? prev.filter(s => s !== seatId)
      : [...prev, seatId]
    );
  };

  const getSeatPrice = (isVIP: boolean) => isVIP ? 100 : 50;
  const totalPrice = selectedSeats.reduce((sum, seatId) => {
    const rowLabel = seatId[0];
    const isVIP = rowLabel === 'F' || rowLabel === 'G';
    return sum + getSeatPrice(isVIP);
  }, 0);



  return (
    <div className="text-center space-y-6 px-2 sm:px-4">
      <h2 className="text-2xl sm:text-3xl font-bold">Select Your Seat</h2>

      {/* Stage Shape */}
      <div className="flex justify-center mt-2">
        <div className="w-52 sm:w-64 h-16 sm:h-20 bg-gray-200 rounded-t-[60%] shadow-inner flex items-end justify-center">
          <span className="text-md sm:text-lg font-semibold pb-2">STAGE</span>
        </div>
      </div>

      {/* Seat Map */}
      <div className="flex flex-col items-center space-y-4 pt-4 overflow-x-hidden">
        {rows.map((row, rowIndex) => {
          const curve = (rowIndex - rows.length / 2) * 3;

          return (
            <div
              key={row.label}
              className="flex gap-[2px] sm:gap-2 justify-center flex-wrap"
              style={{
                transform: `rotate(${curve}deg) translateY(${Math.abs(curve)}px) rotate(${-curve}deg)`,
              }}
            >
              {Array.from({ length: row.count }, (_, i) => {
                const seatId = `${row.label}${i + 1}`;
                const isVIP = row.label === 'F' || row.label === 'G';
                const isBooked = bookedSeats.includes(seatId);
                const isSelected = selectedSeats.includes(seatId);

                const bgColor = isBooked
                  ? seatStatusColors.booked
                  : isSelected
                  ? seatStatusColors.selected
                  : isVIP
                  ? seatStatusColors.vip
                  : seatStatusColors.available;

                const tooltipText = isBooked
                  ? 'Already Booked'
                  : `₹${getSeatPrice(isVIP)}`;

                return (
                  <div className="relative group" key={seatId}>
                    <button
                      onClick={() => toggleSeat(seatId, isVIP)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm rounded shadow-md ${bgColor} hover:scale-105 transition-transform`}
                      disabled={isBooked}
                    >
                      {seatId}
                    </button>
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform text-xs sm:text-sm bg-black text-white px-2 py-1 rounded z-10 whitespace-nowrap">
                      {tooltipText}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center flex-wrap gap-3 text-sm pt-6">
        <div><span className={`inline-block w-4 h-4 rounded mr-1 ${seatStatusColors.available}`}></span>Available</div>
        <div><span className={`inline-block w-4 h-4 rounded mr-1 ${seatStatusColors.selected}`}></span>Selected</div>
        <div><span className={`inline-block w-4 h-4 rounded mr-1 ${seatStatusColors.vip}`}></span>VIP</div>
        <div><span className={`inline-block w-4 h-4 rounded mr-1 ${seatStatusColors.booked}`}></span>Booked</div>
      </div>

      {/* Price and Button */}
      <div className="pt-4 text-lg font-semibold">
        Total: ₹{totalPrice}
      </div>
      <button
        className="mt-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded transition disabled:opacity-50"
        disabled={selectedSeats.length === 0}
        onClick={() => console.log("Proceed with", selectedSeats)}
      >
        Confirm Booking
      </button>
    </div>
  );
}
