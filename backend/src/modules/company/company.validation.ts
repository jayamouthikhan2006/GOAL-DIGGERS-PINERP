import { z } from "zod";

export const updateCompanySettingsSchema = z.object({
  companyName: z.string().min(1).max(200).optional(),
  logoUrl: z.string().max(1000).optional(),
  gstNumber: z.string().max(50).optional(),
  address: z.string().max(1000).optional(),
  currency: z.string().max(10).optional(),
  timezone: z.string().max(100).optional(),
  financialYearStart: z.string().max(10).optional(),
  taxPercentage: z.number().min(0).max(100).optional(),
  smtpUser: z.string().max(200).optional(),
});
