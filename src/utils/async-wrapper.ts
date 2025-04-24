import ApiError from "./api-error.js";
import { NextFunction, Request, Response } from "express";

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
