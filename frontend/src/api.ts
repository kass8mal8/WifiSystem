import axios from 'axios';

const isDev = import.meta.env.DEV;

const API_URL = isDev 
  ? `/api` 
  : `https://wifisystem.onrender.com/api`;

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface WifiUser {
  _id: string;
  name: string;
  macAddress: string;
  paymentExpiryDate: string;
  amountPaid: number;
  methodPaid: string;
  status: 'active' | 'expired';
  createdAt: string;
  routerSync?: {
    success: boolean;
    message?: string;
  };
}

export const fetchUsers = async (): Promise<WifiUser[]> => {
  const response = await api.get('/users');
  return response.data;
};

export const createUser = async (userData: any): Promise<WifiUser> => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};

export const updateUser = async (id: string, userData: any): Promise<WifiUser> => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

// Auth APIs
export const loginUser = async (credentials: any) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData: any) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const updateRouterSettings = async (settings: any) => {
  const response = await api.put('/auth/me/router', settings);
  return response.data;
};

// Router APIs
export const fetchRouterStatus = async () => {
  const response = await api.get('/router/status');
  return response.data;
};

export const fetchConnectedDevices = async () => {
  const response = await api.get('/router/devices');
  return response.data;
};

export default api;
