import { mongoose, Schema } from "./mongoose";
import {
  REQUEST_STATUSES,
  REQUEST_PRIORITIES,
} from "@/lib/portal-constants";

const requestSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    project: { type: Schema.Types.ObjectId, ref: "project", required: true },
    // Denormalized owner so client-scoped queries don't need a join.
    client: { type: Schema.Types.ObjectId, ref: "user", required: true },
    status: { type: String, enum: REQUEST_STATUSES, default: "Pending" },
    priority: { type: String, enum: REQUEST_PRIORITIES, default: "Medium" },
  },
  { timestamps: true }
);

const RequestModel =
  mongoose.models.request || mongoose.model("request", requestSchema);
export default RequestModel;
