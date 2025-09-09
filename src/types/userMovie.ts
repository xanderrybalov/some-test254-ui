export interface CreateMovieData {
  title: string;
  year: number;
  runtimeMinutes: number;
  genre: string[];
  director: string[];
}

export interface UserMovieState {
  userMovies: any[];
  loading: boolean;
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
