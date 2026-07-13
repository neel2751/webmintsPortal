import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import {
  canAccessPath,
  homeForRole,
  LEGACY_REDIRECTS,
} from "./lib/permissions";

// Use the edge-safe config (no database imports) — the middleware only
// needs to read the session JWT, not run the credentials login.
const { auth } = NextAuth(authConfig);

export const middleware = auth((req) => {
  const session = req.auth;
  const { pathname } = req.nextUrl;

  if (!session?.user) {
    return Response.redirect(new URL("/auth/login", req.url));
  }

  // Old bookmarked URLs from before the /admin, /team, /portal split.
  const legacy = LEGACY_REDIRECTS.find(
    ([oldPrefix]) =>
      pathname === oldPrefix || pathname.startsWith(oldPrefix + "/")
  );
  if (legacy) {
    const [oldPrefix, newPrefix] = legacy;
    return Response.redirect(
      new URL(newPrefix + pathname.slice(oldPrefix.length), req.url)
    );
  }

  if (!canAccessPath(session.user.role, pathname)) {
    return Response.redirect(new URL(homeForRole(session.user.role), req.url));
  }
});

export const config = {
  // Protect all pages except the login page, static assets and /api/*.
  // API routes handle their own auth (API key for external callers);
  // server actions are guarded by requireRole() inside each action.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|opengraph-image|auth/login).*)",
  ],
};
