// src/hooks/usePlants.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { plantasApi } from '../services/api';
import { PlantaFormData } from '../types';
import { useCallback } from 'react';

export const usePlants = () => {
  const queryClient = useQueryClient();

  const { data: plantas = [], isLoading, error, refetch } = useQuery({
    queryKey: ['plantas'],
    queryFn: plantasApi.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const createPlantMutation = useMutation({
    mutationFn: plantasApi.create,
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['plantas'] });
    },
  });

  const updatePlant = useCallback(async ({ id, data }) => {
  console.log("🌿 [usePlants] Atualizando planta:", id, data);
  await plantasApi.update(id, data);
  await refetch();
}, [refetch]);


  const updatePlantMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PlantaFormData> }) =>
      plantasApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plantas'] });
    },
  });

// src/hooks/usePlants.ts - ADICIONE ESTES LOGS
const deletePlantMutation = useMutation({
  mutationFn: async (id: number) => {
    console.log('🔍 [usePlants] Iniciando delete mutation, ID:', id);
    try {
      await plantasApi.delete(id);
      console.log('✅ [usePlants] Delete mutation concluída com sucesso');
      return id;
    } catch (error) {
      console.error('❌ [usePlants] Erro na delete mutation:', error);
      throw error;
    }
  },
  onSuccess: (id) => {
    console.log('🔄 [usePlants] onSuccess chamado, invalidando queries para ID:', id);
    queryClient.invalidateQueries({ queryKey: ['plantas'] });
  },
  onError: (error, id) => {
    console.error('🚨 [usePlants] onError chamado para ID:', id, 'Erro:', error);
  },
});

  const updateWateringMutation = useMutation({
    mutationFn: ({ id, date }: { id: number; date: string }) =>
      plantasApi.updateWateringDate(id, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plantas'] });
    },
  });

  return {
    plantas,
    isLoading,
    error,
    refetch,
    createPlant: createPlantMutation.mutateAsync,
    updatePlant: updatePlantMutation.mutateAsync,
    deletePlant: deletePlantMutation.mutateAsync,
    updateWatering: updateWateringMutation.mutateAsync,
    isCreating: createPlantMutation.isPending,
    isUpdating: updatePlantMutation.isPending,
    isDeleting: deletePlantMutation.isPending,
  };
};

export const usePlant = (id: number) => {
  return useQuery({
    queryKey: ['planta', id],
    queryFn: () => plantasApi.getById(id),
    enabled: !!id,
  });
};