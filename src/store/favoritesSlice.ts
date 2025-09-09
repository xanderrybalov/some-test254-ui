import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { FavoritesState, ToggleFavoriteRequest } from '../types/favorites';
import { ApiService } from '../utils/api';
import { API_CONFIG } from '../utils/constants';

const initialState: FavoritesState = {
  favoriteMovieIds: localStorage.getItem('favoriteMovieIds') 
    ? JSON.parse(localStorage.getItem('favoriteMovieIds')!) 
    : [],
  favoriteMovies: [],
  loading: false,
  error: null,
  showFavoritesOnly: false,
};

// Toggle favorite status of a movie
export const toggleFavorite = createAsyncThunk(
  'favorites/toggleFavorite',
  async ({ userId, movieId }: ToggleFavoriteRequest, { rejectWithValue, getState }) => {
    try {
      const endpoint = API_CONFIG.ENDPOINTS.TOGGLE_FAVORITE
        .replace(':userId', userId)
        .replace(':movieId', movieId);
      
      // Get current favorites state to determine new toggle state
      const state = getState() as any;
      const currentFavorites = state.favorites.favoriteMovieIds as string[];
      const isCurrentlyFavorite = currentFavorites.includes(movieId);
      const newFavoriteState = !isCurrentlyFavorite;
      
      const response = await ApiService.put(endpoint, {
        isFavorite: newFavoriteState
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }
      
      return { movieId, userId };
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return rejectWithValue('Failed to connect to backend API. Please make sure the server is running on http://localhost:8080');
      }
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred while updating favorites');
    }
  }
);

// Fetch user's favorite movies
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (userId: string, { rejectWithValue }) => {
    try {
      const endpoint = `${API_CONFIG.ENDPOINTS.GET_USER_MOVIES.replace(':userId', userId)}?favorites=true`;
      
      const response = await ApiService.get(endpoint);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // API returns array of favorite movies directly
      const favoriteMovies = Array.isArray(data) ? data : [];
      const favoriteIds = favoriteMovies.map((movie: any) => movie.id);
      
      
      return { favoriteMovies, favoriteIds };
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return rejectWithValue('Failed to connect to backend API. Please make sure the server is running on http://localhost:8080');
      }
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred while fetching favorites');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    toggleShowFavoritesOnly: (state) => {
      state.showFavoritesOnly = !state.showFavoritesOnly;
    },
    setShowFavoritesOnly: (state, action) => {
      state.showFavoritesOnly = action.payload;
    },
    clearFavorites: (state) => {
      state.favoriteMovieIds = [];
      state.favoriteMovies = [];
      state.showFavoritesOnly = false;
      localStorage.removeItem('favoriteMovieIds');
    },
  },
  extraReducers: (builder) => {
    builder
      // Toggle favorite
      .addCase(toggleFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.loading = false;
        const { movieId } = action.payload;
        
        // Toggle the movie ID in favorites array
        const index = state.favoriteMovieIds.indexOf(movieId);
        
        if (index > -1) {
          // Remove from favorites
          state.favoriteMovieIds.splice(index, 1);
          state.favoriteMovies = state.favoriteMovies.filter(movie => movie.id !== movieId);
        } else {
          // Add to favorites - only add ID for now, full movie data will be fetched next time
          state.favoriteMovieIds.push(movieId);
          // Note: We don't add to favoriteMovies here as we don't have full movie data
          // The favoriteMovies will be updated on next fetchFavorites call
        }
        
        // Save to localStorage
        localStorage.setItem('favoriteMovieIds', JSON.stringify(state.favoriteMovieIds));
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favoriteMovieIds = action.payload.favoriteIds;
        state.favoriteMovies = action.payload.favoriteMovies;
        
        // Save to localStorage
        localStorage.setItem('favoriteMovieIds', JSON.stringify(state.favoriteMovieIds));
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, toggleShowFavoritesOnly, setShowFavoritesOnly, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
