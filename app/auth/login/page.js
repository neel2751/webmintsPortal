import AuthForm from "@/components/auth/authForm";
import { SessionProvider } from "next-auth/react";
import React from "react";

export default function page() {
  return (
    <SessionProvider>
      <AuthForm />
    </SessionProvider>
  );
}
