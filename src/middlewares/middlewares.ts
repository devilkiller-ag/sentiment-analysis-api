import { RequestHandler } from "express";

export const middleware: RequestHandler = (req, res) => {
  console.log("Middleware called");
  res.send("Hello from sentiment analysis api middleware!");
};
