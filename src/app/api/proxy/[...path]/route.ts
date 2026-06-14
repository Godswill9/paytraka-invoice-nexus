import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api/client";

const ACCESS_COOKIE = "paytraka_access_token";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxyRequest(request: NextRequest, context: RouteContext) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
  }

  const { path } = await context.params;
  if (!path?.length) {
    return NextResponse.json({ success: false, message: "API path is required" }, { status: 400 });
  }

  const upstreamUrl = new URL(`${API_BASE_URL}/${path.join("/")}`);
  request.nextUrl.searchParams.forEach((value, key) => upstreamUrl.searchParams.set(key, value));

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${accessToken}`);

  const contentType = request.headers.get("content-type");
  let body: BodyInit | undefined;

  if (!["GET", "HEAD"].includes(request.method)) {
    if (contentType?.includes("multipart/form-data")) {
      body = await request.formData();
    } else {
      headers.set("Content-Type", contentType ?? "application/json");
      body = await request.text();
    }
  }

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to reach PayTraka API" }, { status: 502 });
  }

  const responseContentType = upstreamResponse.headers.get("content-type") ?? "application/json";
  const responseBody = await upstreamResponse.arrayBuffer();

  return new NextResponse(responseBody, {
    status: upstreamResponse.status,
    headers: {
      "Content-Type": responseContentType,
    },
  });
}

export function GET(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export function POST(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export function PATCH(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export function DELETE(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}
