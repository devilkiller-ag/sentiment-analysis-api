import { Request, Response } from "express";
import prisma from "#prisma/client.js";

export const storeSentences = async (req: Request, res: Response) => {
  try {
    const { sentences, webhook } = req.body;
    const created = await Promise.all(sentences.map((text: string) => prisma.sentence.create({ data: { text, webhook } })));
    res.status(201).json({
      message: "Sentences received and stored.",
      count: created.length,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to store sentences." });
  }
};
