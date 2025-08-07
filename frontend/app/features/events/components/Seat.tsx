import React from "react";

interface SeatProps {
  label: string;
  status: "available" | "vip" | "booked" | "selected";
  onClick: () => void;
}

const statusColors = {
  available: "bg-green-500",
  vip: "bg-yellow-500",
  booked: "bg-red-500",
  selected: "bg-blue-500",
};

export default function Seat({ label, status, onClick }: SeatProps) {
  const colorClass = statusColors[status];

  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 text-white font-bold rounded-md ${colorClass} hover:scale-110 transition`}
      disabled={status === "booked"}
    >
      {label}
    </button>
  );
}
