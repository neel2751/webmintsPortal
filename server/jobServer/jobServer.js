"use server";

import { connect } from "@/db/db";
import SubmitJobApplicationsModel from "@/models/submitApplicationModel";

export async function getAllJobApplicantData() {
  try {
    await connect();
    const response = await SubmitJobApplicationsModel.find();
    if (!response || response.length === 0) {
      return { success: false, message: "No job applicants found" };
    }
    return { success: true, data: JSON.stringify(response) };
  } catch (error) {
    console.error("Error fetching job applicant data:", error);
    return { success: false, message: "Failed to fetch job applicant data" };
  }
}

export async function updateJobStatus({ id, status }) {
  try {
    await connect();
    const response = await SubmitJobApplicationsModel.updateOne(
      { _id: id },
      { $set: { status } }
    );
    if (response.modifiedCount === 0) {
      return {
        success: false,
        message: "No job application found with this ID",
      };
    }
    return {
      success: true,
      message: "Job application status updated successfully",
    };
  } catch (error) {
    console.error("Error updating job status:", error);
    return { success: false, message: "Failed to update job status" };
  }
}
