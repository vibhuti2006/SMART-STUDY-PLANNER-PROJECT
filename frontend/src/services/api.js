import axios from 'axios';

const API_BASE = 'https://smart-study-planner-project-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ... existing axios setup ...

export const subjectsAPI = {
  getAll: () => api.get('/subjects'),
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
};

export const examsAPI = {
  getAll: () => api.get('/exams'),
  create: (data) => api.post('/exams', data),
  update: (id, data) => api.put(`/exams/${id}`, data),
  delete: (id) => api.delete(`/exams/${id}`),
};

export const scheduleAPI = {
  getToday: () => api.get('/study-sessions/schedule?weeksAhead=1'),  // Top day
};

// ... existing authAPI

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),  // Adjust if your endpoint is /signin
};

export const studySessionsAPI = {
  create: (data) => api.post('/study-sessions', data),
  getAnalytics: (period = 'month') => api.get(`/study-sessions/analytics?period=${period}`),
};

export default api;
