import { AuthActionTypes, type AuthActions, type JwtPayload } from "./Auth-actionTypes";
import type { SignupValues, LoginValues, LoginSuccessPayload } from "~/features/auth/types/auth_types";
import * as authApi from '~/features/auth/services/authApi'
import type { ThunkAction } from 'redux-thunk';
import { persistor, type AppState } from "~/redux/store";
import { jwtDecode }  from "jwt-decode";

export const signupUser = (
  formData: SignupValues
): ThunkAction<Promise<void>, AppState, unknown, AuthActions> => {
  return async (dispatch) => {
    dispatch({ type: AuthActionTypes.SIGNUP_REQUEST, payload: {formData} });
    try {
      const data = await authApi.signup(formData);
      dispatch({
        type: AuthActionTypes.SIGNUP_SUCCESS,
        payload: { user: data.user, token: data.token },
      });
      return data;
    } catch (err: any) {
      dispatch({
        type: AuthActionTypes.SIGNUP_FAILURE,
        payload: { error: err.message || 'Signup failed' },
      });
      throw err;
    }
  };
};

export const loginUser = (
  formData: LoginValues
): ThunkAction<Promise<LoginSuccessPayload>, AppState, unknown, AuthActions> => {
  return async (dispatch) => {
    dispatch({ 
      type: AuthActionTypes.LOGIN_REQUEST, 
      payload: {formData} 
    });
    try {
      const data = await authApi.login(formData);
      dispatch({
        type: AuthActionTypes.LOGIN_SUCCESS,
        payload: { 
          user: data.user, 
          token: data.token
        },
      });
      return data;
    } catch (err: any) {
      dispatch({
        type: AuthActionTypes.LOGIN_FAILURE,
        payload: { error: err.message || 'Login failed' },
      });
      throw err;
    }
  };
};

export const logoutUser = ():
  ThunkAction<void, AppState, unknown, AuthActions> => 
  async (dispatch) => {
    try {
      await authApi.logout();
      dispatch({ type: AuthActionTypes.LOGOUT });
      await persistor.purge();
      // Only access localStorage on client side
      if (typeof window !== 'undefined') {
        localStorage.removeItem("persist:auth");
        localStorage.removeItem("persist:events"); // force remove if purge failed to clear
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
}

export const validateToken = ():
  ThunkAction<void, AppState, unknown, AuthActions> =>
  async (dispatch, getState) => {
    const { jwtToken } = (getState() as AppState).auth;
    if (!jwtToken) return;
    try {
      const { exp } = jwtDecode<JwtPayload>(jwtToken);
      const stillValid = exp * 1000 > Date.now();

      if (stillValid) {
        dispatch({ type: AuthActionTypes.SET_AUTHENTICATED });
      } else {
        await dispatch(logoutUser());
      }
    } catch {
      await dispatch(logoutUser());
    }
};
