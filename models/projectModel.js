import { mongoose, Schema } from "./mongoose";
import { PROJECT_STATUSES } from "@/lib/portal-constants";

const projectSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    client: { type: Schema.Types.ObjectId, ref: "user", required: true },
    status: { type: String, enum: PROJECT_STATUSES, default: "Planning" },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    maintenanceEndDate: { type: Date },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ProjectModel =
  mongoose.models.project || mongoose.model("project", projectSchema);
export default ProjectModel;
