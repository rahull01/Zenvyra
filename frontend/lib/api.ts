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
let csrfHeaderName = "X-XSRF-TOKEN";
let csrfPromise: Promise<void> | null = null;

async function ensureCsrfToken() {
    if (typeof window === "undefined" || csrfToken) {
        return;
    }

    if (!csrfPromise) {
        csrfPromise = api.get("/csrf", { headers: { "X-CSRF-Intent": "fetch" } })
            .then((response) => {
                csrfHeaderName = response.data?.headerName || "X-XSRF-TOKEN";
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

    if (unsafeMethods.has(method) && !isCsrfFetch) {
        await ensureCsrfToken();
        if (csrfToken) {
            config.headers = config.headers || {};
            config.headers[csrfHeaderName] = csrfToken;
        }
    }

    return config;
});

// Response interceptor
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
