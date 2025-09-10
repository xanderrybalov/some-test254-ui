import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders, mockMovie, mockUser } from '../../test/utils'
import { MovieList } from '../MovieList'
import '@testing-library/jest-dom'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('MovieList - Simple Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render empty state when no movies', () => {
    renderWithProviders(<MovieList />)
    expect(screen.getByText('Start typing to search for movies')).toBeInTheDocument()
  })

  it('should render movies when available', () => {
    const preloadedState = {
      movies: {
        movies: [mockMovie],
        loading: false,
        error: null,
        searchQuery: 'test',
        totalResults: 1,
        currentPage: 1,
      },
      userMovies: {
        userMovies: [],
        loading: false,
        error: null,
      },
      favorites: {
        favoriteMovieIds: [],
        favoriteMovies: [],
        loading: false,
        error: null,
        showFavoritesOnly: false,
      },
      auth: {
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
        token: null,
      },
    }

    renderWithProviders(<MovieList />, { preloadedState })
    expect(screen.getByText(mockMovie.title)).toBeInTheDocument()
  })

  it('should show loading state', () => {
    const preloadedState = {
      movies: { 
        movies: [], 
        loading: true, 
        error: null, 
        searchQuery: 'test', 
        totalResults: 0, 
        currentPage: 1 
      },
      userMovies: { userMovies: [], loading: false, error: null },
      favorites: { 
        favoriteMovieIds: [], 
        favoriteMovies: [], 
        loading: false, 
        error: null, 
        showFavoritesOnly: false 
      },
      auth: { 
        isAuthenticated: false, 
        user: null, 
        loading: false, 
        error: null, 
        token: null 
      },
    }

    renderWithProviders(<MovieList />, { preloadedState })
    expect(screen.getByText('Searching movies...')).toBeInTheDocument()
  })

  it('should show error state', () => {
    const preloadedState = {
      movies: { 
        movies: [], 
        loading: false, 
        error: 'Network error', 
        searchQuery: 'test', 
        totalResults: 0, 
        currentPage: 1 
      },
      userMovies: { userMovies: [], loading: false, error: null },
      favorites: { 
        favoriteMovieIds: [], 
        favoriteMovies: [], 
        loading: false, 
        error: null, 
        showFavoritesOnly: false 
      },
      auth: { 
        isAuthenticated: false, 
        user: null, 
        loading: false, 
        error: null, 
        token: null 
      },
    }

    renderWithProviders(<MovieList />, { preloadedState })
    expect(screen.getByText("We can't find this movies")).toBeInTheDocument()
  })

  it('should filter favorites when showFavoritesOnly is true', () => {
    const preloadedState = {
      movies: { 
        movies: [], 
        loading: false, 
        error: null, 
        searchQuery: '', 
        totalResults: 0, 
        currentPage: 1 
      },
      userMovies: { userMovies: [], loading: false, error: null },
      favorites: {
        favoriteMovieIds: [mockMovie.id],
        favoriteMovies: [mockMovie],
        loading: false,
        error: null,
        showFavoritesOnly: true,
      },
      auth: { 
        isAuthenticated: true, 
        user: mockUser, 
        loading: false, 
        error: null, 
        token: 'test-token' 
      },
    }

    renderWithProviders(<MovieList />, { preloadedState })
    expect(screen.getByText('Showing 1 favorite movie')).toBeInTheDocument()
  })
})
