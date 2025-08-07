import type { User } from "~/features/users/types";

export interface SignupValues {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: string;
  confirmPassword: string;
  receiveUpdates?: boolean;
};

export interface LoginValues {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export interface LoginSuccessPayload {
  user:  User;
  token: string;
}

export interface AuthFormProps {
  mode: 'signup' | 'login';
}


