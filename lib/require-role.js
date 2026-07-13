import { auth } from "@/auth";
import { normalizeRole } from "@/lib/permissions";
import { connect } from "@/db/db";
import UserModel from "@/models/userModel";

// Call at the top of any server action that must not be reachable by
// every logged-in user. Throws if the caller is missing or not allowed;
// the action's own try/catch turns that into its failure response.
export async function requireRole(allowedRoles) {
  const session = await auth();
  const role = normalizeRole(session?.user?.role);
  if (!session?.user || !allowedRoles.includes(role)) {
    throw new Error("Unauthorized: you do not have access to this action.");
  }

  // A deactivated account keeps its session cookie until it expires —
  // re-check the database so deactivation cuts off actions immediately.
  await connect();
  const dbUser = await UserModel.findById(session.user.id).select("isActive");
  if (!dbUser || dbUser.isActive === false) {
    throw new Error("Unauthorized: this account is deactivated.");
  }

  return session;
}
