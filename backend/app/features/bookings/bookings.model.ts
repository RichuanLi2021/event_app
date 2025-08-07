import { Schema, model } from 'mongoose';
import { Booking, BookingStatus } from './bookings.type';

const BookingSchema = new Schema<Booking>(
  {
    eventId: { 
        type: Schema.Types.ObjectId, 
        ref: 'EventId', 
        required: true 
    },
    eventTitle: {
        type: String,
        required: true
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'UserId',  
        required: true 
    },
    userName: {
      type: String,
      required: true
    },
    status: {
        type: String, 
        enum: Object.values(BookingStatus), 
        default: BookingStatus.Inactive
    },
  },
  { timestamps: true }
);

BookingSchema.index({ eventId: 1, userId: 1 }, { unique: true }); 
export const BookingModel = model<Booking>('Booking', BookingSchema);