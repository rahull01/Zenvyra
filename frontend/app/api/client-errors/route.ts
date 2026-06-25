import { NextRequest, NextResponse } from "next/server";

const MAX_FIELD_LENGTH = 180;

function clean(value: unknown, maxLength = MAX_FIELD_LENGTH) {
  if (typeof value !== "string") return "";
  const stripped = value.replace(/[\u0000-\u001F\u007F]/g, "").trim();
  return stripped.length <= maxLength ? stripped : stripped.slice(0, maxLength);
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: "ignored" }, { status: 202 });
  }

  const payload = {
    type: "client_error",
    route: clean(body.route),
    digest: clean(body.digest, 96),
    message: clean(body.message, 120),
    userAgent: clean(request.headers.get("user-agent"), 180),
    requestId: clean(request.headers.get("x-request-id"), 80),
    at: new Date().toISOString(),
  };

  console.error("[client_error]", JSON.stringify(payload));
  return NextResponse.json({ status: "accepted" }, { status: 202 });
}
