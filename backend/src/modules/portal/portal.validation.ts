import { z } from "zod";

export const createReviewSchema = z.object({
  salesOrderId: z.coerce.number().int().positive(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
});

export const createMessageSchema = z.object({
  message: z.string().min(1).max(5000),
});
