// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  ENDPOINTS: {
    // Movies
    SEARCH_MOVIES: '/movies/search', // POST - JSON body: {"query": "movie title"}
    MOVIES_BY_IDS: '/movies/by-ids', // POST
    USERS_ENSURE: '/users/ensure',   // POST
    MOVIES_DETAILS: '/movies',       // GET
    
    // Authentication
    AUTH_REGISTER: '/auth/register', // POST
    AUTH_LOGIN: '/auth/login',       // POST  
    AUTH_VERIFY: '/auth/verify',     // POST
    
    // Favorites
    TOGGLE_FAVORITE: '/users/:userId/movies/:movieId/favorite', // PUT - Toggle favorite status
    GET_USER_MOVIES: '/users/:userId/movies', // GET - Get user movies (with ?favorites=true for favorites)
    
    // User Movies
    ADD_USER_MOVIE: '/users/:userId/movies', // POST - Add a new movie
    EDIT_USER_MOVIE: '/users/:userId/movies/:movieId', // PUT - Edit a movie
    DELETE_USER_MOVIE: '/users/:userId/movies/:movieId', // DELETE - Delete a movie
  },
} as const;

// Default pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  ITEMS_PER_PAGE: 10,
} as const;
