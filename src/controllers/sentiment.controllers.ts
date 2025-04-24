import prisma from "#prisma/client.js";
import { analyzeSentiment } from "#services/sentiment.service.js";
import { Sentence } from "#types/global.js";
import { Request, Response } from "express";
import fetch from "node-fetch";

/**
 * @description Process unprocessed sentences to analyze their sentiment, update the database, and send their result.
 *
 * @route POST /sentiment/process
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void
 */
export const processSentiments = async (req: Request, res: Response): Promise<void> => {
  const unprocessed = (await prisma.sentence.findMany({
    where: { sentiment: null },
  })) as Sentence[];

  const updated = await Promise.all(
    unprocessed.map(async (sentence: Sentence) => {
      const sentiment = await analyzeSentiment(sentence.text);

      await prisma.sentence.update({
        where: { id: sentence.id },
        data: { sentiment },
      });

      if (sentence.webhook) {
        await fetch(sentence.webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            test: sentence.text,
            sentiment,
          }),
        });
      }

      return { ...sentence, sentiment };
    }),
  );

  const result = updated.map((sentence) => ({
    text: sentence.text,
    sentiment: sentence.sentiment,
  }));

  res.status(200).json({
    result,
  });
};
