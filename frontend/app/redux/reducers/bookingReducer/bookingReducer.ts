import { BookingActionTypes, type BookingActions } from "~/redux/actions/booking/Booking-actionTypes";
import { initialBookingState, type BookingState } from "./bookingStateProperties";

export default function bookingsReducer (
  state = initialBookingState,
  actions: BookingActions
): BookingState {
    switch(actions.type) {
    // Booking event
    case BookingActionTypes.BOOKING_REQUEST:
        return {
            ...state,
            loading: true, 
            error: null 
    };
    case BookingActionTypes.BOOKING_SUCCESS:
        return {
            ...state,
            loading: false,
            bookedEvents: [...state.bookedEvents, actions.payload],
            error: null
        }
    case BookingActionTypes.BOOKING_FAILURE:
        return {
            ...state,
            loading: false,
            error: actions.payload.error
        }
    case BookingActionTypes.FETCH_USER_BOOKINGS_REQUEST:
        return {
            ...state,
            loading: true,
            error: null
        }
    case BookingActionTypes.FETCH_USER_BOOKINGS_SUCCESS:
        return {
            ...state,
            loading: false,
            bookedEvents: actions.payload,
            error: null
        }
    case BookingActionTypes.FETCH_USER_BOOKINGS_FAILURE:
        return {
            ...state,
            loading: false,
            error: actions.payload.error
        }
    default:
        return state;
    }
}