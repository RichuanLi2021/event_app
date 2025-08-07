import type { Action } from 'redux';
import type { BookedEvent } from '~/features/events/types';

export enum BookingActionTypes {
  BOOKING_REQUEST = 'bookings/BOOKING_REQUEST',
  BOOKING_SUCCESS = 'bookings/BOOKING_SUCCESS',
  BOOKING_FAILURE = 'bookings/BOOKING_FAILURE',
  FETCH_USER_BOOKINGS_REQUEST = 'bookings/FETCH_USER_BOOKINGS_REQUEST',
  FETCH_USER_BOOKINGS_SUCCESS = 'bookings/FETCH_USER_BOOKINGS_SUCCESS',
  FETCH_USER_BOOKINGS_FAILURE = 'bookings/FETCH_USER_BOOKINGS_FAILURE',
}

export interface BookingRequestAction extends Action<
typeof BookingActionTypes.BOOKING_REQUEST> {
  payload: {eventId: string};
};

export interface BookingSuccessAction extends Action<
typeof BookingActionTypes.BOOKING_SUCCESS> {
  payload: BookedEvent;
};

export interface BookingFailureAction extends Action<
typeof BookingActionTypes.BOOKING_FAILURE> {
  payload: {error: string};
};

export interface FetchUserBookingsRequestAction extends Action<
typeof BookingActionTypes.FETCH_USER_BOOKINGS_REQUEST> {
  payload: void;
};

export interface FetchUserBookingsSuccessAction extends Action<
typeof BookingActionTypes.FETCH_USER_BOOKINGS_SUCCESS> {
  payload: BookedEvent[];
};

export interface FetchUserBookingsFailureAction extends Action<
typeof BookingActionTypes.FETCH_USER_BOOKINGS_FAILURE> {
  payload: {error: string};
};

export type BookingActions = 
    | BookingRequestAction
    | BookingSuccessAction
    | BookingFailureAction
    | FetchUserBookingsRequestAction
    | FetchUserBookingsSuccessAction
    | FetchUserBookingsFailureAction

