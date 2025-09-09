import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { MovieState, MovieSearchResponse } from '../types/movie';
import { ApiService } from '../utils/api';
import { API_CONFIG } from '../utils/constants';
import { editUserMovie, deleteUserMovie } from './userMovieSlice';

const initialState: MovieState = {
  movies: [],
  loading: false,
  error: null,
  searchQuery: '',
  totalResults: 0,
  currentPage: 1,
};

export const searchMovies = createAsyncThunk(
  'movies/searchMovies',
  async ({ query, page = 1 }: { query: string; page?: number }, { rejectWithValue }) => {
    try {
      const response = await ApiService.post(API_CONFIG.ENDPOINTS.SEARCH_MOVIES, {
        query: query.trim(),
      });
      
      const data = await ApiService.handleResponse<MovieSearchResponse>(response);
      
      if (!data.items || data.items.length === 0) {
        throw new Error('No movies found');
      }
      
      return {
        movies: data.items || [],
        totalResults: data.items.length, // For now, use actual items count
        page,
        query,
      };
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return rejectWithValue('Failed to connect to backend API. Please make sure the server is running on http://localhost:8080');
      }
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred while searching movies');
    }
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearMovies: (state) => {
      state.movies = [];
      state.totalResults = 0;
      state.currentPage = 1;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.page === 1 
          ? action.payload.movies 
          : [...state.movies, ...action.payload.movies];
        state.totalResults = action.payload.totalResults;
        state.currentPage = action.payload.page;
        state.searchQuery = action.payload.query;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        if (state.currentPage === 1) {
          state.movies = [];
        }
      })
      // Sync user movie edits to search results
      .addCase(editUserMovie.fulfilled, (state, action) => {
        const { movieId, updatedMovie } = action.payload;
        const index = state.movies.findIndex(movie => movie.id === movieId);
        if (index !== -1) {
          state.movies[index] = updatedMovie;
        }
      })
      // Sync user movie deletes to search results
      .addCase(deleteUserMovie.fulfilled, (state, action) => {
        const { movieId } = action.payload;
        state.movies = state.movies.filter(movie => movie.id !== movieId);
      });
  },
});

export const { setSearchQuery, clearMovies, clearError } = movieSlice.actions;
export default movieSlice.reducer;
