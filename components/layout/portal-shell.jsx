"use client";
import Navbar from "@/components/navbar/navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

const queryClient = new QueryClient();

// Shared shell for the /admin, /team and /portal areas.
export default function PortalShell({ children }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <Navbar>{children}</Navbar>
      </QueryClientProvider>
    </SessionProvider>
  );
}
