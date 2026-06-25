export function isTokenValid(token: string): boolean {
    return Boolean(token);
}

export function getTokenPayload(token: string): any {
    return null;
}

export function setAuthToken(token: string) {
    void token;
}

export function removeAuthToken() {
}

export function getAuthToken(): string | null {
    return null;
}
