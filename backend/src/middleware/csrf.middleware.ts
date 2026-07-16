import { Request, Response, NextFunction } from "express";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * Lightweight CSRF defense for the cookie-based session model.
 *
 * In production the session cookies are `SameSite=None; Secure` (required so
 * the deployed frontend, on a different registrable domain than the API,
 * can still send them cross-site). That reopens classic CSRF: a bare HTML
 * `<form method="POST">` on any attacker-controlled page is a "simple
 * request" — no JSON content-type, no custom headers — so the browser
 * neither needs nor sends a CORS preflight for it, and the state-changing
 * request (e.g. POST /api/users/:id/disable, POST /api/sales/:id/confirm)
 * still reaches the server with the victim's cookie attached, even though
 * `cors()` would refuse to let the attacker's page read the JSON response.
 *
 * The fix: require every mutating request to carry a custom header. A
 * custom header forces the browser to send a CORS preflight, which our
 * origin-locked `cors({ origin: env.FRONTEND_URL })` config will reject for
 * any page not served from the real frontend — a plain HTML form has no way
 * to set custom headers at all. This is the same "custom header" CSRF
 * mitigation Rails/Django/Angular have used for years; it doesn't require
 * per-session tokens because the origin check IS the token here.
 */
export function requireCsrfHeader(req: Request, res: Response, next: NextFunction): void {
  if (SAFE_METHODS.has(req.method)) {
    next();
    return;
  }
  if (req.get("X-Requested-With") !== "XMLHttpRequest") {
    res.status(403).json({ error: "Missing required request header" });
    return;
  }
  next();
}
