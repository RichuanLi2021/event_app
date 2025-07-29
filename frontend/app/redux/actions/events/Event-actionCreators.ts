import { EventActionTypes, type EventActions } from "./Event-actionTypes";
import type { ThunkAction } from 'redux-thunk';
import type { 
    CreateEventBody, 
    DeletedEvent, 
    Events, 
    TheEvent, 
    UpdateAnEvent, 
    UpdatedEvent, 
    UserEvents
} from "~/features/events/types";
import { type AppState } from "~/redux/store";
import * as eventApi from "~/features/events/services/eventApi";

export const fetchAllEvents = (): ThunkAction<
    Promise<Events>, AppState, unknown, EventActions
> => {
    return async (dispatch) => {
        dispatch({
            type: EventActionTypes.FETCH_EVENTS_REQUEST
        })
        try {
            const events = await eventApi.fetchAllEvents();
            dispatch({
                type: EventActionTypes.FETCH_EVENTS_SUCCESS,
                payload: events
            });
            console.log("Events are: ", events);
            return events;
        } catch (error: any) {
            dispatch({
                type: EventActionTypes.FETCH_EVENTS_FAILURE,
                payload: {error: error.message || "Fetch events failed."}
            })
            throw error;
        }
    }
}

export const fetchAllEventsById = (usrId: string): ThunkAction<
    Promise<UserEvents>, AppState, unknown, EventActions
> => {
    return async (dispatch) => {
        dispatch({
            type: EventActionTypes.FETCH_EVENTS_BY_ID_REQUEST,
            payload: { id: usrId }
        })
        try {
            const usrEvents = await eventApi.fetchAllEventsByUsrId(usrId);
            dispatch({
                type: EventActionTypes.FETCH_EVENTS_BY_ID_SUCCESS,
                payload: usrEvents
            });

            // CheckPoint: DO NOT DELETE
            console.log("User events are: ", usrEvents);

            return usrEvents;
        } catch (err: any) {
            dispatch({
                type: EventActionTypes.FETCH_EVENTS_BY_ID_FAILURE,
                payload: {error: err.message || "Fetch event failed."}
            })
            throw err;
        }
    }

}

export const fetchEvent = (id: string): ThunkAction<
    Promise<TheEvent>, AppState, unknown, EventActions
> => {
    return async (dispatch) => {
        dispatch({
            type: EventActionTypes.FETCH_ONE_EVENT_REQUEST,
            payload: {id}
        })
        try {
            const event = await eventApi.fetchEventById(id);
            dispatch({
                type: EventActionTypes.FETCH_ONE_EVENT_SUCCESS,
                payload: event
            })
            console.log(`Fetched event is: ${event}`);
            return event;
        } catch (err: any) {
            dispatch({
                type: EventActionTypes.FETCH_ONE_EVENT_FAILURE,
                payload: {error: err.message || "Fetch event failed."}
            })
            throw err;
        }
    }
}

// Org
export const createEventAction = (NewEvent: CreateEventBody): ThunkAction<
    Promise<TheEvent>, AppState, unknown, EventActions
> => {
    return async (dispatch) => {
        dispatch({
            type: EventActionTypes.CREATE_EVENT_REQUEST,
            payload: NewEvent
        });
        try {
            const newEvent = await eventApi.createEvent(NewEvent);
            dispatch({
                type: EventActionTypes.CREATE_EVENT_SUCCESS,
                payload: newEvent
            })
            console.log(`Event created: ${newEvent}`);
            return newEvent
        } catch (err: any) {
            dispatch({
                type: EventActionTypes.CREATE_EVENT_FAILURE,
                payload: {error: err.message || "Create event failed."}
            })
            throw err;
        }
    }
}

export const updateEvent = (UpdateEventFields: UpdateAnEvent): ThunkAction<
    Promise<UpdatedEvent>, AppState, unknown, EventActions
> => {
    return async (dispatch) => {
        dispatch({
            type: EventActionTypes.UPDATE_EVENT_REQUEST,
            payload: UpdateEventFields
        });
        try {
            const updatedEvent = await eventApi.updateEvent(UpdateEventFields);
            dispatch({
                type: EventActionTypes.UPDATE_EVENT_SUCCESS,
                payload: updatedEvent
            });
            console.log(`Event updated succeed! ${updateEvent}`);
            return updatedEvent;
        } catch (err: any) {
            dispatch({
                type: EventActionTypes.UPDATE_EVENT_FAILURE,
                payload: {error: err.message || "Event update failed."}
            })
            throw err;
        }
    }
}

export const deleteEvent = (id: string): ThunkAction<
    Promise<DeletedEvent>, AppState, unknown, EventActions
> => {
    return async (dispatch) => {
        dispatch({
            type: EventActionTypes.DELETE_EVENT_REQUEST,
            payload: { id }
        })
        try {
            const deleted = await eventApi.deleteEvent(id);
            dispatch({
                type: EventActionTypes.DELETE_EVENT_SUCCESS,
                payload: deleted
            });
            console.log(`Event is deleted: ${deleted}`);
            return deleted;
        } catch (err: any) {
            dispatch({
                type: EventActionTypes.DELETE_EVENT_FAILURE,
                payload: {error: err.message || "Event delete failed."}
            })
            throw err;
        }
    }
}