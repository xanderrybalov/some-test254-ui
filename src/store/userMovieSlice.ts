import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { UserMovieState, AddMovieRequest, DeleteMovieRequest } from '../types/userMovie';
import { ApiService } from '../utils/api';
import { API_CONFIG } from '../utils/constants';
import type { RootState } from '.';
import type { Movie } from '../types/movie';

const initialState: UserMovieState = {
  userMovies: [],
  loading: false,
  error: null,
};

// Add a new movie
export const addUserMovie = createAsyncThunk(
  'userMovies/addMovie',
  async ({ userId, movieData }: AddMovieRequest, { rejectWithValue, getState }) => {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.ADD_USER_MOVIE.replace(':userId', userId);
      
      // Check for duplicate title in existing movies
      const state = getState() as RootState;
      const allMovies = [...state.movies.movies, ...state.userMovies.userMovies, ...state.favorites.favoriteMovies];
      const isDuplicate = allMovies.some((movie: Movie) => 
        movie.title.toLowerCase().trim() === movieData.title.toLowerCase().trim()
      );
      
      if (isDuplicate) {
        throw new Error('A movie with the same name already exists.');
      }
      
      const response = await ApiService.post(endpoint, movieData);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return rejectWithValue('Failed to connect to backend API. Please make sure the server is running on http://localhost:8080');
      }
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred while adding the movie');
    }
  }
);

// Delete a movie
export const deleteUserMovie = createAsyncThunk(
  'userMovies/deleteMovie',
  async ({ userId, movieId }: DeleteMovieRequest, { rejectWithValue }) => {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.DELETE_USER_MOVIE
        .replace(':userId', userId)
        .replace(':movieId', movieId);
      
      const response = await ApiService.delete(endpoint);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }
      
      return { movieId };
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return rejectWithValue('Failed to connect to backend API. Please make sure the server is running on http://localhost:8080');
      }
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred while deleting the movie');
    }
  }
);

// Fetch user created movies
export const fetchUserMovies = createAsyncThunk(
  'userMovies/fetchUserMovies',
  async (userId: string, { rejectWithValue }) => {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.GET_USER_MOVIES.replace(':userId', userId);
      
      const response = await ApiService.get(endpoint);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Filter only user-created movies (source: "custom")
      const allUserMovies = Array.isArray(data) ? data : [];
      const userCreatedMovies = allUserMovies.filter((movie: Movie) => movie.source === 'custom');
      
      return userCreatedMovies;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return rejectWithValue('Failed to connect to backend API. Please make sure the server is running on http://localhost:8080');
      }
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred while fetching user movies');
    }
  }
);

const userMovieSlice = createSlice({
  name: 'userMovies',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUserMovies: (state) => {
      state.userMovies = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Add movie
      .addCase(addUserMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUserMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.userMovies.push(action.payload);
      })
      .addCase(addUserMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete movie
      .addCase(deleteUserMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.userMovies = state.userMovies.filter(movie => movie.id !== action.payload.movieId);
      })
      .addCase(deleteUserMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch user movies
      .addCase(fetchUserMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.userMovies = action.payload;
      })
      .addCase(fetchUserMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearUserMovies } = userMovieSlice.actions;
export default userMovieSlice.reducer;
