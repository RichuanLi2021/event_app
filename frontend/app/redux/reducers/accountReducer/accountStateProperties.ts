import type { User } from "~/features/users/types";
import type { UpdateAccountInfo } from "~/features/users/types";

export interface AccountState {
  currentUser: User | null; 
  pendingUpdate: UpdateAccountInfo | null;
  loading: boolean;   
  updating: boolean; 
  deleting: boolean;
  error: string | null; 
}

export const initialAccountState: AccountState = {
  currentUser: null,
  pendingUpdate: null,
  loading: false,
  updating: false,
  deleting: false,
  error: null,
};