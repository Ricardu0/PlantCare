// src/types/index.ts

export interface Categoria {
  id_categoria: number;
  nome: string;
}

export interface Planta {
  id: number;
  nome: string;
  especie?: string;
  frequencia_rega?: number; // em dias
  data_ultima_rega?: string; // formato ISO
  observacoes?: string;
  id_categoria?: number;
  categoria_nome?: string;
}

export interface PlantaFormData {
  nome: string;
  especie?: string;
  frequencia_rega?: number;
  data_ultima_rega?: string;
  observacoes?: string;
  id_categoria?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}