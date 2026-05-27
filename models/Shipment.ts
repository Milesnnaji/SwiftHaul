import mongoose, { Document, Model, Schema } from "mongoose";

export type ShipmentStatus =
  | "pending"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface ITimelineEntry {
  status: ShipmentStatus;
  note?: string;
  timestamp: Date;
  updatedBy?: mongoose.Types.ObjectId;
}

export interface IShipment extends Document {
  _id: mongoose.Types.ObjectId;
  trackingId: string;
  customerId: mongoose.Types.ObjectId;
  driverId?: mongoose.Types.ObjectId;
  status: ShipmentStatus;
  senderDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  };
  recipientDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  };
  packageInfo: {
    weightKg: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    category: "standard" | "fragile" | "perishable";
    description: string;
  };
  zone: "local" | "interstate" | "international";
  pricing: {
    baseRate: number;
    weightCharge: number;
    categorySurcharge: number;
    subtotal: number;
    tax: number;
    total: number;
    currency: string;
  };
  paymentStatus: PaymentStatus;
  paymentRef?: string;
  timeline: ITimelineEntry[];
  proofOfDeliveryUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const timelineSchema = new Schema<ITimelineEntry>(
  {
    status: {
      type: String,
      enum: ["pending", "picked_up", "in_transit", "out_for_delivery", "delivered", "failed"],
      required: true,
    },
    note: { type: String },
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false }
);

const addressSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String },
  },
  { _id: false }
);

const shipmentSchema = new Schema<IShipment>(
  {
    trackingId: { type: String, required: true, unique: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    driverId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    status: {
      type: String,
      enum: ["pending", "picked_up", "in_transit", "out_for_delivery", "delivered", "failed"],
      default: "pending",
    },
    senderDetails: { type: addressSchema, required: true },
    recipientDetails: { type: addressSchema, required: true },
    packageInfo: {
      weightKg: { type: Number, required: true },
      dimensions: {
        length: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
      },
      category: {
        type: String,
        enum: ["standard", "fragile", "perishable"],
        required: true,
      },
      description: { type: String, required: true },
    },
    zone: {
      type: String,
      enum: ["local", "interstate", "international"],
      required: true,
    },
    pricing: {
      baseRate: { type: Number, required: true },
      weightCharge: { type: Number, required: true },
      categorySurcharge: { type: Number, required: true },
      subtotal: { type: Number, required: true },
      tax: { type: Number, required: true },
      total: { type: Number, required: true },
      currency: { type: String, default: "NGN" },
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentRef: { type: String, index: true },
    timeline: { type: [timelineSchema], default: [] },
    proofOfDeliveryUrl: { type: String },
  },
  { timestamps: true }
);

shipmentSchema.index({ customerId: 1, createdAt: -1 });
shipmentSchema.index({ driverId: 1, status: 1 });
shipmentSchema.index({ status: 1, createdAt: -1 });

const Shipment: Model<IShipment> =
  mongoose.models.Shipment ?? mongoose.model<IShipment>("Shipment", shipmentSchema);

export default Shipment;
