import { Schema, model, models } from "./mongoose";

const leadMagnetSchema = new Schema(
  {
    subscriberId: {
      type: Schema.Types.ObjectId,
      ref: "Subscriber",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    fileUrl: {
      type: String,
    },
    contentHtml: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "general",
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    accessKey: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const LeadMagnetModel =
  models.LeadMagnet || model("LeadMagnet", leadMagnetSchema);
export default LeadMagnetModel;
