import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  SESSION_COOKIE_NAME,
  isAuthConfigured,
  verifySessionToken,
} from "@/lib/auth";

// Runs on every request matched below, before any page or API route. This
// is the actual enforcement point for admin protection — the login check
// inside the dashboard UI alone would not be enough, since someone could
// otherwise call /api/products, /api/blog, or /api/upload directly and
// bypass the UI entirely.
//
// Uses the Node.js middleware runtime (stable as of Next.js 15.5) so that
// src/lib/auth.ts can use Node's built-in `crypto` module for signing and
// verifying the session cookie, without adding a new dependency.
export const config = {
  runtime: "nodejs",
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/products",
    "/api/products/:path*",
    "/api/blog",
    "/api/blog/:path*",
    "/api/upload",
  ],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApiRoute = pathname.startsWith("/api/");

  // If the three required env vars haven't been set yet, block access
  // entirely rather than leaving the admin area open. The login page
  // itself explains what to set.
  if (!isAuthConfigured()) {
    if (isApiRoute) {
      return NextResponse.json(
        {
          error:
            "Admin authentication is not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD, and SESSION_SECRET in .env.local.",
        },
        { status: 503 }
      );
    }
    const setupUrl = new URL("/login", request.url);
    setupUrl.searchParams.set("setup", "1");
    return NextResponse.redirect(setupUrl);
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isValid = verifySessionToken(token);

  if (isValid) {
    return NextResponse.next();
  }

  // Unauthenticated API calls get a JSON 401 instead of an HTML redirect,
  // since the caller is a fetch() request, not a browser navigation.
  if (isApiRoute) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}
