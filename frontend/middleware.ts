import { NextResponse, type NextRequest } from "next/server";
import { isTokenValid } from "@/lib/auth";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("zenvyra-token")?.value;

    if (!token || !isTokenValid(token)) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
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
