import type { DeleteAccountSuccessPayload, UpdateAccountInfo, UpdateAccountSuccessPayload } from "~/features/users/types";
import type { Action } from 'redux';

export enum AccountActionTypes {
  // Update 
  UPDATE_ACCOUNT_REQUEST = 'account/UPDATE_ACCOUNT_REQUEST',
  UPDATE_ACCOUNT_SUCCESS = 'account/UPDATE_ACCOUNT_SUCCESS',
  UPDATE_ACCOUNT_FAILURE = 'account/UPDATE_ACCOUNT_FAILURE',

  // Delete 
  DELETE_ACCOUNT_REQUEST = 'account/DELETE_ACCOUNT_REQUEST',
  DELETE_ACCOUNT_SUCCESS = 'account/DELETE_ACCOUNT_SUCCESS',
  DELETE_ACCOUNT_FAILURE = 'account/DELETE_ACCOUNT_FAILURE',
}

// Action interfaces
export interface UpdateAccountRequestAction extends Action<typeof AccountActionTypes.UPDATE_ACCOUNT_REQUEST> {
  payload: UpdateAccountInfo;
}

export interface UpdateAccountSuccessAction extends Action<typeof AccountActionTypes.UPDATE_ACCOUNT_SUCCESS> {
  payload: UpdateAccountSuccessPayload;
}

export interface UpdateAccountFailureAction extends Action<typeof AccountActionTypes.UPDATE_ACCOUNT_FAILURE> {
  payload: { error: string };
}

export interface DeleteAccountRequest extends Action<typeof AccountActionTypes.DELETE_ACCOUNT_REQUEST> {
  payload: { _id: string };
}

export interface DeleteAccountSuccess extends Action<typeof AccountActionTypes.DELETE_ACCOUNT_SUCCESS> {
  payload: DeleteAccountSuccessPayload;
}

export interface DeleteAccountFailure extends Action<typeof AccountActionTypes.DELETE_ACCOUNT_FAILURE> {
  payload: { error: string };
}

export type AccountActions = 
  | UpdateAccountRequestAction
  | UpdateAccountSuccessAction
  | UpdateAccountFailureAction
  | DeleteAccountRequest
  | DeleteAccountSuccess
  | DeleteAccountFailure
