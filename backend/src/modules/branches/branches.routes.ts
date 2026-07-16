import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/rbac.middleware";
import { validateRequest } from "../../middleware/validateRequest";
import { createBranchSchema, updateBranchSchema } from "./branches.validation";
import { listHandler, createHandler, updateHandler, deleteHandler } from "./branches.controller";

export const branchesRouter = Router();
branchesRouter.use(authMiddleware);
branchesRouter.get("/", listHandler);
branchesRouter.post("/", requireAdmin, validateRequest(createBranchSchema), createHandler);
branchesRouter.patch("/:id", requireAdmin, validateRequest(updateBranchSchema), updateHandler);
branchesRouter.delete("/:id", requireAdmin, deleteHandler);
