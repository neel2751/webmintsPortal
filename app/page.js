import { auth } from "@/auth";
import { homeForRole } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/login");
  }
  redirect(homeForRole(session.user.role));
}
