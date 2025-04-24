import express from "express";

/**
 * Middleware to parse incoming requests with JSON payloads.
 * It is based on the `express.json()` middleware.

 * @returns {express.RequestHandler} - The middleware function that parses JSON requests.
 * @throws {SyntaxError} - If the request body is not valid JSON.
 * @throws {Error} - If the request body is too large or if the content type is not JSON.
 */
export const jsonMiddleware = express.json();
