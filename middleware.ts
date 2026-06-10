import { withAuth } from "next-auth/middleware";
import type { NextRequest } from "next/server";
import type { UserRole } from "@/types/roles";

export default withAuth(
  function middleware(req: NextRequest) {
    const token = (req as unknown as { nextauth: { token: Record<string, unknown> } }).nextauth.token;
    const pathname = req.nextUrl.pathname;
    const role = (token?.role as UserRole) || "student";

    if (pathname.startsWith("/dashboard") && role === "student") {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      loginUrl.searchParams.set("role", "admin");
      return Response.redirect(loginUrl);
    }

    if (pathname.startsWith("/portal") && (role === "admin" || role === "teacher")) {
      const dashboardUrl = new URL("/dashboard", req.url);
      return Response.redirect(dashboardUrl);
    }
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const pathname = req.nextUrl.pathname;
        if (pathname.startsWith("/dashboard")) {
          return token?.role === "admin" || token?.role === "teacher";
        }
        if (pathname.startsWith("/portal")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/portal/:path*"],
};
