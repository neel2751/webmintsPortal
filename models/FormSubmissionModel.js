// models/FormSubmission.js
import mongoose from "mongoose";

const formSubmissionSchema = new mongoose.Schema(
  {
    formType: { type: String, required: true },
    customFields: { type: mongoose.Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true },
    status: { type: String, default: "Inquiry" },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const FormSubmissionModel =
  mongoose.models.FormSubmission ||
  mongoose.model("FormSubmission", formSubmissionSchema);
export default FormSubmissionModel;
