import { NextRequest, NextResponse } from "next/server";
import { GET as getBannerBundle } from "../v1/banner/[siteId]/bundle.js/route";

const API_BASE_URL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function handleRequest(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    const pathSegments = params.path;
    const search = request.nextUrl.search || "";

    if (
        request.method === "GET" &&
        pathSegments.length === 4 &&
        pathSegments[0] === "v1" &&
        pathSegments[1] === "banner" &&
        pathSegments[3] === "bundle.js"
    ) {
        return getBannerBundle(request, { params: { siteId: pathSegments[2] } });
    }

    let url: string;
    if (pathSegments.length > 0 && pathSegments[0] === "v1") {
        const trimmedPath = pathSegments.slice(1).join("/");
        url = `${API_BASE_URL}/api/v1/${trimmedPath}${search}`;
    } else {
        url = `${API_BASE_URL}/${pathSegments.join("/")}${search}`;
    }

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
