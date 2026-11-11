import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
API.interceptors.request.use(
  config => {
    const token = localStorage.getItem('heritage_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor to handle unauthenticated responses
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      // Only remove if not already on login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('heritage_token');
        localStorage.removeItem('heritage_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authAPI = {
  login: credentials => API.post('/auth/login', credentials),
  register: userData => API.post('/auth/register', userData),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: data => API.put('/auth/profile', data),
};

// Heritage Endpoints
export const heritageAPI = {
  getAll: params => API.get('/heritage', { params }),
  getById: id => API.get(`/heritage/${id}`),
  getFilterOptions: () => API.get('/heritage/meta/filters'),
  create: data => API.post('/heritage', data),
  update: (id, data) => API.put(`/heritage/${id}`, data),
  delete: id => API.delete(`/heritage/${id}`),
};

// Learning Modules Endpoints
export const moduleAPI = {
  getAll: params => API.get('/modules', { params }),
  getById: id => API.get(`/modules/${id}`),
  create: data => API.post('/modules', data),
};

// Quiz Endpoints
export const quizAPI = {
  getAll: params => API.get('/quizzes', { params }),
  getById: id => API.get(`/quizzes/${id}`),
  submit: (id, answers) => API.post(`/quizzes/${id}/submit`, { answers }),
  create: data => API.post('/quizzes', data),
};

// Progress Endpoints
export const progressAPI = {
  getUserProgress: () => API.get('/progress'),
  recordView: heritageId => API.post('/progress/recent-view', { heritageId }),
  completeModule: moduleId => API.post('/progress/complete-module', { moduleId }),
};

// Bookmarks Endpoints
export const bookmarkAPI = {
  getAll: () => API.get('/bookmarks'),
  add: heritageId => API.post('/bookmarks', { heritageId }),
  remove: heritageId => API.delete(`/bookmarks/${heritageId}`),
};

// Admin Endpoints
export const adminAPI = {
  getStats: () => API.get('/admin/dashboard'),
  getAllUsers: params => API.get('/admin/users', { params }),
  updateUser: (id, data) => API.put(`/admin/users/${id}`, data),
};

export default API;
