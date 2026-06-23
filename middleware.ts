import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = new Set([
  "/",
  "/login",
  "/signup",
  "/verify-email",
  "/product",
  "/resources",
  "/solutions",
  "/company",
]);

function isPublicPath(pathname: string) {
  return PUBLIC_ROUTES.has(pathname)
    || pathname.startsWith("/api/auth/session")
    || pathname.startsWith("/api/proxy")
    || pathname.startsWith("/_next")
    || pathname.startsWith("/paytraka_logo")
    || pathname === "/favicon.ico";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAccessToken = Boolean(request.cookies.get("paytraka_access_token")?.value);

  if (isPublicPath(pathname)) return NextResponse.next();

  if (!hasAccessToken) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"],
};
