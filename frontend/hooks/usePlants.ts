// src/hooks/usePlants.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { plantasApi } from '../services/api';
import { PlantaFormData } from '../types';

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

  const updatePlantMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PlantaFormData> }) =>
      plantasApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plantas'] });
    },
  });

  const deletePlantMutation = useMutation({
    mutationFn: plantasApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plantas'] });
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