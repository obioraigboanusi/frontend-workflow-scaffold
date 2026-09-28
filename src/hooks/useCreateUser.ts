import { useMutation } from '@tanstack/react-query';
import { createUser } from '../api/users';
import { queryClient } from '../lib/queryClient';

export const useCreateUser = () => {
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Returning the promise keeps the mutation pending until the list has refetched.
      return queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
