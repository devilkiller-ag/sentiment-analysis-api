// middlewares/error-handler.ts
import config from "../config/config.js";
import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/api-error.js";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Global Error: ", err.stack);

  const isApiError = err instanceof ApiError;

  const success = isApiError ? err.success : false;
  const statusCode = isApiError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success,
    statusCode,
    message,
    ...(config.env === "development" && { stack: err.stack }),
  });
};
