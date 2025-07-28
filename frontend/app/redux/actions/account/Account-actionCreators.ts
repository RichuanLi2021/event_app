import type { DeleteAccountSuccessPayload, UpdateAccountInfo, UpdateAccountSuccessPayload} from "~/features/users/types";
import { AccountActionTypes, type AccountActions } from "./Account-actionTypes";
import type { ThunkAction } from 'redux-thunk';
import { type AppState } from "~/redux/store";
import * as accountApi from '~/features/users/services/accountApi';

export const updateAccount = (
    updateData: UpdateAccountInfo
): ThunkAction<Promise<UpdateAccountSuccessPayload>, AppState, unknown, AccountActions> => {
    return async (dispatch) => {
        dispatch({
            type: AccountActionTypes.UPDATE_ACCOUNT_REQUEST,
            payload: updateData,
        });
        try {
            const updated = await accountApi.updateUserInfo(updateData);
            dispatch({
                type: AccountActionTypes.UPDATE_ACCOUNT_SUCCESS,
                payload: updated 
            })
            console.log("Updated user is: ", updated);
            return updated;
        } catch (error: any) {
            dispatch({
                type: AccountActionTypes.UPDATE_ACCOUNT_FAILURE,
                payload: { error: error.message || "Update failed."}
            })
            throw error;
        }
    }
}

export const deleteAccount =  (
    deleteId: string
): ThunkAction<Promise<DeleteAccountSuccessPayload>, AppState, unknown, AccountActions> => {
    return async (dispatch) => {
        dispatch({
            type: AccountActionTypes.DELETE_ACCOUNT_REQUEST,
            payload: {_id: deleteId}
        });
        try {
            const deletedAccount = await accountApi.deleteAccount(deleteId);

            dispatch({
                type: AccountActionTypes.DELETE_ACCOUNT_SUCCESS,
                payload: deletedAccount
            })
            return deletedAccount;
        } catch (error: any) {
            dispatch({
                type: AccountActionTypes.DELETE_ACCOUNT_FAILURE,
                payload: {error: error.message || "Delete account failed."}
            })
        }
    }
}