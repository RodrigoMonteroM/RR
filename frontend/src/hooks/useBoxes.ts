import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { boxService } from '@/services/box.service';

const BOXES_KEY = ['boxes'] as const;

export function useBoxes() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: BOXES_KEY,
    queryFn: boxService.getBoxes,
  });

  const createMutation = useMutation({
    mutationFn: boxService.createBox,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOXES_KEY }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...payload }: { id: string; name?: string; description?: string }) =>
      boxService.updateBox(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOXES_KEY }),
  });

  const deleteMutation = useMutation({
    mutationFn: boxService.deleteBox,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOXES_KEY }),
  });

  return {
    boxes: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createBox: createMutation.mutateAsync,
    updateBox: updateMutation.mutateAsync,
    deleteBox: deleteMutation.mutateAsync,
  };
}

export function useBox(id: string) {
  return useQuery({
    queryKey: ['boxes', id],
    queryFn: () => boxService.getBox(id),
    enabled: !!id,
  });
}
