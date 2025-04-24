// Project structure:
// src/
// ├── controllers/
// │   ├── inputController.ts
// │   └── sentimentController.ts
// ├── routes/
// │   ├── inputRoutes.ts
// │   └── sentimentRoutes.ts
// ├── services/
// │   └── sentimentService.ts
// ├── middlewares/
// │   └── middlewares.ts
// ├── prisma/
// │   └── client.ts
// └── index.ts

// ---------- src/prisma/client.ts ----------
import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();
export default prisma;

// ---------- src/services/sentimentService.ts ----------
import fetch, { RequestInit } from "node-fetch";

const HF_API_URL = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english";
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

export async function analyzeSentiment(text: string): Promise<string> {
  if (!HF_API_KEY) throw new Error("HUGGINGFACE_API_KEY is not defined");

  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: text }),
  };

  const res = await fetch(HF_API_URL, requestOptions);
  const data: any = await res.json();
  return typeof data[0]?.label === "string" ? data[0].label : "UNKNOWN";
}

// ---------- src/controllers/inputController.ts ----------
import { Request, Response } from "express";
import prisma from "../prisma/client";

export const storeSentences = async (req: Request, res: Response) => {
  try {
    const { sentences, webhook } = req.body;
    const created = await Promise.all(sentences.map((text: string) => prisma.sentence.create({ data: { text, webhook } })));
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: "Failed to store sentences." });
  }
};

// ---------- src/controllers/sentimentController.ts ----------
import { Request, Response } from "express";
import prisma from "../prisma/client";
import { analyzeSentiment } from "../services/sentimentService";
import fetch from "node-fetch";

export const processSentiments = async (_req: Request, res: Response) => {
  try {
    const sentences = await prisma.sentence.findMany({
      where: { sentiment: null },
    });

    const updated = await Promise.all(
      sentences.map(async (s) => {
        const sentiment = await analyzeSentiment(s.text);
        await prisma.sentence.update({
          where: { id: s.id },
          data: { sentiment },
        });

        if (s.webhook) {
          await fetch(s.webhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sentence: s.text, sentiment }),
          });
        }

        return { sentence: s.text, sentiment };
      }),
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to process sentiments." });
  }
};

// ---------- src/routes/inputRoutes.ts ----------
import express from "express";
import { storeSentences } from "../controllers/inputController";
const router = express.Router();

router.post("/input", storeSentences);
export default router;

// ---------- src/routes/sentimentRoutes.ts ----------
import express from "express";
import { processSentiments } from "../controllers/sentimentController";
const router = express.Router();

router.get("/sentiments", processSentiments);
export default router;

// ---------- src/middlewares/middlewares.ts ----------
import express from "express";

export const jsonMiddleware = express.json();

// ---------- src/index.ts ----------
import express from "express";
import dotenv from "dotenv";
import inputRoutes from "./routes/inputRoutes";
import sentimentRoutes from "./routes/sentimentRoutes";
import { jsonMiddleware } from "./middlewares/middlewares";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(jsonMiddleware);
app.use("/api", inputRoutes);
app.use("/api", sentimentRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
