import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { AuthTokens } from "@/types/api";

const ACCESS_COOKIE = "paytraka_access_token";
const REFRESH_COOKIE = "paytraka_refresh_token";
const USER_COOKIE = "paytraka_user_profile";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function GET() {
  const cookieStore = await cookies();
  const user = cookieStore.get(USER_COOKIE)?.value;

  return NextResponse.json({
    authenticated: Boolean(cookieStore.get(ACCESS_COOKIE)?.value),
    user: safeParseUser(user),
  });
}

export async function POST(request: NextRequest) {
  let payload: AuthTokens & { remember?: boolean };
  try {
    payload = (await request.json()) as AuthTokens;
  } catch {
    return NextResponse.json({ success: false, message: "Malformed session payload" }, { status: 400 });
  }

  if (!payload?.accessToken || !payload?.refreshToken || !payload?.user) {
    return NextResponse.json({ success: false, message: "Session tokens and user are required" }, { status: 400 });
  }

  const response = NextResponse.json({ success: true, user: payload.user });

  const persistent = payload.remember ? { maxAge: 60 * 60 * 24 * 30 } : {};
  response.cookies.set(ACCESS_COOKIE, payload.accessToken, { ...cookieOptions, ...persistent });
  response.cookies.set(REFRESH_COOKIE, payload.refreshToken, { ...cookieOptions, ...persistent });
  response.cookies.set(USER_COOKIE, JSON.stringify(payload.user), { ...cookieOptions, ...persistent });

  return response;
}

function safeParseUser(value?: string) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(ACCESS_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  response.cookies.set(USER_COOKIE, "", { ...cookieOptions, maxAge: 0 });

  return response;
}
