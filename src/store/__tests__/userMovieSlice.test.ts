import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import userMovieReducer, { 
  addUserMovie, 
  deleteUserMovie, 
  fetchUserMovies,
  clearError,
  clearUserMovies
} from '../userMovieSlice'
import { mockUserMovie, mockUser } from '../../test/utils'

// Mock API
globalThis.fetch = vi.fn()

describe('userMovieSlice', () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    store = configureStore({
      reducer: {
        userMovies: userMovieReducer,
        favorites: vi.fn().mockReturnValue({ favoriteMovieIds: [] }),
        movies: vi.fn().mockReturnValue({ movies: [] }),
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
    })
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should return the initial state', () => {
      const state = (store.getState() as any).userMovies
      expect(state.userMovies).toEqual([])
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('reducers', () => {
    it('should handle clearError', () => {
      // First set an error
      store = configureStore({
        reducer: {
          userMovies: userMovieReducer,
        },
        preloadedState: {
          userMovies: {
            userMovies: [],
            loading: false,
            error: 'Test error',
          },
        },
      })

      store.dispatch(clearError())
      const state = (store.getState() as any).userMovies
      expect(state.error).toBeNull()
    })

    it('should handle clearUserMovies', () => {
      store = configureStore({
        reducer: {
          userMovies: userMovieReducer,
        },
        preloadedState: {
          userMovies: {
            userMovies: [mockUserMovie],
            loading: false,
            error: null,
          },
        },
      })

      store.dispatch(clearUserMovies())
      const state = (store.getState() as any).userMovies
      expect(state.userMovies).toEqual([])
    })
  })

  describe('addUserMovie', () => {
    it('should handle addUserMovie.pending', () => {
      const action = { type: addUserMovie.pending.type }
      const state = userMovieReducer(undefined, action)
      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should handle addUserMovie.fulfilled', () => {
      const action = {
        type: addUserMovie.fulfilled.type,
        payload: mockUserMovie,
      }
      const state = userMovieReducer(undefined, action)
      expect(state.loading).toBe(false)
      expect(state.userMovies).toContain(mockUserMovie)
    })

    it('should handle addUserMovie.rejected', () => {
      const action = {
        type: addUserMovie.rejected.type,
        payload: 'Test error',
      }
      const state = userMovieReducer(undefined, action)
      expect(state.loading).toBe(false)
      expect(state.error).toBe('Test error')
    })


    it('should handle duplicate movie error', async () => {
      // Set up store with existing movie
      store = configureStore({
        reducer: {
          userMovies: userMovieReducer,
          movies: vi.fn().mockReturnValue({ movies: [mockUserMovie] }),
          favorites: vi.fn().mockReturnValue({ favoriteMovies: [] }),
        },
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware({ serializableCheck: false }),
      })

      const movieData = {
        title: mockUserMovie.title, // Same title as existing movie
        year: 2024,
        runtimeMinutes: 90,
        genre: ['Drama'],
        director: ['Test'],
      }

      await store.dispatch(addUserMovie({ 
        userId: mockUser.id, 
        movieData 
      }))

      const state = (store.getState() as any).userMovies
      expect(state.error).toBe('A movie with the same name already exists.')
    })
  })

  describe('deleteUserMovie', () => {

    it('should handle deleteUserMovie.fulfilled', () => {
      const initialState = {
        userMovies: [mockUserMovie],
        loading: false,
        error: null,
      }
      const action = {
        type: deleteUserMovie.fulfilled.type,
        payload: { movieId: mockUserMovie.id },
      }
      const state = userMovieReducer(initialState, action)
      expect(state.loading).toBe(false)
      expect(state.userMovies).not.toContain(mockUserMovie)
    })

    it('should successfully delete a movie via thunk', async () => {
      const mockResponse = { ok: true }
      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse)

      await store.dispatch(deleteUserMovie({ 
        userId: mockUser.id, 
        movieId: mockUserMovie.id 
      }))

      const state = (store.getState() as any).userMovies
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/users/user-1/movies/${mockUserMovie.id}`),
        expect.objectContaining({
          method: 'DELETE',
        })
      )
    })
  })

  describe('fetchUserMovies', () => {
    it('should handle fetchUserMovies.pending', () => {
      const action = { type: fetchUserMovies.pending.type }
      const state = userMovieReducer(undefined, action)
      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should handle fetchUserMovies.fulfilled', () => {
      const action = {
        type: fetchUserMovies.fulfilled.type,
        payload: [mockUserMovie],
      }
      const state = userMovieReducer(undefined, action)
      expect(state.loading).toBe(false)
      expect(state.userMovies).toEqual([mockUserMovie])
    })

    it('should filter only custom movies', async () => {
      const allMovies = [
        mockUserMovie, // source: 'custom'
        { ...mockUserMovie, id: '3', source: 'omdb' }, // should be filtered out
      ]
      const mockResponse = { 
        ok: true, 
        json: vi.fn().mockResolvedValue(allMovies) 
      }
      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse)

      await store.dispatch(fetchUserMovies(mockUser.id))

      const state = (store.getState() as any).userMovies
      expect(state.userMovies).toHaveLength(1)
      expect(state.userMovies[0].source).toBe('custom')
    })
  })
})
