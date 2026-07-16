import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/rbac.middleware";
import { validateRequest } from "../../middleware/validateRequest";
import { createDepartmentSchema, updateDepartmentSchema } from "./departments.validation";
import { listHandler, createHandler, updateHandler, deleteHandler } from "./departments.controller";

export const departmentsRouter = Router();
departmentsRouter.use(authMiddleware);
departmentsRouter.get("/", listHandler);
departmentsRouter.post("/", requireAdmin, validateRequest(createDepartmentSchema), createHandler);
departmentsRouter.patch("/:id", requireAdmin, validateRequest(updateDepartmentSchema), updateHandler);
departmentsRouter.delete("/:id", requireAdmin, deleteHandler);
