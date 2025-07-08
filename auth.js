import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = credentials;

          const sanitizeEmail = email?.toLowerCase();

          if (!sanitizeEmail || !password) {
            throw new Error("Email and password are required.");
          }

          const res = await fetch("http://localhost:3001/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: sanitizeEmail,
              password,
            }),
          });
          const data = await res.json();

          if (!data?.success) {
            throw new Error(data?.message || "Invalid login attempt.");
          }
          return data.user;
        } catch (error) {
          console.error("Authorize error:", error.message);
        }
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id;
        token.email = user.email;
        token.name = user.name || "";
        token.role = user.role || "user"; // Default role if not provided
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.role = token.role || "user"; // Default role if not provided
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/auth/login",
  },
});
