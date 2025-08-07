import type { LoginValues, SignupValues } from "~/features/auth/types/auth_types";
import type { User } from "~/features/users/types";
import type { Action } from 'redux';

export enum AuthActionTypes {
  // Signup
  SIGNUP_REQUEST = 'auth/SIGNUP_REQUEST',
  SIGNUP_SUCCESS = 'auth/SIGNUP_SUCCESS',
  SIGNUP_FAILURE = 'auth/SIGNUP_FAILURE',

  // Login
  LOGIN_REQUEST = 'auth/LOGIN_REQUEST',
  LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS',
  LOGIN_FAILURE = 'auth/LOGIN_FAILURE',

  // Logout - tmp
  LOGOUT = 'auth/LOGOUT',

  // Refresh
  REFRESH_REQUEST = 'auth/REFRESH_REQUEST',
  REFRESH_SUCCESS = 'auth/REFRESH_SUCCESS',
  REFRESH_FAILURE = 'auth/REFRESH_FAILURE',

  // Authenticated
  SET_AUTHENTICATED = 'auth/SET_AUTHENTICATED',
}

//Signup actions
export interface SignupRequestAction extends Action<typeof AuthActionTypes.SIGNUP_REQUEST> {
  payload: {formData: SignupValues};
};
export interface SignupSuccessAction extends Action<typeof AuthActionTypes.SIGNUP_SUCCESS>  {
  payload: { user: User; token: string };
};
export interface SignupFailureAction extends Action<typeof AuthActionTypes.SIGNUP_FAILURE> {
  payload: {error: string};
};

//Login actions
export interface LoginRequestAction extends Action<typeof AuthActionTypes.LOGIN_REQUEST> {
  payload: {formData: LoginValues}
};
export interface LoginSuccessAction extends Action<typeof AuthActionTypes.LOGIN_SUCCESS>{
  payload: { user: User, token: string }
};
export interface LoginFailureAction extends Action<typeof AuthActionTypes.LOGIN_FAILURE>{
  payload: {error: string};
};

//Logout
export interface SyncLogoutAction extends Action<
  typeof AuthActionTypes.LOGOUT>{};
export interface SetAuthenticatedAction extends Action<
  typeof AuthActionTypes.SET_AUTHENTICATED>{}
export interface JwtPayload { 
  exp: number 
}

// Refresh
export interface RefreshRequestAction extends Action<
typeof AuthActionTypes.REFRESH_REQUEST>{}
export interface RefreshSuccessAction extends Action<typeof AuthActionTypes.REFRESH_SUCCESS>{
  payload: { token: string }; 
}
export interface RefreshFailureAction extends Action<typeof AuthActionTypes.REFRESH_FAILURE>{
  payload: { error: string };
};
export const refreshSuccess = (token: string) => ({
  type: AuthActionTypes.REFRESH_SUCCESS,
  payload: { token },
});

export type AuthActions =
  | SignupRequestAction
  | SignupSuccessAction
  | SignupFailureAction
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction
  | SyncLogoutAction
  | SetAuthenticatedAction
  | RefreshRequestAction
  | RefreshSuccessAction
  | RefreshFailureAction;