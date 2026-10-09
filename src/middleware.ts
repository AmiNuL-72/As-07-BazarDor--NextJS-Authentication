import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/products"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    // Check auth cookie (set on login)
    const isLoggedIn = request.cookies.get("bazar_auth")?.value === "true";
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:path*"],
};