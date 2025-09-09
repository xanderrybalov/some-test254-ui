import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './movieSlice';
import authReducer from './authSlice';
import favoritesReducer from './favoritesSlice';

export const store = configureStore({
  reducer: {
    movies: movieReducer,
    auth: authReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
