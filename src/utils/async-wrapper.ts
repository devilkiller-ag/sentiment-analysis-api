import ApiError from "./api-error.js";
import { NextFunction, Request, Response } from "express";

/**
 * Middleware to handle errors in Express routes.
 * This function wraps the provided route handler function and catches any errors
 * that occur during its execution, passing them to the next middleware.
 * It handles both synchronous and asynchronous errors.
 *
 * @function asyncWrapper
 * @param {Function} fn - The route handler function to wrap.
 * @returns {Function} - A middleware function that handles errors.
 * @throws {ApiError} - Throws an ApiError with a 500 status code for unexpected errors.
 */
export const asyncWrapper = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // To handle asynchronous errors - when the function is async and returns a promise.
      Promise.resolve(fn(req, res, next)).catch((err: Error) => {
        if (err instanceof Error) {
          return next(err);
        }

        const apiError = new ApiError(500, "Internal Server Error");
        apiError.name = "InternalServerError";
        apiError.message = "An unexpected error occurred.";
        next(apiError);
      });
    } catch (err) {
      // To catch and handle synchronous errors - when the function is not async and throws an error directly.
      if (err instanceof Error) {
        return next(err);
      }

      const apiError = new ApiError(500, "Internal Server Error");
      apiError.name = "InternalServerError";
      apiError.message = "An unexpected error occurred.";
      next(apiError);
    }
  };
};

export default asyncWrapper;
