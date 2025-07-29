import { Types, Document } from "mongoose";

export interface Event extends Document {
  organizer_id: Types.ObjectId;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  date: Date;
  location: string;
  capacity: number;
  costs: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
}

export type CreateEventInput = Omit<Event, 'status' | 'organizer_id'>;

export type UpdateEventInput = Partial<CreateEventInput>;

export type UpdateEventStatus = Event['status'];

export type LeanEvent = Event & { _id: Types.ObjectId };