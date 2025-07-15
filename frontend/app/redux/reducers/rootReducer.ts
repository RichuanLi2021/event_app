import { persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import eventReducer from './eventReducer/eventReducer';
import authReducer from './authReducer/authReducer';
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => ({
  getItem(_key: string) {
    return Promise.resolve(null);   
  },
  setItem(_key: string, value: unknown) {
    return Promise.resolve(value); 
  },
  removeItem(_key: string) {
    return Promise.resolve();
  },
});

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['jwtToken', 'isAuthenticated', 'currentUser'],
};

export const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  events: eventReducer,
  // other reducers
});