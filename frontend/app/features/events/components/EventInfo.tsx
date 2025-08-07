import type { TheEvent } from "../types";

export default function EventInfo({ title, date, location, description }: Partial<TheEvent>) {
    const formatDate = (date: any) => {
      if (!date) return "TBA";
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return dateObj.toLocaleDateString('en-US', { 
        weekday: 'long',
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    };

    const formatTime = (date: any) => {
      if (!date) return "";
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return dateObj.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });
    };

    return (
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <div className="space-y-2 mb-4">
          <p className="flex items-center text-gray-700">
            <span className="mr-2">📅</span>
            <strong>Date:</strong>{" "}
            {formatDate(date)}
          </p>
          <p className="flex items-center text-gray-700">
            <span className="mr-2">🕒</span>
            <strong>Time:</strong>{" "}
            {formatTime(date)}
          </p>
          <p className="flex items-center text-gray-700">
            <span className="mr-2">📍</span>
            <strong>Location:</strong>{" "}
            {location}
          </p>
        </div>
        <p className="mt-3 text-gray-600 leading-relaxed">{description}</p>
      </div>
    );
  }