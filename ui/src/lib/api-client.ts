import axios, { AxiosHeaders, type AxiosInstance } from 'axios';

export interface Service {
  id: number;
  dns_name: string;
  host: string;
  port: number;
  proto: 'http' | 'https' | 'tcp' | 'udp';
  created_at: string;
}

export interface CreateServiceDto {
  dns_name: string;
  host: string;
  port: number;
  proto?: 'http' | 'https' | 'tcp' | 'udp';
}

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized error
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const servicesApi = {
  getAll: () => apiClient.get<Service[]>('/services'),
  getById: (id: number) => apiClient.get<Service>(`/services/${id}`),
  create: (data: CreateServiceDto) => apiClient.post<Service>('/services', data),
  update: (id: number, data: Partial<CreateServiceDto>) =>
    apiClient.patch<Service>(`/services/${id}`, data),
  delete: (id: number) => apiClient.delete(`/services/${id}`),
};

export const healthApi = {
  check: () => apiClient.get('/health'),
};

export const authApi = {
  login: (data: { username: string; password: string; remember_me: boolean }) =>
    apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  status: () => apiClient.get('/auth/status'),
  getConfig: () => apiClient.get('/auth/config'),
  updateConfig: (data: {
    auth_enabled?: boolean;
    session_expiry_minutes?: number;
  }) => apiClient.post('/auth/config', data),
};

export default apiClient;
