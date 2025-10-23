import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useApiQuery = (key, fn) => useQuery({ queryKey: key, queryFn: fn });

export const useApiMutation = (mutationFn, options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (...args) => {
      queryClient.invalidateQueries();  // Invalidate all (or specify key)
      if (options.onSuccess) options.onSuccess(...args);
    },
    ...options,
  });
};