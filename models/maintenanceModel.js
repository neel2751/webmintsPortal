import { mongoose, Schema } from "./mongoose";
import { MAINTENANCE_STATUSES } from "@/lib/portal-constants";

const maintenanceSchema = new Schema(
  {
    title: { type: String, required: true },
    project: { type: Schema.Types.ObjectId, ref: "project", required: true },
    // Denormalized owner so client-scoped queries don't need a join.
    client: { type: Schema.Types.ObjectId, ref: "user", required: true },
    status: { type: String, enum: MAINTENANCE_STATUSES, default: "Scheduled" },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

const MaintenanceModel =
  mongoose.models.maintenance ||
  mongoose.model("maintenance", maintenanceSchema);
export default MaintenanceModel;
