// src/services/api.ts
import axios, { AxiosResponse } from 'axios';
import { Planta, Categoria, PlantaFormData } from '../types';

const API_BASE_URL = 'http://localhost:3000/api/';

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
    console.log('📦 Request Data:', config.data);
    console.log('🔑 Headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Teste de conectividade
api.get('/')
  .then(response => {
    console.log('✅ Conectado ao servidor:', response.status);
  })
  .catch(error => {
    console.error('❌ Falha ao conectar com o servidor:', error);
  });

api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    console.log('📥 Response Data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.message);
    console.error('🔍 Error Details:', error.response?.data);
    return Promise.reject(error);
  }
);

// ==================== PLANTAS ====================

export const plantasApi = {
  getAll: async (): Promise<Planta[]> => {
    console.log('🌱 Buscando todas as plantas...');
    try {
      const response = await api.get<Planta[]>('/plantas');
      console.log(`✅ Encontradas ${response.data.length} plantas`);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar plantas:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Planta> => {
    console.log(`🌱 Buscando planta com ID ${id}...`);
    try {
      const response = await api.get<Planta>(`/plantas/${id}`);
      console.log('✅ Planta encontrada:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao buscar planta ${id}:`, error);
      throw error;
    }
  },

  create: async (data: PlantaFormData): Promise<{ id: number }> => {
    console.log('🌱 Criando nova planta...', data);
    try {
      const response = await api.post<{ id: number }>('/plantas', data);
      console.log('✅ Planta criada com ID:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao criar planta:', error);
      throw error;
    }
  },

  update: async (id: number, data: Partial<PlantaFormData>): Promise<void> => {
    console.log(`🌱 Atualizando planta ${id}...`, data);
    try {
      await api.put(`/plantas/${id}`, data);
      console.log(`✅ Planta ${id} atualizada com sucesso`);
    } catch (error) {
      console.error(`❌ Erro ao atualizar planta ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    console.log(`🌱 Deletando planta ${id}...`);
    try {
      await api.delete(`/plantas/${id}`);
      console.log(`✅ Planta ${id} deletada com sucesso`);
    } catch (error) {
      console.error(`❌ Erro ao deletar planta ${id}:`, error);
      throw error;
    }
  },

  updateWateringDate: async (id: number, date: string): Promise<void> => {
    console.log(`💧 Atualizando data de rega da planta ${id} para:`, date);
    try {
      await api.put(`/plantas/${id}`, {
        data_ultima_rega: date,
      });
      console.log(`✅ Data de rega da planta ${id} atualizada`);
    } catch (error) {
      console.error(`❌ Erro ao atualizar data de rega da planta ${id}:`, error);
      throw error;
    }
  },
};

// ==================== CATEGORIAS ====================

export const categoriasApi = {
  getAll: async (): Promise<Categoria[]> => {
    console.log('📂 Buscando todas as categorias...');
    try {
      const response = await api.get<Categoria[]>('/categorias');
      console.log(`✅ Encontradas ${response.data.length} categorias`);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar categorias:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Categoria> => {
    console.log(`📂 Buscando categoria com ID ${id}...`);
    try {
      const response = await api.get<Categoria>(`/categorias/${id}`);
      console.log('✅ Categoria encontrada:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao buscar categoria ${id}:`, error);
      throw error;
    }
  },

  create: async (nome: string): Promise<{ id_categoria: number }> => {
    console.log('📂 Criando nova categoria...', { nome });
    try {
      const response = await api.post<{ id_categoria: number }>('/categorias', { nome });
      console.log('✅ Categoria criada com ID:', response.data.id_categoria);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao criar categoria:', error);
      throw error;
    }
  },

  update: async (id: number, nome: string): Promise<void> => {
    console.log(`📂 Atualizando categoria ${id}...`, { nome });
    try {
      await api.put(`/categorias/${id}`, { nome });
      console.log(`✅ Categoria ${id} atualizada com sucesso`);
    } catch (error) {
      console.error(`❌ Erro ao atualizar categoria ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    console.log(`📂 Deletando categoria ${id}...`);
    try {
      await api.delete(`/categorias/${id}`);
      console.log(`✅ Categoria ${id} deletada com sucesso`);
    } catch (error) {
      console.error(`❌ Erro ao deletar categoria ${id}:`, error);
      throw error;
    }
  },
};

export default api;