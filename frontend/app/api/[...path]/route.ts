import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080";

async function handleRequest(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    const path = params.path.join("/");
    const url = `${API_BASE_URL}/api/${path}${request.nextUrl.search}`;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    // Forward auth token
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
        headers["Authorization"] = authHeader;
    }

    try {
        const response = await fetch(url, {
            method: request.method,
            headers,
            body: request.method !== "GET" && request.method !== "HEAD"
                ? await request.text()
                : undefined,
        });

        const data = await response.text();

        return new NextResponse(data, {
            status: response.status,
            headers: {
                "Content-Type": response.headers.get("content-type") || "application/json",
            },
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;