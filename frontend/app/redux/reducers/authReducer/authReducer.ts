import type AuthState from "./authStateProperties";
import type { AuthActions } from "../../actions/auth/Auth-actionCreators";
import { AuthActionTypes } from "../../actions/auth/Auth-actionTypes";

const initialState: AuthState = {
    pendingSignup: undefined,
    pendingLogin: undefined,

    currentUser: null,
    jwtToken: null,
    isAuthenticated: false,

    loading: false,
    error: null
}

export default function authReducer(
    state = initialState,
    action: AuthActions
): AuthState {
    switch(action.type) {
        //Signup
        case AuthActionTypes.SIGNUP_REQUEST:
            return {
                ...state,

                pendingSignup: action.payload.formData,

                loading: true,
                error: null
            };
        case AuthActionTypes.SIGNUP_SUCCESS:
            return {
                ...state,

                currentUser: action.payload.user,
                jwtToken: action.payload.token,

                pendingSignup: undefined,

                loading: false,
                error: null
            };
        case AuthActionTypes.SIGNUP_FAILURE:
            return {
                ...state,
                pendingSignup: undefined,
                loading: false,
                error: action.payload.error
            }

        //login
        case AuthActionTypes.LOGIN_REQUEST:
            return {
                ...state,
                pendingLogin: action.payload.formData,
                loading: true,
                error: null
            };
        case AuthActionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                currentUser: action.payload.user,
                jwtToken: action.payload.token,
                isAuthenticated: true,

                pendingLogin: undefined,
                loading: false,
                error: null
            };
        case AuthActionTypes.LOGIN_FAILURE:
            return {
                ...state,
                pendingLogin: undefined,
                loading: false,
                error: action.payload.error
            };

        // Logout – restore slice to initial state
        case AuthActionTypes.LOGOUT:
            return initialState;

        case AuthActionTypes.SET_AUTHENTICATED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                error: null,
            };
        
        // Handle refresh 
        case AuthActionTypes.REFRESH_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case AuthActionTypes.REFRESH_SUCCESS:
            return {
                ...state,
                jwtToken: action.payload.token,   // payload is the new token
                isAuthenticated: true,
                loading: false,
                error: null,
            };
        case AuthActionTypes.REFRESH_FAILURE:
            return {
                ...state,
                jwtToken: null,
                isAuthenticated: false,
                loading: false,
                error: action.payload.error,
            };
        default:
            return state;
    }
}