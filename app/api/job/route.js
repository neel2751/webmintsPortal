// pages/api/submit-form.js

import { connect } from "@/db/db";
import SubmitJobApplicationsModel from "@/models/submitApplicationModel";
import { generatePreSignedUrl } from "@/server/aws/awsUpload";
import axios from "axios";
import { headers } from "next/headers";

export async function POST(req) {
  const headerList = await headers();
  const origin = headerList.get("origin");
  const apiKey = headerList.get("x-api-key");
  // Security checks

  const allowedOrigins = [
    process.env.MAIN_SITE_URL, // e.g., https://subdomain.vercel.app
    "http://localhost:3000", // allow this during local testing
  ];

  if (!origin || !allowedOrigins.includes(origin)) {
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  }

  if (apiKey !== process.env.API_SECRET) {
    return Response.json({ error: "Invalid API key" }, { status: 403 });
  }

  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  await connect();
  const formData = await req.formData();
  // console.log("Received form submission:", {
  //   formData: Object.fromEntries(formData.entries()),
  // });

  try {
    // we have to remove file resume and cover letter from formData

    const jobid = formData.get("jobId");
    const email = formData.get("email");
    if (!jobid || !email) {
      return Response.json(
        { success: false, message: "Job ID and email are required" },
        { status: 400 }
      );
    }
    // check if they already submitted the job application
    const existingSubmission = await SubmitJobApplicationsModel.findOne({
      jobId: jobid,
      email: email,
    });
    if (existingSubmission) {
      return Response.json(
        {
          success: false,
          message: "You have already submitted this job application",
        },
        { status: 400 }
      );
    }

    const resumeFile = formData.get("resume");
    const coverLetterFile = formData.get("coverLetter");
    //cover letter is optional so we havet to check if it exists
    if (!resumeFile || !(resumeFile instanceof File)) {
      return Response.json(
        { success: false, message: "Resume must be a file" },
        { status: 400 }
      );
    }
    if (coverLetterFile && !(coverLetterFile instanceof File)) {
      return Response.json(
        { success: false, message: "Cover letter must be a file" },
        { status: 400 }
      );
    }
    const files = [resumeFile];
    if (coverLetterFile) files.push(coverLetterFile);

    // we have map this to upload both resume and cover letter
    if (files.length === 0) {
      return Response.json({ error: "No files to upload" }, { status: 400 });
    }
    files.forEach((file) => {
      if (file.size > 20 * 1024 * 1024) {
        return Response.json(
          { success: false, message: "File size exceeds 20MB limit" },
          { status: 400 }
        );
      }
    });
    const fileUploads = files.map(async (file) => {
      const { url, key } = await generatePreSignedUrl({
        fileName: file.name,
        contentType: file.type,
        path: "uploads/resumes",
        access: "private", // or "public" based on your requirements
      });
      const upload = await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      if (upload.status === 200) {
        console.log(`${file.name} uploaded successfully`);
        return { success: true, key: key };
      } else {
        console.log(`Failed to upload ${file.name}`);
        return { success: false, key: null, message: "Upload failed" };
      }
    });
    const uploadResults = await Promise.all(fileUploads);
    console.log("Upload results:", uploadResults);
    const resumeKey = uploadResults.find(
      (result) => result.key && result.success
    ).key;
    const coverLetterKey =
      uploadResults.find(
        (result) => result.key && result.success && result.key !== resumeKey
      )?.key || "";
    // Create the submission model instance
    formData.delete("resume");
    formData.delete("coverLetter");
    const submission = new SubmitJobApplicationsModel({
      jobId: jobid,
      email: email,
      resumeLink: resumeKey,
      coverLetter: coverLetterKey,
      others: Object.fromEntries(formData.entries()),
      access: "private", // Default access type
      status: "applied", // Default status
      appliedAt: new Date(),
    });
    // Save the submission to the database
    await submission.save();
    // If you want to return the submission details, you can do so
    return Response.json({ success: true, submission }, { status: 200 });
    // return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.log("Error processing form submission:", err);
    return Response.json(
      { success: false, message: "Something went wrong! " },
      { status: 500 }
    );
  }
}
