// pages/api/submit-form.js

import { connect } from "@/db/db";
import FormSubmissionModel from "@/models/FormSubmissionModel";
import { headers } from "next/headers";

export async function POST(req) {
  console.log("Received request in submit-form API");
  const headerList = await headers();
  const origin = headerList.get("origin");
  const apiKey = headerList.get("x-api-key");

  // Security checks
  if (!origin || origin !== process.env.MAIN_SITE_URL) {
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  }

  if (apiKey !== process.env.API_SECRET) {
    return Response.json({ error: "Invalid API key" }, { status: 403 });
  }

  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  await connect();

  const { formType, ...customFields } = await req.json();

  try {
    const submission = new FormSubmissionModel({
      formType,
      customFields,
    });

    await submission.save();
    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
