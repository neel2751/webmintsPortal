import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function page() {
  const sessions = await auth();
  if (sessions) {
    redirect("/admin/dashboard");
  } else {
    redirect("/auth/login");
  }
}
