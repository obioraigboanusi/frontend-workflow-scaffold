import { delay, http, HttpResponse } from 'msw';
import { API_BASE_URL } from '../api/client';
import { mockUsers } from './users';
import type { User } from '../types/user';

/** Builds a mock URL that matches wherever the API client points (same-origin or VITE_API_BASE_URL). */
export const apiUrl = (path: string) => `${API_BASE_URL}${path}`;

export const handlers = [
  http.get(apiUrl('/api/users'), () => HttpResponse.json(mockUsers, { status: 200 })),
  http.post(apiUrl('/api/users'), async ({ request }) => {
    const newUser = (await request.json()) as unknown as User;

    await delay(1);

    return HttpResponse.json(
      {
        ...newUser,
        id: Date.now(),
      },
      { status: 201 },
    );
  }),
];
