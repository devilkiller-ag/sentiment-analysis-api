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
