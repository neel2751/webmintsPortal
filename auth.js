import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { connect } from "@/db/db";
import UserModel from "@/models/userModel";
import { comparePassword } from "@/helper/bcryptPassword";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const email = credentials?.email?.toLowerCase().trim();
          const password = credentials?.password;

          if (!email || !password) {
            return null;
          }

          await connect();
          const user = await UserModel.findOne({ email });

          // Return the same generic failure (null) for an unknown email
          // and a wrong password, so login attempts can't be used to
          // discover which emails have accounts.
          if (!user) {
            return null;
          }
          // Deactivated accounts cannot log in.
          if (user.isActive === false) {
            return null;
          }
          const isValid = await comparePassword(password, user.password);
          if (!isValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Authorize error:", error.message);
          return null;
        }
      },
    }),
  ],
});
