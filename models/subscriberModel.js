import { Schema, model, models } from "./mongoose";

const subscriberSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    interests: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["subscribed", "unsubscribed", "pending"],
      default: "subscribed",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    source: {
      type: String,
      default: "website",
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const SubscriberModel =
  models.Subscriber || model("Subscriber", subscriberSchema);
export default SubscriberModel;
