import { mongoose, Schema } from "./mongoose";

const userSchema = new Schema(
  {
    // username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    role: { type: String, default: "user", enum: ["user", "admin"] },
  },
  {
    timestamps: true,
    // versionKey: false,
    // toJSON: { virtuals: true },
    // toObject: { virtuals: true },
  }
);
const UserModel = mongoose.models.user || mongoose.model("user", userSchema);
export default UserModel;
