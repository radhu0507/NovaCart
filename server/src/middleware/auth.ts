import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { decodeToken } from "../utils/jwt";
import { JwtPayload } from "../types";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function protect(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Not authorized. Please log in."));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = decodeToken(token);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token. Please log in again."));
  }
}

export function requireAdmin(req: AuthRequest, _res: Response, next: NextFunction) {
  if (req.user?.role !== "ADMIN") {
    return next(new ApiError(403, "Access denied. Admin only."));
  }
  next();
}