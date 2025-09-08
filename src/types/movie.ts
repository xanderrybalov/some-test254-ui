export interface Movie {
  id: string;
  title: string;
  year: string;
  poster: string;
  type: string;
  imdbID: string;
}

export interface MovieSearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
  Error?: string;
}

export interface MovieState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  totalResults: number;
  currentPage: number;
}
