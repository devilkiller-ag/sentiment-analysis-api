import express from "express";
import inputRoutes from "./routes/input.routes.js";
import sentimentRoutes from "./routes/sentiment.routes.js";
import { jsonMiddleware } from "./middlewares/middlewares.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(jsonMiddleware);
app.use("/", inputRoutes);
app.use("/", sentimentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
