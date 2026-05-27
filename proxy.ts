import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/track", "/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];
const API_PUBLIC = ["/api/auth", "/api/track", "/api/health", "/api/webhooks"];

const ROLE_ROUTES: Record<string, string[]> = {
  customer: ["/dashboard", "/shipments"],
  driver: ["/driver"],
  admin: ["/admin"],
};

export default auth(async function middleware(req: NextRequest & { auth: { user?: { role?: string; isVerified?: boolean } } | null }) {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Allow public API routes
  if (API_PUBLIC.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow public pages
  if (PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
    if (session?.user && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL(getDashboardUrl(session.user.role), req.url));
    }
    return NextResponse.next();
  }

  // Require auth for everything else
  if (!session?.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { role, isVerified } = session.user;

  // Block unverified customers from protected pages — send them back to login with a hint
  if (role === "customer" && !isVerified) {
    return NextResponse.redirect(new URL("/login?error=unverified", req.url));
  }

  // Role-based route protection
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL(getDashboardUrl(role), req.url));
  }

  if (pathname.startsWith("/driver") && role !== "driver" && role !== "admin") {
    return NextResponse.redirect(new URL(getDashboardUrl(role), req.url));
  }

  if (
    (pathname.startsWith("/dashboard") || pathname.startsWith("/shipments")) &&
    role !== "customer" &&
    role !== "admin"
  ) {
    return NextResponse.redirect(new URL(getDashboardUrl(role), req.url));
  }

  return NextResponse.next();
});

function getDashboardUrl(role?: string): string {
  switch (role) {
    case "admin": return "/admin/dashboard";
    case "driver": return "/driver/dashboard";
    default: return "/dashboard";
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|icons).*)"],
};
