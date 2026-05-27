import { z } from "zod";

export const createDriverSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  licenseNumber: z.string().min(5, "License number required"),
  vehicleInfo: z.object({
    type: z.enum(["motorcycle", "car", "van", "truck"]),
    plateNumber: z.string().min(5),
    model: z.string().min(2),
  }),
});

export const updateDriverSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  isActive: z.boolean().optional(),
});

export type CreateDriverInput = z.infer<typeof createDriverSchema>;
export type UpdateDriverInput = z.infer<typeof updateDriverSchema>;
