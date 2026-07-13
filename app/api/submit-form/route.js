// pages/api/submit-form.js

import { connect } from "@/db/db";
import FormSubmissionModel from "@/models/FormSubmissionModel";
import { apiGuard } from "@/lib/api-guard";

export async function POST(req) {
  const denied = await apiGuard({ requireOrigin: true });
  if (denied) return denied;

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
