import { z } from "zod";

export const createBranchSchema = z.object({
  name: z.string().min(1).max(200),
  city: z.string().max(200).optional(),
});

export const updateBranchSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  city: z.string().max(200).optional(),
  isActive: z.boolean().optional(),
});
