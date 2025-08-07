import { Schema, model } from 'mongoose';
import { Event } from '../types/event.type';

const EventSchema = new Schema<Event>(
  {
    organizer_id: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    title: { 
      type: String, 
      required: true 
    },
    description: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: false
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
      required: true
    },
    capacity: {
      type: Number,
      required: true
    },
    costs: {
      type: String,
      required: true
    },
    status: { 
      type: String, 
      enum: ['PENDING','APPROVED','REJECTED','CANCELLED'], 
      default: 'PENDING' 
    }
  },
  { timestamps: true }
);

EventSchema.index({ organizer_id: 1 });
export const EventModel = model<Event>('Event', EventSchema);