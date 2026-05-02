// Client-side fetch middleware
// Use in: Client Components, hooks, event handlers

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  tags?: string[];        // not used client-side but keeps the API shape consistent
};

type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  status: number;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

async function clientFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {} } = options;

  const config: RequestInit = {
    method,
    credentials: 'include',       // sends cookies (for session auth)
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config);

    // Handle non-JSON error responses (e.g. 502 nginx HTML pages)
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
    // Network failure, CORS, DNS, etc.
    const message = err instanceof Error ? err.message : 'Network error';
    return { data: null, error: message, status: 0 };
  }
}

export const apiClient = {
  get: <T>(endpoint: string, headers?: Record<string, string>) =>
    clientFetch<T>(endpoint, { method: 'GET', headers }),

  post: <T>(endpoint: string, body: unknown, headers?: Record<string, string>) =>
    clientFetch<T>(endpoint, { method: 'POST', body, headers }),

  put: <T>(endpoint: string, body: unknown, headers?: Record<string, string>) =>
    clientFetch<T>(endpoint, { method: 'PUT', body, headers }),

  patch: <T>(endpoint: string, body: unknown, headers?: Record<string, string>) =>
    clientFetch<T>(endpoint, { method: 'PATCH', body, headers }),

  delete: <T>(endpoint: string, headers?: Record<string, string>) =>
    clientFetch<T>(endpoint, { method: 'DELETE', headers }),
};