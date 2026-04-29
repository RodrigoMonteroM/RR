import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemService } from '@/services/item.service';

const itemsKey = (boxId: string) => ['boxes', boxId, 'items'] as const;

export function useItems(boxId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: itemsKey(boxId),
    queryFn: () => itemService.getItems(boxId),
    enabled: !!boxId,
  });

  const createMutation = useMutation({
    mutationFn: (content: string) => itemService.createItem(boxId, content),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemsKey(boxId) }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      itemService.updateItem(id, content),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemsKey(boxId) }),
  });

  const deleteMutation = useMutation({
    mutationFn: itemService.deleteItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemsKey(boxId) }),
  });

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createItem: createMutation.mutateAsync,
    updateItem: updateMutation.mutateAsync,
    deleteItem: deleteMutation.mutateAsync,
  };
}
