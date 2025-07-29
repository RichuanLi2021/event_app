import { persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import eventReducer from './eventReducer/eventReducer';
import authReducer from './authReducer/authReducer';
import accountReducer from './accountReducer/accountReducer';
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

const eventsPersistConfig = {
  key: 'events',
  storage,
  whitelist: ['events', 'selectedEvent', 'currentUserEvents', 'updatedEventStatus'],
}

export const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  events: persistReducer(eventsPersistConfig, eventReducer),
  account: accountReducer
  // other reducers
});