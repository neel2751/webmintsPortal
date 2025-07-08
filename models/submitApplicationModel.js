import { mongoose, Schema } from "./mongoose";

const submitJobAppliactions = new Schema(
  {
    jobId: { type: String, required: true },
    userId: { type: String },
    email: { type: String, required: true },
    status: {
      type: String,
      enum: ["applied", "interviewing", "offered", "rejected"],
      default: "applied",
    },
    resumeLink: { type: String, required: true },
    access: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
    coverLetter: { type: String, default: "" },
    others: { type: Schema.Types.Mixed, default: {} },
    appliedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
const SubmitJobApplicationsModel =
  mongoose.models.submitJobAppliaction ||
  mongoose.model("submitJobAppliaction", submitJobAppliactions);
export default SubmitJobApplicationsModel;
