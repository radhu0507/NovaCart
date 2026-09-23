import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  const parseError = err as { type?: string };
  if (parseError?.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, message: "Invalid JSON in request body" });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({ success: false, message: "Something went wrong on the server" });
}