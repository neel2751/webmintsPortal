"use server";

import { connect } from "@/db/db";
import FormSubmissionModel from "@/models/FormSubmissionModel";

export async function getAllInquiry() {
  try {
    await connect();
    const submissions = await FormSubmissionModel.find().lean(); // lean() makes it a plain JS object
    return { success: true, data: submissions };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
}
