import { z } from "zod";

export const createVendorSchema = z.object({
  name: z.string().min(1).max(200),
  address: z.string().max(500).optional(),
  contact: z.string().max(200).optional(),
});

export const updateVendorSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  address: z.string().max(500).optional(),
  contact: z.string().max(200).optional(),
});

export const createQualityIncidentSchema = z.object({
  description: z.string().min(1).max(2000),
  severity: z.enum(["low", "medium", "high"]),
});
