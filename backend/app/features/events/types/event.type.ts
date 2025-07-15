import { Types, Document } from "mongoose";

export interface Event extends Document {
  title: string;
  description?: string;
  category: string;
  date: Date;
  location: string;
  capacity?: number;
  costs: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  organizer: Types.ObjectId;     // ref to User
}

export interface CreateAndUpdateEventInput {
  title: string;
  description?: string;
  category: string;
  date: Date;
  location: string;
  capacity?: number;
  costs: string;
  organizer: Types.ObjectId;
}

export type LeanEvent = Event & { _id: Types.ObjectId };