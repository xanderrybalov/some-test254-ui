import type { Movie } from './movie';

export interface CreateMovieData {
  title: string;
  year: number;
  runtimeMinutes: number;
  genre: string[];
  director: string[];
}

export interface UserMovieState {
  userMovies: Movie[];
  loading: boolean;
  editLoading: boolean;
  deleteLoading: boolean;
  error: string | null;
}

export interface AddMovieRequest {
  userId: string;
  movieData: CreateMovieData;
}

export interface DeleteMovieRequest {
  userId: string;
  movieId: string;
}

export interface EditMovieData {
  title: string;
  year: number;
  runtimeMinutes: number;
  genre: string[];
  director: string[];
}

export interface EditMovieRequest {
  userId: string;
  movieId: string;
  movieData: EditMovieData;
}
