import { jwtDecode, type JwtPayload } from "jwt-decode";

export const AUTH_COOKIE = "zenvyra-token";
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

export function setAuthToken(token: string): void {
    if (!isBrowser() || !token) {
        return;
    }
    document.cookie = buildCookieValue(AUTH_COOKIE, token, AUTH_MAX_AGE_SECONDS);
}

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
        if (name === AUTH_COOKIE) {
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

export function removeAuthToken(): void {
    if (!isBrowser()) {
        return;
    }
    document.cookie = buildCookieValue(AUTH_COOKIE, "", 0);
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

export function isAuthenticated(): boolean {
    return isTokenValid(getAuthToken());
}

export { jwtDecode };
