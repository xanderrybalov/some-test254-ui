import React from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import { ThemeProvider } from '../styles/ThemeContext'

import movieReducer from '../store/movieSlice'
import authReducer from '../store/authSlice'
import favoritesReducer from '../store/favoritesSlice'
import userMovieReducer from '../store/userMovieSlice'

// Create a test store with initial state
export function createTestStore(preloadedState?: any) {
  return configureStore({
    reducer: {
      movies: movieReducer,
      auth: authReducer,
      favorites: favoritesReducer,
      userMovies: userMovieReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Disable for tests
      }),
  })
}

// Custom render function with providers
export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: {
    preloadedState?: any
    store?: ReturnType<typeof createTestStore>
  } & Omit<RenderOptions, 'wrapper'> = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    )
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}

// Mock movie data
export const mockMovie = {
  id: '1',
  omdbId: 'tt1234567',
  title: 'Test Movie',
  year: 2023,
  runtimeMinutes: 120,
  genre: ['Action', 'Adventure'],
  director: ['Test Director'],
  poster: 'https://example.com/poster.jpg',
  source: 'omdb',
}

export const mockUserMovie = {
  id: '2',
  title: 'Custom Movie',
  year: 2024,
  runtimeMinutes: 90,
  genre: ['Drama'],
  director: ['Custom Director'],
  poster: null,
  source: 'custom',
}

export const mockUser = {
  id: 'user-1',
  username: 'testuser',
  email: 'test@example.com',
}

// Export all from testing library
export * from '@testing-library/react'
export { userEvent } from '@testing-library/user-event'
