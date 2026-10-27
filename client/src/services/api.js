import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const TOKEN_KEY = 'cinebook_token';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.code === 'ECONNABORTED') {
    return 'The server took too long to respond. Please try again.';
  }

  if (!error.response) {
    return 'Unable to connect to CineBook. Make sure the backend server is running on port 5000.';
  }

  return 'Something went wrong. Please try again.';
};

export const authService = {
  register: async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },
  login: async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    return data;
  },
  me: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};

export const movieService = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/movies', { params });
    return data;
  },
  search: async (query) => {
    const { data } = await api.get('/movies/search', { params: { q: query } });
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/movies/${id}`);
    return data;
  },
};

export const showtimeService = {
  getAll: async (params = {}) => {
    const { data } = await api.get('/showtimes', { params });
    return data;
  },
  getSeats: async (id) => {
    const { data } = await api.get(`/showtimes/${id}/seats`);
    return data;
  },
};

export const bookingService = {
  create: async (payload) => {
    const { data } = await api.post('/bookings', payload);
    return data;
  },
  getMine: async () => {
    const { data } = await api.get('/bookings/my');
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/bookings/${id}`);
    return data;
  },
  cancel: async (id) => {
    const { data } = await api.patch(`/bookings/${id}/cancel`);
    return data;
  },
};

export default api;
