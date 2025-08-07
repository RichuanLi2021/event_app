import { AccountActionTypes, type AccountActions } from "~/redux/actions/account/Account-actionTypes";
import { initialAccountState, type AccountState } from "./accountStateProperties";

export default function accountReducer(
  state = initialAccountState,
  action: AccountActions
): AccountState {
  switch (action.type) {
    // Update account
    case AccountActionTypes.UPDATE_ACCOUNT_REQUEST:
      return {
        ...state,
        updating: true,
        error: null,
        pendingUpdate: action.payload,
      };

    case AccountActionTypes.UPDATE_ACCOUNT_SUCCESS:
      return {
        ...state,
        updating: false,
        currentUser: action.payload,
        pendingUpdate: null,
        error: null,
      };

    case AccountActionTypes.UPDATE_ACCOUNT_FAILURE:
      return {
        ...state,
        updating: false,
        error: action.payload.error,
        pendingUpdate: null,
      };
    
    // Delete account
    case AccountActionTypes.DELETE_ACCOUNT_REQUEST:
      return {
        ...state,
        deleting: true,
        error: null,
      };

    case AccountActionTypes.DELETE_ACCOUNT_SUCCESS:
      return {
        ...initialAccountState,
      };

    case AccountActionTypes.DELETE_ACCOUNT_FAILURE:
      return {
        ...state,
        deleting: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
}