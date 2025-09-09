export interface Movie {
  id: string;
  omdbId: string;
  title: string;
  year: number;
  runtimeMinutes: number;
  genre: string[];
  director: string[];
  poster: string;
  source: string;
}

export interface MovieSearchResponse {
  items: Movie[];
}

export interface MovieState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  totalResults: number;
  currentPage: number;
}
