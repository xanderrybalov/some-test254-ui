import { API_CONFIG } from './constants';

// API utility class for authenticated requests
export class ApiService {
  private static getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  static async get(endpoint: string): Promise<Response> {
    return fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
  }

  static async post(endpoint: string, data?: any): Promise<Response> {
    return fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async put(endpoint: string, data?: any): Promise<Response> {
    return fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async delete(endpoint: string): Promise<Response> {
    return fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
  }

  // Helper method for handling common API response patterns
  static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}

// Hook for API calls with automatic token refresh handling
export const useApiCall = () => {
  const makeAuthenticatedCall = async <T>(
    apiCall: () => Promise<Response>
  ): Promise<T> => {
    try {
      const response = await apiCall();
      
      // If token is expired (401), you might want to handle refresh here
      if (response.status === 401) {
        // Clear invalid token
        localStorage.removeItem('token');
        // Redirect to login or refresh token
        window.location.href = '/login';
        throw new Error('Session expired');
      }
      
      return ApiService.handleResponse<T>(response);
    } catch (error) {
      throw error;
    }
  };

  return { makeAuthenticatedCall };
};
