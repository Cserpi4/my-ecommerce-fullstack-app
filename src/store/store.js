import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer.js';

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // pl. sessionStorage vagy non-serializable data miatt
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
