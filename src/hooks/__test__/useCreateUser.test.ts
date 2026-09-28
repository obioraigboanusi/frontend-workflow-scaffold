import { renderHook, waitFor } from '@testing-library/react';
import { useCreateUser } from '../useCreateUser';
import { createQueryWrapper } from '../../test/createQueryWrapper';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/node';
import { apiUrl } from '../../mocks/handlers';

describe('Create user hook', () => {
  it('manages successful creation network cycles', async () => {
    const { result } = renderHook(() => useCreateUser(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);

    const payload = {
      name: 'Saint Johns',
      email: 'sj@mail.com',
    };

    result.current.mutate(payload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchObject(payload);
    expect(result.current.error).toBeNull();
  });

  it('rejects gracefully', async () => {
    const errorRes = { message: 'Email address taken' };

    server.use(
      http.post(apiUrl('/api/users'), () => {
        return HttpResponse.json(errorRes, { status: 400 });
      }),
    );

    const { result } = renderHook(() => useCreateUser(), {
      wrapper: createQueryWrapper(),
    });

    result.current.mutate({
      name: 'Existing',
      email: 'existing@mail.com',
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();

    expect(result.current.error).toBe(errorRes.message);
  });
});
