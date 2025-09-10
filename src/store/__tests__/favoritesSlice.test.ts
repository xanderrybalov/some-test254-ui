import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import favoritesReducer, {
  toggleFavorite,
  fetchFavorites,
  clearError,
  toggleShowFavoritesOnly,
  setShowFavoritesOnly,
  clearFavorites,
} from '../favoritesSlice'
import { mockMovie, mockUser } from '../../test/utils'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock API
globalThis.fetch = vi.fn()

describe('favoritesSlice', () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    store = configureStore({
      reducer: {
        favorites: favoritesReducer,
        userMovies: vi.fn().mockReturnValue({ userMovies: [] }),
        movies: vi.fn().mockReturnValue({ movies: [] }),
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
    })
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should return the initial state', () => {
      localStorageMock.getItem.mockReturnValue(null)
      const state = (store.getState() as any).favorites
      expect(state).toEqual({
        favoriteMovieIds: [],
        favoriteMovies: [],
        loading: false,
        error: null,
        showFavoritesOnly: false,
      })
    })

  })

  describe('reducers', () => {
    it('should handle clearError', () => {
      store = configureStore({
        reducer: { favorites: favoritesReducer },
        preloadedState: {
          favorites: {
            favoriteMovieIds: [],
            favoriteMovies: [],
            loading: false,
            error: 'Test error',
            showFavoritesOnly: false,
          },
        },
      })

      store.dispatch(clearError())
      const state = (store.getState() as any).favorites
      expect(state.error).toBeNull()
    })

    it('should handle toggleShowFavoritesOnly', () => {
      store.dispatch(toggleShowFavoritesOnly())
      let state = (store.getState() as any).favorites
      expect(state.showFavoritesOnly).toBe(true)

      store.dispatch(toggleShowFavoritesOnly())
      state = (store.getState() as any).favorites
      expect(state.showFavoritesOnly).toBe(false)
    })

    it('should handle setShowFavoritesOnly', () => {
      store.dispatch(setShowFavoritesOnly(true))
      const state = (store.getState() as any).favorites
      expect(state.showFavoritesOnly).toBe(true)
    })

    it('should handle clearFavorites', () => {
      store = configureStore({
        reducer: { favorites: favoritesReducer },
        preloadedState: {
          favorites: {
            favoriteMovieIds: ['1', '2'],
            favoriteMovies: [mockMovie],
            loading: false,
            error: null,
            showFavoritesOnly: true,
          },
        },
      })

      store.dispatch(clearFavorites())
      const state = (store.getState() as any).favorites
      expect(state.favoriteMovieIds).toEqual([])
      expect(state.favoriteMovies).toEqual([])
      expect(state.showFavoritesOnly).toBe(false)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('favoriteMovieIds')
    })
  })

  describe('toggleFavorite', () => {
    it('should handle toggleFavorite.pending', () => {
      const action = { type: toggleFavorite.pending.type }
      const state = favoritesReducer(undefined, action)
      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should add movie to favorites when not favorited', () => {
      const action = {
        type: toggleFavorite.fulfilled.type,
        payload: { movieId: mockMovie.id },
      }
      const state = favoritesReducer(undefined, action)
      expect(state.loading).toBe(false)
      expect(state.favoriteMovieIds).toContain(mockMovie.id)
    })

    it('should remove movie from favorites when already favorited', () => {
      const initialState = {
        favoriteMovieIds: [mockMovie.id],
        favoriteMovies: [mockMovie],
        loading: false,
        error: null,
        showFavoritesOnly: false,
      }
      const action = {
        type: toggleFavorite.fulfilled.type,
        payload: { movieId: mockMovie.id },
      }
      const state = favoritesReducer(initialState, action)
      expect(state.loading).toBe(false)
      expect(state.favoriteMovieIds).not.toContain(mockMovie.id)
      expect(state.favoriteMovies).not.toContain(mockMovie)
    })

    it('should save favorites to localStorage', () => {
      const action = {
        type: toggleFavorite.fulfilled.type,
        payload: { movieId: mockMovie.id },
      }
      favoritesReducer(undefined, action)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'favoriteMovieIds',
        JSON.stringify([mockMovie.id])
      )
    })

    it('should successfully toggle favorite via thunk', async () => {
      const mockResponse = { ok: true }
      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse)

      await store.dispatch(toggleFavorite({ 
        userId: mockUser.id, 
        movieId: mockMovie.id 
      }))

      const state = (store.getState() as any).favorites
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/users/user-1/movies/${mockMovie.id}/favorite`),
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({ isFavorite: true }),
        })
      )
    })

    it('should handle API error', async () => {
      const mockResponse = { 
        ok: false, 
        status: 500,
        json: vi.fn().mockResolvedValue({ error: 'Server error' })
      }
      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse)

      await store.dispatch(toggleFavorite({ 
        userId: mockUser.id, 
        movieId: mockMovie.id 
      }))

      const state = (store.getState() as any).favorites
      expect(state.loading).toBe(false)
      expect(state.error).toBe('Server error')
    })
  })

  describe('fetchFavorites', () => {
    it('should handle fetchFavorites.fulfilled', () => {
      const favoriteMovies = [mockMovie]
      const action = {
        type: fetchFavorites.fulfilled.type,
        payload: {
          favoriteMovies,
          favoriteIds: [mockMovie.id],
        },
      }
      const state = favoritesReducer(undefined, action)
      expect(state.loading).toBe(false)
      expect(state.favoriteMovies).toEqual(favoriteMovies)
      expect(state.favoriteMovieIds).toEqual([mockMovie.id])
    })

    it('should successfully fetch favorites via thunk', async () => {
      const favoriteMovies = [mockMovie]
      const mockResponse = { 
        ok: true, 
        json: vi.fn().mockResolvedValue(favoriteMovies) 
      }
      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse)

      await store.dispatch(fetchFavorites(mockUser.id))

      const state = (store.getState() as any).favorites
      expect(state.loading).toBe(false)
      expect(state.favoriteMovies).toEqual(favoriteMovies)
      expect(state.favoriteMovieIds).toEqual([mockMovie.id])
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/users/user-1/movies?favorites=true`),
        expect.objectContaining({
          method: 'GET',
        })
      )
    })
  })
})
