import type { EventProperties } from "../../../types/events";
import * as actionTypes from "../../actions/events/actionTypes";
import type { EventState } from "./eventStateProperties";

const initialState: EventState = {
    events: [],
    loading: false,
    error: null
}

export default function eventReducer (
    state = initialState, 
    action: any
): EventState {
    switch (action.type) {
        // Fetch Events
        case actionTypes.FETCH_EVENTS_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case actionTypes.FETCH_EVENTS_SUCCESS:
            return {
                ...state,
                events: action.payload,
                loading: false,
            }
        case actionTypes.FETCH_EVENTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        // To be completed...

        
        default:
            return state;
    }
}