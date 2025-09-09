import type { Movie } from './movie';

export interface FavoritesState {
  favoriteMovieIds: string[]; // Array of movie IDs that are favorited
  favoriteMovies: Movie[]; // Array of actual favorite movie objects
  loading: boolean;
  error: string | null;
  showFavoritesOnly: boolean; // Filter toggle state
}

export interface ToggleFavoriteRequest {
  userId: string;
  movieId: string;
}

export interface FavoritesResponse {
  favorites: string[]; // Array of movie IDs
}
