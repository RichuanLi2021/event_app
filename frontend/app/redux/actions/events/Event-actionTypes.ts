import type { CreateEventBody, DeletedEvent, Events, TheEvent, UpdateAnEvent, UpdatedEvent, UpdateEventStatus, UserEvent, UserEvents } from "~/features/events/types";
import type { Action } from 'redux';

// Fetch Events
export enum EventActionTypes {
  // Get All
  FETCH_EVENTS_REQUEST = 'event/FETCH_EVENTS_REQUEST',
  FETCH_EVENTS_SUCCESS = 'event/FETCH_EVENTS_SUCCESS',
  FETCH_EVENTS_FAILURE = 'event/FETCH_EVENTS_FAILURE',

  // Get All by Id
  FETCH_EVENTS_BY_ID_REQUEST = 'event/FETCH_EVENTS_BY_ID_REQUEST',
  FETCH_EVENTS_BY_ID_SUCCESS = 'event/FETCH_EVENTS_BY_ID_SUCCESS',
  FETCH_EVENTS_BY_ID_FAILURE = 'event/FETCH_EVENTS_BY_ID_FAILURE',

  // Get ONE
  FETCH_ONE_EVENT_REQUEST = 'event/FETCH_ONE_EVENT_REQUEST',
  FETCH_ONE_EVENT_SUCCESS = 'event/FETCH_ONE_EVENT_SUCCESS',
  FETCH_ONE_EVENT_FAILURE = 'event/FETCH_ONE_EVENT_FAILURE',

  // Create one
  CREATE_EVENT_REQUEST = 'event/CREATE_EVENT_REQUEST',
  CREATE_EVENT_SUCCESS = 'event/CREATE_EVENT_SUCCESS',
  CREATE_EVENT_FAILURE = 'event/CREATE_EVENT_FAILURE',

  // Update one
  UPDATE_EVENT_REQUEST = 'event/UPDATE_EVENT_REQUEST',
  UPDATE_EVENT_SUCCESS = 'event/UPDATE_EVENT_SUCCESS',
  UPDATE_EVENT_FAILURE = 'event/UPDATE_EVENT_FAILURE',

  // Update event status
  UPDATE_EVENT_STATUS_REQUEST = 'event/UPDATE_EVENT_STATUS_REQUEST',
  UPDATE_EVENT_STATUS_SUCCESS = 'event/UPDATE_EVENT_STATUS_SUCCESS',
  UPDATE_EVENT_STATUS_FAILURE = 'event/UPDATE_EVENT_STATUS_FAILURE',

  // Delete one
  DELETE_EVENT_REQUEST = 'event/DELETE_EVENT_REQUEST',
  DELETE_EVENT_SUCCESS = 'event/DELETE_EVENT_SUCCESS',
  DELETE_EVENT_FAILURE = 'event/DELETE_EVENT_FAILURE'
}

/* Action Interfaces */

// Fetch all events    -- Public
export interface FetchEventsRequestAction extends Action<
  typeof EventActionTypes.FETCH_EVENTS_REQUEST>{  
}
export interface FetchEventsSuccessAction extends Action<
  typeof EventActionTypes.FETCH_EVENTS_SUCCESS>{
    payload: Events
}
export interface FetchEventsFailureAction extends Action<
  typeof EventActionTypes.FETCH_EVENTS_FAILURE>{
    payload: { error: string }
}

// Fetch All events by ID  -- Private
export interface FetchEventsByIdRequestAction extends Action<
  typeof EventActionTypes.FETCH_EVENTS_BY_ID_REQUEST>{
    payload: {id: string}
}
export interface FetchEventsByIdSuccessAction extends Action<
  typeof EventActionTypes.FETCH_EVENTS_BY_ID_SUCCESS>{
    payload: UserEvents
}
export interface FetchEventsByIdFailureAction extends Action<
  typeof EventActionTypes.FETCH_EVENTS_BY_ID_FAILURE>{
    payload: { error: string }
}

// Fetch ONE
export interface FetchEventRequestAction extends Action<
  typeof EventActionTypes.FETCH_ONE_EVENT_REQUEST>{
    payload: { id: string };
}
export interface FetchEventSuccessAction extends Action<
  typeof EventActionTypes.FETCH_ONE_EVENT_SUCCESS>{
  payload: TheEvent;
}
export interface FetchEventFailureAction extends Action<
  typeof EventActionTypes.FETCH_ONE_EVENT_FAILURE>{
  payload: { error: string };
}

// Create one
export interface CreateEventRequestAction extends Action<
  typeof EventActionTypes.CREATE_EVENT_REQUEST>{
  payload: CreateEventBody
}
export interface CreateEventSuccessAction extends Action<
  typeof EventActionTypes.CREATE_EVENT_SUCCESS>{
  payload: TheEvent;
}
export interface CreateEventFailureAction extends Action<
  typeof EventActionTypes.CREATE_EVENT_FAILURE>{
  payload: { error: string };
}

// Update event
export interface UpdateEventRequestAction extends Action<
  typeof EventActionTypes.UPDATE_EVENT_REQUEST>{
  payload: UpdateAnEvent;
}
export interface UpdateEventSuccessAction extends Action<
  typeof EventActionTypes.UPDATE_EVENT_SUCCESS>{
  payload: UpdatedEvent;
}
export interface UpdateEventFailureAction extends Action<
  typeof EventActionTypes.UPDATE_EVENT_FAILURE>{
  payload: { error: string };
}

// Update event status
export interface UpdateEventStatusRequestAction extends Action<
  typeof EventActionTypes.UPDATE_EVENT_STATUS_REQUEST>{
  payload: UpdateEventStatus;
}
export interface UpdateEventStatusSuccessAction extends Action<
  typeof EventActionTypes.UPDATE_EVENT_STATUS_SUCCESS>{
  payload: UpdatedEvent;
}
export interface UpdateEventStatusFailureAction extends Action<
  typeof EventActionTypes.UPDATE_EVENT_STATUS_FAILURE>{
  payload: { error: string };
}

// Delete
export interface DeleteEventRequestAction extends Action<
  typeof EventActionTypes.DELETE_EVENT_REQUEST>{
  payload: { id: string };
}
export interface DeleteEventSuccessAction extends Action<
  typeof EventActionTypes.DELETE_EVENT_SUCCESS>{
  payload: DeletedEvent;
}
export interface DeleteEventFailureAction extends Action<
  typeof EventActionTypes.DELETE_EVENT_FAILURE>{
  payload: { error: string };
}

export type EventActions =
  | FetchEventsRequestAction
  | FetchEventsSuccessAction
  | FetchEventsFailureAction
  | FetchEventsByIdRequestAction
  | FetchEventsByIdSuccessAction
  | FetchEventsByIdFailureAction
  | FetchEventRequestAction
  | FetchEventSuccessAction
  | FetchEventFailureAction
  | CreateEventRequestAction
  | CreateEventSuccessAction
  | CreateEventFailureAction
  | UpdateEventRequestAction
  | UpdateEventSuccessAction
  | UpdateEventFailureAction
  | UpdateEventStatusRequestAction
  | UpdateEventStatusSuccessAction
  | UpdateEventStatusFailureAction
  | DeleteEventRequestAction
  | DeleteEventSuccessAction
  | DeleteEventFailureAction



