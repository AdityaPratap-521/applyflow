import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      errors: error.response?.data?.errors || null,
      status: error.response?.status || 500,
    };
    return Promise.reject(customError);
  }
);

export const getHealth = () => apiClient.get('/health');

export const getStats = () => apiClient.get('/stats');

export const getApplications = (params = {}) => apiClient.get('/applications', { params });

export const getApplicationById = (id) => apiClient.get(`/applications/${id}`);

export const createApplication = (data) => apiClient.post('/applications', data);

export const updateApplication = (id, data) => apiClient.put(`/applications/${id}`, data);

export const deleteApplication = (id) => apiClient.delete(`/applications/${id}`);
