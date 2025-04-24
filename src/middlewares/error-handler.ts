import config from "../config/config.js";
import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/api-error.js";

/**
 * Middleware to handle errors globally in the application.
 * It captures any errors thrown in the application and sends a structured response.
 *
 * @param {Error} err - The error object.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {void}
 */
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
