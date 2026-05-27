import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: "customer" | "driver" | "admin";
  isVerified: boolean;
  isActive: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
  phone?: string;
  licenseNumber?: string;
  vehicleInfo?: {
    type: string;
    plateNumber: string;
    model: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "driver", "admin"],
      default: "customer",
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    verificationToken: { type: String, index: true },
    verificationTokenExpiry: { type: Date },
    resetToken: { type: String, index: true },
    resetTokenExpiry: { type: Date },
    phone: { type: String },
    licenseNumber: { type: String },
    vehicleInfo: {
      type: {
        type: String,
        enum: ["motorcycle", "car", "van", "truck"],
      },
      plateNumber: { type: String },
      model: { type: String },
    },
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", userSchema);

export default User;
