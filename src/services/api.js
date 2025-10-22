import axios from 'axios';
import { CONFIG } from 'src/config-global';
// ----------------------------------------------------------------------

export const storageService = {
  /**
   * Create a new storage category
   * @param {Object} data - Category data
   * @returns {Promise<Object>} Created category
   */
  createStorageCategory: async (data) => {
    try {
      const response = await apiClient.post('/api/v1/storage/categories', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update a storage category
   * @param {string} id - Category ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object>} Updated category
   */
  updateStorageCategory: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/v1/storage/categories/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete a storage category
   * @param {string} id - Category ID
   * @returns {Promise<Object>} Deletion response
   */
  deleteStorageCategory: async (id) => {
    try {
      const response = await apiClient.delete(`/api/v1/storage/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Add a subcategory to a storage category
   * @param {string} categoryId - Category ID
   * @param {Object} data - Subcategory data
   * @returns {Promise<Object>} Created subcategory
   */
  addSubcategory: async (categoryId, data) => {
    try {
      const response = await apiClient.post(
        `/api/v1/storage/categories/${categoryId}/subcategory`,
        data
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update a subcategory
   * @param {string} categoryId - Category ID
   * @param {string} subcategoryId - Subcategory ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object>} Updated subcategory
   */
  updateSubcategory: async (categoryId, subcategoryId, data) => {
    try {
      const response = await apiClient.put(
        `/api/v1/storage/categories/${categoryId}/subcategory/${subcategoryId}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete a subcategory
   * @param {string} categoryId - Category ID
   * @param {string} subcategoryId - Subcategory ID
   * @returns {Promise<Object>} Deletion response
   */
  deleteSubcategory: async (categoryId, subcategoryId) => {
    try {
      const response = await apiClient.delete(
        `/api/v1/storage/categories/${categoryId}/subcategory/${subcategoryId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  /**
   * Get all storage spaces with filtering and pagination
   * @param {Object} params - Query parameters
   * @param {string} params.category - Filter by storage category
   * @param {string} params.spaceType - Filter by space type
   * @param {number} params.minPrice - Minimum monthly price
   * @param {number} params.maxPrice - Maximum monthly price
   * @param {string} params.city - Filter by city
   * @param {string} params.state - Filter by state
   * @param {string} params.features - Comma-separated features
   * @param {number} params.latitude - Latitude for location-based search
   * @param {number} params.longitude - Longitude for location-based search
   * @param {number} params.radius - Search radius in miles
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.sortBy - Sort by field (e.g., 'newest')
   * @returns {Promise<Object>} Storage spaces list with pagination
   */
  getStorageSpaces: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/v1/storage', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  /**
   * Get all storage categories (types)
   * @returns {Promise<Object>} Storage categories list
   */
  getStorageCategories: async () => {
    try {
      const response = await apiClient.get('/api/v1/storage/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

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
   * Get all users with admin controls
   * @param {Object} params - Query parameters
   * @param {string} params.role - User role filter
   * @param {boolean} params.isActive - Active status filter
   * @param {boolean} params.isVerified - Verification status filter
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.search - Search term
   * @returns {Promise<Object>} Users list with pagination
   */
  getUsers: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/v1/admin/users', { params });
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

  /**
   * Toggle user active status (Admin only)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} API response
   */
  toggleUserStatus: async (userId) => {
    try {
      const response = await apiClient.put(`/api/v1/auth/users/${userId}/toggle-status`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// ----------------------------------------------------------------------

export const dashboardService = {
  /**
   * Get admin dashboard statistics
   * @returns {Promise<Object>} Dashboard statistics
   */
  getDashboardStats: async () => {
    try {
      const response = await apiClient.get('/api/v1/admin/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get detailed analytics
   * @param {string} period - Analytics period (week, month, year)
   * @returns {Promise<Object>} Analytics data
   */
  getAnalytics: async (period = 'week') => {
    try {
      const response = await apiClient.get(`/api/v1/admin/analytics?period=${period}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// ----------------------------------------------------------------------

export default apiClient;
