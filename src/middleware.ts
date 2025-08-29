// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PREFIXES = ["/_next", "/static", "/favicon.ico"];
const PUBLIC_PATHS = ["/", "/docs"]; // only root + docs are always public

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const session = request.cookies.get("session");

    // Allow Next.js internals (static assets, etc.)
    if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
        return NextResponse.next();
    }

    // Always allow root and docs (public pages)
    if (
        PUBLIC_PATHS.includes(pathname) ||
        PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))
    ) {
        return NextResponse.next();
    }

    // 🔒 Auth page logic
    if (pathname.startsWith("/authenticate")) {
        if (session) {
            // ✅ Already logged in → redirect away
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.next(); // not logged in → allow access to authenticate
    }

    // 🔒 Protected routes
    if (!session) {
        return NextResponse.redirect(new URL("/authenticate", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/:path*"], // run on all routes
};
