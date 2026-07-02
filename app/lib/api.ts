/**
 * CMS Frontend — API client
 * Reads NEXT_PUBLIC_API_URL from env (default: http://localhost:5000)
 * Attaches Bearer token from localStorage "cms_auth" on every request.
 *
 * PERFORMANCE: GET requests are cached in memory for 30s so navigating
 * between tabs doesn't re-hit the backend every single time.
 */

const API_BASE_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:5000") + "/api";

// ─── Simple in-memory GET cache ───────────────────────────────────────────────
const CACHE_TTL = 30_000; // 30 seconds
const cache = new Map<string, { data: any; expiresAt: number }>();

function getCached(key: string) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { cache.delete(key); return null; }
  return entry.data;
}

function setCached(key: string, data: any) {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL });
}

/** Call this after any mutation so stale GET data is cleared */
export function invalidateCache(pathPrefix?: string) {
  if (!pathPrefix) { cache.clear(); return; }
  for (const key of cache.keys()) {
    if (key.includes(pathPrefix)) cache.delete(key);
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("cms_auth");
    return raw ? JSON.parse(raw).token : null;
  } catch {
    return null;
  }
}

// ─── _id → id mapper ──────────────────────────────────────────────────────────
function mapId<T>(data: any): T {
  if (Array.isArray(data)) return data.map(mapId) as T;
  if (data && typeof data === "object") {
    const { _id, ...rest } = data;
    return { id: _id, ...rest } as T;
  }
  return data as T;
}

// ─── Core request ─────────────────────────────────────────────────────────────
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  useCache = false
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  // Return cached GET response if fresh
  if (useCache) {
    const hit = getCached(url);
    if (hit !== null) return hit as T;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message ?? `API Error: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) return {} as T;

  const data = await response.json();
  const mapped = mapId<T>(data);

  if (useCache) setCached(url, mapped);

  return mapped;
}

// ─── Public API ───────────────────────────────────────────────────────────────
export const api = {
  /** Cached GET — won't re-fetch for 30 s after the first call */
  get: <T>(path: string) => request<T>(path, {}, true),

  /** Mutations always bypass cache and invalidate matching GET entries */
  post: <T>(path: string, body: unknown) => {
    invalidateCache(path);
    return request<T>(path, { method: "POST", body: JSON.stringify(body) });
  },
  put: <T>(path: string, body: unknown) => {
    invalidateCache(path);
    return request<T>(path, { method: "PUT", body: JSON.stringify(body) });
  },
  patch: <T>(path: string, body: unknown) => {
    invalidateCache(path);
    return request<T>(path, { method: "PATCH", body: JSON.stringify(body) });
  },
  delete: <T>(path: string) => {
    invalidateCache(path);
    return request<T>(path, { method: "DELETE" });
  },

  upload: async (file: File): Promise<{ path: string }> => {
    const token = getToken();
    const formData = new FormData();
    formData.append("image", file);

    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.message ?? `Upload Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },
};
