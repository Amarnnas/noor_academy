import { withAuth } from "next-auth/middleware";
import type { NextRequest } from "next/server";

const ADMIN_ONLY_PATHS = [
  "/dashboard/admins",
  "/dashboard/instructors",
  "/dashboard/orders",
  "/dashboard/messages",
  "/dashboard/certificates",
];

export default withAuth(
  function middleware(req: NextRequest) {
    const token = (req as unknown as { nextauth: { token: Record<string, unknown> } }).nextauth.token;
    const pathname = req.nextUrl.pathname;
    const role = (token?.role as string) || "student";

    if (pathname.startsWith("/dashboard") && role === "student") {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      loginUrl.searchParams.set("role", "admin");
      return Response.redirect(loginUrl);
    }

    if (pathname.startsWith("/dashboard") && role === "teacher") {
      for (const adminPath of ADMIN_ONLY_PATHS) {
        if (pathname === adminPath || pathname.startsWith(adminPath + "/")) {
          return Response.redirect(new URL("/dashboard", req.url));
        }
      }
    }

    if (pathname.startsWith("/portal") && (role === "admin" || role === "teacher")) {
      return Response.redirect(new URL("/dashboard", req.url));
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
