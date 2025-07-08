import ClientDashboardPage from "@/app/(client)/(dashboard)/clientDashboard";
import { auth } from "@/auth";
import React from "react";

export default async function page() {
  const session = await auth();
  return (
    <>
      {session?.user?.role === "admin" ? (
        // <div>This is admin page</div>
        <ClientDashboardPage />
      ) : (
        <ClientDashboardPage />
      )}
    </>
  );
}
