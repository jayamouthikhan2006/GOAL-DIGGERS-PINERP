import { z } from "zod";

const moduleEnum = z.enum(["sales", "purchase", "manufacturing", "product"]);

export const permissionRowSchema = z.object({
  module: moduleEnum,
  field: z.string().min(1),
  canCreate: z.boolean(),
  canView: z.boolean(),
  canEdit: z.boolean(),
  canDelete: z.boolean(),
});

export const createUserSchema = z.object({
  loginId: z.string().min(6).max(12),
  email: z.email().max(200),
  password: z.string().min(8).max(200),
  name: z.string().min(1).max(200),
  position: z.string().max(200).optional(),
  isAdmin: z.boolean().optional().default(false),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  address: z.string().max(500).optional(),
  mobile: z.string().max(30).optional(),
  position: z.string().max(200).optional(),
  isAdmin: z.boolean().optional(),
  permissions: z.array(permissionRowSchema).optional(),
});

// Self-service profile update — deliberately excludes email/position, even
// if the client sends them, those fields are simply not in this schema so
// validateRequest strips them before the handler ever sees them.
export const updateMeSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  address: z.string().max(500).optional(),
  mobile: z.string().max(30).optional(),
});

export const changeMyPasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(200),
});

export const adminResetPasswordSchema = z.object({
  password: z.string().min(8).max(200),
});
