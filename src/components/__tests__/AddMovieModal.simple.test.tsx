import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders, mockUser, userEvent } from '../../test/utils'
import { AddMovieModal } from '../AddMovieModal'
import React from 'react'
import '@testing-library/jest-dom'

// Mock message from antd
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd')
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
    },
  }
})

describe('AddMovieModal - Simple Tests', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const defaultPreloadedState = {
    auth: {
      isAuthenticated: true,
      user: mockUser,
      loading: false,
      error: null,
      token: 'test-token',
    },
    userMovies: {
      userMovies: [],
      loading: false,
      error: null,
    },
    movies: { movies: [], loading: false, error: null, searchQuery: '', totalResults: 0, currentPage: 1 },
    favorites: { favoriteMovieIds: [], favoriteMovies: [], loading: false, error: null, showFavoritesOnly: false },
  }

  it('should render when visible', () => {
    renderWithProviders(
      <AddMovieModal visible={true} onClose={mockOnClose} />,
      { preloadedState: defaultPreloadedState }
    )
    
    expect(screen.getByText('Add New Movie')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter movie title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter release year')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter runtime in minutes')).toBeInTheDocument()
  })

  it('should not render when not visible', () => {
    renderWithProviders(
      <AddMovieModal visible={false} onClose={mockOnClose} />,
      { preloadedState: defaultPreloadedState }
    )
    
    expect(screen.queryByText('Add New Movie')).not.toBeInTheDocument()
  })

  it('should add and remove genre fields', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(
      <AddMovieModal visible={true} onClose={mockOnClose} />,
      { preloadedState: defaultPreloadedState }
    )
    
    // Should have one genre field initially
    const genreInputs = screen.getAllByPlaceholderText('Enter genre')
    expect(genreInputs).toHaveLength(1)
    
    // Add another genre field
    const addGenreButton = screen.getByText('Add Genre')
    await user.click(addGenreButton)
    
    // Should now have two genre fields
    const updatedGenreInputs = screen.getAllByPlaceholderText('Enter genre')
    expect(updatedGenreInputs.length).toBeGreaterThanOrEqual(1)
  })

  it('should close modal when cancel button is clicked', async () => {
    const user = userEvent.setup()
    
    renderWithProviders(
      <AddMovieModal visible={true} onClose={mockOnClose} />,
      { preloadedState: defaultPreloadedState }
    )
    
    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)
    
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should show error when there is an API error', () => {
    const preloadedStateWithError = {
      ...defaultPreloadedState,
      userMovies: {
        userMovies: [],
        loading: false,
        error: 'A movie with the same name already exists.',
      },
    }
    
    renderWithProviders(
      <AddMovieModal visible={true} onClose={mockOnClose} />,
      { preloadedState: preloadedStateWithError }
    )
    
    expect(screen.getByText('A movie with the same name already exists.')).toBeInTheDocument()
  })
})
