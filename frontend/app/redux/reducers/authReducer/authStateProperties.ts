import type { SignupValues, LoginValues } from "~/features/auth/types/auth_types";
import type { User } from "~/features/users/types";

export default interface AuthState {
    pendingSignup?: SignupValues; //form data to be sent
    pendingLogin?: LoginValues;

    currentUser: User | null;
    jwtToken: string | null;
    isAuthenticated: boolean;
    
    loading: boolean;
    error: string | null;
}

export const initialAuthState: AuthState = {
    pendingSignup: undefined,
    pendingLogin: undefined,

    currentUser: null,
    jwtToken: null,
    isAuthenticated: false,

    loading: false,
    error: null
}