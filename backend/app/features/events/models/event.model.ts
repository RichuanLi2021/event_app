import { Schema, model } from 'mongoose';
import { Event } from '../types/event.type';

const EventSchema = new Schema<Event>(
  {
    title: { 
      type: String, 
      required: true 
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now,
    },
    location: {
      type: String,
      enum: ['Online', 'On-site'], 
      required: true
    },
    capacity: {
      type: Number,
      required: false
    },
    costs: {
      type: String,
      required: true
    },
    status: { 
      type: String, 
      enum: ['PENDING','APPROVED','REJECTED'], 
      default: 'PENDING' 
    },
    organizer: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    }
  },
  { timestamps: true }
);

export const EventModel = model<Event>('Event', EventSchema);