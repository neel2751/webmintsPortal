"use server";

import { connect } from "@/db/db";
import UserModel from "@/models/userModel";
import { hashPassword } from "@/helper/bcryptPassword";
import { trimWhitespace } from "@/helper/trim";
import { requireRole } from "@/lib/require-role";
import { ADMIN_ONLY, ROLES } from "@/lib/permissions";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function getAllUsers() {
  try {
    await requireRole(ADMIN_ONLY);
    await connect();
    const users = await UserModel.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    return { success: true, data: JSON.stringify(users) };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, message: error.message };
  }
}

export async function createUser(params) {
  try {
    await requireRole(ADMIN_ONLY);

    const name = trimWhitespace(params?.name || "");
    const email = trimWhitespace((params?.email || "").toLowerCase());
    const password = params?.password || "";
    const role = params?.role;

    if (!name || !email || !password) {
      return { success: false, message: "All fields are required" };
    }
    if (!EMAIL_REGEX.test(email)) {
      return { success: false, message: "Invalid email address" };
    }
    if (password.length < 8) {
      return { success: false, message: "Password must be at least 8 characters" };
    }
    if (!Object.values(ROLES).includes(role)) {
      return { success: false, message: "Invalid role" };
    }

    await connect();
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return { success: false, message: "Email already registered" };
    }

    const newUser = new UserModel({
      name,
      email,
      password: await hashPassword(password),
      role,
    });
    await newUser.save();
    return { success: true, message: `Created ${role} account for ${name}` };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, message: error.message };
  }
}

export async function updateUserRole({ id, role }) {
  try {
    const session = await requireRole(ADMIN_ONLY);

    if (!Object.values(ROLES).includes(role)) {
      return { success: false, message: "Invalid role" };
    }
    if (String(id) === session.user.id) {
      return { success: false, message: "You cannot change your own role" };
    }

    await connect();
    const target = await UserModel.findById(id);
    if (!target) {
      return { success: false, message: "User not found" };
    }

    // Never leave the portal without an active admin.
    if (target.role === ROLES.ADMIN && role !== ROLES.ADMIN) {
      const activeAdmins = await UserModel.countDocuments({
        role: ROLES.ADMIN,
        isActive: { $ne: false },
      });
      if (activeAdmins <= 1) {
        return { success: false, message: "Cannot demote the last admin" };
      }
    }

    target.role = role;
    await target.save();
    return { success: true, message: `Role changed to ${role}` };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, message: error.message };
  }
}

export async function setUserStatus({ id, isActive }) {
  try {
    const session = await requireRole(ADMIN_ONLY);

    if (String(id) === session.user.id) {
      return { success: false, message: "You cannot deactivate your own account" };
    }

    await connect();
    const target = await UserModel.findById(id);
    if (!target) {
      return { success: false, message: "User not found" };
    }

    // Never leave the portal without an active admin.
    if (!isActive && target.role === ROLES.ADMIN) {
      const activeAdmins = await UserModel.countDocuments({
        role: ROLES.ADMIN,
        isActive: { $ne: false },
      });
      if (activeAdmins <= 1) {
        return { success: false, message: "Cannot deactivate the last admin" };
      }
    }

    target.isActive = Boolean(isActive);
    await target.save();
    return {
      success: true,
      message: isActive ? "Account activated" : "Account deactivated",
    };
  } catch (error) {
    console.error("Error updating user status:", error);
    return { success: false, message: error.message };
  }
}
