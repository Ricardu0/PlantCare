// src/services/api.ts
import axios, { AxiosResponse } from 'axios';
import { Planta, Categoria, PlantaFormData } from '../types';

// Ajuste a URL conforme seu ambiente
// Para Android Emulator: http://10.0.2.2:3000/api
// Para iOS Simulator: http://localhost:3000/api
// Para dispositivo físico: http://SEU_IP:3000/api
const API_BASE_URL = 'http://10.0.2.2:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para logs (útil para debug)
api.interceptors.request.use(
  (config) => {
    console.log('📡 Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// ==================== PLANTAS ====================

export const plantasApi = {
  getAll: async (): Promise<Planta[]> => {
    const response = await api.get<Planta[]>('/plantas');
    return response.data;
  },

  getById: async (id: number): Promise<Planta> => {
    const response = await api.get<Planta>(`/plantas/${id}`);
    return response.data;
  },

  create: async (data: PlantaFormData): Promise<{ id: number }> => {
    const response = await api.post<{ id: number }>('/plantas', data);
    return response.data;
  },

  update: async (id: number, data: Partial<PlantaFormData>): Promise<void> => {
    await api.put(`/plantas/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/plantas/${id}`);
  },

  // Atualizar data de rega
  updateWateringDate: async (id: number, date: string): Promise<void> => {
    await api.put(`/plantas/${id}`, {
      data_ultima_rega: date,
    });
  },
};

// ==================== CATEGORIAS ====================

export const categoriasApi = {
  getAll: async (): Promise<Categoria[]> => {
    const response = await api.get<Categoria[]>('/categorias');
    return response.data;
  },

  getById: async (id: number): Promise<Categoria> => {
    const response = await api.get<Categoria>(`/categorias/${id}`);
    return response.data;
  },

  create: async (nome: string): Promise<{ id_categoria: number }> => {
    const response = await api.post<{ id_categoria: number }>('/categorias', { nome });
    return response.data;
  },

  update: async (id: number, nome: string): Promise<void> => {
    await api.put(`/categorias/${id}`, { nome });
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categorias/${id}`);
  },
};

export default api;