import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z.string().min(1).max(200),
});

export const updateDepartmentSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  isActive: z.boolean().optional(),
});
