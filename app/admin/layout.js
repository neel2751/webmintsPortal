"use client";
import Navbar from "@/components/navbar/navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

const queryClient = new QueryClient();

export default function DashboardLayout({ children }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <Navbar children={children} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
