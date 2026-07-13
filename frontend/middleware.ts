import { NextResponse, type NextRequest } from "next/server";
import { jwtDecode, type JwtPayload } from "jwt-decode";

// MUST match `AuthCookieService.ACCESS_COOKIE` in the backend.
const ACCESS_COOKIE_NAME = "zenvyra_access";

function isAccessTokenValid(token: string | undefined): boolean {
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

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get(ACCESS_COOKIE_NAME)?.value;

    if (!isAccessTokenValid(accessToken)) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/billing/:path*",
        "/policies/:path*",
        "/websites/:path*",
        "/consent/:path*",
        "/ai-act/:path*",
        "/scanner/:path*",
        "/analytics/:path*",
        "/monitor/:path*",
        "/workflows/:path*",
        "/compliance/:path*",
        "/dsar/:path*",
        "/team/:path*",
        "/settings/:path*",
        "/admin/:path*",
        "/agency/:path*",
        "/account/:path*",
    ],
};
