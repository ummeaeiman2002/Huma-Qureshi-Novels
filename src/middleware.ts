import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Middleware for authentication
 *
 * Current setup:
 * - Simple public website (no login/dashboard/premium)
 * - /login, /checkout, /dashboard all redirect to homepage
 */

export default auth((req) => {
  const { nextUrl } = req;

  // Redirect all auth/premium routes to homepage (simple public website)
  const isRestrictedRoute =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/checkout") ||
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/premium");

  if (isRestrictedRoute) {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  // Default - allow access
  return NextResponse.next();
});

// Routes to protect
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - /studio (Sanity Studio)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|studio(?:/.*)?).*)",
  ],
};
