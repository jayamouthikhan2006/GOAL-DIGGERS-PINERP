import rateLimit from "express-rate-limit";

/**
 * Scoped to login/signup/password-reset endpoints to blunt credential
 * stuffing and brute-force guessing. Keyed by IP (express-rate-limit
 * default), counts both successful and failed attempts so a scripted
 * attacker can't just retry past it, but the window/limit are generous
 * enough not to lock out a real demo user fat-fingering a password a few
 * times.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts — please try again later" },
});
