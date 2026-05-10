import { jwtDecode } from "jwt-decode";

export function isTokenValid(token: string): boolean {
    try {
        const decoded: any = jwtDecode(token);
        return decoded.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

export function getTokenPayload(token: string): any {
    try {
        return jwtDecode(token);
    } catch {
        return null;
    }
}

export function setAuthToken(token: string) {
    localStorage.setItem("token", token);
}

export function removeAuthToken() {
    localStorage.removeItem("token");
}

export function getAuthToken(): string | null {
    return localStorage.getItem("token");
}