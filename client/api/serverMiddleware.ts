// Server-side fetch middleware
// Use in: Server Components, Route Handlers (/app/api/), Server Actions
// NEVER import this in a Client Component — it will break

import { cookies, headers } from 'next/headers';
import { cache } from 'react';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  tags?: string[];           // Next.js cache tags for revalidation
  revalidate?: number | false; // seconds, or false = no cache
};

type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  status: number;
};

const BASE_URL = process.env.SERVER_BASE_URL ?? '';

async function serverFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers: extraHeaders = {}, tags, revalidate } = options;

  // Forward the session cookie from the incoming request to your backend
  const cookieStore = cookies();
  const headerStore = headers();
  const sessionCookie = cookieStore.toString(); // all cookies as header string
  const forwardedFor = (await headerStore).get('x-forwarded-for') ?? '';

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Cookie: sessionCookie,
      ...(forwardedFor ? { 'x-forwarded-for': forwardedFor } : {}),
      ...extraHeaders,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    // Next.js extended fetch options
    next: {
      ...(tags ? { tags } : {}),
      ...(revalidate !== undefined ? { revalidate } : {}),
    },
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config);

    const contentType = res.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    const payload = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      const message =
        isJson && payload?.message
          ? payload.message
          : `Request failed with status ${res.status}`;
      return { data: null, error: message, status: res.status };
    }

    return { data: payload as T, error: null, status: res.status };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error';
    return { data: null, error: message, status: 0 };
  }
}

// Wrap GET requests in React's `cache()` so duplicate calls in the same
// render pass are deduplicated automatically (like React Query but free)
export const cachedGet = cache(
  <T>(endpoint: string, tags?: string[]) =>
    serverFetch<T>(endpoint, { method: 'GET', tags })
);

export const apiServer = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    serverFetch<T>(endpoint, { method: 'GET', ...options }),

  post: <T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    serverFetch<T>(endpoint, { method: 'POST', body, ...options }),

  put: <T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    serverFetch<T>(endpoint, { method: 'PUT', body, ...options }),

  patch: <T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    serverFetch<T>(endpoint, { method: 'PATCH', body, ...options }),

  delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    serverFetch<T>(endpoint, { method: 'DELETE', ...options }),
};