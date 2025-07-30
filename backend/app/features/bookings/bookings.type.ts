import { Types } from 'mongoose';

// Status for User-events interactions
export enum BookingStatus {
  Booked = 'BOOKED',
  Inactive = 'INACTIVE',
  Cancelled = 'CANCELLED',
  Waitlisted = 'WAITLISTED',
}

export interface Booking {
  eventId: Types.ObjectId;
  userId: Types.ObjectId;
  eventTitle: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}