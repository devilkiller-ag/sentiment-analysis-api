import express from "express";

import { middleware } from "#middlewares/middlewares.js";

const app = express();
const port = process.env.PORT ?? "8081";

app.get("/", middleware);

app.listen(port, () => {
  console.log(`Example app listening on port ${port} at http://localhost:${port}`);
});
