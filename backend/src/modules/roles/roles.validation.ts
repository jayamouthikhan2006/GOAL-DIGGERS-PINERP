import { z } from "zod";
import { ALL_MODULES } from "./roles.service";

const rolePermissionSchema = z.object({
  module: z.enum(ALL_MODULES),
  canView: z.boolean(),
  canCreate: z.boolean(),
  canEdit: z.boolean(),
  canDelete: z.boolean(),
  canApprove: z.boolean(),
  canExport: z.boolean(),
  canImport: z.boolean(),
});

export const roleInputSchema = z.object({
  label: z.string().min(1).max(200),
  permissions: z.array(rolePermissionSchema).max(ALL_MODULES.length),
});
