import { describe, it, expect, beforeEach } from "vitest";
import {
    AUTH_ACCESS_COOKIE,
    AUTH_REFRESH_COOKIE,
    AUTH_SESSION_MARKER,
    hasAuthCookie,
    isAuthenticated,
    isTokenValid,
    getTokenPayload,
    setAuthToken,
    removeAuthToken,
} from "@/lib/auth";

function setCookie(name: string, value: string): void {
    document.cookie = `${name}=${value}; path=/`;
}

function clearCookies(): void {
    document.cookie = `${AUTH_ACCESS_COOKIE}=; path=/; max-age=0`;
    document.cookie = `${AUTH_REFRESH_COOKIE}=; path=/; max-age=0`;
    document.cookie = `${AUTH_SESSION_MARKER}=; path=/; max-age=0`;
}

describe("lib/auth cookie naming", () => {
    it("AUTH_ACCESS_COOKIE matches the backend AccessCookie constant", () => {
        // The backend's AuthCookieService.ACCESS_COOKIE constant must match.
        // If this changes, both ends need to be updated together.
        expect(AUTH_ACCESS_COOKIE).toBe("zenvyra_access");
        expect(AUTH_REFRESH_COOKIE).toBe("zenvyra_refresh");
    });

    it("AUTH_SESSION_MARKER is the non-HttpOnly presence cookie", () => {
        expect(AUTH_SESSION_MARKER).toBe("zenvyra_session");
    });
});

describe("lib/auth hasAuthCookie", () => {
    beforeEach(() => {
        clearCookies();
    });

    it("returns false when the session marker cookie is absent", () => {
        expect(hasAuthCookie()).toBe(false);
    });

    it("returns true when the session marker cookie is present", () => {
        setCookie(AUTH_SESSION_MARKER, "1");
        expect(hasAuthCookie()).toBe(true);
    });

    it("returns false for an unrelated cookie", () => {
        setCookie("other_cookie", "value");
        expect(hasAuthCookie()).toBe(false);
    });
});

describe("lib/auth isAuthenticated", () => {
    beforeEach(() => {
        clearCookies();
    });

    it("delegates to hasAuthCookie (does not look for the JWT)", () => {
        // The JWT is HttpOnly and cannot be read from JavaScript. The
        // client-side check must rely on the presence of the marker.
        setCookie(AUTH_SESSION_MARKER, "1");
        expect(isAuthenticated()).toBe(true);
    });

    it("returns false when no marker cookie exists", () => {
        expect(isAuthenticated()).toBe(false);
    });
});

describe("lib/auth isTokenValid", () => {
    it("returns false for an undefined token", () => {
        expect(isTokenValid(undefined)).toBe(false);
    });

    it("returns false for an empty string", () => {
        expect(isTokenValid("")).toBe(false);
    });

    it("returns false for a malformed token", () => {
        expect(isTokenValid("not-a-jwt")).toBe(false);
    });

    it("returns true for a token whose exp claim is in the future", () => {
        // Header: { "alg": "none", "typ": "JWT" }
        const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
        const exp = Math.floor(Date.now() / 1000) + 3600;
        const payload = Buffer.from(JSON.stringify({ exp, sub: "user@example.com" })).toString("base64url");
        const token = `${header}.${payload}.signature`;
        expect(isTokenValid(token)).toBe(true);
    });

    it("returns false for an expired token", () => {
        const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
        const exp = Math.floor(Date.now() / 1000) - 3600;
        const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
        const token = `${header}.${payload}.signature`;
        expect(isTokenValid(token)).toBe(false);
    });
});

describe("lib/auth getTokenPayload", () => {
    it("returns null for an invalid token", () => {
        expect(getTokenPayload("garbage")).toBeNull();
    });

    it("returns the parsed payload for a valid token", () => {
        const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
        const payload = Buffer.from(JSON.stringify({ exp: 9999999999, sub: "user@example.com", custom: "value" }))
            .toString("base64url");
        const token = `${header}.${payload}.signature`;
        const decoded = getTokenPayload<{ sub: string; custom: string }>(token);
        expect(decoded?.sub).toBe("user@example.com");
        expect(decoded?.custom).toBe("value");
    });
});

describe("lib/auth setAuthToken (legacy / non-HttpOnly only)", () => {
    beforeEach(() => {
        clearCookies();
    });

    it("writes a non-HttpOnly cookie for the access token name", () => {
        setAuthToken("test-token");
        expect(document.cookie).toContain(`${AUTH_ACCESS_COOKIE}=test-token`);
    });

    it("removeAuthToken clears the access cookie", () => {
        setAuthToken("test-token");
        removeAuthToken();
        expect(document.cookie.includes(`${AUTH_ACCESS_COOKIE}=test-token`)).toBe(false);
    });
});
