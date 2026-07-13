import { Schema, models, model } from "./mongoose";

// Tenant registry: each external website that consumes the blog API.
const websiteSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    // Normalized host only — no protocol, port, path, or leading "www."
    domain: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Extra hosts that resolve to this site (staging URL, alt TLD, localhost for dev).
    extraDomains: [{ type: String, lowercase: true, trim: true }],
    // Per-website API key sent as x-api-key by the consuming site.
    apiKey: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const WebsiteModel = models.Website || model("Website", websiteSchema);
export default WebsiteModel;
