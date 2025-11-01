import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/login"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Check for Supabase session cookies (they use multiple cookies)
  const cookies = request.cookies;
  const supabaseAuth =
    cookies.get("sb-access-token")?.value ||
    cookies.get("sb-refresh-token")?.value;

  // For now, allow all routes (we'll handle auth in components)
  // This is because Supabase cookies might not be available in middleware immediately
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
