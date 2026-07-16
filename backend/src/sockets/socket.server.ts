import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { parse as parseCookie } from "cookie";
import { env } from "../config/env";
import { InternalJwtPayload } from "../types/auth";
import { INTERNAL_SESSION_COOKIE } from "../middleware/session";

let io: SocketIOServer | null = null;

/**
 * Verifies the same HttpOnly session cookie auth.middleware checks, but
 * from the socket handshake headers (Socket.io connections never pass
 * through Express's cookie-parser/middleware chain). A socket that can't
 * produce a valid session is rejected at connect time — it must NOT be
 * able to just claim an arbitrary userId in a 'join' payload, or any
 * anonymous socket.io client could subscribe to any user's private
 * notification stream.
 */
function authenticateSocket(socket: Socket): number | null {
  const cookieHeader = socket.handshake.headers.cookie;
  if (!cookieHeader) return null;
  const token = parseCookie(cookieHeader)[INTERNAL_SESSION_COOKIE];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, env.JWT_INTERNAL_SECRET) as InternalJwtPayload;
    return payload.userId;
  } catch {
    return null;
  }
}

/** Attaches Socket.io to the same HTTP server Express is already using —
 * one port, no separate process, no coupling between the REST layer and
 * the real-time layer beyond sharing a socket. */
export function initSocketServer(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, { cors: { origin: env.FRONTEND_URL, credentials: true } });

  io.on("connection", (socket) => {
    // eslint-disable-next-line no-console
    console.log(`Socket connected: ${socket.id}`);

    // The authenticated userId is derived from the session cookie, never
    // from client input — a socket can only ever join its OWN user room.
    const userId = authenticateSocket(socket);
    if (userId) {
      socket.join(`user:${userId}`);
    }

    socket.on("disconnect", () => {
      // eslint-disable-next-line no-console
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

/** Services call this AFTER a transaction commits to push a live update.
 * Throws if called before the server has booted — a clear signal of a
 * wiring mistake rather than a silent no-op. */
export function getIO(): SocketIOServer {
  if (!io) throw new Error("Socket.io server not initialized — call initSocketServer() first");
  return io;
}

/** Push an event directly to a specific user's connected socket(s). */
export function emitToUser(userId: number, event: string, payload: unknown): void {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, payload);
}
