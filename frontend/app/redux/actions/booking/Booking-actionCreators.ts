import type { ThunkAction } from 'redux-thunk';
import type { BookedEvent } from '~/features/events/types';
import { type AppState } from "~/redux/store";
import { BookingActionTypes, type BookingActions } from './Booking-actionTypes';
import * as eventApi from "~/features/events/services/eventApi";

export const bookEvent = (eventId: string): ThunkAction<
    Promise<BookedEvent>, AppState, unknown, BookingActions
> => {
    return async (dispatch) => {
        dispatch({
            type: BookingActionTypes.BOOKING_REQUEST,
            payload: {eventId: eventId}
        })
        try {
            const bookedEvent = await eventApi.bookEvent(eventId);
            dispatch({
                type: BookingActionTypes.BOOKING_SUCCESS,
                payload: bookedEvent
            });

            // CheckPoint: DO NOT DELETE
            console.log("Event booked succcessfully: ", bookedEvent);

            return bookedEvent;
        } catch (error: any) {
            dispatch({
                type: BookingActionTypes.BOOKING_FAILURE,
                payload: {error: error.message || "Book event failed."}
            })
            throw error;
        }
    }
}

export const fetchUserBookings = (): ThunkAction<
    Promise<BookedEvent[]>, AppState, unknown, BookingActions
> => {
    return async (dispatch) => {
        dispatch({
            type: BookingActionTypes.FETCH_USER_BOOKINGS_REQUEST,
            payload: undefined
        })
        try {
            const userBookings = await eventApi.getUserBookings();
            dispatch({
                type: BookingActionTypes.FETCH_USER_BOOKINGS_SUCCESS,
                payload: userBookings
            });

            return userBookings;
        } catch (error: any) {
            dispatch({
                type: BookingActionTypes.FETCH_USER_BOOKINGS_FAILURE,
                payload: {error: error.message || "Fetch user bookings failed."}
            })
            throw error;
        }
    }
}