import axios from 'axios';
import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

// Use the correct API server URL from environment or fallback to the dev API
const API_BASE_URL = CONFIG.serverUrl || 'https://dev-api.popnplace.nl';

console.log('API Base URL:', API_BASE_URL); // Debug log to verify the URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
    });

    const token = localStorage.getItem('jwt_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('jwt_access_token');
      window.location.href = '/auth/jwt/sign-in';
    }
    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------------

export const authService = {
  /**
   * Login user
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Login response with token and user data
   */
  login: async (credentials) => {
    try {
      console.log('AuthService.login called with:', credentials);
      console.log('Making request to:', `${API_BASE_URL}/api/v1/auth/login`);

      const response = await apiClient.post('/api/v1/auth/login', credentials);
      console.log('Login response:', response.data);

      // Handle the actual API response structure
      const { success, data, message } = response.data;

      if (!success) {
        throw new Error(message || 'Login failed');
      }

      // Return the data in the expected format
      return {
        accessToken: data.token,
        user: data.user,
        message,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get('/api/v1/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Logout user
   * @returns {Promise<Object>} Logout response
   */
  logout: async () => {
    try {
      const response = await apiClient.post('/api/v1/auth/logout');
      localStorage.removeItem('jwt_access_token');
      return response.data;
    } catch (error) {
      // Even if logout fails, clear local storage
      localStorage.removeItem('jwt_access_token');
      throw error.response?.data || error.message;
    }
  },

  /**
   * Refresh access token
   * @returns {Promise<Object>} New token data
   */
  refreshToken: async () => {
    try {
      const response = await apiClient.post('/api/v1/auth/refresh');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// ----------------------------------------------------------------------

export const userService = {
  /**
   * Get all users
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Users list
   */
  getUsers: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/v1/users', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User data
   */
  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`/api/v1/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update user
   * @param {string} userId - User ID
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Updated user data
   */
  updateUser: async (userId, userData) => {
    try {
      const response = await apiClient.put(`/api/v1/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Deletion response
   */
  deleteUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/api/v1/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// ----------------------------------------------------------------------

export default apiClient;
