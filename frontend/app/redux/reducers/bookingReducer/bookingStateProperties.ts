import type { BookedEvent } from "~/features/events/types"

export interface BookingState {
  bookedEvents: BookedEvent[],
  loading: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
}

export const initialBookingState: BookingState = {
  bookedEvents: [],
  loading: false,
  updating: false,
  deleting: false,
  error: null
}