import { auth } from "./auth";

export const middleware = auth((req) => {
  const email = req.auth;
  if (!email) {
    return Response.redirect(new URL("/auth/login", req.url));
  }
});

export const config = {
  // allow only one api route to be protected
  // we have to allow the other api routes to be public
  // so that they can be accessed without authentication
  // but we can protect the other routes
  // by using the matcher
  // matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // ✅ Skips all API routes and static files
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|auth/login).*)", // ✅ Skips /auth/login
  ],
};
