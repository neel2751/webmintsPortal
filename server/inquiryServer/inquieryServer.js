"use server";

import { connect } from "@/db/db";
import FormSubmissionModel from "@/models/FormSubmissionModel";
import { requireRole } from "@/lib/require-role";
import { ADMIN_ONLY } from "@/lib/permissions";

export async function getAllInquiry() {
  try {
    await requireRole(ADMIN_ONLY);
    await connect();
    const submissions = await FormSubmissionModel.find().lean(); // lean() makes it a plain JS object
    return { success: true, data: submissions };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
}
