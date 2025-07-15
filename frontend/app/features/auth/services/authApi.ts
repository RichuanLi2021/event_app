import type { SignupValues, LoginValues } from "../types/auth_types";
import { api } from "~/api/central-axios";

export async function signup(formData: SignupValues) {
  try {
    const { data } = await api.post("/auth/signup", formData);
    return data; 
  } catch (err: any) {
    const status = err.response?.status ?? "network";
    throw new Error(`Signup failed (${status})`);
  }
}

export async function login(formData: LoginValues) {
  try {
    const { data } = await api.post("/auth/sign-in", formData);
    return data;
  } catch (err: any) {
    const status = err.response?.status ?? "network";
    throw new Error(`Login failed (${status})`);
  }
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch (err: any) {
    const status = err.response?.status ?? "network";
    throw new Error(`Logout failed (${status})`);
  }
}