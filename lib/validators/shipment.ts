import { z } from "zod";

const addressSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().optional(),
});

export const createShipmentSchema = z.object({
  senderDetails: addressSchema,
  recipientDetails: addressSchema,
  packageInfo: z.object({
    weightKg: z.number().positive("Weight must be positive").max(500),
    dimensions: z.object({
      length: z.number().positive(),
      width: z.number().positive(),
      height: z.number().positive(),
    }),
    category: z.enum(["standard", "fragile", "perishable"]),
    description: z.string().min(5, "Description required").max(500),
  }),
  zone: z.enum(["local", "interstate", "international"]),
  paymentRef: z.string().optional(),
});

export const updateShipmentStatusSchema = z.object({
  status: z.enum([
    "pending",
    "picked_up",
    "in_transit",
    "out_for_delivery",
    "delivered",
    "failed",
  ]),
  note: z.string().optional(),
});

export const assignDriverSchema = z.object({
  driverId: z.string().min(1, "Driver ID required"),
});

export const uploadProofSchema = z.object({
  proofUrl: z.string().url("Valid URL required"),
});

export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;
export type UpdateShipmentStatusInput = z.infer<typeof updateShipmentStatusSchema>;
