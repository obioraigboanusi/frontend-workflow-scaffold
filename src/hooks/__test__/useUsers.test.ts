import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/node';
import { apiUrl } from '../../mocks/handlers';
import { useUsers } from '../useUsers';
import { mockUsers } from '../../mocks/users';
import { createQueryWrapper } from '../../test/createQueryWrapper';

describe('useUsers Custom Hook', () => {
  it('should handle a successful API response correctly', async () => {
    // Render the custom hook within the test runner
    const { result } = renderHook(() => useUsers(), {
      wrapper: createQueryWrapper(),
    });

    // Check initial synchronous loading states
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();

    // Wait for the asynchronous fetch operation to resolve
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify the states updated perfectly with the API data
    expect(result.current.data).toEqual(mockUsers);
    expect(result.current.error).toBeNull();
  });

  it('should catch and process errors correctly when the API fails', async () => {
    // mocking rejection

    const errorRes = { message: 'Something went wrong' };
    server.use(
      http.get(apiUrl('/api/users'), () => {
        return HttpResponse.json(errorRes, { status: 500 });
      }),
    );

    // Render the hook
    const { result } = renderHook(() => useUsers(), {
      wrapper: createQueryWrapper(),
    });

    // Wait for the hook to exit its loading loop
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify the catch block generated a clean error string
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBe(errorRes.message);
  });
});
