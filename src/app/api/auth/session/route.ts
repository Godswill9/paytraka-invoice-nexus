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
    user: user ? JSON.parse(user) : null,
  });
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as AuthTokens;
  const response = NextResponse.json({ success: true, user: payload.user });

  response.cookies.set(ACCESS_COOKIE, payload.accessToken, { ...cookieOptions, maxAge: 60 * 60 });
  response.cookies.set(REFRESH_COOKIE, payload.refreshToken, { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 });
  response.cookies.set(USER_COOKIE, JSON.stringify(payload.user), { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(ACCESS_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  response.cookies.set(USER_COOKIE, "", { ...cookieOptions, maxAge: 0 });

  return response;
}
