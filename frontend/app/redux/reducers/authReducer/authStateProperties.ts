import type { User, SignupValues, LoginValues } from "~/features/auth/types/auth_types";

export default interface AuthState {
    pendingSignup?: SignupValues; //form data to be sent
    pendingLogin?: LoginValues;

    currentUser: User | null;
    jwtToken: string | null;
    isAuthenticated: boolean;
    
    loading: boolean;
    error: string | null;
}