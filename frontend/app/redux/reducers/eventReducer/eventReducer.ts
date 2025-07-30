import { EventActionTypes, type EventActions } from "~/redux/actions/events/Event-actionTypes";
import { type EventState, initialEventState } from "./eventStateProperties";
import { AuthActionTypes, type AuthActions } from "~/redux/actions/auth/Auth-actionTypes";

export default function eventReducer(
  state = initialEventState,
  action: EventActions | AuthActions
): EventState {
    switch (action.type) {
    // Fetch All
    case EventActionTypes.FETCH_EVENTS_REQUEST:
      return { 
        ...state, 
        loading: true, 
        error: null 
    };
    case EventActionTypes.FETCH_EVENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        events: action.payload,
        error: null,
      };
    case EventActionTypes.FETCH_EVENTS_FAILURE:
      return { 
        ...state, 
        loading: false, 
        error: action.payload.error 
    };

    // Fetch All by User Id
    case EventActionTypes.FETCH_EVENTS_BY_ID_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case EventActionTypes.FETCH_EVENTS_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        currentUserEvents: action.payload,
        error: null
      };
    case EventActionTypes.FETCH_EVENTS_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };

    // Fetch one
    case EventActionTypes.FETCH_ONE_EVENT_REQUEST:
      return { 
        ...state, 
        loading: true, 
        error: null 
    };
    case EventActionTypes.FETCH_ONE_EVENT_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        selectedEvent: action.payload
    };

    case EventActionTypes.FETCH_ONE_EVENT_FAILURE:
      return { 
        ...state, 
        loading: false, 
        error: action.payload.error 
    };

    // CREATE 
    case EventActionTypes.CREATE_EVENT_REQUEST:
      return { 
        ...state, 
        updating: true, 
        error: null 
    };

    case EventActionTypes.CREATE_EVENT_SUCCESS:
      return {
        ...state,
        updating: false,
        events: [...state.events, action.payload],
        selectedEvent: action.payload,
      };

    case EventActionTypes.CREATE_EVENT_FAILURE:
      return { 
        ...state, 
        updating: false, 
        error: action.payload.error 
    };

    // Update
    case EventActionTypes.UPDATE_EVENT_REQUEST:
      return { 
        ...state, 
        updating: true, 
        error: null 
    };

    case EventActionTypes.UPDATE_EVENT_SUCCESS:
      return {
        ...state,
        updating: false,
        events: state.events.map((event) =>
          event._id === action.payload._id ? action.payload : event
        ),
        selectedEvent:
          state.selectedEvent?._id === action.payload._id
            ? action.payload
            : state.selectedEvent,
      };

    case EventActionTypes.UPDATE_EVENT_FAILURE:
      return { 
        ...state, 
        updating: false, 
        error: action.payload.error 
    };

    // Update event status
    case EventActionTypes.UPDATE_EVENT_STATUS_REQUEST:
      return {
        ...state,
        updating: true,
        error: null
      };

    case EventActionTypes.UPDATE_EVENT_STATUS_SUCCESS:
      return {
        ...state,
        updating: false,
        events: state.events.map((event) =>
          event._id === action.payload._id ? action.payload : event
        ),
        updatedEventStatus: {
          _id: action.payload._id,
          status: action.payload.status,
        },
      };

    case EventActionTypes.UPDATE_EVENT_STATUS_FAILURE:
      return {
        ...state,
        updating: false, 
        error: action.payload.error 
      };

    //DELETE
    case EventActionTypes.DELETE_EVENT_REQUEST:
      return { 
        ...state, 
        deleting: true, 
        error: null 
    };

    case EventActionTypes.DELETE_EVENT_SUCCESS:
      return {
        ...state,
        deleting: false,
        events: state.events.filter((e) => e._id !== action.payload._id),
        selectedEvent:
          state.selectedEvent?._id === action.payload._id ? null : state.selectedEvent,
      };

    case EventActionTypes.DELETE_EVENT_FAILURE:
      return { 
        ...state, 
        deleting: false, 
        error: action.payload.error 
    };
    case AuthActionTypes.LOGIN_SUCCESS:
    case AuthActionTypes.LOGOUT:
      return { ...initialEventState };
    default:
      return state;
    }
}