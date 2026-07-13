import { jwtDecode, type JwtPayload } from "jwt-decode";

/**
 * Cookie names MUST match the backend `AuthCookieService` constants.
 * Backend sets `zenvyra_access` and `zenvyra_refresh` as HttpOnly cookies.
 * The middleware (server-side) reads `zenvyra_access` and validates exp.
 *
 * Client code CANNOT read HttpOnly cookies from JavaScript, so legacy
 * `getAuthToken` / `setAuthToken` only work for non-HttpOnly token flows.
 * For normal app login, auth state lives in HttpOnly cookies set by the
 * backend — do NOT call `setAuthToken` after a successful login response.
 */
export const AUTH_ACCESS_COOKIE = "zenvyra_access";
export const AUTH_REFRESH_COOKIE = "zenvyra_refresh";
/**
 * Non-HttpOnly marker cookie set by the backend on login. Present in
 * `document.cookie` so client-side code can determine auth state without
 * seeing the JWT itself.
 */
export const AUTH_SESSION_MARKER = "zenvyra_session";

// Legacy constant kept for backward-compat; equals the access cookie name
// so legacy call sites that read `AUTH_COOKIE` look at the right name.
export const AUTH_COOKIE = AUTH_ACCESS_COOKIE;

const AUTH_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function isBrowser(): boolean {
    return typeof document !== "undefined";
}

function buildCookieValue(name: string, value: string, maxAgeSeconds: number): string {
    const parts = [
        `${name}=${value}`,
        "path=/",
        `max-age=${maxAgeSeconds}`,
        "SameSite=Lax",
    ];
    if (process.env.NODE_ENV === "production") {
        parts.push("Secure");
    }
    return parts.join("; ");
}

/**
 * @deprecated HttpOnly cookies set by the backend are the source of truth.
 * This function is kept only for non-HttpOnly token flows (e.g. service
 * workers). New login flows must NOT call this — the backend already sets
 * the HttpOnly `zenvyra_access` cookie on successful login.
 */
export function setAuthToken(token: string): void {
    if (!isBrowser() || !token) {
        return;
    }
    document.cookie = buildCookieValue(AUTH_ACCESS_COOKIE, token, AUTH_MAX_AGE_SECONDS);
}

/**
 * Reads the access cookie value from the browser. Note: HttpOnly cookies
 * cannot be read from JavaScript — for HttpOnly flows this returns
 * `undefined`. Use `hasAuthCookie()` for client-side auth presence checks.
 */
export function getAuthToken(): string | undefined {
    if (!isBrowser()) {
        return undefined;
    }
    const cookies = document.cookie ? document.cookie.split("; ") : [];
    for (const entry of cookies) {
        const eqIndex = entry.indexOf("=");
        if (eqIndex === -1) {
            continue;
        }
        const name = entry.slice(0, eqIndex);
        if (name === AUTH_ACCESS_COOKIE) {
            const rawValue = entry.slice(eqIndex + 1);
            try {
                return decodeURIComponent(rawValue);
            } catch {
                return rawValue;
            }
        }
    }
    return undefined;
}

/**
 * Returns true if the non-HttpOnly session-marker cookie is present. The
 * backend sets this cookie alongside the HttpOnly access cookie on every
 * successful login and clears it on logout. Because it is not HttpOnly,
 * it is visible to JavaScript and can be used for client-side UI hints.
 */
export function hasAuthCookie(): boolean {
    if (!isBrowser()) {
        return false;
    }
    return document.cookie.split("; ").some((c) => c.startsWith(`${AUTH_SESSION_MARKER}=`));
}

/**
 * @deprecated Server logout clears the HttpOnly cookies; client-side only
 * clears the marker cookie for UI consistency.
 */
export function removeAuthToken(): void {
    if (!isBrowser()) {
        return;
    }
    document.cookie = buildCookieValue(AUTH_ACCESS_COOKIE, "", 0);
    document.cookie = buildCookieValue(AUTH_SESSION_MARKER, "", 0);
}

export function isTokenValid(token?: string): boolean {
    if (!token) {
        return false;
    }
    try {
        const payload = jwtDecode<JwtPayload>(token);
        if (!payload || typeof payload.exp !== "number") {
            return false;
        }
        // exp is in seconds since epoch
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

export function getTokenPayload<T = JwtPayload>(token?: string): T | null {
    if (!token) {
        return null;
    }
    try {
        return jwtDecode<T>(token);
    } catch {
        return null;
    }
}

/**
 * Client-side auth check. Because the real JWT lives in an HttpOnly cookie
 * (set by backend on login), we check the non-HttpOnly session-marker
 * cookie for presence. Real auth enforcement happens server-side.
 */
export function isAuthenticated(): boolean {
    return hasAuthCookie();
}

export { jwtDecode };
