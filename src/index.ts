import cors from "cors";
import express from "express";
import inputRoutes from "./routes/input.routes.js";
import sentimentRoutes from "./routes/sentiment.routes.js";
import { jsonMiddleware } from "./middlewares/middlewares.js";
import { errorHandler } from "#middlewares/error-handler.js";

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE: To enable CORS (Cross-Origin Resource Sharing)
app.use(cors());

// MIDDLEWARE: To parse incoming requests with JSON payloads
app.use(jsonMiddleware);

// ROUTES
app.use("/", inputRoutes);
app.use("/", sentimentRoutes);

// MIDDLEWARE: To handle errors globally (should be the last one in the stack).
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
