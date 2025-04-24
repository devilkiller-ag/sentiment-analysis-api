/**
 * Custom error class for API errors.
 * This class extends the built-in Error class and adds additional properties
 * to represent the success status, name, and HTTP status code of the error.
 *
 * @class ApiError
 * @extends {Error}
 * @property {boolean} success - Indicates whether the API call was successful.
 * @property {string} name - The name of the error.
 * @property {number} statusCode - The HTTP status code associated with the error.
 *
 * @constructor
 * @param {number} statusCode - The HTTP status code associated with the error.
 * @param {string} message - The error message.
 */
export default class ApiError extends Error {
  success: boolean;
  name: string;
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.success = false;
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}
