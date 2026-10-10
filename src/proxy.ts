import { NextRequest, NextResponse } from "next/server";

// /products (plural) is the actual route — product details
const PROTECTED_ROUTES = ["/products", "/profile"];
const AUTH_ROUTES = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  
  const isAuthRoute = AUTH_ROUTES.some((route) => 
    pathname.startsWith(route)
  );

  // Check BetterAuth session cookie (set automatically after login)
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value ||
    request.cookies.getAll().find((c) => c.name.includes("session_token"))?.value;

  const hasSessionCookie = Boolean(sessionToken);

  if (isProtected && !hasSessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && hasSessionCookie) {
    const fromParam = request.nextUrl.searchParams.get("from");
    const destination =
      fromParam && !fromParam.startsWith("/login") && !fromParam.startsWith("/register")
        ? fromParam
        : "/";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:path*", "/profile", "/login", "/register"],
};