import { normalizeRole, ROLES } from "@/lib/permissions";

// Edge-safe NextAuth config, shared with the middleware.
// Keep database imports OUT of this file — the Credentials provider
// (which queries MongoDB) is added in auth.js, so mongoose never ends
// up in the middleware bundle.
export const authConfig = {
  providers: [],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id;
        token.email = user.email;
        token.name = user.name || "";
        token.role = normalizeRole(user.role) || ROLES.CLIENT;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.role = normalizeRole(token.role) || ROLES.CLIENT;
      return session;
    },
  },

  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/auth/login",
  },
};
