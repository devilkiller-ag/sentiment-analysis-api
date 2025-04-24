import { Request, Response } from "express";
import prisma from "#prisma/client.js";

/**
 * @description Store sentences in the database.
 *
 * @route POST /input/sentences
 * @param {Request} req - The request object containing sentences and optional webhook.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void
 */
export const storeSentences = async (req: Request, res: Response) => {
  const { sentences, webhook } = req.body;
  const created = await Promise.all(sentences.map((text: string) => prisma.sentence.create({ data: { text, webhook } })));

  res.status(201).json({
    message: "Sentences received and stored.",
    count: created.length,
  });
};
