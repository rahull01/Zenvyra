import { NextRequest, NextResponse } from "next/server";
import { GET as getBannerBundle } from "../v1/banner/[siteId]/bundle.js/route";
import { backendApiBaseUrl } from "@/lib/env";

const API_BASE_URL = backendApiBaseUrl();

const ALLOWED_METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]);
const ALLOWED_METHODS_HEADER = "GET, POST, PUT, PATCH, DELETE";
const BLOCKED_PATH_SEGMENTS = new Set(["admin", "internal", "actuator", "health"]);
const MAX_BODY_BYTES = 1024 * 1024; // 1 MB
const UPSTREAM_TIMEOUT_MS = 15_000;

function isBlockedPath(pathSegments: string[]): boolean {
    return pathSegments.length > 0 && BLOCKED_PATH_SEGMENTS.has(pathSegments[0]);
}

async function handleRequest(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    // 1. Allowed methods only
    if (!ALLOWED_METHODS.has(request.method)) {
        return NextResponse.json(
            { error: "Method not allowed" },
            {
                status: 405,
                headers: { Allow: ALLOWED_METHODS_HEADER },
            }
        );
    }

    const pathSegments = params.path;
    const search = request.nextUrl.search || "";

    // 2. Block sensitive paths (404 — pretend they don't exist)
    if (isBlockedPath(pathSegments)) {
        return NextResponse.json(
            { error: "Not found" },
            { status: 404 }
        );
    }

    if (
        request.method === "GET" &&
        pathSegments.length === 4 &&
        pathSegments[0] === "v1" &&
        pathSegments[1] === "banner" &&
        pathSegments[3] === "bundle.js"
    ) {
        return getBannerBundle(request, { params: { siteId: pathSegments[2] } });
    }

    // 3. Request body size guard (Content-Length header)
    const contentLengthHeader = request.headers.get("content-length");
    if (contentLengthHeader) {
        const contentLength = parseInt(contentLengthHeader, 10);
        if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
            return NextResponse.json(
                { error: "Payload too large" },
                { status: 413 }
            );
        }
    }

    let url: string;
    if (pathSegments.length > 0 && pathSegments[0] === "v1") {
        const trimmedPath = pathSegments.slice(1).join("/");
        url = `${API_BASE_URL}/${trimmedPath}${search}`;
    } else {
        url = `${API_BASE_URL}/${pathSegments.join("/")}${search}`;
    }

    // We construct a fresh headers object below so the incoming Cookie header
    // is never forwarded to the backend.
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    // Forward auth token
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
        headers["Authorization"] = authHeader;
    }

    // 4. Timeout via AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

    try {
        const response = await fetch(url, {
            method: request.method,
            headers,
            body: request.method !== "GET" && request.method !== "HEAD"
                ? await request.text()
                : undefined,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const contentType = response.headers.get("content-type") || "application/json";
        const isBinary = contentType.includes("zip") ||
                         contentType.includes("image") ||
                         contentType.includes("pdf") ||
                         contentType.includes("octet-stream");

        const data = isBinary ? await response.arrayBuffer() : await response.text();

        return new NextResponse(data, {
            status: response.status,
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": response.headers.get("content-disposition") || "",
            },
        });
    } catch (error) {
        clearTimeout(timeoutId);
        // 5. Generic error responses — do not leak raw messages or backend URL
        const isAbort = error instanceof Error && error.name === "AbortError";
        return NextResponse.json(
            { error: isAbort ? "Gateway timeout" : "Bad gateway" },
            { status: isAbort ? 504 : 502 }
        );
    }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
