// src/api/axios.ts
import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import type { AxiosRequestHeaders } from "axios";
import { env } from "~/config/env";
import { store } from "~/redux/store";
import { refreshSuccess, logoutUser as logoutAction } from "~/redux/actions/auth/Auth-actionCreators";

const getAccessToken = () => store.getState().auth.jwtToken;
const setAccessToken = (token: string) => {
  store.dispatch(refreshSuccess(token));
};
const logout = () => {
  store.dispatch(logoutAction());
};

export const api = axios.create({
  baseURL: `${env.VITE_API_BASE_URL}${env.VITE_API_PREFIX}`,
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) {
    if (config.headers) {
      (config.headers as AxiosRequestHeaders)['Authorization'] = `Bearer ${token}`;
    } else {
      config.headers = { Authorization: `Bearer ${token}` } as AxiosRequestHeaders;
    }
  }
  return config;
});

let isRefreshing = false;
let queue: ((token: string) => void)[] = [];

api.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const orig = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || orig._retry) {
      return Promise.reject(error);
    }
    orig._retry = true;

    console.log("!!! Access token expired: sending /auth/refresh-token");

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const { data } = await api.post(`${env.VITE_API_BASE_URL}${env.VITE_API_PREFIX}/auth/refresh-token`);
        setAccessToken(data.token); 
        isRefreshing = false;
        queue.forEach(cb => cb(data.token)); 
        queue = [];
      } catch (refreshErr) {
        isRefreshing = false;
        queue = [];
        logout();  
        return Promise.reject(refreshErr);
      }
    }

    return new Promise((resolve, reject) => {
      queue.push(token => {
        orig.headers!.Authorization = `Bearer ${token}`;
        resolve(api(orig));
      });
    });
  }
);