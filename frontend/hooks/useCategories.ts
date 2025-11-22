// src/hooks/useCategories.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriasApi } from '../services/api';

export const useCategories = () => {
  const queryClient = useQueryClient();

  const { data: categorias = [], isLoading, error } = useQuery({
    queryKey: ['categorias'],
    queryFn: categoriasApi.getAll,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });

  const createCategoryMutation = useMutation({
    mutationFn: categoriasApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, nome }: { id: number; nome: string }) =>
      categoriasApi.update(id, nome),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: categoriasApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });

  return {
    categorias,
    isLoading,
    error,
    createCategory: createCategoryMutation.mutateAsync,
    updateCategory: updateCategoryMutation.mutateAsync,
    deleteCategory: deleteCategoryMutation.mutateAsync,
  };
};