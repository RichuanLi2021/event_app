import { Types } from 'mongoose';

// Status for User-events interactions
export enum BookingStatus {
  // Pending = 'PENDING',
  Booked = 'BOOKED',
  Cancelled = 'CANCELLED',
  Waitlisted = 'WAITLISTED',
}

export interface Booking {
  eventId: Types.ObjectId;
  userId: Types.ObjectId;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}