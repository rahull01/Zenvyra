import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

const unsafeMethods = new Set(["post", "put", "patch", "delete"]);
let csrfToken: string | null = null;
let csrfHeaderName = "X-CSRF-TOKEN";
let csrfPromise: Promise<void> | null = null;

async function ensureCsrfToken() {
    if (typeof window === "undefined" || csrfToken) {
        return;
    }

    if (!csrfPromise) {
        csrfPromise = api.get("/csrf", { headers: { "X-CSRF-Intent": "fetch" } })
            .then((response) => {
                csrfHeaderName = response.data?.headerName || "X-CSRF-TOKEN";
                csrfToken = response.data?.token || null;
            })
            .finally(() => {
                csrfPromise = null;
            });
    }

    await csrfPromise;
}

api.interceptors.request.use(async (config) => {
    const method = (config.method || "get").toLowerCase();
    const isCsrfFetch = typeof config.url === "string" && config.url.includes("/csrf");

    // The backend reads the JWT from the HttpOnly `zenvyra_access` cookie,
    // which is set by the backend on login. The browser attaches it
    // automatically because the api instance uses `withCredentials: true`.
    // We deliberately do NOT set an `Authorization: Bearer <token>` header
    // from client-side code, because:
    //   1. HttpOnly cookies cannot be read from JavaScript.
    //   2. Setting an Authorization header from JS would bypass HttpOnly
    //      protections and be visible to any XSS payload.

    if (unsafeMethods.has(method) && !isCsrfFetch) {
        await ensureCsrfToken();
        if (csrfToken) {
            config.headers = config.headers || {};
            config.headers[csrfHeaderName] = csrfToken;
        }
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                window.location.href = "/auth/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
