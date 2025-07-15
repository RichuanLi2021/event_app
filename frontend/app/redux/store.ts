import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducers/rootReducer'; 
import logger from './middleware/logger';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { persistStore } from 'redux-persist';
import { validateToken } from './actions/auth/Auth-actionCreators';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logger),
  devTools: process.env.NODE_ENV === 'development'
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store, null, ()=>{
  store.dispatch(validateToken());
});
