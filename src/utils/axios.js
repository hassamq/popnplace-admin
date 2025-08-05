import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

// Use the correct API server URL from environment or fallback to the dev API
const API_BASE_URL = CONFIG.serverUrl || 'https://dev-api.popnplace.nl';

console.log('Old Axios Instance - API Base URL:', API_BASE_URL); // Debug log

const axiosInstance = axios.create({ baseURL: API_BASE_URL });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/v1/chat',
  kanban: '/api/v1/kanban',
  calendar: '/api/v1/calendar',
  auth: {
    me: '/api/v1/auth/profile',
    login: '/api/v1/auth/login',
    signIn: '/api/v1/auth/login', // Add this for backward compatibility
    signUp: '/api/v1/auth/sign-up',
    logout: '/api/v1/auth/logout',
    refresh: '/api/v1/auth/refresh',
  },
  mail: {
    list: '/api/v1/mail/list',
    details: '/api/v1/mail/details',
    labels: '/api/v1/mail/labels',
  },
  post: {
    list: '/api/v1/post/list',
    details: '/api/v1/post/details',
    latest: '/api/v1/post/latest',
    search: '/api/v1/post/search',
  },
  product: {
    list: '/api/v1/product/list',
    details: '/api/v1/product/details',
    search: '/api/v1/product/search',
  },
  users: {
    list: '/api/v1/users',
    details: '/api/v1/users/:id',
  },
};
