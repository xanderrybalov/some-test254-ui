// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
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
  },
} as const;

// Default pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  ITEMS_PER_PAGE: 10,
} as const;
