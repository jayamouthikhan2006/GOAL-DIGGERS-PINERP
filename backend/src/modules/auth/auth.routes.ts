import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { authRateLimiter } from "../../middleware/rateLimiter.middleware";
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  portalLoginSchema,
  portalSignupSchema,
} from "./auth.validation";
import {
  loginHandler,
  signupHandler,
  logoutHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  portalLoginHandler,
  portalSignupHandler,
  portalLogoutHandler,
} from "./auth.controller";

export const authRouter = Router();
authRouter.post("/login", authRateLimiter, validateRequest(loginSchema), loginHandler);
authRouter.post("/signup", authRateLimiter, validateRequest(signupSchema), signupHandler);
authRouter.post("/logout", logoutHandler);
authRouter.post("/forgot-password", authRateLimiter, validateRequest(forgotPasswordSchema), forgotPasswordHandler);
authRouter.post("/reset-password", authRateLimiter, validateRequest(resetPasswordSchema), resetPasswordHandler);

export const portalAuthRouter = Router();
portalAuthRouter.post("/login", authRateLimiter, validateRequest(portalLoginSchema), portalLoginHandler);
portalAuthRouter.post("/signup", authRateLimiter, validateRequest(portalSignupSchema), portalSignupHandler);
portalAuthRouter.post("/logout", portalLogoutHandler);
